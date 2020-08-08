app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns','ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.Active = "All";
    $scope.language = null;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.S_Active = 'All';
    $scope.ReportDate = new Date();
   
    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50,cellClass: getCellClass,enableFiltering: false, enableSorting: false
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', cellClass: getCellClass,enableColumnResizing: true, width: "15%", minWidth: 100, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass,enableColumnResizing: true, width: "15%", minWidth: 100

        },
        {
            name: 'ReportDate', displayName: 'Report Date', enableColumnResizing: true, width: "12%", minWidth: 100, cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass

        },
        {
            name: 'RecommendationDate', displayName: 'Recommendation Date', enableColumnResizing: true, width: "12%", minWidth: 100, cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass

        },
        { name: 'Recommendation', displayName: 'Recommendation', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100 },
        { name: 'Saving', displayName: 'Saving', cellClass: getCellClass, enableColumnResizing: true, width: "6%", minWidth: 100 },
        {
            name: 'Active', displayName: 'Status',
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row, col) === "Y") {
                    return 'green';
                } else {
                    if (grid.getCellValue(row, col) === "N") {
                        return 'red';
                    }
                }
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "8%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                //'<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Other Reports" tooltip-class="customClass"></i></a>' +
                '<a href="{{row.entity.PhysicalPath}}" target="_blank"><i class="fa fa-download icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download File" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "10%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.TechUpgrade = row;
        $scope.loadPlant(row.SectorId);
        $scope.isCreate = false;
        $scope.isSearch = false;
    };

    $scope.searchToggle = function () {
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.gridOpts.data = [];
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.clearModal();
    };

    $scope.resetForm = function () {
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.PlantAreaId= 0,
        $scope.EquipmentId= 0,
        $scope.Saving= 0,
        $scope.Recommendation="",
        $scope.Remarks= "",
        $scope.Active= "",
        $scope.ReportDate="",
        $scope.RecommendationDate="",
        $('#files').val("");
        $scope.resetForm();
    };


    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.S_Active = 'All';
    };

   
    $scope.columns = angular.copy(_columns);


    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;

    //Set grid options to grid
    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts.columnDefs = angular.copy(_columns);
                }, 2);
            };
            gridApi.cellNav.on.navigate($scope, function (selected) {

                if ('.ui-grid-cell-focus ') {
                    highlightRow = selected.row.uid;
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }

            });
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_TechUpgrade.xlsx',
        exporterExcelSheetName: 'EMaintenance_TechUpgrade',
        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

            var stylesheet = workbook.getStyleSheet();
            var stdStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri'
            });
            var boldStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri', bold: true
            });
            var aFormatDefn = {
                "font": boldStyle.id,
                "alignment": { "wrapText": true }
            };
            var formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['bold'] = formatter;
            var dateFormatter = stylesheet.createSimpleFormatter('date');
            $scope.formatters['date'] = dateFormatter;

            aFormatDefn = {
                "font": stdStyle.id,
                "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
                "alignment": { "wrapText": true }
            };
            var singleDefn = {
                font: stdStyle.id,
                format: '#,##0.0'
            };
            formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['red'] = formatter;

            Object.assign(docDefinition.styles, $scope.formatters);

            return docDefinition;
        },
        exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
            // this can be defined outside this method
            var stylesheet = workbook.getStyleSheet();
            var aFormatDefn = {
                "font": { "size": 11, "fontName": "Calibri", "bold": true },
                "alignment": { "wrapText": true }
            };
            var formatterId = stylesheet.createFormat(aFormatDefn);

            // excel cells start with A1 which is upper left corner
            sheet.mergeCells('B1', 'C1');
            var cols = [];
            // push empty data
            cols.push({ value: '' });
            // push data in B1 cell with metadata formatter
            cols.push({ value: 'SKF', metadata: { style: formatterId.id } });
            sheet.data.push(cols);
        },
        exporterFieldFormatCallback: function (grid, row, gridCol, cellValue) {
            // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
            // a formatter and obtaining the id
            var formatterId = null;
            if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
                formatterId = $scope.formatters['red'].id;
            }

            if (gridCol.field === 'updatedDate') {
                formatterId = $scope.formatters['date'].id;
            }

            if (formatterId) {
                return { metadata: { style: formatterId } };
            } else {
                return null;
            }
        },
        exporterColumnScaleFactor: 4.5,
        exporterFieldApplyFilters: true
    };

    $scope.loadData = function () {
       $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var postUrl = "/TechUpgrade/GetTechUpgradeByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=ALL";
     
        $http.get(postUrl).then(function (response) {
            if (response.data) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            }

        }, function (response) {
            if (response.data.message) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            }
        });
    };

    $scope.loadPlant = function () {
        var _url = "/Plant/GetPlantByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;
            });
    };

    $scope.loadEquipment = function (data) {
        var _url = "/TechUpgrade/GetEquipmentByPlant?lId=" + $scope.language.LanguageId + "&plantId="+ data;
        $http.get(_url)
            .then(function (response) {
                $scope.EquipmentDDL = response.data;
            });
    };

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo == null) {
            //var modalInstance = $uibModal.open({
            //    templateUrl: 'skfClientInfoModal.html',
            //    controller: 'skfClientInfoModalCtrl',
            //    size: 'md',
            //    backdrop: 'static',
            //    keyboard: false,
            //    resolve: {
            //        params: function () {
            //            return { "languageId": $scope.language.LanguageId, "ClientName": $scope.clientName };
            //        }
            //    }
            //});

            //modalInstance.result.then(function (data) {
            //    if (data) {
            //        sessionStorage.setItem("clientInfo", JSON.stringify(data));
            //        clientFactory.setClient(data);
            //        window.location.reload();
            //    }
            //}, function () {

            //});
            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    }

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadPlant();
            if ($scope.isPageLoad) {
                $scope.loadData();
            }
           
        }
    });

   
    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        if (files.length > 0) {
            var data = new FormData();
            if ($scope.ClientSiteId) {
                for (var i = 0; i < files.length; i++) {
                    data.append(files[i].name, files[i]);
                }
                $.ajax({
                    type: "POST",
                    url: "/TechUpgrade/UploadFiles",
                    contentType: false,
                    processData: false,
                    headers: { 'aId': $scope.ClientSiteId, 'equipmentId': $scope.EquipmentId, 'saving': $scope.Saving, 'plantAreaId': $scope.PlantAreaId, 'reportDate': $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"), 'recommendationDate': $filter('date')($scope.RecommendationDate, "yyyy-MM-dd 00:00:00"), 'recommendation': $scope.Recommendation, 'remarks': $scope.Remarks, 'type': 'TechUpgrade' },
                    data: data,
                    success: function (message) {
                        alertFactory.setMessage({
                            msg: "Data saved successfully."
                        });
                        $('#files').val("");
                        $scope.clearModal();
                        $scope.loadData();
                    },
                    error: function () {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "Error upload document please upload attachment again."
                        });
                    }
                });
            }
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please upload document."
            });
        }
    };

    $scope.validFormat = false;
    $scope.uploadImageStart = function () {
        $scope.validFormat = false;
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var _files = $.map($('#files').prop("files"), function (val) { return val.name; });
        angular.forEach(_files, function (filename, i) {
            var filext = filename.substring(filename.lastIndexOf(".") + 1);
            filext = filext.toLowerCase();
        });
        if (fileUpload) {
            $timeout(function () {
                $scope.readURL(fileUpload);
                $scope.validFormat = true;
            }, 10);

        } else {
            $timeout(function () {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Upload valid Image Format"
                });
                $scope.validFormat = false;
                $('#files').val("");
            }, 10);

        }

    }

    $scope.readURL = function (input) {
        $scope.thumb = [];
        for (var i = 0; i < input.files.length; i++) {
            if (input.files && input.files[i]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.thumb.push(e.target.result);
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    }



});



