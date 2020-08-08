app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'gridster');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout, $compile, clientFactory) {

    $scope.loadUserWidget = function () {
        var _url = "/Widget/GetDashboardByUser?lid" + $scope.language.LanguageId + "status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.userWidgets = response.data;
                $scope.SaveWidget = angular.copy($scope.userWidgets);
                angular.forEach($scope.userWidgets, function (data, i) {
                    data.directiveName = data.WidgetCode.toLowerCase();
                });
            });
    };

    $scope.plantChange = function () {
        $scope.loadParameter();
    }

    $scope.loadParameter = function () {
        var _url = "/Widget/GetDashboardByUser?lid" + $scope.language.LanguageId + "status=Y";
        $http.get(_url)
            .then(function (response) {;
                angular.forEach(response.data, function (data, i) {
                    //if (data.WidgetCode = "WGT01") {
                    //    $scope.FromDate = new Date(data.Param1);
                    //    $scope.ToDate = new Date(data.Param2);
                    //}
                    //if (data.WidgetCode == "WGT02") {
                    //    $scope.FromTwoDate = new Date(data.Param1);
                    //    $scope.ToTwoDate = new Date(data.Param2);
                    //}
                });
            });
        $scope.loadChartPfOne();
        $scope.loadChartPfTwo();
    }

    $scope.loadMasterWidget = function () {
        var _url = "/Widget/GetWidgetByStatus?status=ALL&lid=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.listwidgets = response.data;
            });
    };

    $scope.clearValue = function () {
        $scope.userWidgets = [];
    }

    $scope.isEdit = false;
    $scope.slideBar = false;

    $scope.editDashboard = function () {
        $scope.isEdit = true;
        $scope.gridsterOpts.draggable.enabled = true;
    }

    $scope.DeletedItem = [];
    $scope.delete = function (data) {
        angular.forEach($scope.SaveWidget, function (val, i) {
            //if (val.WidgetId = data) {
            //    val.Active = 'N';
            //    $scope.DeletedItem.push(val);
            //    $scope.userWidgets.splice(i, 1);
            //}

        });
    }

   
    $scope.AddedWidget = function (data) {
        $scope.getselected = [];
        if ($scope.getselected.length > 0) {
            angular.forEach($scope.getselected, function (val, i) {
                if (val.WidgetId == data.WidgetId) {
                    $scope.getselected.splice(i, 1);
                    $scope.getselected.push(data);
                } else {
                    $scope.getselected.push(data);
                }
            });
        } else {
            $scope.getselected.push(data);
        }
    }

    $scope.addWidget = function () {
        $scope.slideBar = true;
        $scope.isSaved = true;
    }

    $scope.closePanel = function () {
        $scope.slideBar = false;
    }

    $scope.SaveUserWidget = function (data) {
        $scope.isSaved = true;
        $scope.isEdit = false;
        $scope.gridsterOpts.draggable.enabled = false;
        if ($scope.DeletedItem.length > 0) {
            angular.forEach($scope.DeletedItem, function (val, i) {
                $scope.userWidgets.push(val);
            });
        }

        var postUrl = "/Widget/SaveDashboardByUser";

        $http.post(postUrl, JSON.stringify($scope.userWidgets)).then(function (response) {
            if (response.data) {
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
                }
            }
            $scope.loadUserWidget();
            $scope.loadMasterWidget();
            if (data) {
                alertFactory.setMessage({
                    msg: "Widget added Successfully."
                });
            } else {
                alertFactory.setMessage({
                    msg: "Data saved Successfully."
                });
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

    $scope.AddWidgetToBoard = function () {
        //angular.forEach($scope.userWidgets, function (val, i) {
        angular.forEach($scope.getselected, function (data, j) {
            //if (data.WidgetId == val.WidgetId) {
            data.row = 0;
            data.col = 0;
            data.sizeX = 4;
            data.sizeY = 3;
            data.DataViewPrefId = 1;
            data.DataViewPref = "SuperAdmin";
            $scope.userWidgets.push(data);

            $scope.SaveUserWidget(data);
            $scope.slideBar = false;
            $scope.editDashboard();
            //}
        });
        //});
    }


    $scope.loadPlant = function () {
        var _url = "/Plant/GetPlantByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=ALL";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;
            });
    };

    $scope.gridsterOpts = {
        minrows: 2, // the minimum height of the grid, in rows
        maxrows: 100,
        columns: 6, // the width of the grid, in columns
        colwidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowheight: 'match', // can be an integer or 'match'.  match uses the colwidth, giving you square widgets.
        margins: [15, 15], // the pixel distance between each widget
        defaultsizex: 2, // the default width of a gridster item, if not specifed
        defaultsizey: 1, // the default height of a gridster item, if not specified
        mobilebreakpoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        resizable: {
            enabled: true,
            start: function (event, uiwidget, $element) {
            }, // optional callback fired when resize is started,
            resize: function (event, uiwidget, $element) {
            }, // optional callback fired when item is resized,
            stop: function (event, uiwidget, $element) {
            } // optional callback fired when item is finished resizing
        },
        draggable: {
            enabled: false, // whether dragging items is supported
            handle: '.ddd', // optional selector for resize handle
            start: function (event, uiwidget, $element) {
            }, // optional callback fired when drag is started,
            drag: function (event, uiwidget, $element) {
            }, // optional callback fired when item is moved,
            stop: function (event, uiwidget, $element) {
            } // optional callback fired when item is finished dragging
        }
    };

    $scope.DataLimit = 10;
    $scope.PlantName = 'ALL';
    $scope.loadchartObj = function () {
        $scope.ThirdChartObj = {
            "ChartType": "pie",
            "WidgetCode": "WGT01",
            "WidgetId": "67",
            "UserId": 0,
            "ClientSiteId": $scope.ClientSiteId,
            "PlantName": $scope.PlantName,
            "MachineName": "",
            "AssetName": "",
            "JobId": 11916,
            "DataLimit": $scope.DataLimit
        };
    }

    $scope.loadPerformanceType = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=PerformanceReportType";
        $http.get(_url)
            .then(function (response) {
                $scope.PfTypeDDL = response.data;
            });
    };

    $scope.loadChartPfOne = function () {

        var postUrl = "/PerformanceReport/GetPerformanceReport"
        $scope.pfoneBarCategories = [];
        $scope.Completed = [];
        $scope.Dispute = [];
        $scope.InProgress = [];
        $scope.Scheduled = [];
        $scope.ServiceNotRequired = [];
        $scope.WaitingForReview = [];

        //var date = new Date();
        //var d = date.getDate() - 20;
        // y = date.getFullYear(), m = date.getMonth()
        //$scope.FromDate = new Date(y, m, d);
        //$scope.ToDate = date;


        if ($scope.FromDate) {
            var FromDate = $scope.FromDate;
        } else {
             FromDate = new Date();
        }

        if ($scope.ToDate) {
            var ToDate = $scope.ToDate;
        } else {
             ToDate = new Date();
        }
        var postData = {
            "ReportType": 'JobStatus',
            "FromDate": $filter('date')(FromDate, "yyyy-MM-dd 00:00:00"),
            "ToDate": $filter('date')(ToDate, "yyyy-MM-dd 00:00:00"),
            "ClientSiteId": $scope.ClientSiteId, 
            "PlantAreaId": $scope.PlantAreaId,
            "LanguageId": $scope.language.LanguageId
        }

        var Completed = Dispute = InProgress = Scheduled = WaitingForReview = ServiceNotRequired = 0;

        if (postData) {
            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
                if (response.data) {
                    angular.forEach(response.data, function (val, i) {
                        if (i === 0) {
                            $scope.pfOne = JSON.parse(val.JsonOutReport);
                        }
                        if ($scope.pfOne != null) {
                            $scope.pfoneBarCategories = $scope.pfOne.map(function (value, index, self) {
                                return value.JobMonth;
                            }).filter(function (value, index, self) {
                                return self.indexOf(value) === index;
                            });
                            angular.forEach($scope.pfOne, function (_data, j) {
                                $scope.Completed.push(_data.Completed);
                                $scope.Dispute.push(_data.Dispute);
                                $scope.InProgress.push(_data.InProgress);
                                $scope.Scheduled.push(_data.Scheduled);
                                $scope.ServiceNotRequired.push(_data.ServiceNotRequired);
                                $scope.WaitingForReview.push(_data.WaitingForReview);

                                $scope.pfoneseries = [
                                    {
                                        name: 'Completed',
                                        data: $scope.Completed
                                    }, {
                                        name: 'Dispute',
                                        data: $scope.Dispute
                                    }, {
                                        name: 'InProgress',
                                        data: $scope.InProgress
                                    }, {
                                        name: 'Scheduled',
                                        data: $scope.Scheduled
                                    },
                                    {
                                        name: 'Service Not Required',
                                        data: $scope.ServiceNotRequired
                                    },
                                    {
                                        name: 'Waiting For Review',
                                        data: $scope.WaitingForReview
                                    },
                                ];

                                $scope.pfonePieseries = [
                                    ['Completed', Completed],
                                    ['Dispute', Dispute],
                                    ['InProgress', InProgress],
                                    ['Scheduled', Scheduled],
                                    ['ServiceNotRequired', ServiceNotRequired],
                                    ['WaitingForReview', WaitingForReview]
                                ];

                            })
                        }
                       

                    });
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
        }
    };


    $scope.loadChartPfTwo = function () {

        var postUrl = "/PerformanceReport/GetPerformanceReport"
        //var date = new Date();
        //var d = date.getDate() - 20;
        //y = date.getFullYear(), m = date.getMonth()
        //$scope.FromtwoDate = new Date(y, m, d);
        //$scope.ToTwoDate = date;

        if ($scope.FromTwoDate) {
            var FromDate = $scope.FromTwoDate;
        } else {
             FromDate = new Date();
        }

        if ($scope.ToTwoDate) {
            var ToDate = $scope.ToTwoDate;
        } else {
             ToDate = new Date();
        }

        var postData = {
            "ReportType": 'EquipmentCondition',
            "FromDate": $filter('date')(FromDate, "yyyy-MM-dd 00:00:00"),
            "ToDate": $filter('date')(ToDate, "yyyy-MM-dd 00:00:00"),
            "ClientSiteId": $scope.ClientSiteId, 
            "PlantAreaId": $scope.PlantAreaId,
            "LanguageId": $scope.language.LanguageId
        }

        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data) {
                angular.forEach(response.data, function (val, i) {
                    if (i == 0) {
                        var _d = JSON.parse(val.JsonOutReport);
                    }
                    $scope.pftwoseries = [];
                    angular.forEach(_d, function (_data, j) {
                        $scope.pftwoseries.push([_data.ConditionName, _data.ConditionCount]);

                    })
                    $timeout(function () {
                        $scope.loadUserWidget();
                    }, 200);
                });
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


    $scope.loadChartPfThree = function () {

        var postUrl = "/PerformanceReport/GetPerformanceReport";
        var date = new Date();
        var d = date.getDate() - 20;
        y = date.getFullYear(), m = date.getMonth()
        $scope.FromDate = new Date(y, m, d);
        $scope.ToDate = date;
        var postData = {
            "ReportType": 'FaultStatus',
            "FromDate": $filter('date')($scope.FromDate, "yyyy-MM-dd 00:00:00"),
            "ToDate": $filter('date')($scope.ToDate, "yyyy-MM-dd 00:00:00"),
            "ClientSiteId": 15,
            "PlantAreaId": 21, 
            "LanguageId": 1 
        }

        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data) {
                angular.forEach(response.data, function (val, i) {
                    if (i == 0) {
                        var _d = JSON.parse(val.JsonOutReport);
                    }

                    $scope.pfthreeseries = [];
                    angular.forEach(_d, function (_data, j) {
                        $scope.pfthreeseries.push([_data.ConditionName, _data.ConditionCount]);

                        //$timeout(function () {
                        //$scope.loadUserWidget();
                        //}, 200);
                    })

                });
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

    $scope.WidgetpfoneModal = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'WidgetpfonePopupModal.html',
            controller: 'pfonePopupModalCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                params: function () {
                    return { "language": $scope.language, "ClientSiteId": $scope.ClientSiteId, "data": data };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadParameter();
            }
        }, function () {

        });
    };

    $scope.WidgetpftwoModal = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'WidgetpftwoPopupModal.html',
            controller: 'pftwoPopupModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "ClientSiteId": $scope.ClientSiteId, "data": data };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadParameter();
            }
        }, function () {

        });
    };

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo === null) {
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

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadPlant();
            $scope.loadchartObj();
            $scope.loadMasterWidget();
            $scope.loadParameter();

        }
    });

});

