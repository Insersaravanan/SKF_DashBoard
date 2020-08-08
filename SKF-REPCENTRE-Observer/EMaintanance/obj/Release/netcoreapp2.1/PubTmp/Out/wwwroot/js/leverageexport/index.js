app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.exportLeverageActive = true;

    $scope.next = function (stage) {
        $scope.exportListActive = false;
        $scope.exportLeverageActive = false;
        if (stage == "stage1" || stage == "stage0") {
            if (stage == "stage1") {
                $scope.exportListActive = true;
                $scope.loadExport();

            } else {
                $scope.exportLeverageActive = true;
            }
            $scope.stage = stage;
            $scope.moreFields = false;
        };

    };

    //Export Leverage Grid

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'ClientName', displayName: 'Client Name', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "10%", minWidth: 100 },
        { name: 'PlantArea', displayName: 'Plant', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "12%", minWidth: 100 },
        { name: 'EquipmentName', displayName: 'Equipment Name', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "12%", minWidth: 100 },
        { name: 'JobNumber', displayName: 'Job Number', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "5%", minWidth: 100 },
        {
            name: 'OpportunityType', displayName: 'Opportunities', enableCellEdit: false, enableFiltering: true, width: "20%",
            minWidth: 100
        },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "24%", minWidth: 100 },
        {
            name: 'Status', displayName: 'Action', enableFiltering: false, enableCellEdit: false,
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" class="header-checkbox" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents grid-checkbox"><input type="checkbox" ng-model="row.entity.Status" ng-click="grid.appScope.SelectedRow(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "10%",
            minWidth: 50
        }
    ];


    $scope.SelectedRow = function (row) {
        row.isDirty = true;
    }

    $scope.loadCountry = function () {
        $scope.CountryDDL = [];
        $scope.defaultCountry = {
            CountryId: 0,
            CountryName: "--Select--"
        }

        var _url = "/taxonomy/GetLoadListItem?Type=UserCountryAccess&lId=" + $scope.language.LanguageId + "&sId=0&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.CountryDDL = response.data;
                $scope.CountryDDL.splice(0, 0, $scope.defaultCountry);
            });
    };

    $scope.SelectAll = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        if (!$scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.Status = 'Y';
                val.entity.isDirty = true;
                $scope.selectAll = true;
            });
        } else if ($scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.isDirty = true;
                val.entity.Status = 'N';
                $scope.selectAll = false;
            });
        }
    }

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
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Leverage.xlsx',
        exporterExcelSheetName: 'EMaintenance_Leverage',
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

    // Export Leverage List
    $scope.loadData = function () {
        $scope.L_Leverage.languageId = $scope.language.LanguageId;
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        $scope.L_Leverage = {
            LeverageFromDate: $filter('date')($scope.L_Leverage.LeverageFromDate, "yyyy-MM-dd 00:00:00"),
            LeverageToDate: $filter('date')($scope.L_Leverage.LeverageToDate, "yyyy-MM-dd 00:00:00"),
            CountryId: $scope.L_Leverage.CountryId
        };

        var postUrl = "/LeverageExport/GetLeveragesByParams";
        $http.post(postUrl, JSON.stringify($scope.L_Leverage)).then(function (response) {
            if (response.data) {
                $scope.gridOpts.data = response.data;
                $scope.L_Leverage.LeverageFromDate = new Date($scope.L_Leverage.LeverageFromDate);
                $scope.L_Leverage.LeverageToDate = new Date($scope.L_Leverage.LeverageToDate);

                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            }

        }, function (response) {
            $scope.alerts.push({
                type: "warning",
                msg: String(response.data.message)
            });
        });
    };

    $scope.loadJobStatus = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=JobProcessStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.LeverageDDL = response.data;
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
            $scope.loadJobStatus();
            $scope.loadCountry();
            //if ($scope.isPageLoad) {
            $scope.loadData();
            //}
        }
    });


    $scope.clearOut = function () {
        $scope.clearValue();
    };

    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth();
    $scope.clearValue = function () {
        $scope.L_Leverage = {
            LeverageFromDate: new Date(y, m - 1, 1),
            LeverageToDate: new Date(),
        };

    };

    $scope.clearValue();

    $scope.save = function () {
        var LeverageServices = [];
        $scope.LeverageServices = $scope.SelectedRow;
        angular.forEach($scope.gridOpts.data, function (val, i) {
            if (val.isDirty === true && val.Status === 'Y') {

                LeverageServices.push({ 'LeverageServiceId': val.LeverageServiceId });
            }
        });


        if (!$scope.isProcess && LeverageServices.length > 0) {
            var postData = {
                "LeverageServices": LeverageServices
            }
            $scope.isProcess = true;
            var postUrl = "/LeverageExport/ExportLeverage";
            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
                if (response.status) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        alertFactory.setMessage({
                            msg: "Data Generated Successfully."
                        });
                    }
                    $scope.loadData();

                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message)
                });
            });
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please select atleast one record"
            });
        }
    };


    // Export List Grid

    var _columns1 = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'FileDate', displayName: 'File Date', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "20%", minWidth: 50, cellFilter: 'date:\'dd/MM/yyyy\'' },
        { name: 'FileName', displayName: 'File Name', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "30%", minWidth: 50 },
        { name: 'FilePath', displayName: 'File Path', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, width: "28%", minWidth: 50 },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.downloadExcel(row.entity)" <i class="fa fa-download icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download" tooltip-class="customClass"></i></a>' +

                '</div>',
            width: "18%",
            minWidth: 100
        }
    ];


    $scope.columns = angular.copy(_columns1);
    //Set grid options to grid

    $scope.gridOpts1 = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        enablePinning: true,
        enableCellEdit: false,
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
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ExportList.xlsx',
        exporterExcelSheetName: 'EMaintenance_ExportList',
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

    $scope.clearExportValue = function () {
        $scope.L_ExportLeverage = {
            FileFromDate: new Date(y, m - 1, 1),
            FileToDate: new Date()

        };
    };

    $scope.clearExportValue();

    //Export List  

    $scope.loadExport = function () {
        $scope.L_ExportLeverage.languageId = $scope.language.LanguageId;
        $scope.gridOpts1.data = [];
        $scope.isPageLoad = true;
        $scope.L_ExportLeverage = {
            FileFromDate: $filter('date')($scope.L_ExportLeverage.FileFromDate, "yyyy-MM-dd 00:00:00"),
            FileToDate: $filter('date')($scope.L_ExportLeverage.FileToDate, "yyyy-MM-dd 00:00:00")
        };

        var postUrl = "/LeverageExport/GetExportLeverageFiles";
        $http.post(postUrl, JSON.stringify($scope.L_ExportLeverage)).then(function (response) {
            if (response.data) {
                $scope.gridOpts1.data = response.data;
                angular.forEach($scope.gridOpts1.data, function (val, i) {
                    val.sno = i + 1;
                });
            }

        }, function (response) {
            $scope.alerts.push({
                type: "warning",
                msg: String(response.data.message)
            });
        });
    };

    //Download Export List
    $scope.downloadExcel = function (row) {
        var postUrl = "LeverageExport/GetLeveragesToDownload?leId=" + row.LeverageExportId + "&lId=" + $scope.language.LanguageId;
        $http.get(postUrl)
            .then(function (response) {
                $scope.template = row.FileName;
                $scope.download = response.data;
                var ws = XLSX.utils.json_to_sheet($scope.download);

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, $scope.template + "");

                /* write workbook */
                XLSX.writeFile(wb, $scope.template + ".xlsx");
            });
    }

});