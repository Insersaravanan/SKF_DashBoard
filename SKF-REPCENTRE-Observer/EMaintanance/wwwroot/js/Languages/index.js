app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, $timeout, uiGridConstants, $http, languageFactory, alertFactory) {
    $scope.startIndex = 1;
    $scope.isCreate = true;
    $scope.isEdit = false;
    $scope.isclear = true;
    $scope.readOnlyPage = false;
    $scope.S_active = "All";
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50,cellClass: getCellClass,enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LName', displayName: 'Language Name', cellClass: getCellClass, enableColumnResizing: true, width: "25%", minWidth: 200, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'CountryCode', displayName: 'Country Code', width: '25%', minWidth: 200,cellClass: getCellClass,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.CountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.CountryCode }}</div>'
        },
        {
            name: 'Active', displayName: 'Status', width: "25%", minWidth: 200,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            cellClass: getCellClass,
            //cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex)  {
            //    if (grid.getCellValue(row, col) === "Y") {
            //        return 'green getClass';
            //    } else {
            //        if (grid.getCellValue(row, col) === "N") {
            //            return 'red getClass';
            //        }
            //    }
            //},
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }],
            }
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            width: "19%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Language" tooltip-class="customClass"></i></a>' +
                '</div>'
        }
    ];

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;

    setInterval(() => {
        $http.get("https://18.138.91.203:7788/api/InvokeEmaintenance/SyncLiveDetails")
            .then(function (response) {
                if (response.data) {
                   // $scope.reload();
                }
            });
    }, 30000);

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.isclear = false;
        $scope.isEdit = true;
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.LName = row.entity.LName;
        $scope.countryCode = row.entity.CountryCode;
        $scope.active = row.entity.Active;
        $scope.languageId = row.entity.LanguageId;
        $('#LName').focus();
    };

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //    //$scope.gridOpts.data = [];
    //};

    $scope.resetForm = function () {
    $scope.LName = $scope.countryCode = null;
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isEdit = false;
        $scope.isProcess = false;
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.isclear = true;
        $scope.S_active = 'All';
        $scope.resetForm();
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
        exporterExcelFilename: 'EMaintenance_Languages.xlsx',
        exporterExcelSheetName: 'EMaintenance_Languages',
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
        $http.get("/languages/GetLanguagesByStatus?status=" + $scope.S_active)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    if (val.LName == "English") {
                        val.CountryCode = "gb";
                    }
                });
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
                "LName": $scope.LName,
                "countryCode": $scope.countryCode
            };

            $scope.isProcess = true;
            var postUrl = "/languages/Create";

            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        alertFactory.setMessage({
                            msg: "Data saved Successfully."
                        });
                        $scope.clearOut();
                        $scope.loadData();
                        $scope.createToggle();
                    }
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
                "languageId": $scope.languageId,
                "LName": $scope.LName,
                "countryCode": $scope.countryCode,
                "Active": $scope.active
            };

            $scope.isProcess = true;
            var postUrl = "/languages/Update"
            $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        $scope.loadData();
                        alertFactory.setMessage({
                            msg: "Data updated Successfully."
                        });
                        $scope.searchToggle();
                    }
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
});