app.directive('bindDirective', function ($compile) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            var html = $scope.$eval($attrs.bindDirective),
                toCompile = angular.element('<' + html + '>');
            $element.append($compile(toCompile)($scope));
        }
    };
});

app.directive('wgt01', function () {
    return {
        restrict: 'E',
        templateUrl: 'widgetpfone.html',

        link: function (scope, element) {

            Highcharts.chart('containerOne', {
                chart: {
                    type: 'column',
                    backgroundColor: 'rgba(255, 255, 255, 0.0)'
                },
                title: {
                    text: 'Overall Job Status'
                },
                xAxis: {
                    categories: scope.pfoneBarCategories
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: 'Count'
                    }

                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                        //,
                        //dataLabels: {
                        //    enabled: true,
                        //    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        //}
                    }
                },
                series: scope.pfoneseries
            });

        }
    };
});

app.directive('wgt02', function () {

    return {
        restrict: 'E',
        templateUrl: 'widgetpftwo.html',

        // Create the chart
        link: function (scope, element) {

            // Pie Chart for WGT01
            Highcharts.chart('containertwo', {
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: 'Overall Equipment Condition'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    data: scope.pftwoseries
                }]
            });
        }
    };
});

app.directive('wgt03', function () {

    return {
        restrict: 'E',
        templateUrl: 'widgetpftwo.html',

        // Create the chart
        link: function (scope, element) {

            // Bar Chart for wgt03
            Highcharts.chart('containerthree', {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 25,
                        depth: 70
                    }
                },
                title: {
                    text: 'Failure Reports'
                },
                subtitle: {
                    text: 'Asset Wise - Failure Report'
                },
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                xAxis: {
                    //categories: ['Bearing Fault', 'Electrical Fault', 'Rotor Fault', 'Idler Fault', 'Oil Leak', 'Bent Fault', 'Miss Alignment', 'Cavitaion', 'Coupling Faults', 'Beat Frequency'],
                    categories: scope.thirdBarCategories,
                    labels: {
                        skew3d: true,
                        style: {
                            fontSize: '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                series: [{
                    name: 'Top 10 Failure Reports',
                    data: scope.thirdBarData
                }]
            });


        }
    };
});

