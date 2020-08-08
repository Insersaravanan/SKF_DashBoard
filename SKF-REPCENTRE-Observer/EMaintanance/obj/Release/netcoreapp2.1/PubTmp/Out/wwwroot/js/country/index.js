app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ui.bootstrap', 'ui.grid.selection');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, apiFactory, alertFactory,$timeout) {
    $scope.startIndex = 1;
    $scope.isCreate = true;
    $scope.isEdit = false;
    $scope.isclear = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.S_active = "All";
    $scope.language = null;


    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass,enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'CountryCode', displayName: 'Country Code', width: '25%', minWidth: 200,cellClass: getCellClass,aggregationHideLabel: false, enableColumnResizing: true,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.CountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.CountryCode }}</div>'
        },
        {
            name: 'CountryName', displayName: 'Country Name', cellClass: getCellClass,enableColumnResizing: true, width: "25%", minWidth: 200, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'Active', displayName: 'Status', width: "25%", minWidth: 200,
            cellClass: getCellClass,
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
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, width: "19%", minWidth: 100,cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Country" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '</div>'
        }
    ];

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isclear = false;
        $scope.isEdit = true;
        $scope.isCreate = false;
        $scope.selectedRow = $scope.gridOpts.data.indexOf(row.entity);
        $scope.active = row.entity.Active;
        $scope.countryId = row.entity.CountryId;
        $scope.languageId = row.entity.LanguageId;
        $scope.countryCode = row.entity.CountryCode;
        $scope.CountryName = row.entity.CountryName;
        $('#CountryName').focus();
    };

    $scope.resetForm = function () {
        $scope.countryCode = $scope.CountryName = null;
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
        $scope.S_active = 'All';
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
        enableCellEdit:false,
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
        exporterExcelFilename: 'EMaintenance_Country.xlsx',
        exporterExcelSheetName: 'EMaintenance_Country',
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
    };

    $scope.loadData = function () {
        $scope.isPageLoad = true;
        $scope.gridOpts.data = [];
        var _url = "/country/Get?lId=" + $scope.language.LanguageId + "&status=" + $scope.S_active;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                $scope.updateIndex();
            });
    };

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadData();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
        }
    });


    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            var headerData = {
                "languageId": $scope.language.LanguageId,
                "countryCode": $scope.countryCode,
                "countryName": $scope.CountryName,
                "countryId": 0
            };

            $scope.isProcess = true;
            var postUrl = "/country/Create";
            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data && apiFactory.Validate(response.data)) {
                    $scope.etimeout = 4000;
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });
                    $scope.clearOut();
                    $scope.loadData();
                    $scope.createToggle();
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
                "active": $scope.active,
                "countryId": $scope.countryId,
                "countryCode": $scope.countryCode,
                "countryName": $scope.CountryName,
                "languageId": $scope.languageId
            };

            $scope.isProcess = true;
            var postUrl = "/country/Update";
            $scope.ShowEx = false;
            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data && apiFactory.Validate(response.data)) {
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
    };

    $scope.multiLanguage = function (row) {
        $http.get("/Country/GetTransCountries?cId=" + row.entity.CountryId)
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
    };
});

app.controller('skfModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, languageFactory, $timeout) {
    var _param = params;
    $scope.CName = params.row.entity.CountryName;
    $scope.CountryCode = params.row.entity.CountryCode;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false, 
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language', enableCellEdit: false, minWidth: 200, enableFiltering: true,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>'
        },
        { name: 'CountryName', displayName: 'Country Name', enableColumnResizing: true, enableFiltering: false, enableCellEdit: true, minWidth: 200, }
    ];

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Country.xlsx',
        exporterExcelSheetName: 'EMaintenance_Country',
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

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            if ($scope.isPageLoad) {
                $scope.loadData();
            }
        }
    });


    $scope.savemultiCountry = function () {
        var postData = [];
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            if (val.isDirty === true) {
                postData.push(val);
            }
        });

        $scope.isProcess = true;
        var postUrl = "/country/SaveMultilingual";
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                });
            }
            else {
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