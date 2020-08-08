app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $uibModal, $http, languageFactory, alertFactory,$timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isclear = true;
    $scope.readOnlyPage = false;
    $scope.language = null;
    $scope.isCreate = true;
    $scope.formatters = {};
    $scope.S_active = "All";


    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50,cellClass: getCellClass,enableFiltering: false, enableSorting: false, enableHiding: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'CountryName', displayName: 'Country Name', cellClass: getCellClass,enableColumnResizing: true, width: "18%", minWidth: 200, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'CostCentreCode', displayName: 'Branch Code',cellClass: getCellClass,enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'CostCentreName', displayName: 'Branch Name', cellClass: getCellClass,enableColumnResizing: true, width: "21%", minWidth: 150 },
        { name: 'Descriptions', displayName: 'Descriptions', cellClass: getCellClass, enableColumnResizing: true, width: "20%", minWidth: 150 },
        {
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
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
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }],
            },
            width: "10%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Branch" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "13%",
            minWidth: 100
        }
    ];


    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isclear = false;
        $scope.isEdit = true;
        $scope.isCreate = false;
        //$scope.selectedRow = $scope.gridOpts.data.indexOf(row);
        var commodityObj = {
            CountryId: row.CountryId,
            CountryName: row.CountryName
        };
        $scope.$broadcast('angucomplete-alt:changeInput', 'CountryId', commodityObj);
        $scope.CostCentreName = row.CostCentreName;
        $scope.CostCentreCode = row.CostCentreCode;
        $scope.Descriptions = row.Descriptions;
        $scope.Active = row.Active;
        $scope.languageId = row.LanguageId;
        $scope.CostCentreId = row.CostCentreId;
        $scope.CountryId = row.CountryId;
        $scope.CreatedOn = row.CreatedOn;
        $scope.UserId = row.userId;
        $('#CostCentreName').focus();
    };

    $scope.resetForm = function () {
        $scope.CostCentreName = null;
        $scope.Descriptions = null;
        $scope.CostCentreCode = null;
        $scope.$broadcast('angucomplete-alt:clearInput', 'CountryId');
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.clearOut = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.isclear = true;
        $scope.S_active = "All";
        $scope.$broadcast('angucomplete-alt:clearInput', 'CountrySId');
        $scope.resetForm();
    };

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //    $scope.gridOpts.data = [];
    //};

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isEdit = false;
        $scope.resetForm();
    };

    $scope.clearValue = function () {
        $scope.S_active = 'All';
    };
    $scope.clearValue();

    $scope.clear = function () {
        $scope.S_costCentreName = null;
        $scope.$broadcast('angucomplete-alt:clearInput', 'CountryId');
        $scope.S_active = null;
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
        exporterExcelFilename: 'EMaintenance_CostCentre.xlsx',
        exporterExcelSheetName: 'EMaintenance_CostCentre',
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

    $scope.updateIndex = function () {
        angular.forEach($scope.gridOpts.data, function (val, i) {
            val.sno = i + 1;
        });
    }

    $scope.loadCountry = function () {
        var _url = "/country/Get?lId=" + $scope.language.LanguageId + "&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.CountryDDL = response.data;

            });
    }

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadData();
        }
    });

    //$scope.search = function () {
    //    //if ($scope.selectedCountryS_StatusFn) {
    //    //    $scope.S_countryId = $scope.selectedCountryS_StatusFn.originalObject.CountryId;
    //    //} else {
    //    //    $scope.gridOpts.data = [];
    //    //    $scope.S_countryId = 0;
    //    //}

    //    var headerData = {
    //        "LanguageId": $scope.language.LanguageId
            
    //    };

    //    var postUrl = "/CostCentre/SearchCostCentre";

    //    $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
    //        if (response.data) {
    //            $scope.gridOpts.data = response.data;
    //            angular.forEach($scope.gridOpts.data, function (val, i) {
    //                val.sno = i + 1;
    //            });
    //        }
    //    }, function (response) {
    //        $scope.isProcess = false;
    //        if (response.data.message) {
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        }
    //    });

    //};

    $scope.loadData = function () {
       $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/CostCentre/Get?cId=0"+"&lId=" + $scope.language.LanguageId + "&status=All" ;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            var headerData = {
                "languageId": $scope.language.LanguageId,
                "CountryId": $scope.selectedCountryStatusFn.originalObject.CountryId,
                "CostCentreName": $scope.CostCentreName,
                "Descriptions": $scope.Descriptions,
                "CostCentreCode": $scope.CostCentreCode
            };

            $scope.isProcess = true;
            var postUrl = "/CostCentre/Create";

            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data) {
                    $scope.languageId = response.data;
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });

                    $scope.createToggle();
                    $scope.clearValue();
                    $scope.loadData();
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                if (response.data.message) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }
            });
        }
    };

    $scope.update = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            var headerData = {
                "CostCentreName": $scope.CostCentreName,
                "Descriptions": $scope.Descriptions,
                "Active": $scope.Active,
                "languageId": $scope.language.LanguageId,
                "CostCentreId": $scope.CostCentreId,
                "CostCentreCode": $scope.CostCentreCode,
                "CountryId": $scope.selectedCountryStatusFn.originalObject.CountryId,
                "CreatedOn": $scope.CreatedOn
            };

            $scope.isProcess = true;
            var postUrl = "/CostCentre/Update/";
            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data) {
                    alertFactory.setMessage({
                        msg: "Data updated Successfully."
                    });
                    $scope.loadData();
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                if (response.data.message) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }
            });
        }
    }

    $scope.multiLanguage = function (row) {
        $http.get("/CostCentre/GetTransCostCentre?ccId=" + row.CostCentreId)
            .then(function (response) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'skfPopupModal.html',
                    controller: 'skfModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        params: function () {
                            return { "row": row, "data": response.data };
                        }
                    }
                });
            });
        modalInstance.result.then(function (gridData) {
            $scope.search();
        }, function () {
            $scope.search();
        });
    };
});

app.controller('skfModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.costcentreName = params.row.CostCentreName;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false, enableFiltering: true,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountrycode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>'
        },
        { name: 'CostCentreName', displayName: 'Branch Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false }

    ];

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: false,
        enableSorting: true,
        enableFiltering:true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_CostCentre.xlsx',
        exporterExcelSheetName: 'EMaintenance_CostCentre',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts2.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts2.columnDefs = angular.copy(_columns);
                }, 2);
            };
        },
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

    $scope.saveCost = function () {
        var postData = [];
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            if (val.isDirty === true) {
                postData.push(val);
            }
        });

        $scope.isProcess = true;
        var postUrl = "/CostCentre/SaveMultilingual";
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.status) {
                alertFactory.setMessage({
                    msg: "Data updated Successfully."
                });

            }
            $scope.isProcess = false;
        }, function (response) {
            $scope.isProcess = false;
            if (response.data.message) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            }
        });

    };

    $scope.updateIndex = function () {
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            val.sno = i + 1;
        });
    };

    $scope.updateIndex();
    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $scope.remarks = "";
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };
});
