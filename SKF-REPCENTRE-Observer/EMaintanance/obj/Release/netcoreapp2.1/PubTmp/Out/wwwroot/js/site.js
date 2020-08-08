app.requires.push('ngSanitize', 'ui.select');

app.controller("skfHeaderController", function ($scope, $http, languageFactory, $uibModal, clientFactory, $window, $location) {
    $scope.versioncolor = null;
    $http.get("/ApplicationConfiguration/GetAppConfigByName?name=APP_BADGECOLOR").then(function (response) {
        if (response.data) {
            $scope.versioncolor = response.data.appConfigValue;
        }
        else $scope.versioncolor = null;
    });
    $scope.appVersion = null;
    $http.get("/ApplicationConfiguration/GetAppConfigByName?name=APP_VERSION").then(function (response) {
        if (response.data) {
            $scope.appVersion = response.data.appConfigValue;
        }
    });
    $scope.releaseEnv = null;
    $http.get("/ApplicationConfiguration/GetAppConfigByName?name=APP_BADGE").then(function (response) {
        if (response.data) {
            $scope.releaseEnv = response.data.appConfigValue;
        }
    });
    $scope.appNameDDL = null;
    $http.get("/ApplicationConfiguration/GetAppConfigByName?name=APP_NAME").then(function (response) {
        if (response.data) {
            $scope.appNameDDL = response.data.appConfigValue;
        }
    });
    $scope.isDashboardheader = false;
    var path = window.location.pathname.split('/');
    var pname = path.join();
    if (pname === "," || pname === ",home") {
        $scope.isDashboardheader = true;
    }

    $scope.loadClientSite = function () {
        if (typeof $scope.language.LanguageId === "undefined") {
            $scope.language.LanguageId = 1;
        }
        $http.get("/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=ClientSite&cId=&ccId=").then(function (response) {
            $scope.ClientSiteDDL = response.data;
            $scope.getLastSession();
        });
    };

    $scope.getLastSession = function () {
        $http.get("/Users/GetLastSession").then(function (response) {
            if (response.data) {
                $scope.ClientSiteData = response.data;
                if ($scope.ClientSiteData.ClientSiteId != null) {
                    angular.forEach($scope.ClientSiteDDL, function (val, i) {
                        if (val.ClientSiteId == $scope.ClientSiteData.ClientSiteId) {
                            sessionStorage.setItem("clientInfo", JSON.stringify(val));
                            var clientInfo = sessionStorage.getItem("clientInfo");
                            clientFactory.setClient(clientInfo);
                            if (clientInfo && (clientInfo != 'undefined')) {
                                var _client = JSON.parse(clientInfo);
                                $scope.clientName = _client.ClientSiteName.toLowerCase();
                                $scope.logo = _client.logo;
                                if ($scope.logo === null || $scope.logo.length <= 0) {
                                    $scope.logo = "../images/nologo.png";
                                }
                            }
                        }
                    });
                }
                else {
                    var isClientsite = sessionStorage.getItem("isClientSite");
                    if (isClientsite) {
                        $scope.ClientSelect();
                    }
                }
            }
        });
    };

    $scope.ClientInfo = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);
        if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
            $scope.clientName = _client.ClientSiteName.toLowerCase();
            $scope.logo = _client.logo;
            if ($scope.logo === null || $scope.logo.length <= 0) {
                $scope.logo = "../images/nologo.png";
            }
        } else {
            $scope.loadClientSite();
        }
    };

    $scope.languageChange = function () {
        sessionStorage.setItem("languageInfo", JSON.stringify($scope.language));
        languageFactory.setLanguage($scope.language);
    };

    $scope.setupLanguage = function () {
        if (languageInfo && (languageInfo != 'undefined') && $scope.languageList.length > 0) {
            var languageInfo = sessionStorage.getItem("languageInfo");
            var _language = JSON.parse(languageInfo);
            angular.forEach($scope.languageList, function (val, i) {
                if (val.LName == _language.LName) {
                    if (val.LName == "English") {
                        val.CountryCode = "gb";
                    }
                    $scope.language = val;
                }
            });
            $scope.ClientInfo();
        }
        else if (languageInfo == 'undefined') {
            $window.location.href = "/Identity/Account/Login";
        } else {
            angular.forEach($scope.languageList, function (val, i) {
                if (val.LName == 'English') {
                    val.CountryCode = "gb";
                    $scope.language = val;
                }
            });
            $scope.ClientInfo();
        }
        $(document).ready(function () {
            $scope.languageChange();
        });
    };

    var languageList = sessionStorage.getItem("languageList");
    if (languageList) {
        $scope.languageList = JSON.parse(languageList);
        $scope.setupLanguage();
    }
    else {
        $http.get("/Languages/Get")
            .then(function (response) {
                if (response.data) {
                    $scope.languageList = response.data;
                    sessionStorage.setItem("languageList", JSON.stringify($scope.languageList));
                    $scope.setupLanguage();
                }
            }, function (response) {
                $scope.languageList = [];
                $scope.setupLanguage();
            });
    }

    $scope.ClientSelect = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfClientInfoModal.html',
            controller: 'skfClientInfoModalCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "languageId": $scope.language.LanguageId, "ClientName": $scope.clientName };
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                sessionStorage.setItem("clientInfo", JSON.stringify(data));
                clientFactory.setClient(data);
                //sessionStorage.setItem("isDashboard", "Yes");
                $http.get("/Users/UpdateLastSession?csId=" + data.ClientSiteId).then(function (response) {
                    window.location.reload();
                });
            }

        }, function () {

        });
    };

    $scope.showFeedback = function (taskId) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfFeedbackModal.html',
            controller: 'skfFeedbackModalCtrl',
            size: 'lg',
            backdropClass: 'feedback-modal-wrapper',
            windowTopClass: 'feedback-modal-wrapper',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: { taskId: taskId }
            }
        });
        modalInstance.result.then(function (data) {
        }, function () {
        });
    };

});

