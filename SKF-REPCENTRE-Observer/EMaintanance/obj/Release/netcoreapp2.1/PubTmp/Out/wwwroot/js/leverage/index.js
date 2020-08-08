app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.formatters = {};
    $scope.language = null;

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "2%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },

        { name: 'JobNumber', displayName: 'Job Number', cellClass: getCellClass, enableColumnResizing: true, width: "5%", minWidth: 100 },
        {
            name: 'PlantAreaName', displayName: 'Plant Area', enableColumnResizing: true, width: "16%", minWidth: 100,
            cellClass: getCellClass, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'EquipmentName', displayName: 'Equipment', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 100 },
        { name: 'LSQuoteReference', displayName: 'CRM Reference', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 100 },
        { name: 'LSQuoteAmount', displayName: 'quote Amount', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, minWidth: 80, width: "10%" },
        { name: 'LSQuoteComment', displayName: 'Descriptions', cellClass: getCellClass, enableColumnResizing: true, width: "18%", minWidth: 150 },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.AddLeverage(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Leverage Service" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.AddLeverage(row.entity)" <i class="fa fa-plus  icon-space-before" tooltip-append-to-body="true" uib-tooltip="Create Leverage Service" tooltip-class="customClass"></i></a>' +
                '<a href="{{row.entity.LSPhysicalPath}}" target="_blank" ng-class="{disable: row.entity.LSPhysicalPath === null}"> <i class="fa fa-download icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "10%",
            minWidth: 100
        }
    ];

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;

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
                if ('.ui-grid-cell-focus') {
                    highlightRow = selected.row.uid;
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }
            });
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFileName: 'EMaintenance_LeverageList.xlsx',
        exporterExcelSheetName: 'EMaintenance_LeverageList',
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

    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    $scope.L_Leverage = {
        FromDate: new Date(y, m - 1, 1),
        ToDate: new Date()
    };


    $scope.loadData = function () {
        $scope.gridOpts.data = [];
        var _url = "/Leverage/GetLeverage?fromdate=" + $filter('date')($scope.L_Leverage.FromDate, "yyyy-MM-dd 00:00:00") + "&todate=" + $filter('date')($scope.L_Leverage.ToDate, "yyyy-MM-dd 00:00:00") + "&lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            });
    };

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo == null) {
            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
            //}
        }
    });

    $scope.AddLeverage = function (row) {
        var _url = "/Leverage/GetLeverageServiceList?jeId=" + row.JobEquipmentId + "&lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.popupData = response.data;
                var modalInstance = $uibModal.open({
                    templateUrl: 'skfLeverageExternal.html',
                    controller: 'skfLeverageExternalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        params: function () {
                            return { 'data': $scope.popupData, 'row': row, "languageId": $scope.language.LanguageId, 'isEdit': true };
                        }

                    }
                });
                modalInstance.result.then(function (data) {
                    //if (data) {
                    $scope.loadData();
                    //}
                }, function () {

                });
            });
    };

});

app.controller('skfLeverageExternalCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.isEdit = false;
    $scope.EquipmentName = params.row.EquipmentName;
    if (params.row.LeverageServiceId !== 0) {
        $scope.isEdit = true;
        $scope.LSQuoteStatusId = params.row.LSQuoteStatusId;
        $scope.LSQuoteAmount = params.row.LSQuoteAmount;
        $scope.LSQuoteReference = params.row.LSQuoteReference;
        $scope.LSQuoteStatusId = params.row.LSQuoteStatusId;
        $scope.LSQuoteComment = params.row.LSQuoteComment;
    }

    $scope.LeverageServiceStatus = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + params.languageId + "&lName=LeverageServiceStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.QuoteStatusDDL = response.data;
            });
    }();

    $scope.LeverageServiceDDL = params.data;

    $scope.save = function () {
        if ($scope.LSQuoteReference !== 'undefined' || $scope.LSQuoteAmount !== 'undefined' || $scope.LSQuoteStatusId !== 'undefined') {
            var postUrl = "/leverage/Create";
            $scope.Leverageservice = {
                "JobEquipmentId": params.row.JobEquipmentId,
                "LSQuoteReference": $scope.LSQuoteReference,
                "LSQuoteAmount": $scope.LSQuoteAmount,
                "LSQuoteStatusId": $scope.LSQuoteStatusId,
                "LSQuoteComment": $scope.LSQuoteComment,
                "LeverageServices": $scope.LeverageServiceDDL
            };
            $http.post(postUrl, JSON.stringify($scope.Leverageservice)).then(function (response) {
                if (response) {
                    var fileUpload = $("#files").get(0);
                    $scope.aId = response.data;
                    var files = fileUpload.files;
                    if (files.length > 0) {
                        $scope.uploadDocument();
                    } else {
                        alertFactory.setMessage({
                            msg: "Data saved Successfully."
                        });
                    }

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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Invalid User.",
                exc: "Please fill mandatory fields"
            });
        }
    };

    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if ($scope.aId) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/leverage/UploadFilesAjax",
                contentType: false,
                processData: false,
                headers: { 'aId': $scope.aId, 'Type': 'Leverage' },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "Data saved successfully."
                    });
                    $('#files').val("");
                    //$scope.loadData();
                    //$scope.clearModal();
                    $uibModalInstance.close($scope.rowData);
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

    $scope.DirtyValues = function (row) {
        row.isDirty = true;
        console.log($scope.LeverageServiceDDL);
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $scope.comments = "";
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };
});