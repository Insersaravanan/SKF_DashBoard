app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, $timeout, uiGridConstants, $http, languageFactory, alertFactory, clientFactory ) {
    $scope.startIndex = 1;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.isEdit = false;
    $scope.isclear = true;
    $scope.readOnlyPage = false;
    $scope.S_active = "All";
    $scope.formatters = {};

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

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ClientName', displayName: 'Client Name', enableColumnResizing: true, width: "25%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'PlantName', displayName: 'Plant Name', width: '25%', minWidth: 150
        },
        {
            name: 'MachineName', displayName: 'Machine Name', width: '25%', minWidth: 150
        },
        {
            name: 'FaultCount', displayName: 'Fault Code', width: '20%', minWidth: 150
        },
    ];

    $scope.columns = angular.copy(_columns);

    $scope.loadData = function () {

        $http.get("/dashboard/GetFaultReportDetail?ClientSiteId=" + $scope.ClientSiteId)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
        }
    });

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

    };



});
