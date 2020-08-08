var app = angular.module('skfApp', ['ngAnimate', 'angular-loading-bar', 'ui.bootstrap', 'angular.filter', 'angularjs-dropdown-multiselect', 'angularjs-gauge']);
var commonMethods = angular.module('commonMethods', []);

commonMethods.service('utility', function () {
    this.stringParam = function (value) {
        if (value == null || value == undefined || value == "")
            return "";
        else
            return value;
    };

    this.isEmpty = function (value) {
        if (value == null || value == undefined || value == "")
            return true;
        else
            return false;
    };

    this.getFloat = function (value, toFixedLen) {
        if (value == null || value == undefined || value == "" || isNaN(value))
            return 0;
        else {
            if (toFixedLen == undefined || toFixedLen === "") {
                toFixedLen = 2;
            }
            return parseFloat(parseFloat(value).toFixed(toFixedLen));
        }
    };

    this.getFloatPrint = function (value) {
        if (value == null || value == undefined || value == "" || isNaN(value))
            return "0.00";
        else {
            return parseFloat(value).toFixed(2);
        }
    };

    this.roundRate = function (val, roundOffValue) {
        var rangeVal = roundOffValue / 2;
        var remainVal = val % roundOffValue;
        if (remainVal == 0) {
            return val;
        }
        else if (remainVal >= rangeVal) {
            return val + (roundOffValue - remainVal);
        }
        else {
            return val - remainVal;
        }
    };
});

app.factory('globalInfoFactory', function ($http) {
    var globalInfoService;
    var myService = {
        async: function () {
            if (!globalInfoService) {
                globalInfoService = $http.get('/Home/GetClientList?email=' + currentUser).then(function (response) {
                    var data = response.data;
                    data.currentUser = currentUser;
                    return data;
                });
            }
            return globalInfoService;
        }
    };
    return myService;
});

app.factory('alertFactory', function () {
    var _message = {};

    return {
        getMessage: function () {
            return _message;
        },
        setMessage: function (message) {
            _message = message;
        }
    };
});

app.factory('apiFactory', ['alertFactory', function (alertFactory) {
    return {
        Validate: function (data) {
            if (data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                });
                return false;
            }
            else if (data.isException) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: data.message
                });
                return false;
            }
            return true;
        }
    };
}]);

app.factory('languageFactory', function () {
    var _language = {};

    return {
        getLanguage: function () {
            return _language;
        },
        setLanguage: function (language) {
            _language = language;
        }
    };
});

app.factory('clientFactory', function () {
    var _client = {};

    return {
        getClient: function () {
            return _client;
        },
        setClient: function (client) {
            _client = client;
        }
    };
});

app.factory('locationFactory', function () {
    var _locationId = {};

    return {
        getlocationId: function () {
            return _locationId;
        },
        setlocationId: function (locationId) {
            _locationId = locationId;
        }
    };
});

app.factory('myHttpResponseInterceptor', ['$q', '$location', 'alertFactory', function ($q, $location, alertFactory) {
    return httpFn = {
        request: function (config) {
            return config;
        },
        requestError: function (config) {
            return config;
        },
        response: function (res) {
            return res;
        },
        responseError: function (res) {
            //if (res.status === 302) {
            //    alertFactory.setMessage({
            //        type: 'warning',
            //        timeout: 9000,
            //        msg: 'Your session expired! Please Re-login to Continue.'
            //    });
            //    sessionStorage.clear();
            //    setTimeout(function () {
            //        window.location = "/";
            //    }, 1000);
            //    return res;
            //}
            //else
                if (res.status === 303) {
                alertFactory.setMessage({
                    type: 'warning',
                    timeout: 9000,
                    msg: 'You are not authorized for this request!'
                });
            }
            return $q.reject(res);
        }
    };
}]);

//Http Intercpetor to check auth failures for xhr requests
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpResponseInterceptor');
}]);