app.controller("skfBreadCrumbController", function ($scope, alertFactory, $location) {
    $scope.alerts = [];
    $scope.closeAlert = function (index) {
        try {
            $scope.alerts.splice(index, 1);
        }
        catch (e) {
            //
        }
    };

    $scope.isDashboardheader = false;
    var path = window.location.pathname.split('/');
    var pname = path.join();
    if (pname === "," || pname === ",home") {
        $scope.isDashboardheader = true;
    }

    $scope.ShowEx = false;
    $scope.exception = function () {
        if ($scope.ShowEx) {
            $scope.ShowEx = false;
        } else {
            $scope.ShowEx = true;
        }
    };

    //Watch expressions to get Global Message. 
    $scope.$watch(function () {
        return alertFactory.getMessage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.alerts.splice(0, 1);
            $scope.alerts.push(newValue);
            angular.forEach($scope.alerts, function (val, i) {
                val.timeout = 4000;
                $scope.ShowEx = false;
                if (val.exc != null || typeof val.exc != "undefined") {
                    val.timeout = 40000;
                }
            });
        }
    });

});

app.controller("skfLeftNavController", function ($scope, $window, clientFactory, $filter, $http, $uibModal, languageFactory, $location) {
    $scope.menus = [];
    $scope.loadPageMenus = function () {
        if (typeof $scope.language.LanguageId === "undefined") {
            $scope.language.LanguageId = 1;
        }
        $http.get('/Menu/GetMenus?LanguageId=' + $scope.language.LanguageId).then(function (response) {
            try {
                var _data = response.data;
                $scope.menus = [];
                if (!(_data.indexOf("<!DOCTYPE html>") >= 0)) { //TOTO fix it with best approch to avoid login page message                  
                    if (response.data && response.data[0].Menus) {
                        $scope.menus = JSON.parse(response.data[0].Menus);
                    }
                }
            }
            catch (e) {
                $scope.menus = [];
            }
        });

        // $scope.menus = [{ "hasChild": "False", "ControllerName": "ClientSite", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "hasChild": "True", "Childs": [{ "ControllerName": "Admin", "ActionName": "", "IconName": "", "CssClassName": "", "LinkUrl": "", "Childs": [{ "ControllerName": "Users", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "CostCentre", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Client", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }] }, { "ControllerName": "Analyst", "ActionName": "", "IconName": "", "CssClassName": "", "LinkUrl": "", "Childs": [{ "ControllerName": "ClientPlant", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }] }, { "ControllerName": "SuperAdmin", "ActionName": "", "IconName": "", "CssClassName": "", "LinkUrl": "", "Childs": [{ "ControllerName": "Languages", "ActionName": "", "IconName": "fa-language", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Country", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Lookup", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Sector", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Segment", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "Industry", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }, { "ControllerName": "RoleGroup", "ActionName": "", "IconName": "fa-question-circle", "CssClassName": "", "LinkUrl": "" }] }], "ControllerName": "Settings", "ActionName": "", "IconName": "fa-language", "CssClassName": "", "LinkUrl": "" }];

        $scope.currentController = $window.currentController;
    };

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo == null) {
            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    }

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue || $scope.menus.length == 0) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadPageMenus();
        }
    });

    $scope.isActive = function (m) {
        if (m.ControllerName == $scope.currentController) {
            return true;
        }
        var _flag = false;
        if (m.hasChild && m.hasChild == 'True') {
            angular.forEach(m.Childs, function (c, i) {
                if (!_flag) {
                    if (c.ControllerName == $scope.currentController) {
                        _flag = true;
                    }
                    if (c.Childs !== null && c.Childs == 'undefined') {
                        if (!_flag && c.Childs.length > 0) {
                            angular.forEach(c.Childs, function (c1, i1) {
                                if (!_flag) {
                                    if (c1.ControllerName == $scope.currentController) {
                                        _flag = true;
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
        return _flag;
    };

    $scope.navigate = function (m) {
        if (m.hasChild && m.hasChild == 'True') {
            $scope.showMenuPopup(m);
        }
        else {
            window.location = m.LinkUrl ? m.LinkUrl : m.ActionName ? '/' + m.ControllerName + '/' + m.ActionName : '/' + m.ControllerName;
        }
    };

    $scope.showMenuPopup = function (_) {
        $('.menu-modal.ng-scope').each(function () {
            try {
                $(this).scope().$dismiss();
            }
            catch (ex) { //log
            }
        });

        _.media = 'SM';
        _.mediaCol = '12';

        if (_.Childs.length >= 2) {
            _.media = 'md';
            _.mediaCol = (_.Childs.length == 2) ? '6' : '4';
        }

        if (_.Childs.length >= 4) {
            _.media = 'lg';
            _.mediaCol = '3';
        }

        var modalInstance = $uibModal.open({
            templateUrl: 'tovertoMenuModal.html',
            controller: 'tovertoMenuCtrl',
            size: _.media,
            appendTo: $(document).find('.body-content').eq(0),
            backdropClass: 'menu',
            windowTopClass: 'menu',
            resolve: {
                params: function () {
                    return { 'row': _ };
                }
            }
        });

        modalInstance.result.then(function (gridData) {
            $('.has-child').removeClass("expand");
        }, function () {
            $('.has-child').removeClass("expand");
        });

        //modalInstance.rendered.then(function () {
        //    setTimeout(function () {
        //        $('.modal-dialog .btn-primary').focus();
        //    }, 100);
        //});
    };

});

//Global Menu modal
app.controller('tovertoMenuCtrl', function ($scope, $window, $uibModalInstance, params) {
    $scope.menu = params.row;
    $scope.currentController = $window.currentController;
    $scope.isDesktop = !($(window).width() <= 1024);
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

//Client List popup controller with country and cost centre
app.controller('skfClientInfoModalCtrl', function ($scope, $http, $uibModalInstance, params, clientFactory, $window) {
    var _param = params;

    $scope.loadClientSite = function () {
        $http.get("/UserClientSiteRel/GetUserClientSites?lId=" + params.languageId + "&type=ClientSite&cId=&ccId=")
            .then(function (response) {
                $scope.ClientSiteDDL = response.data;
                var clientInfo = sessionStorage.getItem("clientInfo");
                if (clientInfo) {
                    var client = JSON.parse(clientInfo);
                    //$scope.ClientSiteDDL.ClientName = client.ClientSiteName;
                }
            });
    }();

    $scope.save = function () {
        angular.forEach($scope.ClientSiteDDL, function (val, i) {
            if ($scope.ClientSiteDDL.ClientName == val.ClientSiteName) {
                $uibModalInstance.close(val);
            }
        });

    };

    $scope.cancel = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        if (clientInfo == null) {
            $window.location.href = "/home";
        } else {
            $uibModalInstance.dismiss('cancel');
        }
    };
});

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop] != null) {
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

$(document).ready(function () {
    $('.bounce').on('click', function () {
        $('body').toggleClass("menu-expand");
    });

    $(window).on("load resize", function () {
        $(window).width() <= 1024 ? $(".header-content .top-menu").prepend($(".left-nav .menu-parent")) : $(".left-nav").prepend($(".header-content .top-menu .menu-parent"));
        $(window).width() <= 780 ? $(".header-content .top-menu").prepend($(".head-wrappper .ClientMaster")) : $(".ClientMaster-wrapper").prepend($(".header-content .ClientMaster"));
    });
    $(".header-content .navbar-toggle").click(function () {
        $(".top-menu").toggleClass("active");
        $(".navbar-toggle").toggleClass("active");
    });

    $('.has-child > a').on('click', function () {
        $('.has-child').removeClass("expand");
        $(this).parent('.has-child').toggleClass("expand");
    });
});

app.filter('trustAsHtml', function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});


app.config(['$httpProvider', function ($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = new Date();
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);

