app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'dndLists', 'ngSanitize', 'ui.select');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, uiGridPinningConstants, $uibModal, $timeout, $http, languageFactory, alertFactory) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enablePinning: false, pinnedLeft: true,
            aggregationHideLabel: true, aggregationType: uiGridConstants.aggregationTypes.count, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'UserName', displayName: 'User Name', cellClass: getCellClass, enableColumnResizing: true, width: "25%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'FirstName', displayName: 'First Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 150 },
        { name: 'LastName', displayName: 'Last Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 150 },
        { name: 'Mobile', displayName: 'Mobile', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'EmailId', displayName: 'Email', cellClass: getCellClass, enableColumnResizing: true, width: "20%", minWidth: 150 },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity) || grid.appScope.toggleCreate()" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit User" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.loadrelData(row.entity)" <i class="fa fa-link icon-space-before" tooltip-append-to-body="true" uib-tooltip="User RoleGroup Relation" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.UserSiteAccess(row.entity)" <i class="fa fa-sitemap icon-space-before" tooltip-append-to-body="true" uib-tooltip="User Site Access" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "9%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.clearModal();
        $scope.Users.UserTypeId = row.UserTypeId;
        $scope.Users.UserStatusId = row.UserStatusId;
        $scope.Users = row;
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
    };

    $scope.searchToggle = function () {
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        //$scope.gridOpts.data = [];
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.clearModal();
    };

    $scope.validateDomain = function () {
        if ($scope.Users.UserName.length > 0) {
            var domain = $scope.Users.UserName.replace(/.*@/, "");
            if (domain.length > 0) {
                if (domain.toUpperCase() == "SKF.COM") {
                    angular.forEach($scope.UserTypeDDL, function (val, i) {
                        if (val.LookupCode == 'IUSR') {
                            $scope.Users.UserTypeId = val.LookupId;
                        }
                    });
                } else {
                    $scope.Users.UserTypeId = null;
                }
            }
        }
    }

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
        $scope.Users = {
            LookupId: 0,
            UserId: 0,
            LanguageId: $scope.language.LanguageId,
            UserName: null,
            FirstName: null,
            MiddleName: null,
            LastName: null,
            EmailId: null,
            UserTypeId: null,
            UserStatusId: null,
            Mobile: null,
            Phone: null,
            CreatedBy: 0,
            Active: "Y"
        };
        $scope.resetForm();
    };

    $scope.clearValue = function () {
        $scope.S_Users = {
            _UserStatusId: "",
            _UserTypeId: ""
        };
    };
    $scope.clearValue();

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
        exporterExcelFilename: 'EMaintenance_Users.xlsx',
        exporterExcelSheetName: 'EMaintenance_Users',
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
        $scope.S_Users.languageId = $scope.language.LanguageId;
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var postUrl = "/Users/Search";
        if ($scope.S_Users._UserTypeId) {
            $scope.S_Users.UserTypeId = parseInt($scope.S_Users._UserTypeId);
        } else {
            $scope.S_Users.UserTypeId = 0;
        }
        if ($scope.S_Users._UserStatusId) {
            $scope.S_Users.UserStatusId = parseInt($scope.S_Users._UserStatusId);
        } else {
            $scope.S_Users.UserStatusId = 0;
        }
        $http.post(postUrl, JSON.stringify($scope.S_Users)).then(function (response) {
            if (response.data) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            }

        }, function (response) {
            alertFactory.setMessage({
                type: "warning",
                msg: String(response.data.message)
            });
        });
    };

    $scope.loadUserType = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=UserType";
        $http.get(_url)
            .then(function (response) {
                $scope.UserTypeDDL = response.data;
            });
    };

    $scope.loadUserStatus = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=UserStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.UserStatusDDL = response.data;
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
            $scope.loadUserStatus();
            $scope.loadUserType();
        }
    });

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Users/Create";

            $http.post(postUrl, JSON.stringify($scope.Users)).then(function (response) {
                if (response.data) {
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
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message)
                });
            });
        }
    };

    $scope.update = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Users/Update/";
            $http.post(postUrl, JSON.stringify($scope.Users)).then(function (response) {
                if (response.data) {
                    alertFactory.setMessage({
                        msg: "Data updated Successfully."
                    });
                    $scope.searchToggle();
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
        }
    };

    $scope.roleGroupRelation = function (row, data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfRoleGroupModal.html',
            controller: 'skfRoleGroupModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, "data": data};
                }
            }
        });

        modalInstance.result.then(function (gridData) {
            $scope.loadData();
        }, function () {
            $scope.loadData();
        });

    };

    $scope.loadrelData = function (row) {
        $http.get("/UserRoleGroupRel/GetUserRoleGroupAccess?uId=" + row.UserId + "&lId=" + $scope.language.LanguageId)
            .then(function (response) {
                if (response.data) {
                    $scope.roleGroupRelation(row, response.data);
                }
            });
    }

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

    $scope.import = function () {
        $scope.segment = "User"
        var modalInstance = $uibModal.open({
            templateUrl: 'skfImportModal.html',
            controller: 'skfImportModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "templateName": $scope.segment };
                }
            }
        });

        modalInstance.result.then(function (gridData) {
            $scope.loadData();
        }, function () {
            $scope.loadData();
        });
    };
});

