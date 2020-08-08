app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, $window, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    //$scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    //$scope.isCreate = true;
    $scope.Active = "All";

    var _columns = [
        {
            name: 'ChannelId', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ChannelCode', displayName: 'Channel Code', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 50, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'ChannelName', displayName: 'Channel Name', cellClass: getCellClass, enableColumnResizing: true, width: "30%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'Descriptions', displayName: 'Descriptions', cellClass: getCellClass, enableColumnResizing: true, width: "32%", minWidth: 100 },
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
            minWidth: 50
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Channel" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.UserSiteAccess(row.entity)" <i class="fa fa-sitemap icon-space-before" tooltip-append-to-body="true" uib-tooltip="Channel Plant Mapping" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.clone(row,\'PL\')"><i class="fa fa-clone icon-space-before" tooltip-append-to-body="true" uib-tooltip="Clone Unit" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "15%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.Channel = row;
        $scope.isCreate = false;
        $scope.isSearch = false;
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
        $scope.Channel = {
            LanguageId: $scope.language.LanguageId,
            ChannelName: null,
            Descriptions: null,
            ChannelCode: null,
            Active: null,
            ClientSiteId: 0
        };
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.clearModal();
    };

    $scope.clearValue = function () {
        $scope.S_Channel = {
            Status: 'All'
        }
    };
    $scope.clearValue();

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //    $scope.gridOpts.data = [];
    //};

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isEdit = false;
        $scope.clearModal();
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
        exporterExcelFilename: 'EMaintenance_Channel.xlsx',
        exporterExcelSheetName: 'EMaintenance_Channel',
        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

            var stylesheet = workbook.getStyleSheet();
            var stdStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri'
            })  ;
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
        $scope.S_Channel.languageId = $scope.language.LanguageId;
        $scope.gridOpts.data = [];
        //$scope.isPageLoad = true;
        var _url = "/Channel/GetChannelByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=" + $scope.S_Channel.Status;
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

    //Watch expressions to get Client value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            //$scope.responseId = JSON.parse(sessionStorage.getItem("responseId"));
            $scope.selectClient();
            $scope.loadData();

            $scope.createToggle();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
        }
    });

    $scope.save = function (data) {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Channel/Create";
            if ($scope.ClientSiteId) {
                $scope.Channel.ClientSiteId = $scope.ClientSiteId;
            }

            $http.post(postUrl, JSON.stringify($scope.Channel)).then(function (response) {
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
                                $scope.Id = val.ChannelId;
                            });
                            sessionStorage.setItem("responseId", $scope.Id);
                            $window.location.href = "/Equipment";
                        } else {
                            $scope.clearValue();
                            $scope.createToggle();
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
            var postUrl = "/Channel/Update";
            if ($scope.ClientSiteId) {
                $scope.Channel.ClientSiteId = $scope.ClientSiteId;
            }

            $http.post(postUrl, JSON.stringify($scope.Channel)).then(function (response) {
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

    $scope.UserSiteAccess = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfUsersiteAccess.html',
            controller: 'skfUsersiteAccessCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (gridData) {
        }, function () {
        });
    };


    //$scope.multiLanguage = function (row) {
    //    $http.get("/Channel/GetTransChannel?pId=" + row.ChannelId)
    //        .then(function (response) {
    //            angular.forEach(response.data, function (val, i) {
    //                val.sno = i + 1;
    //            });

    //            var modalInstance = $uibModal.open({
    //                templateUrl: 'skfMultiLanguageModal.html',
    //                controller: 'skfMultiLanguageModalCtrl',
    //                size: 'lg',
    //                backdrop: 'static',
    //                keyboard: false,
    //                resolve: {
    //                    params: function () {
    //                        return { "row": row, "data": response.data };
    //                    }
    //                }
    //            });
    //        });
    //};

    //$scope.import = function () {
    //    $scope.Channel = "Channel"
    //    var modalInstance = $uibModal.open({
    //        templateUrl: 'skfImportModal.html',
    //        controller: 'skfImportModalCtrl',
    //        size: 'lg',
    //        resolve: {
    //            params: function () {
    //                return { "language": $scope.language, "templateName": $scope.segment };
    //            }
    //        }
    //    });

    //    modalInstance.result.then(function (gridData) {
    //        $scope.loadData();
    //    }, function () {
    //        $scope.loadData();
    //    });
    //};

    //setTimeout(function () {
    //    $scope.checkSession = function () {
    //        if (typeof $scope.clientInfo == "undefined") {
    //            $scope.ClientInfo = function () {
    //                var modalInstance = $uibModal.open({
    //                    templateUrl: 'skfClientInfoModal.html',
    //                    controller: 'skfClientInfoModalCtrl',
    //                    size: 'md',
    //                    resolve: {
    //                        params: function () {
    //                            return { "languageId": $scope.language.LanguageId, "ClientName": $scope.clientName };
    //                        }
    //                    }
    //                });

    //                modalInstance.result.then(function () {
    //                }, function () {

    //                });
    //            };
    //            $scope.ClientInfo();
    //        }
    //    }();
    //}, 1000);

    $scope.clone = function (row, Type) {
        var ChannelId;
        if (Type == 'PL') {
            ChannelId = row.entity.ChannelId;
        }
        else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Unit does not match, Please Contact Support!!!",
                exc: "Please check the Unit Type Code."
            });
            return false;
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'skfClonePopupModal.html',
            controller: 'skfCloneCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { Type: Type, ChannelId: ChannelId, "languageId": $scope.language.LanguageId, "ChannelName": row.entity.ChannelName };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadData();
            }
        }, function () {
        });
    }




});