app.directive('wgt04', function () {

    return {
        restrict: 'E',
        templateUrl: 'widgetpftwo.html',

        // Create the chart
        link: function (scope, element) {

            // Bar Chart for wgt04
            Highcharts.chart('containertFour', {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 25,
                        depth: 70
                    }
                },
                title: {
                    text: 'Failure Reports'
                },
                subtitle: {
                    text: 'Asset Wise - Failure Report'
                },
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                xAxis: {
                    //categories: ['Bearing Fault', 'Electrical Fault', 'Rotor Fault', 'Idler Fault', 'Oil Leak', 'Bent Fault', 'Miss Alignment', 'Cavitaion', 'Coupling Faults', 'Beat Frequency'],
                    categories: scope.thirdBarCategories,
                    labels: {
                        skew3d: true,
                        style: {
                            fontSize: '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                series: [{
                    name: 'Top 10 Failure Reports',
                    //data: [210, 320, null, 180, 0, 550, 600, 780, 320, 45]
                    data: scope.thirdBarData
                }]
            });

        }
    };
});

app.directive('wgt05', function () {

    return {
        restrict: 'E',
        templateUrl: 'widgetpftwo.html',

        // Create the chart
        link: function (scope, element) {

            // Bar Chart for wgt05
            Highcharts.chart('containerFive', {
                chart: {
                    type: 'column',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 25,
                        depth: 70
                    }
                },
                title: {
                    text: 'Failure Reports'
                },
                subtitle: {
                    text: 'Asset Wise - Failure Report'
                },
                plotOptions: {
                    column: {
                        depth: 25
                    }
                },
                xAxis: {
                    //categories: ['Bearing Fault', 'Electrical Fault', 'Rotor Fault', 'Idler Fault', 'Oil Leak', 'Bent Fault', 'Miss Alignment', 'Cavitaion', 'Coupling Faults', 'Beat Frequency'],
                    categories: scope.thirdBarCategories,
                    labels: {
                        skew3d: true,
                        style: {
                            fontSize: '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                series: [{
                    name: 'Top 10 Failure Reports',
                    //data: [210, 320, null, 180, 0, 550, 600, 780, 320, 45]
                    data: scope.thirdBarData
                }]
            });

            // Pie Chart for WGT01
            Highcharts.chart('halfcharttwo', {
                chart: {
                    type: 'pie',
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: '',
                    data: scope.pfonePieseries
                }]
            });
        }
    };
});

