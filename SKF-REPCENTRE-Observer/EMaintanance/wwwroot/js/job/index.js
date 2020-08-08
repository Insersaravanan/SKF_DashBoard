app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.isView = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.Active = "Y";
    $scope.isJobStatusColour = false;

    $scope.loadlegends = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.languageId + "&lName=ReportStatusLegend";
        $http.get(_url)
            .then(function (response) {
                $scope.legendDDL = response.data;
            });
    };

    $scope.ChangestartDate = function () {
        if ($scope.JobList.EstEndDate < $scope.JobList.EstStartDate) {
            $scope.JobList.EstEndDate = "";
        }

        $scope.E_options = {
            minDate: new Date($scope.JobList.EstStartDate) // restrict min date to Start date
        };
    }

    $scope.loadAssign = function () {
        $scope.S_Users = {
            "languageId": $scope.language.LanguageId,
            "UserTypeId": 0,
            "UserStatusId": 0
        }

        var postUrl = "/Users/Search";
        $http.post(postUrl, JSON.stringify($scope.S_Users)).then(function (response) {
            if (response.data) {
                $scope.AssignDDL = response.data;
            }

        }, function (response) {
            alertFactory.setMessage({
                type: "warning",
                msg: String(response.data.message)
            });
        });
    }

    //$scope.loadReportType = function (data) {
    //    var j = 5
    //    var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ReportType";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.ReportTypeDDL = response.data;
    //            angular.forEach(response.data, function (val, i) {
    //                if (i == 0) {
    //                    var x = {
    //                        field: val.LookupCode.toUpperCase(), minWidth: 20, width: '4%', enableFiltering: false, enablePinning: false,
    //                        //enableCellEdit: false, enableSorting: false,
    //                        //headerCellTemplate: '<span class="report-header">' + val.LookupCode.toUpperCase() + '<span class="common-report-heading job-list">Job Services</span></span>'
    //                    };
    //                } else {
    //                    var x = {
    //                        field: val.LookupCode.toUpperCase(), minWidth: 20, width: '4%', enableFiltering: false, enablePinning: false,
    //                        //enableCellEdit: false, enableSorting: false,
    //                        // headerCellTemplate: '<span class="report-header">' + val.LookupCode.toUpperCase() + '</span>'
    //                    };
    //                }

    //                $scope.gridOpts.columnDefs.splice(j, 0, x);
    //                j++;
    //            });
    //            //$scope.gridvalue();
    //        });
    //};

    //$scope.gridvalue = function () {
    //    angular.forEach($scope.gridOpts.data, function (val, i) {
    //        var data = JSON.parse(val.JobServices);
    //        angular.forEach(data, function (_data, j) {
    //            angular.forEach($scope.gridOpts.columnDefs, function (_, l) {
    //                if (_.field == _data.ServiceCode) {
    //                    //var field = _.field;
    //                    //val[field] = _data.Active;
    //                    _.type = 'boolean';
    //                    _.cellTemplate = '<label uib-tooltip="' + _data.ToolTipText + '" tooltip-append-to-body="true"><input type="checkbox" disabled ng-model="row.entity.' + _.field + '" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>';
    //                }
    //            });
    //        });
    //    });
    //}

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "40", enableCellEdit: false, enableFiltering: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'JobNumber', displayName: 'Job #', enableColumnResizing: true, enableCellEdit: false, width: "5%", minWidth: 60, cellClass: getCellClass, aggregationHideLabel: false

        },
        {
            name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, enableCellEdit: false, width: "17%", minWidth: 140, cellClass: getCellClass, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-JobName"><a ng-click="grid.appScope.viewRow(row.entity)">{{row.entity.JobName}}</a></div>'
        },
        { name: 'EstStartDate', displayName: 'Est. Start Date', enableColumnResizing: true, enableCellEdit: false, minWidth: 70, width: "9%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        { name: 'EstEndDate', displayName: 'Est. End Date', enableColumnResizing: true, enableCellEdit: false, minWidth: 60, width: "8%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        {
            name: 'VACount', displayName: 'VA', enableColumnResizing: false, enableCellEdit: false, minWidth: 40, width: '6%', enableFiltering: false, enablePinning: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header">Vibration Analysis<span class="common-report-heading job-list">Job Services</span></span>',
            cellTemplate: '<div tooltip-append-to-body="true" class="rservice" uib-tooltip={{row.entity.VAToolTip}} ng-attr-style="background-color:{{row.entity.VAStatusColour}}" tooltip-class="customClass import-tooltip">{{row.entity.VACount}}</div>'
        },
        {
            name: 'OACount', displayName: 'OA', enableColumnResizing: false, enableCellEdit: false, minWidth: 40, width: '6%', enableFiltering: false, enablePinning: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header">Oil Analysis</span>',
            cellTemplate: '<div tooltip-append-to-body="true" class="rservice" uib-tooltip={{row.entity.OAToolTip}} ng-attr-style="background-color:{{row.entity.OAStatusColour}}" tooltip-class="customClass import-tooltip">{{row.entity.OACount}}</div>'
        },

        {
            name: 'StatusName', displayName: 'Job Status', cellClass: getCellClass, enableCellEdit: false,
            width: "9%",
            minWidth: 120,
            cellTemplate: '<div class="job-status"><span class="grid-status" ng-attr-style="border: 1px solid {{row.entity.StatusColour}};color: {{row.entity.StatusColour}}">{{row.entity.StatusName}}</span></span>'
        },
        {
            name: 'StatusPercent', displayName: 'Job Progress', enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 100, cellClass: getCellClass,
            cellTemplate: '<div class="job-status progress"><div class="progress-bar" role="progressbar"  ng-attr-style="width:{{row.entity.StatusPercent}}%"></div></span><p>{{row.entity.StatusPercent}}%</p></div>',

        },
        {
            name: 'Assignment',
            displayName: 'Planning',
            enableCellEdit: false,
            width: "7%", minWidth: 120, cellClass: getCellClass,
            cellTemplate: '<div class="assignment {{row.entity.Assignment}}">{{row.entity.Assignment}}</div>'
        },
        {
            name: 'Active', displayName: 'Select', enableFiltering: false, cellClass: getCellClass,
            headerCellTemplate: '<div class="ui-grid-cell-contents job-user">' +
                '<span>Select &nbsp;&nbsp</span><div><input type="checkbox" class="header-checkbox" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></div>' +
                '<a class="grid-user" ng-disabled="!grid.appScope.isAssignee" ng-click="grid.appScope.SelectAssignee()" title="Assign User"><i class="fa fa-user icon-filter"></i></a></div>',
            type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents grid-checkbox"><input type="checkbox" ng-disabled="row.entity.StatusCode == \'C\'" ng-model="row.entity.Assigned"  tooltip-append-to-body="true" uib-tooltip="Select job to assign user" tooltip-class="customClass" ng-click="grid.appScope.selectUser(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></div>',
            width: "5%",
            minWidth: 50
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" ng-class="{disable: row.entity.StatusCode != \'NS\'}" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit JobList" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.splitJob(row.entity)" ng-class="{disable: row.entity.AnalystId == \'0\' || row.entity.StatusCode == \'C\'}"><i class="fa fa-cut icon-space-before"  tooltip-append-to-body="true" uib-tooltip="Split Job" tooltip-class="customClass"></i></a>' +
                '<a href="/ReportFeeder" ng-class="{disable: row.entity.Assignment != \'Done\'}"><i class="fa fa-file-text icon-space-before"  tooltip-append-to-body="true" uib-tooltip="Create Report" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.Report(row)" ng-class="{disable:row.entity.StatusCode == \'NS\'}"><i class="fa fa-align-left icon-space-before" tooltip-append-to-body="true" uib-tooltip="Summary Report" tooltip-class="customClass import-tooltip"></i></a>' +
                '<a ng-click="grid.appScope.downloadExcel(row.entity)"} ng-class="{disable:row.entity.StatusCode != \'C\'}"> <i class="fa fa-file-excel-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "13%",
            minWidth: 120
        }
    ]

    $scope.downloadExcel = function (row) {
        var postUrl = "SummaryReport/GetSummaryReportToDownload?jId=" + row.JobId + "&lId=" + $scope.language.LanguageId;
        $http.get(postUrl)
            .then(function (response) {
                $scope.template = row.JobNumber;
                $scope.download = response.data;
                var ws = XLSX.utils.json_to_sheet($scope.download);

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, $scope.template + "");

                /* write workbook */
                XLSX.writeFile(wb, "SummaryReport_" + $scope.template + ".xlsx");
            });
    };

    $scope.Report = function (row, val) {
        window.open(
            "/report?jId=" + row.entity.JobId + "&lId=" + $scope.language.LanguageId + "&type=SR",
            '_self'  //<- This is what makes it open in a new window.
        );
    }

   
    $scope.SelectAll = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        if (!$scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                if (val.entity.StatusCode != 'C') {
                    val.entity.Assigned = 'Y';
                    val.entity.isDirty = true;
                    $scope.selectAll = true;
                    $scope.isAssignee = true;
                   
                }

            });
        } else if ($scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                if (val.entity.StatusCode != 'C') {
                    val.entity.isDirty = false;
                    val.entity.Assigned = 'N';
                    $scope.selectAll = false;
                    $scope.isAssignee = false;
                    
                }
            });
        }
    }

    $scope.selectUser = function (row) {
        row.isDirty = true;
        for (i = 0; i < $scope.gridOpts.data.length; i++) {
            if ($scope.gridOpts.data[i].Assigned == 'Y') {
                $scope.isAssignee = true;
                break;
            } else {
                $scope.isAssignee = false;
            }
        }
    }

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isEdit = true;
        $scope.isView = false;
        $scope.clearModal();
        $scope.JobList = row;
        $scope.JobList.EstStartDate = new Date(row.EstStartDate);
        $scope.JobList.EstEndDate = new Date(row.EstEndDate);
        $scope.S_Reporting(row.JobServices);
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.selectedRow = [];
        $scope.GetEqByJob(row.JobId);
    };

    $scope.viewRow = function (row) {
        $scope.isView = true;
        $scope.isEdit = false;
        $scope.clearModal();
        $scope.JobList = row;
        $scope.JobList.EstStartDate = new Date(row.EstStartDate);
        $scope.JobList.EstEndDate = new Date(row.EstEndDate);
        $scope.S_Reporting(row.JobServices);
        $scope.isSearch = false;
        $scope.isCreate = false;
        $scope.readOnlyPage = true;
        $scope.selectedRow = [];
        $scope.GetEqByJob(row.JobId);
    };

    $scope.GetEqByJob = function (row) {
        var _url = "/Job/GetEquipmentByJobId?csId=" + $scope.ClientSiteId + "&jId=" + row + "&lId=" + $scope.language.LanguageId;
        $http.get(_url)
            .then(function (response) {
                $scope.s_Equipment = JSON.parse(response.data[0].JobEquipments);
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
                        $scope.selectedRow.push(val);
                        val.isDirty = true;
                    }
                });
            });
    }

    $scope.scheduleReport = function (data) {
        angular.forEach(data, function (val, i) {
            if (val.Active == 'Y') {
                $scope.ScheduleSelectedData.push({ id: val.ReportId });
            }
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
        $scope.$broadcast('angucomplete-alt:clearInput', 'UserId');

        $scope.JobList = {
            JobId: 0,
            ClientSiteId: 0,
            ScheduleSetupId: null,
            JobNumber: 0,
            JobName: null,
            JobStatusId: 0,
            JobStatus: null,
            ProgramTypeId: 0,
            EstStartDate: null,
            AnalystId: 0,
            EstEndDate: null,
            UserId: 0,
            JobEquipments: [],
            JobServices: []
        };
        $scope.ScheduleSelectedData = [];
        $scope.resetForm();
        $timeout(function () {
            $scope.loadProgramType();
        }, 2);
    };

    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.isEdit = false;
    };

    $scope.clearValue = function () {
        $scope.S_JobList = {
            Status: 'Y'
        };
    };
    $scope.clearValue();

    $scope.searchToggle = function () {
        $scope.clearModal();
        $scope.readOnlyPage = false;
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.isView = false;
    };

    $scope.createToggle = function () {
        $scope.readOnlyPage = false;
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.isView = false;
        $scope.S_Reporting();
        $scope.clearModal();
        $scope.selectedRow = [];
        $scope.isMachines = false;
        $scope.s_Equipment = [];
        $scope.EqCount = 0;
    };

    $scope.columns = angular.copy(_columns);

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;
    //Set grid options to grid
    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        enablePinning: true,
        enableCellEdit: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            gridApi.core.on.renderingComplete($scope, function () {
                console.log(gridApi.grid);
            });
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts.columnDefs = angular.copy(_columns);
                }, 2);
            };
            gridApi.cellNav.on.navigate($scope, function (selected) {

                if ('.ui-grid-cell-focus') {
                    highlightRow = selected.row.uid;
                    $scope.Id = selected.row.entity.JobId;
                    $scope.isJobStatusColour = true;
                    var _url = "/Job/GetUserJobStatusColour?jId=" + $scope.Id;
                    $http.get(_url)
                        .then(function (response) {
                            $scope.JobStatusColourDDL = response.data;
                        });
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                }
            });
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_JobList.xlsx',
        exporterExcelSheetName: 'EMaintenance_JobList',
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

    $scope.S_jobList = {
        JobNumber: null,
        StartDate: null,
        EstEndDate: null
    }

    $scope.loadData = function () {
        var date = new Date();
        var d = date.getDate() - 30;
        y = date.getFullYear(), m = date.getMonth()
        if ($scope.S_jobList.StartDate == null) {
            $scope.S_jobList.StartDate = new Date(y, m, d);
        }

        $scope.gridOpts.data = [];
        var _url = "/job/GetJobByStatus?csId=" + $scope.ClientSiteId + "&jId=0&ssId=0&lId=" + $scope.language.LanguageId + "&status=ALL&esDate=" + $filter('date')($scope.S_jobList.StartDate, "yyyy-MM-dd 00:00:00") + "&eeDate=" + $filter('date')($scope.S_jobList.EstEndDate, "yyyy-MM-dd 00:00:00") + "&jNo=" + $scope.S_jobList.JobNumber;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                //$scope.gridvalue();
            });
    };

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/job/Create";
            $scope.JobList.JobEquipments = $scope.selectedRow;
            $scope.JobList.ClientSiteId = $scope.ClientSiteId;
            //$scope.JobList.UserId = $scope.selectedAssignStatusFn.originalObject.UserId;
            $scope.JobList.EstStartDate = $filter('date')($scope.JobList.EstStartDate, "yyyy-MM-dd 00:00:00");
            $scope.JobList.EstEndDate = $filter('date')($scope.JobList.EstEndDate, "yyyy-MM-dd 00:00:00");

            //$scope.JobList.AnalystId = $scope.JobList.UserId;
            angular.forEach($scope.reportingDDL, function (val, i) {
                angular.forEach($scope.ScheduleSelectedData, function (value, index) {
                    if (val.ServiceId == value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!(val.isDirty)) {
                        val.Active = "N";
                    }
                });
            });

            $scope.JobList.JobServices = $scope.reportingDDL;
            $http.post(postUrl, JSON.stringify($scope.JobList)).then(function (response) {
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

    $scope.update = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {

            $scope.isProcess = true;
            var postUrl = "/job/Update";
            $scope.JobList.JobEquipments = $scope.selectedRow;
            $scope.JobList.ClientSiteId = $scope.ClientSiteId;
            //$scope.JobList.UserId = $scope.selectedAssignStatusFn.originalObject.UserId;
            $scope.JobList.EstStartDate = $filter('date')($scope.JobList.EstStartDate, "yyyy-MM-dd 00:00:00");
            $scope.JobList.EstEndDate = $filter('date')($scope.JobList.EstEndDate, "yyyy-MM-dd 00:00:00");
            //$scope.JobList.AnalystId = $scope.JobList.UserId;

            angular.forEach($scope.reportingDDL, function (val, i) {
                angular.forEach($scope.ScheduleSelectedData, function (value, index) {
                    if (val.ServiceId == value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!(val.isDirty)) {
                        val.Active = "N";
                    }
                });
            });

            $scope.JobList.JobServices = $scope.reportingDDL;
            $http.post(postUrl, JSON.stringify($scope.JobList)).then(function (response) {
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
                        $scope.JobList.EstStartDate = new Date($scope.JobList.EstStartDate);
                        $scope.JobList.EstEndDate = new Date($scope.JobList.EstEndDate);
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

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo == null) {
            sessionStorage.setItem("isClientSite", "yes");
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
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    }

    $scope.ReportingSerSettings = {
        checkBoxes: true,
        dynamicTitle: true,
        showUncheckAll: false,
        showCheckAll: false
    };

    $scope.ScheduleSelectedData = [];
    $scope.S_Reporting = function (data) {
        $scope.ScheduleSelectedData = [];
        $scope.Reporting = [];
        if (!data) {
            var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=0&type=Drive&at=Services&status=All";
            $http.get(_url)
                .then(function (response) {
                    $scope.reportingDDL = response.data;
                    angular.forEach(response.data, function (val, i) {
                        val.JobId = 0;
                        val.JobServiceId = 0;
                        if ($scope.isCreate) {
                            if (i == 0) {
                                val.Active = "Y";
                            }
                        }

                        $scope.Reporting.push({
                            id: val.ServiceId, label: val.ServiceName
                        });
                        if (val.Active == 'Y') {
                            $scope.ScheduleSelectedData.push({ id: val.ServiceId });
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
                    $scope.ScheduleSelectedData.push({ id: val.ServiceId });
                }
            });

        }
    };


    $scope.loadProgramType = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ProgramType";
        $http.get(_url)
            .then(function (response) {
                $scope.ProgramTypeDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    if (val.LookupCode == 'PMPO') {
                        $scope.JobList.ProgramTypeId = val.LookupId;
                    }
                });
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
            $scope.loadAssign();
            $scope.loadlegends();
            $scope.loadProgramType();
        }
    });

    $scope.SelectPlant = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfPlantModal.html',
            controller: 'skfPlantModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': $scope.s_Equipment, "selectedRow": $scope.selectedRow, "language": $scope.language, "csId": $scope.ClientSiteId, "ssId": $scope.JobId, "isEdit": $scope.isEdit, "jbName": $scope.JobList.JobName, "jbNo": $scope.JobList.JobNumber, "isView": $scope.isView };
                }
            }
        });

        modalInstance.result.then(function (data) {

            if (data) {
                $scope.selectedRow = [];
                $scope.EqCount = 0;
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

    $scope.SelectAssignee = function () {
        $scope.SelectedRecord = [];
        var jobList = angular.copy($scope.gridOpts.data);
        angular.forEach(jobList, function (val, i) {
            if (val.isDirty === true && val.Assigned === 'Y') {
                val.JobServices = null;
                val.JobEquipments = null;
                $scope.SelectedRecord.push(val);
            }
        });

        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssignPopupModal.html',
            controller: 'skfAssignPopupModalCtrl',
            windowClass: 'job-assignee-modal',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "SelectedRecord": $scope.SelectedRecord, "language": $scope.language, "csId": $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadData();
                $scope.SelectedRecord = [];
            }
        }, function () {

        });
    };

    $scope.splitJob = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssignEqPopupModal.html',
            controller: 'skfAssignEqPopupModalCtrl',
            windowClass: 'failure-report-modal',
            size: 'lg',
            backdrop: 'static',

            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "csId": $scope.ClientSiteId, "jId": data.JobId, "JobName": data.JobName };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadData();
            }
        }, function () {

        });
    };
    
    $scope.Report = function (row) {

        var mapForm = document.createElement("form");
        mapForm.target = "Map";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = "/report";
        mapForm.setAttribute("class", "report-append-view");

        var Language = document.createElement("input");
        Language.type = "text";
        Language.name = "LanguageId";
        Language.value = $scope.language.LanguageId;
        mapForm.appendChild(Language);

        var Job = document.createElement("input");
        Job.type = "text";
        Job.name = "JobId";
        Job.value = row.entity.JobId;
        mapForm.appendChild(Job);

        var Client = document.createElement("input");
        Client.type = "text";
        Client.name = "ClientSiteId";
        Client.value = $scope.ClientSiteId;
        mapForm.appendChild(Client);

        var Type = document.createElement("input");
        Type.type = "text";
        Type.name = "Type";
        Type.value = "SR";
        mapForm.appendChild(Type);

        document.body.appendChild(mapForm);
        map = window.open("", "Map", "status=0,title=0,height=600,width=800,scrollbars=1");

        if (map) {
            mapForm.submit();
        } else {
            alert('You must allow popups for this map to work.');
        }
    }

});

