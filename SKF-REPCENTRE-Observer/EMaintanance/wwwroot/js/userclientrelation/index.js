app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ngSanitize', 'ui.select');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory) {
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
            if (a == "countryRelations") {
                $scope.countries = val;
                angular.forEach($scope.countries, function (_country, j) {
                    if (_country.active == 'Y') {
                        _country.selected = true;
                        $scope.intern.selectedCountries.push(_country)
                    }
                });
            }
            if (a == "costCentreRelations") {
                $scope.CostcentreDDL = val;
                angular.forEach($scope.CostcentreDDL, function (_costcentre, l) {
                    if (_costcentre.active == 'Y') {
                        _costcentre.selected = true;
                        $scope.intern.selectedCostcentre.push(_costcentre);
                    }
                });
            }

            if (a == "clientRelations") {
                $scope.clientDDL = val;
                angular.forEach($scope.clientDDL, function (_client, m) {
                    if (_client.active == 'Y') {
                        _client.selected = true;
                        $scope.intern.selectedClient.push(_client);
                    }
                });
            }

            if (a == "clientSiteRelations") {
                $scope.ClientSiteDDL = val;
                angular.forEach($scope.ClientSiteDDL, function (_clientsite, k) {
                    if (_clientsite.active == 'Y') {
                        _clientsite.selected = true;
                        $scope.intern.selectedClientSite.push(_clientsite);
                    }
                });
            }
        });
    }

    $scope.save = function () {
        angular.forEach($scope.UserClientRel, function (val, a) {
            if (a == "countryRelations") {
                angular.forEach(val, function (_country, l) {
                    if ($scope.intern.selectedCountries.length > 0) {
                        angular.forEach($scope.intern.selectedCountries, function (S_country, g) {
                            if (_country.countryName == S_country.countryName) {
                                if (S_country.active == 'N') {
                                    _country.active = "Y";
                                    _country.isDirty = true;
                                } else {
                                    _country.isDirty = false;
                                }
                            }
                        });

                    }
                    if (_country.selected && typeof _country.isDirty == "undefined" && _country.active == "Y") {
                        _country.active = "N";
                        _country.isDirty = true;
                    }
                });
            }

            if (a == "clientSiteRelations") {
                angular.forEach(val, function (_ClientSite, j) {
                    if ($scope.intern.selectedClientSite.length > 0) {
                        angular.forEach($scope.intern.selectedClientSite, function (S_clientSite, i) {
                            if (_ClientSite.clientSiteName == S_clientSite.clientSiteName) {
                                if (S_clientSite.active == 'N') {
                                    _ClientSite.active = "Y";
                                    _ClientSite.isDirty = true;
                                } else {
                                    _ClientSite.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_ClientSite.selected && typeof _ClientSite.isDirty == "undefined" && _ClientSite.active == "Y") {
                        _ClientSite.active = "N";
                        _ClientSite.isDirty = true;
                    }
                });
            }

            if (a == "costCentreRelations") {
                angular.forEach(val, function (_costcentre, j) {
                    if ($scope.intern.selectedCostcentre.length > 0) {
                        angular.forEach($scope.intern.selectedCostcentre, function (S_costcentre, i) {
                            if (_costcentre.costCentreName == S_costcentre.costCentreName) {
                                if (S_costcentre.active == 'N') {
                                    _costcentre.active = "Y";
                                    _costcentre.isDirty = true;
                                } else {
                                    _costcentre.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_costcentre.selected && typeof _costcentre.isDirty == "undefined" && _costcentre.active == "Y") {
                        _costcentre.active = "N";
                        _costcentre.isDirty = true;
                    }
                });
            }

            if (a == "clientRelations") {
                angular.forEach(val, function (_client, j) {
                    if ($scope.intern.selectedClient) {
                        angular.forEach($scope.intern.selectedClient, function (S_client, i) {
                            if (_client.clientName == S_client.clientName) {
                                if (S_client.active == 'N') {
                                    _client.active = "Y";
                                    _client.isDirty = true;
                                } else {
                                    _client.isDirty = false;
                                }
                            }
                        });
                    }
                    if (_client.selected && typeof _client.isDirty == "undefined" && _client.active == "Y") {
                        _client.active = "N";
                        _client.isDirty = true;
                    }
                });
            }
        });
        console.log($scope.UserClientRel);
        $scope.isProcess = true;
        var postUrl = "/userClient/Create";

        $http.post(postUrl, JSON.stringify($scope.UserClientRel)).then(function (response) {
            if (response.data) {
                if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                    $scope.alerts.push({
                        type: "warning",
                        msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                    });
                }
                else {
                    $scope.alerts.push({
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
        var _url = "/UserClientSiteRel/GetUserClientSiteGroup?lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.UserClientRel = response.data;
                $scope.UserClientRelation();
            });
    };

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.UserClientRelinfo();
        }
    });
});

