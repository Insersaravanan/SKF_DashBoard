app.controller('skfCtrl', function ($scope, $filter, $timeout, $http) {
    sessionStorage.clear();

    //Loading Page content
    $scope.loadSlider = function () {
        $scope.sliderContent = null;
        $http.get("/PageSetup/GetContentByTypeCode?typeCode=HSlider").then(function (response) {
            if (response.data) {
                $timeout(function () {
                    $scope.sliderContent = response.data;
                    $scope.slideLoaded = true;
                });
            }
        });

        $scope.appVersion = null;
        $http.get("/ApplicationConfiguration/GetAppConfigByName?name=APP_VERSION").then(function (response) {
            if (response.data) {
                $scope.appVersion = response.data.appConfigValue;
            }
        });
    };
    $scope.loadSlider();

});