app.controller('skfPlantModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.SelectedRow = params.selectedRow;
    $scope.JobId = params.ssId;
    $scope.JobName = params.JobName;
    $scope.isEdit = params.isEdit;
    $scope.isView = params.isView;
    $scope.row = params.row;
    $scope.jbName = params.jbName;
    $scope.jbNo = params.jbNo;

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
            name: 'Active', displayName: 'Action', enableFiltering: false,
            //filter: {
            //    type: uiGridConstants.filter.SELECT,
            //    selectOptions: [{ value: 'Y', label: 'Selected' }, { value: 'N', label: 'Unselected' }]
            //},
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" class="header-checkbox" ng-disabled="grid.appScope.isView" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "7%",
            minWidth: 50
        }
    ];

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
            angular.forEach($scope.gridOpts.data, function (val, j) {
                if ($scope.isView) {
                    val.isView = "T";
                }

            });
            angular.forEach($scope.SelectedRow, function (data, i) {
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    if (data.isDirty == true && val.EquipmentId === data.EquipmentId) {
                        val.Active = data.Active;
                        val.isDirty = true;
                    }
                    val.sno = i + 1;
                });
            });

        } else {
            var _url = "Equipment/GetEquipmentsByClientSite?csId=" + $scope.csId + "&lId=" + $scope.languageId + "&status=Y";
            $http.get(_url)
                .then(function (response) {
                    $scope.gridOpts.data = response.data;
                    angular.forEach($scope.SelectedRow, function (data, i) {
                        angular.forEach($scope.gridOpts.data, function (val, i) {
                            if (data.isDirty == true && val.EquipmentId === data.EquipmentId) {
                                val.Active = data.Active;
                                val.isDirty = true;
                            }
                            val.sno = i + 1;
                        });
                    });

                });
        }
    }();

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

