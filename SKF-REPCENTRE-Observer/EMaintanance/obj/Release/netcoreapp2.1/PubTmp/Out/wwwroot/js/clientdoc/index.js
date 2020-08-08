app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.A_Active = 'All';

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'FileName', displayName: 'File Name', cellClass: getCellClass, enableColumnResizing: true, width: "32%", minWidth: 100, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'FileDescription', displayName: 'File Description', cellClass: getCellClass, enableColumnResizing: true, width: "35%", minWidth: 100 },
        {
            name: 'Active', displayName: 'Status',cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            //cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            //    if (grid.getCellValue(row, col) === "Y") {
            //        return 'green';
            //    } else {
            //        if (grid.getCellValue(row, col) === "N") {
            //            return 'red';
            //        }
            //    }
            //},
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "10%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a href="{{row.entity.PhysicalPath}}" target="_blank"><i class="fa fa-download icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download File" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "18%",
            minWidth: 100
        }
    ];

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
        //$scope.ClientDoc = {
        //    ClientDocAttachId: 0,
        //    ClientSiteId: 0,
        //    FileName:null,
        //    FileDescription:null,
        //    LogicalName: null,
        //    PhysicalPath:null,
        //    Active: null,
        //    Type: 'ClientDoc'
        //};
        $scope.FileDescription = "";
        $('#files').val("");
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.A_Active = 'All';
    };

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isSearch = true;
    //    $scope.gridOpts.data = [];
    //};

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.clearModal();
    };

    $scope.columns = angular.copy(_columns);

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
        exporterExcelFilename: 'EMaintenance_ClientDoc.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientDoc',
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

    //$scope.gridOpts.data = [
    //    {
    //        "FileName": "ClientDoc",
    //        "FileDescription": "Test",
    //        "Status": "Y",
    //        "imgPath": "/images/attachments/images/equipment/EQ292019022511170573.jpeg"
    //    }

    //];

    $scope.loadData = function () {
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/ClientDoc/GetClientDocByStatus?csId=" + $scope.ClientSiteId + "&status=ALL";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
            $scope.createToggle();  
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
        }
    });


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

    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if ($scope.ClientSiteId) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/ClientDoc/UploadFiles",
                contentType: false,
                processData: false,
                headers: { 'aId': $scope.ClientSiteId, 'fileDescription': $scope.FileDescription, 'type': 'ClientDoc' },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "Data saved successfully."
                    });
                    $('#files').val("");
                    $scope.loadData();
                    $scope.clearModal();
                },
                error: function () {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Error upload document please upload attachment again."
                    });
                }
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