//MultiLanguage popup controller
//app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
//    var _param = params;
//    $scope.ChannelName = params.row.ChannelName;
//    $scope.formatters = {};

//    var _columns = [
//        {
//            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
//            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
//        },
//        {
//            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false, enableFiltering: true,
//            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>',
//            minWidth: 150
//        },
//        { name: 'ChannelName', displayName: 'Channel Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 },
//        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 200 }
//    ];

//    $scope.columns = angular.copy(_columns);

//    $scope.gridOpts2 = {
//        columnDefs: $scope.columns,
//        data: _param.data,
//        enablePinning: true,
//        enableSorting: true,
//        enableFiltering: true,
//        enableGridMenu: true,
//        enableColumnResizing: true,
//        exporterMenuPdf: false,
//        exporterMenuCsv: false,
//        exporterExcelFilename: 'EMaintenance_Segment.xlsx',
//        exporterExcelSheetName: 'EMaintenance_Segment',
//        onRegisterApi: function (gridApi) {
//            $scope.gridApi = gridApi;
//            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    rowEntity.isDirty = true;
//                }
//            });
//            $scope.gridApi.grid.clearAllFilters = function () {
//                $scope.gridOpts2.columnDefs = [];
//                $timeout(function () {
//                    $scope.gridOpts2.columnDefs = angular.copy(_columns);
//                }, 2);
//            };
//        },
//        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

//            var stylesheet = workbook.getStyleSheet();
//            var stdStyle = stylesheet.createFontStyle({
//                size: 9, fontName: 'Calibri'
//            });
//            var boldStyle = stylesheet.createFontStyle({
//                size: 9, fontName: 'Calibri', bold: true
//            });
//            var aFormatDefn = {
//                "font": boldStyle.id,
//                "alignment": { "wrapText": true }
//            };
//            var formatter = stylesheet.createFormat(aFormatDefn);
//            // save the formatter
//            $scope.formatters['bold'] = formatter;
//            var dateFormatter = stylesheet.createSimpleFormatter('date');
//            $scope.formatters['date'] = dateFormatter;

//            aFormatDefn = {
//                "font": stdStyle.id,
//                "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
//                "alignment": { "wrapText": true }
//            };
//            var singleDefn = {
//                font: stdStyle.id,
//                format: '#,##0.0'
//            };
//            formatter = stylesheet.createFormat(aFormatDefn);
//            // save the formatter
//            $scope.formatters['red'] = formatter;

//            Object.assign(docDefinition.styles, $scope.formatters);

//            return docDefinition;
//        },
//        exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
//            // this can be defined outside this method
//            var stylesheet = workbook.getStyleSheet();
//            var aFormatDefn = {
//                "font": { "size": 11, "fontName": "Calibri", "bold": true },
//                "alignment": { "wrapText": true }
//            };
//            var formatterId = stylesheet.createFormat(aFormatDefn);

//            // excel cells start with A1 which is upper left corner
//            sheet.mergeCells('B1', 'C1');
//            var cols = [];
//            // push empty data
//            cols.push({ value: '' });
//            // push data in B1 cell with metadata formatter
//            cols.push({ value: 'SKF', metadata: { style: formatterId.id } });
//            sheet.data.push(cols);
//        },
//        exporterFieldFormatCallback: function (grid, row, gridCol, cellValue) {
//            // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
//            // a formatter and obtaining the id
//            var formatterId = null;
//            if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
//                formatterId = $scope.formatters['red'].id;
//            }