app.controller('pfonePopupModalCtrl', function ($scope, $filter, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    if (params.data.Param1) {
        $scope.FromDate = new Date(params.data.Param1);
    } else {
        $scope.FromDate = new Date();
    }

    if (params.data.Param2) {
        $scope.ToDate = new Date(params.data.Param2);
    } else {
        $scope.ToDate = new Date();
    }
    $scope.WigetTitle = params.data.WidgetName;

    $scope.save = function () {
        var postUrl = "/Widget/SaveDashboardByUser";
        $scope.userWidgets = {
            "Param1": $filter('date')($scope.FromDate, "yyyy-MM-dd 00:00:00"),
            "Param2": $filter('date')($scope.ToDate, "yyyy-MM-dd 00:00:00"),
            "WidgetId": params.data.WidgetId,
            "UserDashboardId": params.data.UserDashboardId,
            "Active": 'Y',
            "row": params.data.row,
            "col": params.data.col,
            "sizeX": params.data.sizeX,
            "sizeY": params.data.sizeY,
            "DataViewPrefId": params.data.DataViewPrefId
        }

        var userWidgets = [];
        userWidgets.push($scope.userWidgets);

        $http.post(postUrl, JSON.stringify(userWidgets)).then(function (response) {
            if (response.data) {
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
                }
            }

            $uibModalInstance.close("data");

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

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('pftwoPopupModalCtrl', function ($scope, $filter, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    if (params.data.Param1) {
        $scope.FromTwoDate = new Date(params.data.Param1);
    } else {
        $scope.FromTwoDate = new Date();
    }

    if (params.data.Param2) {
        $scope.ToTwoDate = new Date(params.data.Param2);
    } else {
        $scope.ToTwoDate = new Date();
    }
    $scope.WigetTitle = params.data.WidgetName;

    $scope.save = function () {
        var postUrl = "/Widget/SaveDashboardByUser";
        $scope.userWidgets = {
            "Param1": $filter('date')($scope.FromTwoDate, "yyyy-MM-dd 00:00:00"),
            "Param2": $filter('date')($scope.ToTwoDate, "yyyy-MM-dd 00:00:00"),
            "WidgetId": params.data.WidgetId,
            "UserDashboardId": params.data.UserDashboardId,
            "Active": 'Y',
            "row": params.data.row,
            "col": params.data.col,
            "sizeX": params.data.sizeX,
            "sizeY": params.data.sizeY,
            "DataViewPrefId": params.data.DataViewPrefId
        }

        var userWidgets = [];
        userWidgets.push($scope.userWidgets);

        $http.post(postUrl, JSON.stringify(userWidgets)).then(function (response) {
            if (response.data) {
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
                }
            }

            $uibModalInstance.close("data");

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

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('PfthreePopupModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.formatters = {};
    $scope.csId = params.csId;
    $scope.WidgetName = params.WidgetName;


    $scope.save = function () {
        var header = {
            "PlantName": $scope.PlantName,
            "DataLimit": $scope.DataLimit
        }
        $uibModalInstance.close(header);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('PffourPopupModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.formatters = {};
    $scope.csId = params.csId;
    $scope.WidgetName = params.WidgetName;

    $scope.save = function () {
        var header = {
            "PlantName": $scope.PlantName,
            "DataLimit": $scope.DataLimit
        }
        $uibModalInstance.close(header);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('PffivePopupModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.formatters = {};
    $scope.csId = params.csId;
    $scope.WidgetName = params.WidgetName;

    $scope.save = function () {
        var header = {
            "PlantName": $scope.PlantName,
            "DataLimit": $scope.DataLimit
        }
        $uibModalInstance.close(header);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