//RoleGroup popup controller
app.controller('skfRoleGroupModalCtrl', function ($scope, $http, $uibModalInstance, params, alertFactory) {
    var _data = JSON.parse(params.data[0].RoleGroupRelation)[0];
    $scope.userName = params.row.UserName;

    $scope.models = [
        { listName: "Available", cssClass: 'warning', items: _data.Available ? _data.Available : [], dragging: false },
        { listName: "Associated", cssClass: 'success', items: _data.Associated ? _data.Associated : [], dragging: false }
    ];

    /**
     * dnd-dragging determines what data gets serialized and send to the receiver
     * of the drop. While we usually just send a single object, we send the array
     * of all selected items here.
     */
    $scope.getSelectedItemsIncluding = function (list, item) {
        item.selected = true;
        return list.items.filter(function (item) { return item.selected; });
    };


    $scope.btnright = false;
    $scope.btnleft = false;
    $scope.setSelected = function (list, item) {
        item.selected = !item.selected;
        list.selectFlag = !(list.items.length == list.items.filter(function (item) { return item.selected; }).length);
        if (item.selected && list.listName == "Available") {
            $scope.btnright = true;
        } else {
            $scope.btnright = false;
        }

        if (item.selected && list.listName == "Associated") {
            $scope.btnleft = true;
        } else {
            $scope.btnleft = false;
        }
    };

    /**
     * We set the list into dragging state, meaning the items that are being
     * dragged are hidden. We also use the HTML5 API directly to set a custom
     * image, since otherwise only the one item that the user actually dragged
     * would be shown as drag image.
     */
    $scope.onDragstart = function (list, event) {
        list.dragging = true;
        if (event.dataTransfer.setDragImage) {
            var img = new Image();
            img.src = 'images/ic_content_copy_black_24dp_2x.png';
            event.dataTransfer.setDragImage(img, 0, 0);
        }
    };

    /**
     * In the dnd-drop callback, we now have to handle the data array that we
     * sent above. We handle the insertion into the list ourselves. By returning
     * true, the dnd-list directive won't do the insertion itself.
     */
    $scope.onDrop = function (list, items, index) {
        angular.forEach(items, function (item) { item.selected = false; });
        list.selectFlag = true;
        list.items = list.items.slice(0, index)
            .concat(items)
            .concat(list.items.slice(index));
        $scope.btnright = false;
        $scope.btnleft = false;
        return true;
    };

    /**
     * Last but not least, we have to remove the previously dragged items in the
     * dnd-moved callback.
     */
    $scope.onMoved = function (list) {
        list.selectFlag = true;
        list.items = list.items.filter(function (item) { return !item.selected; });
    };

    //On move right only selected item
    $scope.ShuttleRight = function (list) {
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 1) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }
                    });
                }
            });
        }
    };

    //On move right all
    $scope.ShuttleRightAll = function (list) {
        //$scope.selectAll(list, flag);
        angular.forEach(list.items, function (item, i) {
            item.selected = true;
        });
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 1) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    // On Move Left only selected item
    $scope.ShuttleLeft = function (list) {
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 0) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    // On Move Left All
    $scope.ShuttleLeftAll = function (list) {
        //$scope.selectAll(list, flag);
        angular.forEach(list.items, function (item, i) {
            item.selected = true;
        });
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 0) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    $scope.save = function () {
        var postData = {};
        postData.UserId = _data.Userid;
        postData.Relations = [];

        angular.forEach($scope.models, function (m, i) {
            angular.forEach(m.items, function (item, j) {
                if (m.listName == 'Associated') {
                    item.Active = 'Y';
                }
                else {
                    item.Active = 'N';
                }

                postData.Relations.push(item);
            });
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/UserRoleGroupRel/Create";
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
        var _url = "/UserClientSiteRel/GetUserSiteAccess?lId=" + params.languageId + "&uId=" + params.row.UserId;
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

app.controller('skfImportModalCtrl', function ($scope, alertFactory, $timeout, $http, $uibModalInstance, params, uiGridConstants) {
    $scope.formatters = {};
    $scope.alerts = [];
    $scope.closeAlert = function (index) {
        try {
            $scope.alerts.splice(index, 1);
        }
        catch (e) {
            //
        }
    };

    var rowtpl = '<div ng-class="{\'invalid-input\':row.entity.validationStatus == \'E\',\'valid-input\':row.entity.validationStatus == \'V\'}"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
    $scope.gridOptions = {
        rowTemplate: rowtpl,
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Export_' + params.templateName + '.xlsx',
        exporterExcelSheetName: params.templateName,
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

    $scope.reset = function () {
        $scope.gridOptions.data = [];
        $scope.gridOptions.columnDefs = [];
        $scope.stacked = [];
    };

    $scope.template = params.templateName;
    $scope.loadColumns = function () {
        $scope.gridOptions.colTemp = [];
        $http.get("/Lookup/GetLookupByName?lId=" + params.language.LanguageId + "&lName=" + $scope.template + "_Template")
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.gridOptions.colTemp = response.data.map(function (d) {
                        var obj = {};
                        obj[d.LValue] = '';
                        return obj;
                    });
                }
            });
    };
    $scope.loadColumns(params.templateName);

    $scope.downloadTemplate = function () {
        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet($scope.gridOptions.colTemp);

        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, $scope.template + "_Template");

        /* write workbook */
        XLSX.writeFile(wb, $scope.template + "_Template.xlsx");
        // XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //Cancel the Upload Progress
    $scope.cancelProgress = function () {
        $scope.progressCall(false);
    };

    //Initial call for Upload
    $scope.saveData = function () {
        $scope.SaveDataQueue = angular.copy($scope.gridOptions.data);
        $scope.progressCall(true);
    };

    //Update the progress based on items upload
    $scope.progressCall = function (flag) {
        $scope.isProgress = flag;
        $timeout(function () {
            var _total = $scope.gridOptions.data.length;
            var _progressed = _total - $scope.SaveDataQueue.length;
            var _errorCount = $scope.gridOptions.data.filter((data) => {
                return data.validationStatus && data.validationStatus === "E";
            }).length;

            if (flag) {
                $scope.sendDataToImport(5);
            }
            else {
                $scope.SaveDataQueue = [];
            }

            //Progressbar 
            $scope.stacked = [];
            $scope.stacked.push({
                value: Math.round(((_progressed - _errorCount) / _total) * 100),
                type: 'success',
                title: (_progressed - _errorCount) + ' items Successfully updated'
            });
            $scope.stacked.push({
                value: Math.round((_errorCount / _total) * 100),
                type: 'warning',
                title: _errorCount + ' items having issue to upload.'
            });
        }, 1);
    };

    $scope.updateGridData = function (col, flag) {
        var _grid = $scope.gridOptions.data;
        angular.forEach(col, function (val, i) {
            for (var i = 0, len = _grid.length; i < len; i++) {
                if (_grid[i].ReferenceNo == val.ReferenceNo) {
                    _grid[i].validationStatus = val.validationStatus;
                    _grid[i].ValidationResult = val.ValidationResult;
                    break;
                }
            }
        });
        var _flag = $scope.SaveDataQueue.length > 0 && flag ? true : false;
        $scope.progressCall(_flag);
    };

    $scope.sendDataToImport = function (chunk) {
        var postData = {};
        //postData.PType = $scope.template;
        //postData.LanguageId = params.language.LanguageId;
        //postData.Flag = 'Save';
        postData = $scope.SaveDataQueue.splice(0, chunk);
        var postUrl = "/Users/Import";
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data) {
                alertFactory.setMessage({
                    msg: "Data saved Successfully."
                });
                //$scope.updateGridData(JSON.parse(response.data[0].MasterImport), true);
            }
            else if (response.data.isException) {
                $scope.alerts.push({
                    type: "warning",
                    msg: String(response.data.message)
                });
                //var _col = postData.Detail.map(function (item, i) {
                //    item.validationStatus = 'E';
                //    item.ValidationResult = response.data.message;
                //    return item;
                //});
                //$scope.updateGridData(_col, false);
            }
        }, function (response) {
            $scope.alerts.push({
                type: "warning",
                msg: String(response.data.message)
            });
            //var _col = postData.Detail.map(function (item, i) {
            //    item.validationStatus = 'E';
            //    item.ValidationResult = response.data.message;
            //    return item;
            //});
            //$scope.updateGridData(_col, false);
        });
    };
});

