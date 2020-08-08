app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isView = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.Active = "Y";
   // $scope.S_Active = 'All';
    //$scope.StartDate = new Date();


 
    $scope.loadStatus = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=AlarmEmailNotificationStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.AlarmEmailNotificationStatusDDL = response.data;
            });
    };
    //$scope.loadStatus = function () {
    //    var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ScheduleStatus";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.ScheduleStatusDDL = response.data;
    //        });
    //};
  
    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        //{ name: 'PlantName', displayName: 'Plant Name', enableColumnResizing: true, width: "16%", minWidth: 150,cellClass: getCellClass, },
        {
            name: 'AlarmEmailNotificationID', displayName: 'Email ID', enableColumnResizing: true, width: "12%", minWidth: 150, cellClass: getCellClass, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-AlarmEmailNotificationName"><a ng-click="grid.appScope.viewRow(row.entity)">{{row.entity.AlarmEmailNotificationID}}</a></div>'
        },
        {
            name: 'AlarmSMSNotificationNo', displayName: 'Mobile No.', enableColumnResizing: true, width: "12%", minWidth: 150, cellClass: getCellClass, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-AlarmSMSNotificationNo"><a ng-click="grid.appScope.viewRow(row.entity)">{{row.entity.AlarmSMSNotificationNo}}</a></div>'
        },
        { name: 'IntervalDays', displayName: 'Interval(In Days)', enableColumnResizing: true, width: "10%", minWidth: 150, cellClass: getCellClass },
        { name: 'AdditionalEmailID', displayName: 'More Email ID', enableColumnResizing: true, width: "30%", minWidth: 200, cellClass: getCellClass },
        { name: 'AdditionalMobileNo', displayName: 'More Mobile No', enableColumnResizing: true, width: "30%", minWidth: 200, cellClass: getCellClass },
        //{ name: 'EndDate', displayName: 'EndDate', enableColumnResizing: true, width: "14%", minWidth: 150, cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        
        {
            //name: 'StatusName', displayName: 'Status', cellClass: getCellClass,
            //width: "15%",
            //minWidth: 100
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
                filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }],
            },
            width: "10%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" ng-class="{disable: row.entity.StatusCode == \'JG\'}" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.GenerateJob(row.entity)" ng-class="{disable: row.entity.StatusCode == \'JG\'}" ><i class="fa fa-external-link  icon-space-before" tooltip-append-to-body="true" uib-tooltip="Test Email Notification" tooltip-class="customClass"></i></a>' +
                 '</div>',
            width: "10%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isEdit = true;
        $scope.isView = false;
        $scope.clearModal();
        $scope.AlarmEmailNotification = row;
        $scope.AlarmEmailNotification.AlarmEmailNotificationID = row.AlarmEmailNotificationID;
        $scope.AlarmEmailNotification.emailList = new Date(row.emailList);
        $scope.AlarmEmailNotification.AlarmSMSNotificationNo = row.AlarmSMSNotificationNo;
        $scope.AlarmEmailNotification.MobNoList = new Date(row.MobNoList);
        $scope.IntervalDays = row.IntervalDays;
        $scope.AdditionalEmailID = row.AdditionalEmailID;
        $scope.AdditionalMobileNo = row.AdditionalMobileNo;
        $scope.AlarmEmailNotificationSetupId = row.AlarmEmailNotificationSetupId;
        $scope.AlarmEmailNotificationdEquipments = row.AlarmEmailNotificationEquipments;
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.selectedRow = [];
        $scope.GetEqByAlarmEmailNotificationId(row.AlarmEmailNotificationSetupId);
        $scope.s_Equipment = JSON.parse($scope.AlarmEmailNotification.AlarmEmailNotificationEquipments);
        for (i = 0; i < $scope.s_Equipment.length; i++) {
            if ($scope.s_Equipment[i].Active == 'Y') {
                $scope.isMachines = true;
                break;
            } else {
                $scope.isMachines = false;
            }
        }

        $scope.EqCount = 0;
        angular.forEach($scope.s_Equipment, function (val, i) {
            if (val.Active == 'Y') {
                $scope.EqCount = $scope.EqCount + 1;
            }
        });
    };

    $scope.viewRow = function (row) {
        $scope.isView = true;
        $scope.isEdit = false;
        $scope.clearModal();
        $scope.AlarmEmailNotification = row;
        $scope.AlarmEmailNotification.AdditionalEmailID = row.AdditionalEmailID;
        $scope.AlarmEmailNotification.AdditionalMobileNo = row.AdditionalMobileNo;
      //  $scope.AlarmEmailNotification.EndDate = new Date(row.EndDate);
      //  $scope.S_Reporting(row.AlarmEmailNotificationServices);
        $scope.AlarmEmailNotificationSetupId = row.AlarmEmailNotificationSetupId;
        $scope.AlarmEmailNotificationdEquipments = row.AlarmEmailNotificationEquipments;
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.readOnlyPage = true;
        $scope.selectedRow = [];
        $scope.GetEqByAlarmEmailNotificationId(row.AlarmEmailNotificationSetupId);
        $scope.s_Equipment = JSON.parse($scope.AlarmEmailNotification.AlarmEmailNotificationEquipments);
        for (i = 0; i < $scope.s_Equipment.length; i++) {
            if ($scope.s_Equipment[i].Active == 'Y') {
                $scope.isMachines = true;
                break;
            } else {
                $scope.isMachines = false;
            }
        }

        $scope.EqCount = 0;
        angular.forEach($scope.s_Equipment, function (val, i) {
            if (val.Active == 'Y') {
                $scope.EqCount = $scope.EqCount + 1;
            }
        });
    };

    $scope.GetEqByAlarmEmailNotificationId = function (row) {
        var _url = "/AlarmEmailNotification/GetEquipmentByAlarmEmailNotificationId?csId=" + $scope.ClientSiteId + "&scId=" + row + "&lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.s_Equipment = JSON.parse(response.data[0].AlarmEmailNotificationEquipments);
                //$scope.s_Equipment = response.data;

                for (i = 0; i < $scope.s_Equipment.length; i++) {
                    if ($scope.s_Equipment[i].Active == 'Y') {
                        $scope.isMachines = true;
                        break;
                    } else {
                        $scope.isMachines = false;
                    }
                }

                $scope.EqCount = 0;
                angular.forEach($scope.s_Equipment, function (val, i) {
                    if (val.Active == 'Y') {
                        $scope.EqCount = $scope.EqCount + 1;
                    }
                });
            });
    }

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
        $scope.AlarmEmailNotification = {
            AlarmEmailNotificationSetupId: 0,
            ClientSiteId: 0,
            AlarmEmailNotificationID: null,
            AlarmSMSNotificationNo: null,
            Active: null,
            IntervalDays: "",
            ADAdditionalEmailID: "",
            AdditionalMobileNo: "",
            StatusId: 0,
            AlarmEmailNotificationEquipments: []
            
        };
        $scope.AlarmEmailNotificationSelectedData = [];
        $scope.resetForm();
        $timeout(function () {
            $scope.loadProgramType();
        }, 2);
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.S_Active = 'All';
        $scope.clearModal();
    };

    $scope.clearValue = function () {
        $scope.S_AlarmEmailNotification = {
            LookupId: 0
        };
    };
    $scope.clearValue();

    $scope.searchToggle = function () {
        $scope.readOnlyPage = false;
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.isView = false;
        $scope.gridOpts.data = [];
        $scope.selectedRow = []
    };

    $scope.createToggle = function () {
        $scope.readOnlyPage = false;
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.isView = false;
        $scope.clearModal();
        $scope.S_Reporting();
        $scope.selectedRow = [];
        $scope.isMachines = false;
        $scope.s_Equipment = [];
        $scope.EqCount = 0;
    };

    $scope.columns = angular.copy(_columns);
    //Set grid options to grid

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;
    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        modifierKeysToMultiSelectCells: true,
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
            gridApi.cellNav.on.navigate($scope, function (selected) {

                if ('.ui-grid-cell-focus ') {
                    highlightRow = selected.row.uid;
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }

            });
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_AlarmEmailNotification.xlsx',
        exporterExcelSheetName: 'EMaintenance_AlarmEmailNotification',
        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

            var stylesheet = workbook.getStyleSheet();
            var stdStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri'
            });
            var boldStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri', bold: true
            });
            var aFormatDefn = {
                "font": boldStyle.id,
                "alignment": { "wrapText": true }
            };
            var formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['bold'] = formatter;
            var dateFormatter = stylesheet.createSimpleFormatter('date');
            $scope.formatters['date'] = dateFormatter;

            aFormatDefn = {
                "font": stdStyle.id,
                "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
                "alignment": { "wrapText": true }
            };
            var singleDefn = {
                font: stdStyle.id,
                format: '#,##0.0'
            };
            formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['red'] = formatter;

            Object.assign(docDefinition.styles, $scope.formatters);

            return docDefinition;
        },
        exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
            // this can be defined outside this method
            var stylesheet = workbook.getStyleSheet();
            var aFormatDefn = {
                "font": { "size": 11, "fontName": "Calibri", "bold": true },
                "alignment": { "wrapText": true }
            };
            var formatterId = stylesheet.createFormat(aFormatDefn);

            // excel cells start with A1 which is upper left corner
            sheet.mergeCells('B1', 'C1');
            var cols = [];
            // push empty data
            cols.push({ value: '' });
            // push data in B1 cell with metadata formatter
            cols.push({ value: 'SKF', metadata: { style: formatterId.id } });
            sheet.data.push(cols);
        },
        exporterFieldFormatCallback: function (grid, row, gridCol, cellValue) {
            // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
            // a formatter and obtaining the id
            var formatterId = null;
            if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
                formatterId = $scope.formatters['red'].id;
            }

            if (gridCol.field === 'updatedDate') {
                formatterId = $scope.formatters['date'].id;
            }

            if (formatterId) {
                return { metadata: { style: formatterId } };
            } else {
                return null;
            }
        },
        exporterColumnScaleFactor: 4.5,
        exporterFieldApplyFilters: true
    };

    $scope.loadData = function () {
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/AlarmEmailNotification/GetAlarmEmailNotificationByStatus?csId=" + $scope.ClientSiteId + "&ssId=0&lId=" + $scope.language.LanguageId + "&status=" + $scope.S_AlarmEmailNotification.LookupId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                $scope.scrollToFocus();
            }); 
        
    };

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

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            //$scope.loadMachine();
           
            $scope.loadStatus();
            
            $scope.loadData();
            $scope.createToggle();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
           
        }
    });

  
    $scope.AlarmEmailNotificationSelectedData = [];
    $scope.S_Reporting = function (data) {
        $scope.AlarmEmailNotificationSelectedData = [];
        $scope.Reporting = [];
        if (!data) {
            var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=0&type=Drive&at=Services&status=All";
            $http.get(_url)
                .then(function (response) {
                    $scope.reportingDDL = response.data;
                    angular.forEach(response.data, function (val, i) {
                        val.AlarmEmailNotificationSetupId = 0;
                        val.AlarmEmailNotificationServiceId = 0;
                        if ($scope.isCreate) {
                            if (i == 0) {
                                val.Active = "Y";
                            }
                        }
                        $scope.Reporting.push({
                            id: val.ServiceId, label: val.ServiceName
                        });
                        if (val.Active == 'Y') {
                            $scope.AlarmEmailNotificationSelectedData.push({ id: val.ServiceId });
                        }
                    });
                });
        } else {
            var _d = JSON.parse(data);
            $scope.reportingDDL = JSON.parse(data);
            angular.forEach(_d, function (val, i) {
                $scope.Reporting.push({
                    id: val.ServiceId, label: val.ServiceName
                });
                if (val.Active == 'Y') {
                    $scope.AlarmEmailNotificationSelectedData.push({ id: val.ServiceId });
                }
            });
        }
    };

    $scope.GenerateJob = function (data) {
        var _url = "/EmailConfiguration/GenerateJobs?csId=" + $scope.ClientSiteId + "&ssId=" + data.AlarmEmailNotificationSetupId;
        $http.post(_url)
            .then(function (response) {
                $scope.loadData();
                $scope.generateJobPopup();
            });
    };

    $scope.generateJobPopup = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfGenerateJobModal.html',
            controller: 'skfGenerateJobModalCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "csId": $scope.ClientSiteId, };
                }
            }
        });

        modalInstance.result.then(function () {

        }, function () {

        });
    }

    $scope.SelectPlant = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfPlantModal.html',
            controller: 'skfPlantModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': $scope.s_Equipment, "SelectedRow": $scope.selectedRow, "language": $scope.language, "csId": $scope.ClientSiteId, "ssId": $scope.AlarmEmailNotificationSetupId, "isEdit": $scope.isEdit, "scName": $scope.AlarmEmailNotification.AlarmEmailNotificationName, "isView": $scope.isView };
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                $scope.EqCount = 0;
                $scope.selectedRow = [];
                angular.forEach(data, function (val, i) {
                    if (val.isDirty === true) {
                        $scope.selectedRow.push(val);
                    }
                    if (val.Active == 'Y') {
                        $scope.EqCount = $scope.EqCount + 1;
                    }
                });

                for (i = 0; i < data.length; i++) {
                    if (data[i].Active == 'Y') {
                        $scope.isMachines = true;
                        break;
                    } else {
                        $scope.isMachines = false;
                    }
                }
            }

        }, function () {

        });

    };


    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.selectedRowTemp = $scope.selectedRow;
            $scope.isProcess = true;
            var postUrl = "/AlarmEmailNotification/Create";
            $scope.AlarmEmailNotification.AlarmEmailNotificationEquipments = $scope.selectedRow;
            $scope.AlarmEmailNotification.ClientSiteId = $scope.ClientSiteId;
            $scope.AlarmEmailNotification.StartDate = $filter('date')($scope.AlarmEmailNotification.StartDate, "yyyy-MM-dd 00:00:00");
            $scope.AlarmEmailNotification.EndDate = $filter('date')($scope.AlarmEmailNotification.EndDate, "yyyy-MM-dd 00:00:00");

            angular.forEach($scope.reportingDDL, function (val, i) {
                angular.forEach($scope.AlarmEmailNotificationSelectedData, function (value, index) {
                    if (val.ServiceId == value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!(val.isDirty)) {
                        val.Active = "N";
                    }
                });
            });

            $scope.AlarmEmailNotification.AlarmEmailNotificationServices = $scope.reportingDDL;
            $http.post(postUrl, JSON.stringify($scope.AlarmEmailNotification)).then(function (response) {
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
                        $scope.createToggle();
                        $scope.loadData();
                        //setTimeout(function () {
                        //    $scope.scrollToFocus();
                        //}, 200);

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

    //$scope.scrollToFocus = function (rowIndex, colIndex) {
    //    var index = $scope.gridOpts.data.length;
    //    $scope.gridApi.cellNav.scrollToFocus($scope.gridOpts.data[index], $scope.gridOpts.columnDefs[1]);
    //};

    $scope.update = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/AlarmEmailNotification/Update";
            //angular.forEach($scope.reportingDDL, function (val, i) {
            //    angular.forEach($scope.AlarmEmailNotificationSelectedData, function (value, index) {
            //        if (val.ServiceId == value.id) {
            //            val.Active = "Y";
            //            val.isDirty = true;
            //        } else if (!(val.isDirty)) {
            //            val.Active = "N";
            //        }
            //    });
            //});

            $scope.AlarmEmailNotification.AlarmEmailNotificationEquipments = $scope.selectedRow;
         //  $scope.AlarmEmailNotification.alAlarmEmailNotificationServices = $scope.reportingDDL;
            $scope.AlarmEmailNotification.ClientSiteId = $scope.ClientSiteId;
         //   $scope.AlarmEmailNotification.StartDate = $filter('date')($scope.AlarmEmailNotification.StartDate, "yyyy-MM-dd 00:00:00");
        //    $scope.AlarmEmailNotification.EndDate = $filter('date')($scope.AlarmEmailNotification.EndDate, "yyyy-MM-dd 00:00:00");
            $http.post(postUrl, JSON.stringify($scope.AlarmEmailNotification)).then(function (response) {
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
                        //$scope.searchToggle();
                        $scope.readOnlyPage = true;
                        $scope.loadData();
                        $scope.AlarmEmailNotification.AdditionalEmailID = $scope.AlarmEmailNotification.AdditionalEmailID;
                        $scope.AlarmEmailNotification.AdditionalMobileNo = $scope.AlarmEmailNotification.AdditionalMobileNo;
                        
                     //   $scope.AlarmEmailNotification.inter.Emailo.EndDate = new Date($scope.AlarmEmailNotification.EndDate);
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

    $scope.jobAlarmEmailNotification = function (row) {
        $http.get("/AlarmEmailNotification/GetAlarmEmailNotification?cliSiteId=" + row.ClientSiteId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.sno = i + 1;
                    if (val.ClientSiteConfigId == null) {
                        val.ClientSiteConfigId = 0;
                    }
                });

                var modalInstance = $uibModal.open({
                    templateUrl: 'skfJobAlarmEmailNotificationModal.html',
                    controller: 'skfJobAlarmEmailNotificationModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        params: function () {
                            return { "row": row, "data": response.data };
                        }
                    }
                });
            });

        modalInstance.result.then(function () {

        }, function () {
        });

    };
});


