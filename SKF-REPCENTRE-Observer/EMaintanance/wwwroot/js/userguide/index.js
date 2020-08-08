app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ui.bootstrap', 'ui.grid.selection');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, apiFactory, alertFactory, $timeout, $sce) {
    $scope.loadDocumentation = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=Documentation";
        $http.get(_url)
            .then(function (response) {
                $scope.DocumentationDDL = response.data;
            });
    };

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadDocumentation();
        }
    });

    $scope.ViewDocument = function (data, index) {
        $scope.docindex = index;
        $http.get("/PageSetup/GetContentByTypeCode?typeCode=" + data).then(function (response) {
            if (response.data) {
                $scope.document = $sce.trustAsResourceUrl(response.data.typeName);
            }
        });
    };
    var tabs = angular.module('tabs', [])
        .controller('tabCtrl', function ($scope) {
            $scope.selected = "1";
        });
});