app.controller('skfAssignPopupModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.SelectedRecord = params.SelectedRecord;
    $scope.JobList = {
        AnalystId: null,
        DataCollectorId: null,
        ReviewerId: null
    };

    $scope.loadAnalystUsers = function () {
        $http.get("Users/GetAssignToList?type=Analyst&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.AnalystDDL = response.data;
                }
            });
    }();

    $scope.isDcollecter = true;
    $scope.DataCollectionMode = 0;
    $scope.SelectOnline = function () {
        if ($scope.offline == 'Y') {
            $scope.isDcollecter = false;
            $scope.JobList.DataCollectorId = "";
            $scope.DataCollectionMode = 1;
        } else {
            $scope.isDcollecter = true;
            $scope.DataCollectionMode = 0;
        }
    }

    $scope.loadReviewerUsers = function () {
        $http.get("Users/GetAssignToList?type=Reviewer&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.ReviewerDDL = response.data;
                }
            });
    }();

    $scope.loadDCollectorUsers = function () {
        $http.get("Users/GetAssignToList?type=DataCollector&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.DataCollectorDDL = response.data;
                }
            });
    }();

    $scope.save = function () {
        if (!$scope.isDcollecter) {
            $scope.JobList.DataCollectorId = 0;
        }
        if ($scope.JobList.DataCollectorId != 'undefined' || $scope.JobList.DataCollectorId != null || $scope.JobList.AnalystId != 'undefined' || $scope.JobList.AnalystId != null || $scope.JobList.ReviewerId != 'undefined' || $scope.JobList.ReviewerId != null) {
            var postUrl = "/job/SaveAssignUser?aId=" + $scope.JobList.AnalystId + "&dcId=" + $scope.JobList.DataCollectorId + "&dcm=" + $scope.DataCollectionMode + "&rId=" + $scope.JobList.ReviewerId + "&tp=Job";

            $http.post(postUrl, JSON.stringify($scope.SelectedRecord)).then(function (response) {
                if (response) {
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });
                    $uibModalInstance.close('Success');
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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Invalid User.",
                exc: "Please pick an User from the list of suggestions"
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('skfAssignEqPopupModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.jobId = params.jId;
    $scope.JobName = params.JobName;
    $scope.JobList = {
        AnalystId: 0,
        DataCollectorId: 0,
        ReviewerId: 0
    };
    $scope.loadAnalystUsers = function () {
        $http.get("Users/GetAssignToList?type=Analyst&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.AnalystDDL = response.data;
                }
            });
    }();


    $scope.loadReviewerUsers = function () {
        $http.get("Users/GetAssignToList?type=Reviewer&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.ReviewerDDL = response.data;
                }
            });
    }();

    $scope.loadDCollectorUsers = function () {
        $http.get("Users/GetAssignToList?type=DataCollector&lId=" + $scope.languageId + "&csId=" + $scope.csId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.DataCollectorDDL = response.data;
                }
            });
    }();

    $scope.isDcollecter = true;
    $scope.DataCollectionMode = 0;
    $scope.SelectOnline = function () {
        if ($scope.offline == 'Y') {
            $scope.isDcollecter = false;
            $scope.JobList.DataCollectorId = "";
            $scope.DataCollectionMode = 1;
        } else {
            $scope.isDcollecter = true;
            $scope.DataCollectionMode = 0;
        }
    }

    $scope.save = function () {
        $scope.SelectedRecord = [];
        if (!$scope.isDcollecter) {
            $scope.JobList.DataCollectorId = 0;
        }

        if ($scope.JobList.DataCollectorId != 'undefined' && $scope.JobList.DataCollectorId != null && $scope.JobList.AnalystId != 'undefined' && $scope.JobList.AnalystId != null && $scope.JobList.ReviewerId != 'undefined' && $scope.JobList.ReviewerId != null) {
            var postUrl = "/job/SaveAssignUser?aId=" + $scope.JobList.AnalystId + "&dcId=" + $scope.JobList.DataCollectorId + "&dcm=" + $scope.DataCollectionMode + "&rId=" + $scope.JobList.ReviewerId + "&tp=Equipment";

            angular.forEach($scope.gridOpts.data, function (val, i) {
                if (val.isDirty == true && val.Active == 'Y') {
                    $scope.SelectedRecord.push(val);
                }

            });

            $http.post(postUrl, JSON.stringify($scope.SelectedRecord)).then(function (response) {
                if (response) {
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });
                    $uibModalInstance.close('Success');
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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Invalid User.",
                exc: "Please pick an User from the list of suggestions"
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantName', displayName: 'Plant', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'AreaName', displayName: 'Area', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'SystemName', displayName: 'System', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'EquipmentName', displayName: 'Equipment', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'ServiceName', displayName: 'Service', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'DataCollectorName', displayName: 'DataCollector', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'AnalystName', displayName: 'Analyst', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },

        {
            name: 'ReviewerName', displayName: 'Reviewer', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'Active', displayName: 'Action', enableFiltering: false,
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" class="header-checkbox" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents grid-checkbox"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "7%",
            minWidth: 50
        }
    ];

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

    $scope.loadEquipment = function () {
        var _url = "Job/GetJobEquipmentAssignUser?jId=" + $scope.jobId + "&lId=" + $scope.languageId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    }();

});