//            if (gridCol.field === 'updatedDate') {
//                formatterId = $scope.formatters['date'].id;
//            }

//            if (formatterId) {
//                return { metadata: { style: formatterId } };
//            } else {
//                return null;
//            }
//        },
//        exporterColumnScaleFactor: 4.5,
//        exporterFieldApplyFilters: true
//    };


//    $scope.save = function () {
//        var postData = [];
//        angular.forEach($scope.gridOpts2.data, function (val, i) {
//            if (val.isDirty === true) {
//                postData.push(val);
//            }
//        });

//        if (!$scope.isProcess) {
//            $scope.isProcess = true;
//            var postUrl = "/Channel/SaveMultilingual";
//            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
//                if (response.status) {
//                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
//                        alertFactory.setMessage({
//                            type: "warning",
//                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
//                        });
//                    }
//                    else {
//                        alertFactory.setMessage({
//                            msg: "Data updated Successfully."
//                        });
//                    }
//                }
//                $scope.isProcess = false;
//            }, function (response) {
//                $scope.isProcess = false;
//                if (response.data.message) {
//                    alertFactory.setMessage({
//                        type: "warning",
//                        msg: String(response.data.message),
//                        exc: String(response.data.exception)
//                    });
//                }
//            });
//        }
//    };

//    $scope.ok = function () {
//        $uibModalInstance.close($scope.rowData);
//    };

//    $scope.cancel = function () {
//        $uibModalInstance.dismiss('cancel');
//    };

//});

