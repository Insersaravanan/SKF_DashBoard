app.controller('skfCtrl', function ($scope, $filter, $timeout, $http) {

    $scope.encryptdata = function () {
        var postUrl = "/EncryptRDecrypt/EncryptData";
        var postData = {
            "Data": $scope.encrypt.Data,
            "Salt": "",
            "EncryptionPattern": ""
        }
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data) {
                $scope.resultValue = response.data;

            }
        });
    };

    $scope.decryptdata = function () {
        var postUrl = "/EncryptRDecrypt/DecryptData";
        var postData = {
            "Data": $scope.encrypt.Data,
            "Salt": "",
            "EncryptionPattern": ""
        }
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data) {
                $scope.resultValue = response.data;

            }
        });
    };
    $scope.clear = function () {
        $scope.encrypt.Data = null;
        $scope.resultValue = null;
    };
    $scope.copyToClipboard = function (name) {
        var copyElement = document.createElement("textarea");
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = decodeURI($scope.resultValue);
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
    }
});