app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ui.bootstrap', 'ui.grid.selection');
app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, clientFactory, $http, $uibModal, languageFactory, apiFactory, alertFactory, $timeout) {
    $scope.searchEMaint = [];
    $scope.searchObserver = [];
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "2%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ObserverDBId', displayName: 'OB Id', cellClass: getCellClass, enableColumnResizing: true, width: "2%", minWidth: 90
        },
        {
            name: 'PlantAreaName', displayName: 'Plant Area', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 90
        },
        {
            name: 'EquipmentName', displayName: 'Equipment', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 120, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'UnitType', displayName: 'Asset Type', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 70,
            cellTemplate: '<span class="ui-grid-cell-contents" ng-switch = "row.entity.UnitType">' +
                '<span ng-switch-when="DR">Drive Unit</span>' +
                '<span ng-switch-when="IN">Intermediate Unit</span>' +
                '<span ng-switch-when="DN">Driven Unit</span>' +
                '</span>' },
        { name: 'AssetName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "13%", minWidth: 100 },
        { name: 'ObserverNodeName', displayName: 'Asset Name(Observer)', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 120 },
        { name: 'ObserverNodePath', displayName: 'Observer Path', cellClass: getCellClass, enableColumnResizing: true, width: "20%",minWidth: 150},
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.AssetMap(row)" ng-class="{disable: row.entity.ObserverNodeId}"> <i class="fa fa-link icon-space-before" tooltip-append-to-body="true" uib-tooltip="Map Asset" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.removeMapping(row)" ng-class="{disable: row.entity.ObserverNodeId === null}"> <i class= "fa fa-chain-broken icon-space-before" tooltip-append-to-body="true" uib-tooltip="Unmap Asset" tooltip-class="customClass" ></i></a>' +
                '</div>',
            width: "6%",
            minWidth: 50
        }
    ];

    $scope.columns = angular.copy(_columns);
    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }
    var highlightRow = null;

    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
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
        exporterExcelFilename: 'EMaintenance_AssetMapping.xlsx',
        exporterExcelSheetName: 'EMaintenance_AssetMapping',
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

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);
        if (clientInfo === null) {
            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo !== 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
            $scope.ObserverClientNodeId = _client.ObserverNodeId;
            $scope.ClientDDL = _client;
        }
    };

    $scope.loadData = function () {
        $scope.gridOpts.data = [];
        $http.get("/AssetMapping/GetAssetMappingList?cId=" + $scope.ClientSiteId + "&lId=" + $scope.language.LanguageId)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
            });
    };

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
        }
        });

    $scope.AssetMap = function (row) {
        let sRow = [];
        sRow = $scope.gridOpts.data.filter((item) => {
            return item.ObserverNodeId !== null;
        });
        if (sRow.length > 0) {
            $scope.SelectedRow = sRow.filter((item) => {
                return item.ObserverNodeId !== row.ObserverNodeId;
            });
        }
        return $scope.assetMapping(row);
    };


    $scope.assetMapping = function (row) {
        if (!$scope.ObserverClientNodeId) {
            alertFactory.setMessage({
                type: "warning",
                msg: "The client has not been mapped."
            });
            return;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssetMappingModal.html',
            controller: 'skfAssetMappingModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, 'Selected': $scope.SelectedRow, "ObserverDBId": $scope.ObserverDBId, "ObserverClientNodeId": $scope.ObserverClientNodeId, "LanguageID": $scope.language.LanguageId };
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.loadData();
        }, function () {
        });
    };

    $scope.removeMapping = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssetMappingDeleteModal.html',
            controller: 'skfAssetMappingDeleteCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row };
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.loadData();
        }, function () {
        });
    };

    $scope.clientMapping = function () {
        $scope.LanguageID = $scope.language.LanguageId;
        var modalInstance = $uibModal.open({
            templateUrl: 'skfClientMappingAssetModal.html',
            controller: 'skfClientMappingAssetModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "data": $scope.ClientDDL, "ClientSiteId": $scope.ClientSiteId, "LanguageId": $scope.LanguageID };
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.loadData();
            $http.get("/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=ClientSite&cId=&ccId=").then(function (response) {
                for (i = 0; i <= response.data.length; i++) {
                    if (response.data[i]) {
                        if (response.data[i].ClientSiteId === $scope.ClientSiteId) {
                            sessionStorage.setItem("clientInfo", JSON.stringify(response.data[i]));
                            $scope.ObserverClientNodeId = response.data[i].ObserverNodeId;
                        }
                    }
                }
            });
        }, function () {
        });
    };

});

