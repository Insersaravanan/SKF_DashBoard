app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ui.bootstrap', 'ui.grid.selection');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, apiFactory, alertFactory,$timeout) {

    $scope.DownloadImage = function () {
        console.log('Image Download');
    }
  
});