//RoleGroup popup controller
app.controller('skfUsersiteAccessCtrl', function ($scope, $http, $uibModalInstance, params, alertFactory) {
    $scope.userName = params.row.UserName;
    $scope.UserTypeCode = params.row.UserTypeCode;
    $scope.oneAtATime = true;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.intern = {};
    $scope.intern.selectedCountries = [];
    $scope.intern.selectedClientSite = [];
    $scope.intern.selectedCostcentre = [];
    $scope.intern.selectedClient = [];
    $scope.UserClientRelation = function () {
        angular.forEach($scope.UserClientRel, function (val, a) {
            if (a == "CountryRelations") {
                $scope.countries = val;
                angular.forEach(val, function (_country, j) {
                    if (_country.Active == 'Y') {
                        _country.selected = true;
                        $scope.intern.selectedCountries.push(_country)
                    }
                });
            }
            if (a == "CostCentreRelations") {
                $scope.CostcentreDDL = val;
                angular.forEach(val, function (_costcentre, l) {
                    if (_costcentre.Active == 'Y') {
                        _costcentre.selected = true;
                        $scope.intern.selectedCostcentre.push(_costcentre);
                    }
                });
            }

            if (a == "ClientRelations") {
                $scope.clientDDL = val;
                angular.forEach(val, function (_client, m) {
                    if (_client.Active == 'Y') {
                        _client.selected = true;
                        $scope.intern.selectedClient.push(_client);
                    }
                });
            }

            if (a == "ClientSiteRelations") {
                $scope.ClientSiteDDL = val;
                angular.forEach(val, function (_clientsite, k) {
                    if (_clientsite.Active == 'Y') {
                        _clientsite.selected = true;
                        $scope.intern.selectedClientSite.push(_clientsite);
                    }
                });
            }
        });
    }

    $scope.save = function () {
        $scope.countryList = [];
        $scope.costCentreList = [];
        $scope.clientSiteList = [];
        $scope.clientList = [];

        angular.forEach($scope.UserClientRel, function (val, a) {
            if (a == "CountryRelations") {
                angular.forEach(val, function (_country, j) {
                    if ($scope.intern.selectedCountries.length > 0) {
                        angular.forEach($scope.intern.selectedCountries, function (S_country, g) {
                            if (_country.CountryName == S_country.CountryName) {
                                if (S_country.Active == 'N') {
                                    _country.Active = "Y";
                                    _country.isDirty = true;
                                    $scope.countryList.push(_country);
                                } else {
                                    _country.isDirty = false;
                                }
                            }
                        });

                    }
                    if (_country.selected && typeof _country.isDirty == "undefined" && _country.Active == "Y") {
                        _country.Active = "N";
                        _country.isDirty = true;
                        $scope.countryList.push(_country);
                    }
                });
            }

            if (a == "CostCentreRelations") {
                angular.forEach(val, function (_costcentre, j) {
                    if ($scope.intern.selectedCostcentre.length > 0) {
                        angular.forEach($scope.intern.selectedCostcentre, function (S_costcentre, i) {
                            if (_costcentre.CostCentreName == S_costcentre.CostCentreName) {
                                if (S_costcentre.Active == 'N') {
                                    _costcentre.Active = "Y";
                                    _costcentre.isDirty = true;
                                    $scope.costCentreList.push(_costcentre);
                                } else {
                                    _costcentre.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_costcentre.selected && typeof _costcentre.isDirty == "undefined" && _costcentre.Active == "Y") {
                        _costcentre.Active = "N";
                        _costcentre.isDirty = true;
                        $scope.costCentreList.push(_costcentre);
                    }
                });
            }

            if (a == "ClientSiteRelations") {
                angular.forEach(val, function (_ClientSite, j) {
                    if ($scope.intern.selectedClientSite.length > 0) {
                        angular.forEach($scope.intern.selectedClientSite, function (S_clientSite, i) {
                            if (_ClientSite.ClientSiteName == S_clientSite.ClientSiteName) {
                                if (S_clientSite.Active == 'N') {
                                    _ClientSite.Active = "Y";
                                    _ClientSite.isDirty = true;
                                    $scope.clientSiteList.push(_ClientSite);
                                } else {
                                    _ClientSite.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_ClientSite.selected && typeof _ClientSite.isDirty == "undefined" && _ClientSite.Active == "Y") {
                        _ClientSite.Active = "N";
                        _ClientSite.isDirty = true;
                        $scope.clientSiteList.push(_ClientSite);
                    }
                });
            }

            if (a == "ClientRelations") {
                angular.forEach(val, function (_client, j) {
                    if ($scope.intern.selectedClient) {
                        angular.forEach($scope.intern.selectedClient, function (S_client, i) {
                            if (_client.ClientName == S_client.ClientName) {
                                if (S_client.Active == 'N') {
                                    _client.Active = "Y";
                                    _client.isDirty = true;
                                    $scope.clientList.push(_client);
                                } else {
                                    _client.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_client.selected && typeof _client.isDirty == "undefined" && _client.Active == "Y") {
                        _client.Active = "N";
                        _client.isDirty = true;
                        $scope.clientList.push(_client);
                    }
                });
            }
        });
        $scope.isProcess = true;
        var postUrl = "/UserClientSiteRel/Create";
        var UserClientRel = {
            "CountryRelations": $scope.countryList,
            "CostCentreRelations": $scope.costCentreList,
            "ClientSiteRelations": $scope.clientSiteList,
            "ClientRelations": $scope.clientList,
            "LanguageId": params.languageId,
            "Userid": params.row.UserId
        }

        $http.post(postUrl, JSON.stringify(UserClientRel)).then(function (response) {
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

    $scope.UserClientRelinfo = function () {
        var _url = "/ChannelPlantMapping/GetChannelPlantList?lId=" + params.languageId + "&uId=" + params.row.UserId;
        $http.get(_url)
            .then(function (response) {
                $scope.UserClientRel = JSON.parse(response.data[0].UserAccess)[0]
                $scope.UserClientRelation();
            });
    }();


    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});


app.controller('skfCloneCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {
    $scope.DispTypeName = params.DispTypeName;
    $scope.languageId = params.languageId;
    $scope.ChannelName = params.ChannelName;

    
    $scope.isClone = true;

    $scope.clone = function () {
        $scope.CloneCount;
        var _url = "/equipment/Clone?type=" + params.Type + "&cc=" + $scope.CloneCount + "&plId=" + params.ChannelId + "&lId=" + $scope.languageId;

        $http.get(_url).then(function (response) {
            if (response) {
                $scope.ChannelCloneDDL = response.data;
                $scope.isClone = false;
                alertFactory.setMessage({
                    msg: "Data Cloned Successfully."
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

    $scope.save = function () {
        angular.forEach($scope.ChannelCloneDDL, function (val, i) {
            val.LanguageId = $scope.languageId;
            val.Type = params.Type;
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/SaveCloneIdentifier";
            $http.post(postUrl, JSON.stringify($scope.ChannelCloneDDL)).then(function (response) {
                if (response.status) {
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
                        $uibModalInstance.close("Success");
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