app.controller('skfAssetMappingModalCtrl', function ($scope, alertFactory, $http, $uibModalInstance, params) {
    $scope.Selected = {};
    $scope.ObserverDBId = params.row.entity.ObserverDBId;
    $scope.Selected = params.row.entity.ObserverNodeName;
    $scope.EMaintAssetName = params.row.entity.AssetName;
    $scope.SelectedObserver = {};
    switch (params.row.entity.UnitType) {
        case 'DR':
            $scope.selectedAssetType = "Drive Unit";
            break;
        case 'IN':
            $scope.selectedAssetType = "Intermediate Unit";
            break;
        case 'DN':
            $scope.selectedAssetType = "Driven Unit";
            break;
    }
   

    $scope.loadObserverAsset = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + params.LanguageID + "&lName=Observer_URL_END_POINT";
        $http.get(_url)
            .then(function (response) {
                $scope.Observer_ASSET_URL = response.data[0].LValue;
        $http({
            method: 'GET',
            url: $scope.Observer_ASSET_URL +"/InvokeObserver/GetOAssets/" + $scope.ObserverDBId + "/" + params.ObserverClientNodeId
        }).then(function (response) {
                if (typeof params.Selected !== 'undefined') {
                $scope.AssetsDDL = response.data.filter((item) => {
                    return !params.Selected.some((b) => {
                        return item.IDNode === b.ObserverNodeId;
                    });
                });
            }
            else {
                $scope.AssetsDDL = response.data;
            }
        });
            });
    }();

    $scope.save = function (data) {
        $scope.SelectedObserver = data;
    };

    $scope.saveMapping = function () {
        if (!$scope.SelectedObserver.IDNode) {
             //$scope.SelectedObserver.IDNode = params.row.entity.ObserverNodeId;
             //$scope.SelectedObserver.NodeName = params.row.entity.ObserverNodeName;
            $scope.Selected = {};
            alertFactory.setMessage({
                type: "warning",
                msg: "Please select the asset and save."
            });
            return;
        }
        var headerData = {
            "AssetType": params.row.entity.UnitType,
            "AssetId": params.row.entity.UnitId,
            "ObserverNodeId": $scope.SelectedObserver.IDNode,
            "ObserverNodeName": $scope.SelectedObserver.NodeName,
            "ObserverNodePath": $scope.SelectedObserver.NodePath
        };

        var postUrl = "/AssetMapping/Create";
        $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
            if (response.data) {
                alertFactory.setMessage({
                    msg: "Data saved Successfully."
                });
                $uibModalInstance.close();
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfAssetMappingDeleteCtrl', function ($scope, alertFactory, $http, $uibModalInstance, params) {
    var _param = params;
    $scope.row = _param.row;
    $scope.EMaintAssetName = $scope.row.entity.AssetName;
    switch ($scope.row.entity.UnitType) {
        case 'DR':
            $scope.selectedAssetType = "Drive Unit";
            break;
        case 'IN':
            $scope.selectedAssetType = "Intermediate Unit";
            break;
        case 'DN':
            $scope.selectedAssetType = "Driven Unit";
            break;
    }

    $scope.deleteMapping = function () {
        var headerData = {
            "AssetType": $scope.row.entity.UnitType,
            "AssetId": $scope.row.entity.UnitId,
            "ObserverNodeId": null,
            "ObserverNodeName": null,
            "ObserverNodePath": null
        };
        var postUrl = "/AssetMapping/Create";
        $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
            if (response.data) {
                alertFactory.setMessage({
                    msg: "Mapping removed successfully."
                });
                $uibModalInstance.close();
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfClientMappingAssetModalCtrl', function ($scope, alertFactory, $http, $uibModalInstance, params) {
    $scope.ClientName = params.data.ClientSiteName;
    $scope.ClientSiteId = params.data.ClientSiteId;
    $scope.ClientMapping = {
        "ObserverDBId": null,
        "ObserverDBName": null,
        "ObserverNodeId": null,
        "ObserverNodeName": null,
        "ClientSiteId": null,
        "ObserverNodePath": null
    };
    $scope.loadObserverClientDDL = function () {
        $scope.Assetdata = [];
        $http.get("/ClientMapping/GetClientMapping?lId=" + params.LanguageId)
            .then(function (response) {
                $scope.mappingClient(response.data);
            });
    }();

    $scope.mappingClient = function (data) {
        let sRow = [];
        sRow = data.filter((item) => {
            return item.ObserverNodeId !== null;
        });
        if (sRow.length > 0) {
            $scope.SelectedRow = sRow.filter((item) => {
                return item.ObserverNodeId !== params.data.ObserverNodeId;
            });
        }
        return $scope.loadObserverDB();
    };

    $scope.loadObserverDB = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + params.LanguageId + "&lName=Observer_URL_END_POINT";
        $http.get(_url)
            .then(function (response) {
                $scope.Observer_ENDPOINT_URL = response.data[0].LValue;
                $http({
                    method: "GET",
                    url: $scope.Observer_ENDPOINT_URL + "InvokeObserver/GetODBs"
                }).then(function (response) {
                    $scope.ObserverdbDDL = response.data;
                    $scope.ClientMapping.ObserverDBId = 221;
                    $scope.ClientMapping.ObserverDBName = "RMS226AO";
                    $scope.loadObserverClient(221);
                });
            });
    };

    $scope.loadObserverClient = function (data) {
        $scope.ObserverClientDDL = [];
        $http({
            method: "GET",
            url: $scope.Observer_ENDPOINT_URL + "InvokeObserver/GetOClients/" + data + "/0"
        }).then(function (response) {
            if (typeof $scope.SelectedRow !== 'undefined') {
                $scope.ObserverClientDDL = response.data.filter((item) => {
                    return !$scope.SelectedRow.some((b) => {
                        return item.IDNode === b.ObserverNodeId;
                    });
                });
            }
            else {
                $scope.ObserverClientDDL = response.data;
            }
        });
    };

    $scope.SaveODb = function (data) {
        $scope.ClientMapping.ObserverDBName = data.Name;
        $scope.ClientMapping.ObserverDBId = data.Id;
        $scope.loadObserverClient(data.Id);
        $scope.ClientMapping.ObserverNodeId = null;
    };

    $scope.SaveOClient = function (data) {
        $scope.ClientMapping.NodeName = data.NodeName;
        $scope.ClientMapping.IDNode = data.IDNode;
        $scope.ClientMapping.NodePath = data.NodePath;
    };


    $scope.save = function () {
        if (!$scope.ClientMapping.IDNode) {
            $scope.ClientMapping.ObserverNodeId = null;
            alertFactory.setMessage({
                type: "warning",
                msg: "Please select the Observer Client and save."
            });
            return;
        }
        var postData = {
            "ObserverDBId": $scope.ClientMapping.ObserverDBId,
            "ObserverDBName": $scope.ClientMapping.ObserverDBName,
            "ObserverNodeId": $scope.ClientMapping.IDNode,
            "ObserverNodeName": $scope.ClientMapping.NodeName,
            "ObserverNodePath": $scope.ClientMapping.NodePath,
            "ClientSiteId": $scope.ClientSiteId
        };

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/ClientMapping/SaveClientMapping";
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
                            msg: "Data saved Successfully."
                        });
                        $uibModalInstance.close();
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
        $uibModalInstance.dismiss();
    };
});

