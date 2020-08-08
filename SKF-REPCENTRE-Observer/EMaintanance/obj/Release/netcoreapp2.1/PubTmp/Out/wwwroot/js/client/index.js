app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal,$window, languageFactory, alertFactory, $timeout) {
    $scope.startIndex = 1;
    //$scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.language = null;
    //$scope.isCreate = true;
    $scope.isclear = true;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ClientName', displayName: 'Client Name', cellClass: getCellClass, enableColumnResizing: true, width: "50%", minWidth: 200, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'ClientStatusName', displayName: 'Status', cellClass: getCellClass,
            width: "15%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity) || grid.appScope.toggleCreate()" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Client" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "30%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.isCreate = false;
        $scope.Client = row;
        $scope.Client.LookupId = row.ClientStatus;
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
    };

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //};

    $scope.createToggle = function () {
        $scope.isCreate = true;
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
        $scope.Client = {
            LanguageId: $scope.language.LanguageId,
            ClientName: null,
            ClientStatus: 0,
            ClientStatusName: null,
            ClientId:0
        };
        $scope.resetForm();
    };

    $scope.clearValue = function () {
        $scope.S_Client = {
            ClientStatus: ""
        };
    };

    $scope.clearValue();

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
        exporterExcelFilename: 'EMaintenance_Client.xlsx',
        exporterExcelSheetName: 'EMaintenance_Client',
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
        $scope.isPageLoad = true;
        $scope.gridOpts.data = [];
        var _url = "/Client/GetClientByStatus?lId=" + $scope.language.LanguageId + "&cliStatus=" + $scope.S_Client.ClientStatus;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            });
    };


    $scope.loadClient = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ClientStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.ClientDDL = response.data;
            });
    };

    $scope.loadclientchange = function (data) {
        var _url = "/lookup/getlookupbyname?lid=" + $scope.language.languageid + "&lname=clientstatus";
        $http.get(_url)
            .then(function (response) {
                angular.foreach(response.data, function (val, i) {
                    if (_data == val.lookupid) {
                        $scope.client.clientstatusname = val.lookupname;
                        $scope.client.clientstatusid = val.lookupid;
                    }
                });
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadData();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
            $scope.createToggle();
            $scope.loadClient();
        }
    });

    $scope.save = function (data) {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Client/Create";

            $http.post(postUrl, JSON.stringify($scope.Client)).then(function (response) {
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
                       
                        if (data == "goto") {
                            angular.forEach(response.data, function (val, i) {
                                $scope.Id = val.ClientId;
                            });
                            sessionStorage.setItem("responseId", $scope.Id);
                            $window.location.href = "/clientSite";
                        } else {
                            $scope.clearOut();
                            $scope.loadData();
                        }
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
            $scope.isProcess = true;
            var postUrl = "/Client/Update";
            $http.post(postUrl, JSON.stringify($scope.Client)).then(function (response) {
                if (response.data) {
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
                        $scope.loadData();
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

    $scope.multiLanguage = function (row) {
        $http.get("/Client/GetTransClient?cliId=" + row.ClientId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.sno = i + 1;
                });

                var modalInstance = $uibModal.open({
                    templateUrl: 'skfMultiLanguageModal.html',
                    controller: 'skfMultiLanguageModalCtrl',
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
            $scope.loadData();
        }, function () {
            $scope.loadData();
        });
    };
});

//MultiLanguage popup controller
app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.ClientName = params.row.ClientName;

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false, enableFiltering: true,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>',
            minWidth: 150
        },
        { name: 'ClientName', displayName: 'Client Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 }
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
        exporterExcelFilename: 'EMaintenance_Client.xlsx',
        exporterExcelSheetName: 'EMaintenance_Client',
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

    $scope.save = function () {
        var postData = [];
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            if (val.isDirty === true) {
                postData.push(val);
            }
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/Client/SaveMultilingual";
            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
                if (response.data) {
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

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});