app.controller('skfPlantModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.SelectedRow = params.SelectedRow;
    $scope.row = params.row;
    $scope.AlarmEmailNotificationSetupId = params.ssId;
    $scope.ScName = params.scName;
    $scope.isEdit = params.isEdit;
    $scope.isView = params.isView;


    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'AreaName', displayName: 'Area Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'SystemName', displayName: 'System Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'Active', displayName: 'Action', enableFiltering: false, enableCellEdit: false,
            //filter: {
            //    type: uiGridConstants.filter.SELECT,
            //    selectOptions: [{ value: 'Y', label: 'Selected' }, { value: 'N', label: 'Unselected' }]
            //},
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" ng-disabled="grid.appScope.isView" class="header-checkbox" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "7%",
            minWidth: 50
        }
    ];

    $scope.DirtyValues = function (row) {
        row.isDirty = true;
    };

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enablePinning: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Machine.xlsx',
        exporterExcelSheetName: 'EMaintenance_Machine',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts.columnDefs = angular.copy(_columns);
                }, 2);
            };
        },
        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

            var stylesheet = workbook.getStyleSheet();
            var stdStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri'
            });
            var boldStyle = stylesheet.createFontStyle({
                size: 9, fontName: 'Calibri', bold: true
            });
            var aFormatDefn = {
                "font": boldStyle.id,
                "alignment": { "wrapText": true }
            };
            var formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['bold'] = formatter;
            var dateFormatter = stylesheet.createSimpleFormatter('date');
            $scope.formatters['date'] = dateFormatter;

            aFormatDefn = {
                "font": stdStyle.id,
                "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
                "alignment": { "wrapText": true }
            };
            var singleDefn = {
                font: stdStyle.id,
                format: '#,##0.0'
            };
            formatter = stylesheet.createFormat(aFormatDefn);
            // save the formatter
            $scope.formatters['red'] = formatter;

            Object.assign(docDefinition.styles, $scope.formatters);

            return docDefinition;
        },
        exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
            // this can be defined outside this method
            var stylesheet = workbook.getStyleSheet();
            var aFormatDefn = {
                "font": { "size": 11, "fontName": "Calibri", "bold": true },
                "alignment": { "wrapText": true }
            };
            var formatterId = stylesheet.createFormat(aFormatDefn);

            // excel cells start with A1 which is upper left corner
            sheet.mergeCells('B1', 'C1');
            var cols = [];
            // push empty data
            cols.push({ value: '' });
            // push data in B1 cell with metadata formatter
            cols.push({ value: 'SKF', metadata: { style: formatterId.id } });
            sheet.data.push(cols);
        },
        exporterFieldFormatCallback: function (grid, row, gridCol, cellValue) {
            // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
            // a formatter and obtaining the id
            var formatterId = null;
            if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
                formatterId = $scope.formatters['red'].id;
            }

            if (gridCol.field === 'updatedDate') {
                formatterId = $scope.formatters['date'].id;
            }

            if (formatterId) {
                return { metadata: { style: formatterId } };
            } else {
                return null;
            }
        },
        exporterColumnScaleFactor: 4.5,
        exporterFieldApplyFilters: true
    };

    $scope.loadMachine = function () {
        if ($scope.isEdit || $scope.isView) {
            $scope.gridOpts.data = $scope.row;
            angular.forEach($scope.SelectedRow, function (data, i) {
                angular.forEach($scope.gridOpts.data, function (val, j) {
                    if ($scope.isView) {
                        val.isView = "T";
                    }
                    if (data.isDirty == true && val.EquipmentId == data.EquipmentId) {
                        val.Active = data.Active;
                        val.isDirty = true;
                    }
                });
            });

            angular.forEach($scope.gridOpts.data, function (val, j) {
                if ($scope.isView) {
                    val.isView = "T";
                }
            });
        } else {
            var _url = "Equipment/GetEquipmentsByClientSite?csId=" + $scope.csId + "&lId=" + $scope.languageId + "&status=Y";
            $http.get(_url)
                .then(function (response) {
                    $scope.gridOpts.data = response.data;
                    angular.forEach($scope.SelectedRow, function (data, i) {
                        angular.forEach($scope.gridOpts.data, function (val, i) {
                            if (data.isDirty == true && val.EquipmentId == data.EquipmentId) {
                                val.Active = data.Active;
                                val.isDirty = true;
                            }
                            val.sno = i + 1;
                        });
                    });
                });
        }

    }();

    $scope.SelectAll = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        if (!$scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.Active = 'Y';
                val.entity.isDirty = true;
                $scope.selectAll = true;
            });
        } else if ($scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.isDirty = true;
                val.entity.Active = 'N';
                $scope.selectAll = false;
            });
        }
    }

    $scope.save = function () {

        if ($scope.gridOpts.data) {
            $uibModalInstance.close($scope.gridOpts.data);
        }

    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});


app.controller('skfGenerateJobModalCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.AlarmAlarmEmailNotificationSetupId = params.ssId;
    $scope.ScName = params.scName;

    $scope.Gotojoblist = function () {
        $window.location.href = "/EmailConfiguration";
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