app.directive("fileread", [function () {
    return {
        scope: {
            opts: '='
        },
        link: function ($scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();
                $scope.opts.invalidUpload = false;

                reader.onload = function (evt) {
                    $scope.$apply(function () {
                        var _data = evt.target.result;

                        var workbook = XLSX.read(_data, { type: 'binary' });

                        var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];

                        var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

                        $scope.opts.columnDefs = [];
                        $scope.opts.columnDefs.push({
                            field: 'Sno',
                            width: 55,
                            enableFiltering: false,
                            cellTemplate: '<div class="ui-grid-cell-contents"><p>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</p></div>'

                        });

                        var validateFile = true;
                        headerNames.forEach(function (h) {
                            if (validateFile) {
                                $scope.opts.columnDefs.push({ field: h, minWidth: 150 });

                                validateFile = $scope.opts.colTemp.some(function (val) {
                                    return val[h] !== undefined;
                                });
                            }
                        });

                        $scope.opts.columnDefs.push({
                            field: 'ValidationResult',
                            minWidth: 150,
                            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.ValidationResult}}" tooltip-class="customClass import-tooltip">{{row.entity.ValidationResult}}</p></div>'
                        });

                        if (validateFile && $scope.opts.colTemp.length === $scope.opts.columnDefs.length - 2) {
                            $scope.opts.data = data.map(function (item, i) {
                                item.ReferenceNo = i + 1;
                                return item;
                            });
                        }
                        else {
                            $scope.opts.columnDefs = [];
                            $scope.opts.invalidUpload = true;
                        }
                        $elm.val(null);
                    });
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
}]);
