app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, $window, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.formatters = {};
    $scope.language = null;

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'CountryName', displayName: 'Country Name', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 70 },
        {
            name: 'CostCentreName', displayName: 'Costcentre Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100,
            aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },

        { name: 'ClientSiteName', displayName: 'Emaintenance Client', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100 },
        {
            name: 'ObserverNodeName', displayName: 'Observer Client', cellClass: getCellClass, enableColumnResizing: true, width: "13%", minWidth: 80
        },
        {
            name: 'ObserverNodePath', displayName: 'Observer Path', cellClass: getCellClass, enableColumnResizing: true, width: "35%", minWidth: 250
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.ClientMap(row.entity)" ng-class="{disable: row.entity.ObserverNodeId}"> <i class="fa fa-link icon-space-before" tooltip-append-to-body="true" uib-tooltip="Map Client" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.removeMapping(row.entity)" ng-class="{disable: row.entity.ObserverNodeId === null}"> <i class="fa fa-unlink icon-space-before" tooltip-append-to-body="true" uib-tooltip="Unmap Client" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "8%",
            minWidth: 100
        }
    ];


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
        exporterExcelFilename: 'EMaintenance_ClientSite.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientSite',
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
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/ClientMapping/GetClientMapping?lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    $scope.loadSector = function () {
        var _url = "/Sector/GetSectorByStatus?lId=" + $scope.language.LanguageId + "&status=ALL";
        $http.get(_url)
            .then(function (response) {
                $scope.sectorDDL = response.data;
            });
    };

    //Watch expressions to get Language value.
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadData();
            $scope.loadSector();
        }
    });

    // for updating when client which is in header has been selected!!!!
    $scope.updatingObserverNodeId = function (data) {
        var clientInfo = sessionStorage.getItem("clientInfo");
        var _client = JSON.parse(clientInfo);
        if (data === _client.ClientSiteId) {
            $http.get("/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=ClientSite&cId=&ccId=").then(function (response) {
                for (i = 0; i <= response.data.length; i++) {
                    if (response.data[i]) {
                        if (response.data[i].ClientSiteId === data) {
                            sessionStorage.setItem("clientInfo", JSON.stringify(response.data[i]));
                        }
                    }
                }
            });
        }
    };

    $scope.ClientMap = function (row) {
        let sRow = [];
        sRow = $scope.gridOpts.data.filter((item) => {
            return item.ObserverNodeId !== null;
        });
        if (sRow.length > 0) {
            $scope.SelectedRow = sRow.filter((item) => {
                return item.ObserverNodeId !== row.ObserverNodeId;
            });
        }
        return $scope.openmodal(row);
    };

    $scope.openmodal = function (row) {
        $scope.LanguageID = $scope.language.LanguageId;
        var modalInstance = $uibModal.open({
            templateUrl: 'skfClientMappingModal.html',
            controller: 'skfClientMappingModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return {
                        "row": row, 'Selected': $scope.SelectedRow, "LanguageID": $scope.language.LanguageId, "sectorDDL": $scope.sectorDDL
                    };
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.updatingObserverNodeId(data);
            $scope.loadData();
        }, function () {
        });
    };

    $scope.removeMapping = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfClientMappingDelete.html',
            controller: 'skfClientMappingDeleteCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row };
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.updatingObserverNodeId(data);
            $scope.loadData();
        }, function () {

        });
    };
});

app.controller('skfClientMappingModalCtrl', function ($scope, $http, $uibModalInstance, params, $uibModal, alertFactory, $timeout) {
    $scope.ClientName = params.row.ClientSiteName;
    $scope.sectorDDL = params.sectorDDL;
    $scope.ClientMapping = {
        "ObserverDBId": null,
        "ObserverDBName": null,
        "ObserverNodeId": null,
        "ObserverNodeName": null,
        "ClientSiteId": null,
        "ObserverNodePath": null
    };

    $scope.loadObserverDB = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + params.LanguageID + "&lName=Observer_URL_END_POINT";
        $http.get(_url)
            .then(function (response) {
                $scope.Observer_ENDPOINT_URL = response.data[0].LValue;
                $http({
                    method: "GET",
                    url: $scope.Observer_ENDPOINT_URL + "InvokeObserver/GetODBs"
                }).then(function (response) {
                    $scope.ObserverdbDDL = response.data;
                    if (params.row.ObserverDBName !== null) {
                        //$scope.SelectedDBName = response.data.filter((item) => {
                        //    return item.Name === params.row.ObserverDBName;
                        //});
                        $scope.ClientMapping.ObserverDBId = params.row.ObserverDBId;
                        $scope.ClientMapping.ObserverDBName = params.row.ObserverDBName;
                        $scope.loadObserverClient($scope.ClientMapping.ObserverDBId);
                        $scope.ClientMapping.ObserverNodeId = params.row.ObserverNodeId;
                    }
                    else {
                        $scope.ClientMapping.ObserverDBId = 168;
                        $scope.ClientMapping.ObserverDBName = "RMS91A0";
                        $scope.loadObserverClient(168);
                    }
                });
            });
    }();

    $scope.loadObserverClient = function (data) {
        $scope.ObserverClientDDL = [];
        $http({
            method: "GET",
            url: $scope.Observer_ENDPOINT_URL + "InvokeObserver/GetOClients/" + data + "/0"

        }).then(function (response) {
            if (typeof params.Selected !== 'undefined') {
                $scope.ObserverClientDDL = response.data.filter((item) => {
                    return !params.Selected.some((b) => {
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
            "ClientSiteId": params.row.ClientSiteId,
            "SectorId": $scope.ClientMapping.SectorId
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
                        $uibModalInstance.close(params.row.ClientSiteId);
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

app.controller('skfClientMappingDeleteCtrl', function ($scope, alertFactory, $http, $uibModalInstance, params) {
    $scope.ClientName = params.row.ClientSiteName;

    $scope.deleteMapping = function () {
        var postData = {
            // "ObserverDBId": $scope.ClientMapping.observerDBId,
            "ObserverDBName": null,
            "ObserverNodeId": null,
            "ObserverNodeName": null,
            "ObserverNodePath": null,
            "ClientSiteId": params.row.ClientSiteId
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
                            msg: "Data Unlinked Successfully."
                        });
                        $uibModalInstance.close(params.row.ClientSiteId);
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