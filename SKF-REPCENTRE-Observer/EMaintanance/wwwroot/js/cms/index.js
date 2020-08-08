app.requires.push('textAngular', 'commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');


app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, alertFactory) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};

    $scope.columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'TypeCode', displayName: 'Type Code', enableColumnResizing: true, width: "20%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'TypeName', displayName: 'Type Name', enableColumnResizing: true, width: "30%", minWidth: 150 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, width: "30%", minWidth: 200 },
        {
            name: 'Active', displayName: 'Status',
            cellTemplate: '<div> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row, col) === "Y") {
                    return 'green';
                } else {
                    if (grid.getCellValue(row, col) === "N") {
                        return 'red';
                    }
                }
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }],
            },
            width: "9%",
            minWidth: 80
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity) || grid.appScope.toggleCreate()" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Cms" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "7%",
            minWidth: 80
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.Cmssetup = row;
    };


    $scope.resetForm = function () {
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Cmssetup = {
            Cmsid: 0,
            TypeCode: null,
            TypeName: null,
            Descriptions: null,
            TypeText: null,
            TypeOrder: null,
            Active: null,
            CreatedBy: null,
            Createdon: null
        };
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
    };

    $scope.clearOut();

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
        }
    };

    $scope.loadData = function () {
        var _url = "/Pagesetup/GetList";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            });
    };
    $scope.loadData();

    $scope.saveCMS = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/PageSetup/Create";

            $http.post(postUrl, JSON.stringify($scope.Cmssetup)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        $scope.languageId = response.data;
                        alertFactory.setMessage({
                            msg: "Data saved Successfully."
                        });
                        $scope.clearOut();
                        $scope.loadData();
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

    $scope.updateCMS = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/PageSetup/Update";
            $http.post(postUrl, JSON.stringify($scope.Cmssetup)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        alertFactory.setMessage({
                            msg: "Data updated Successfully."
                        });
                        $scope.clearOut();
                        $scope.loadData();
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
});
