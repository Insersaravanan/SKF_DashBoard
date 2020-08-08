app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.j_Active = 'Y';
    $scope.B_Active = 'Y';
    $scope.stage = "";
    $scope.isEdit = false;
    $scope.isSearchDrive = true;
    $scope.isCreateDrive = false;
    $scope.isEditDrive = false;
    $scope.isViewDrive = false;
    $scope.isSearchInter = true;
    $scope.isSearchDriven = true;
    $scope.equipmentListActive = true;
    $scope.ReportDate = new Date();
    $scope.isJobStatusColour = false;

    $scope.loadlegends = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.languageId + "&lName=ReportStatusLegend";
        $http.get(_url)
            .then(function (response) {
                $scope.legendDDL = response.data;
            });
    };

    // Toggle Validation Script
    $scope.next = function (stage, val) {
        $scope.DriveActive = false;
        $scope.equipmentListActive = false;
        $scope.IntermediateActive = false;
        $scope.DrivenActive = false;
        $scope.equipmentActive = false;

        if (stage == "stage2" || stage == "stage1" || stage == "stage0") {
            if (stage == "stage2") {
                $scope.DriveActive = true;
                $scope.searchDriveToggle();
                $scope.loadDrive();
                $scope.loadAssetConditionCode();
                $scope.loadIndicatedFaults();
                $scope.loadSensorLoc();
                $scope.loadVibChange();
                $scope.loadConfidenceFactor();
                $scope.loadProbabilityFactor();
                $scope.loadPriority();
                //$scope.loadFrequency();
            } else if (stage == "stage1") {
                $scope.equipmentActive = true;
                $scope.loadEquipmentByJob(val);

            } else {
                $scope.equipmentListActive = true;
                $scope.loadData();
            }
        }
        $scope.stage = stage;
    };

    $scope.loadDrive = function (row, val) {
        //$scope.gridOpts2.data = [];
        var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + $scope.jobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts2.data = response.data;
                $scope.AssetList = response.data;
                if (row) {
                    if (row == 'SA') {
                        $scope.FeedReport($scope.gridOpts2.data[$scope.sno]);
                    } else {
                        if (response.data.length > 0) {
                            $scope.next('stage2');
                        } else {
                            $scope.SelectAssetList(row);
                        }
                    }
                }
            });
    }

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'JobNumber', displayName: 'Job Number', enableColumnResizing: true, enableCellEdit: false, width: "10%", minWidth: 100, cellClass: getCellClass, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, enableCellEdit: false, width: "20%", minWidth: 200, cellClass: getCellClass },
        { name: 'DataCollectionDate', displayName: 'Data Collection Date', enableColumnResizing: true, enableCellEdit: false, minWidth: 100, width: "11%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        { name: 'ReportDate', displayName: 'ReportDate', enableColumnResizing: true, enableCellEdit: false, minWidth: 80, width: "10%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        {
            name: 'VACount', displayName: 'VA', enableColumnResizing: false, enableCellEdit: false, minWidth: 40, width: '6%', enableFiltering: false, enablePinning: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header">Vibration Analysis<span class="common-report-heading job-list">Job Services</span></span>',
            cellTemplate: '<label tooltip-append-to-body="true" class="rservice" uib-tooltip={{row.entity.VAToolTip}} ng-attr-style="background-color:{{row.entity.VAStatusColour}}" tooltip-class="customClass import-tooltip"><a ng-disabled="row.entity.VACount == \'0\'" ng-click="grid.appScope.Trending(row.entity, row.entity.VAServiceId)" class="rservice-link">{{row.entity.VACount}}</a></label>'
        },
        {
            name: 'OACount', displayName: 'OA', enableColumnResizing: false, enableCellEdit: false, minWidth: 40, width: '6%', enableFiltering: false, enablePinning: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header">Oil Analysis</span>',
            cellTemplate: '<label tooltip-append-to-body="true" class="rservice" uib-tooltip={{row.entity.OAToolTip}} ng-attr-style="background-color:{{row.entity.OAStatusColour}}" tooltip-class="customClass import-tooltip"><a ng-disabled="row.entity.OACount == \'0\'" ng-click="grid.appScope.Trending(row.entity, row.entity.OAServiceId)" class="rservice-link">{{row.entity.OACount}}</label>'
        },

        {
            name: 'StatusName', displayName: 'Job Status', enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 120, cellClass: getCellClass,
            cellTemplate: '<div class="job-status"><span class="grid-status" ng-attr-style="border: 1px solid {{row.entity.StatusColour}};color: {{row.entity.StatusColour}}">{{row.entity.StatusName}}</span></span>'

        },
        {
            name: 'StatusPercent', displayName: 'Job Progress', enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 120, cellClass: getCellClass,
            cellTemplate: '<div class="job-status progress"><div class="progress-bar" role="progressbar"  ng-attr-style="width:{{row.entity.StatusPercent}}%"></div></span><p>{{row.entity.StatusPercent}}%</p></div>',

        },
        //{
        //    name: 'Assignment', displayName: 'Planning', enableColumnResizing: false, enableCellEdit: false, minWidth: 80, width: '9%', enableFiltering: true, cellClass: getCellClass,
        //    cellTemplate: '<label class="assignment {{row.entity.Assignment}}">{{row.entity.Assignment}}</label>'
        //},
        //{ name: 'AssignedToName', displayName: 'Assigned To', enableColumnResizing: true, enableCellEdit: false, width: "12%", minWidth: 150, cellClass: getCellClass },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.Trending(row.entity)" ng-class="{disable:row.entity.DataCollectionDone != \'1\'}"><i class="fa fa-cogs icon-space-before" tooltip-append-to-body="true" uib-tooltip="Equipment" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.Status(row.entity)" ><i class="fa fa-sun-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Job Status" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.Report(row)" ng-class="{disable:row.entity.StatusCode == \'NS\'}"><i class="fa fa-align-left icon-space-before" tooltip-append-to-body="true" uib-tooltip="Summary Report" tooltip-class="customClass import-tooltip"></i></a>' +
                //'<a ng-click="grid.appScope.DataCollectorList(row)"<i class="fa fa-tasks icon-space-before" tooltip-append-to-body="true" uib-tooltip="Data Collector List" tooltip-class="customClass import-tooltip"></i></a>' +
                '<a ng-click="grid.appScope.downloadExcel(row.entity)"} ng-class="{disable:row.entity.StatusCode != \'C\'}"> <i class="fa fa-file-excel-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "15%",
            minWidth: 150
        }
    ];

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
            "/report?jId = " + row.entity.JobId + "&lId=" + $scope.language.LanguageId + "&type=SR",
            '_self'  //<- This is what makes it open in a new window.
        );
    }

    $scope.resetForm = function () {
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.j_Active = 'Y';
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

    $scope.columns = angular.copy(_columns);

    $scope.loadData = function () {
        $scope.isPageLoad = true;
        var _url = "/ReportFeeder/GetAllAssignedJobs?csId=" + $scope.ClientSiteId + "&jId=0&ssId=0&lId=" + $scope.language.LanguageId + "&status=ALL&esDate=" + $filter('date')($scope.S_SelectedJob.StartDate, "yyyy-MM-dd 00:00:00") + "&eeDate=" + $filter('date')($scope.S_SelectedJob.EstEndDate, "yyyy-MM-dd 00:00:00") + "&jNo=" + $scope.S_SelectedJob.JobNumber;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

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

    var highlightRow = null;

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
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
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

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            //if ($scope.isPageLoad) {
            $scope.loadData();
            //}
            $scope.loadlegends();
            //$scope.loadReportType();
        }
    });

    //$scope.loadReportType = function (data) {
    //    var j = 5;
    //    var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ReportType";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.ReportTypeDDL = response.data;
    //            angular.forEach(response.data, function (val, i) {
    //                if (i == 0) {
    //                    var x = {
    //                        field: val.LookupCode.toUpperCase(), minWidth: 15, enableFiltering: false, enablePinning: false,
    //                        enableCellEdit: false, enableSorting: false, width: '5%',
    //                        headerCellTemplate: '<span class="report-header">' + val.LookupCode.toUpperCase() + '<span class="common-report-heading">Job Services</span></span>'
    //                    };
    //                } else {
    //                    var x = {
    //                        field: val.LookupCode.toUpperCase(), minWidth: 15, enableFiltering: false, enablePinning: false,
    //                        enableCellEdit: false, enableSorting: false, width: '5%',
    //                        headerCellTemplate: '<span class="report-header">' + val.LookupCode.toUpperCase() + '</span>'
    //                    };
    //                }

    //                $scope.gridOpts.columnDefs.splice(j, 0, x);
    //                j++;
    //            });

    //        });
    //};

    //$scope.gridvalue = function () {

    //    angular.forEach($scope.gridOpts.data, function (val, i) {
    //        var data = JSON.parse(val.JobServices);
    //        angular.forEach(data, function (_data, j) {
    //            angular.forEach($scope.gridOpts.columnDefs, function (_, l) {
    //                if (_.field == _data.ServiceCode) {
    //                    var field = _.field;
    //                    val[field] = _data.Active;
    //                    _.type = 'boolean';
    //                    //_.cellTemplate = '<label><input type="checkbox" disabled ng-model="row.entity.' + _.field + '" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>';
    //                }
    //            });
    //        });
    //    });
    //}

    $scope.SelectedJob = {
        JobId: 0,
        JobNumber: null,
        JobName: null,
        DataCollectionDate: null,
        ReportDate: null,
    };

    var date = new Date();
    var d = date.getDate() - 30;
    y = date.getFullYear(), m = date.getMonth();
    $scope.S_SelectedJob = {
        JobNumber: null,
        StartDate: new Date(y, m, d),
        EstEndDate: null
    }

    $scope.scheduleReport = function (data) {
        angular.forEach(data, function (val, i) {
            if (val.Active == 'Y') {
                $scope.ScheduleSelectedData.push({ id: val.ReportId });
            }
        });
    }

    // Vibration Analysis DropDown
    $scope.loadAssetConditionCode = function () {
        $scope.AssetConditionCodeDDL = [];
        $scope.defaultAssetConditionCode = {
            ConditionId: null,
            SKFConditionname: "--Select--"
        };
        var _url = "/ConditionCodeMap/Get?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetConditionCodeDDL = response.data;
                $scope.AssetConditionCodeDDL.splice(0, 0, $scope.defaultAssetConditionCode);
            });
    };

    $scope.loadSensorLoc = function (data) {
        $scope.SensorLocDDL = [];
        $scope.defaultOASensorLocation = {
            LookupId: null,
            LValue: "--Select--"
        };

        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisOASensorLocation";
        $http.get(_url)
            .then(function (response) {
                $scope.SensorLocDDL = response.data;
                $scope.SensorLocDDL.splice(0, 0, $scope.defaultOASensorLocation);
            });
    };

    $scope.loadVibChange = function (data) {
        $scope.VibChangeDDL = [];
        $scope.defaultOASensorLocation = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisOAVibChange";
        $http.get(_url)
            .then(function (response) {
                $scope.VibChangeDDL = response.data;
                $scope.VibChangeDDL.splice(0, 0, $scope.defaultOASensorLocation);
            });
    };

    $scope.loadConfidenceFactor = function (data) {
        $scope.ConfidenceFactorDDL = [];
        $scope.defaultConfidenceFactor = {
            LookupId: null,
            LValue: "--Select--"
        }
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisConfidenceFactor";
        $http.get(_url)
            .then(function (response) {
                $scope.ConfidenceFactorDDL = response.data;
                $scope.ConfidenceFactorDDL.splice(0, 0, $scope.defaultConfidenceFactor);
            });
    };

    $scope.loadProbabilityFactor = function (data) {
        $scope.ProbabilityFactorDDL = [];
        $scope.defaultProbablityFactor = {
            LookupId: null,
            LValue: "--Select--"
        }
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisFailureProbability";
        $http.get(_url)
            .then(function (response) {
                $scope.ProbabilityFactorDDL = response.data;
                $scope.ProbabilityFactorDDL.splice(0, 0, $scope.defaultProbablityFactor);
            });
    }

    $scope.loadPriority = function (data) {
        $scope.PriorityDDL = [];
        $scope.defaultPriority = {
            LookupId: null,
            LValue: "--Select--"
        }
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisPriority";
        $http.get(_url)
            .then(function (response) {
                $scope.PriorityDDL = response.data;
                $scope.PriorityDDL.splice(0, 0, $scope.defaultPriority);
            });
    }

    $scope.loadFrequency = function (data, val) {
        $scope.defaultFailureCause = {
            FailureCauseId: 0,
            FailureCauseName: "--SELECT--"
        }
        var _url = "/taxonomy/GetLoadListItem?Type=FailureCause&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                var a = response.data;
                switch (val) {
                    case 0:
                        $scope.FaultsDDL0 = a;
                        $scope.FaultsDDL0.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 1:
                        $scope.FaultsDDL1 = a;
                        $scope.FaultsDDL1.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 2:
                        $scope.FaultsDDL2 = a;
                        $scope.FaultsDDL2.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 3:
                        $scope.FaultsDDL3 = a;
                        $scope.FaultsDDL3.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 4:
                        $scope.FaultsDDL4 = a;
                        $scope.FaultsDDL4.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 5:
                        $scope.FaultsDDL5 = a;
                        $scope.FaultsDDL5.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 6:
                        $scope.FaultsDDL6 = a;
                        $scope.FaultsDDL6.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 7:
                        $scope.FaultsDDL7 = a;
                        $scope.FaultsDDL7.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 8:
                        $scope.FaultsDDL8 = a;
                        $scope.FaultsDDL8.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 9:
                        $scope.FaultsDDL9 = a;
                        $scope.FaultsDDL9.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 10:
                        $scope.FaultsDDL10 = a;
                        $scope.FaultsDDL10.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 11:
                        $scope.FaultsDDL11 = a;
                        $scope.FaultsDDL11.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 12:
                        $scope.FaultsDDL12 = a;
                        $scope.FaultsDDL12.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 13:
                        $scope.FaultsDDL13 = a;
                        $scope.FaultsDDL13.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 14:
                        $scope.FaultsDDL14 = a;
                        $scope.FaultsDDL14.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 15:
                        $scope.FaultsDDL15 = a;
                        $scope.FaultsDDL15.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    case 16:
                        $scope.FaultsDDL16 = a;
                        $scope.FaultsDDL16.splice(0, 0, $scope.defaultFailureCause);
                        break;
                    default:
                }
            });
    };

    $scope.loadOAInFault = function (data) {
        $scope.defaultFailureCause = {
            FailureCauseId: 0,
            FailureCauseName: "--SELECT--"
        }
        var _url = "/taxonomy/GetLoadListItem?Type=FailureCause&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                var a = response.data;
                $scope.FaultsDDL = response.data;
                $scope.FaultsDDL.splice(0, 0, $scope.defaultFailureCause);
            });
    };

    $scope.loadFailureMode = function (data) {
        $scope.FailureModeDDL = [];
        $scope.defaultFailureMode = {
            FailureModeId: 0,
            FailureModeName: "--SELECT--"
        }
        var _url = "/taxonomy/GetLoadListItem?Type=FailureModeByAsset&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.FailureModeDDL = response.data;
                $scope.FailureModeDDL.splice(0, 0, $scope.defaultFailureMode);
            });
    };

    $scope.loadIndicatedFaults = function (data) {
        $scope.IndicatedFaultDDL = [];
        $scope.defaultOASensorDirection = {
            LookupId: null,
            LValue: "--Select--"
        };

        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=DiagnosisOASensorDirection";
        $http.get(_url)
            .then(function (response) {
                $scope.IndicatedFaultDDL = response.data;
                $scope.IndicatedFaultDDL.splice(0, 0, $scope.defaultOASensorDirection);
            });
    };

    $scope.loadEquipmentByJob = function (data) {
        if (!data) {
            data = null;
        }
        var _url = "/ReportFeeder/GetEquipmentsByJob?jId=" + $scope.SelectedJob.JobId + "&lId=" + $scope.language.LanguageId + "&statusId=0&ServiceId=" + data;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts1.data = response.data;
            });
    }

    $scope.OpenEqComment = function (data, val) {
        for (i = 0; i <= $scope.gridOpts1.data.length; i++) {
            if ($scope.gridOpts1.data[i].EquipmentId == data && $scope.gridOpts1.data[i].ServiceId == val) {
                $scope.EquipStatus($scope.gridOpts1.data[i]);
                break;
            }
        }
    }

    //Equipment List for Job Id
    $scope.Trending = function (data, val) {
        $scope.isEqActive = true;
        $scope.isunitActive = false;
        $scope.SelectedJob.JobId = data.JobId;
        $scope.SelectedJob.JobNumber = data.JobNumber;
        $scope.SelectedJob.JobName = data.JobName;
        $scope.SelectedJob.DataCollectionDate = new Date(data.EstStartDate);
        $scope.SelectedJob.ReportDate = new Date();
        $scope.next('stage1', val);
        //$scope.loadEquipmentByJob(val);

    };

    $scope.loadAssigned = function () {
        //var _url = "/Manufacturer/GetManufactureByStatus?lId=" + $scope.language.LanguageId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.AssignedToDDL = response.data;
            });
    };

    $scope.Status = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfStatus.html',
            controller: 'skfStatusCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId, "ClientSiteId": $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadData();

            } else {
                $scope.loadData();
            }
        }, function () {

        });
    };

    //Equipment Unit
    $scope.columns1 = [
        {
            name: 'sno', displayName: '#', cellClass: getCellClass, width: "3%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass, enableColumnResizing: true, width: "13%", minWidth: 100
        },
        {
            name: 'ServiceName', displayName: 'Service Name', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 100
        },
        {
            name: 'DataCollectionDate', displayName: 'DC Date', cellClass: getCellClass, enableColumnResizing: true, width: "3%", minWidth: 100, cellFilter: 'date:\'dd/MM/yyyy\''
        },
        {
            name: 'ReportDate', displayName: 'Report Date', cellClass: getCellClass, enableColumnResizing: true, width: "3%", minWidth: 100, cellFilter: 'date:\'dd/MM/yyyy\''
        },
        {
            name: 'IsWorkNotification', displayName: 'Work Notification', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 100
        },
        {
            name: 'OpenWorkNotifications', displayName: 'Open WN', cellClass: getCellClass, enableColumnResizing: true, width: "2%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents openwn-status" ng-hide={{row.entity.OpenWorkNotifications==0}}>&nbsp;{{row.entity.OpenWorkNotifications}}&nbsp;&nbsp;<span class="worknotification-status" ng-class="{wncolor:row.entity.OpenWorkNotifications > 0}"><i class="fa fa-bell" tooltip-append-to-body="true" tooltip-class="customClass" uib-tooltip="You have {{row.entity.OpenWorkNotifications}} Open Work Notifications for this asset."aria-hidden="true"></i></span></div>'
        },
        {
            name: 'StatusName', displayName: 'Report Status', enableColumnResizing: true, enableCellEdit: false, width: "9%", minWidth: 100, cellClass: getCellClass,
            cellTemplate: '<div class="job-status"><span class="grid-status" ng-attr-style="border: 1px solid {{row.entity.StatusColour}};color: {{row.entity.StatusColour}}">{{row.entity.StatusName}}</span></span>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.Asset(row.entity)" ng-class="{disable:row.entity.StatusCode == \'NA\'}"<i class="fa fa-object-group icon-space-before" tooltip-append-to-body="true" uib-tooltip="Asset" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.SelectAssetList(row.entity)" ng-class="{disable:row.entity.StatusCode == \'SU\' || row.entity.StatusCode == \'C\' || row.entity.StatusCode == \'NA\' || row.entity.AssetToReport == \'0\'}"> <i class="fa fa-check-circle icon-space-before" tooltip-append-to-body="true" uib-tooltip="Select Asset" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.EquipStatus(row.entity)"<i class="fa fa-sun-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Equipment Status" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.OAPopup(row.entity)" ng-class="{disable:row.entity.IsOilProperties == \'N\'}"><i class="fa fa-dropbox icon-space-before" tooltip-append-to-body="true" uib-tooltip="Equipment Oil Properties" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.LeverageService(row.entity)" ng-class="{enable: (row.entity.StatusCode == \'SU\' && row.entity.IsWorkNotification == \'Y\'), disable: \'true\'}"> <i class="fa fa fa-random icon-space-before" tooltip-append-to-body="true" uib-tooltip="Leverage Service" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "15%",
            minWidth: 100
        }
    ];

    $scope.gridOpts1 = {
        columnDefs: $scope.columns1,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
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
        exporterExcelFilename: 'EMaintenance_Equipment.xlsx',
        exporterExcelSheetName: 'EMaintenance_Equipment',
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

    $scope.Asset = function (row) {
        $scope.isunitActive = true;
        $scope.EstatusId = row.StatusId;
        $scope.jobEquipmentId = row.JobEquipmentId;
        $scope.loadDrive(row);
        $scope.ActEndDate = new Date(row.ActEndDate);
        $scope.ActStartDate = new Date(row.ActStartDate);
        $scope.EstEndDate = new Date(row.EstEndDate);
        $scope.EstStartDate = new Date(row.EstStartDate);
        $scope.JobId = row.JobId;
        $scope.JobName = row.JobName;
        $scope.JobNumber = row.JobNumber;
        $scope.PlantAreaId = row.PlantAreaId;
        $scope.PlantAreaName = row.PlantAreaName;

    };

    $scope.EquipStatus = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfEquipStatus.html',
            controller: 'skfEquipStatusCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId, 'DataColDate': $scope.SelectedJob.DataCollectionDate, 'ClientSiteId': $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadEquipmentByJob();
                $http.get("/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=JobProcessStatus")
                    .then(function (response) {
                        if (response.data && response.data.length > 0) {
                            $scope.jobStatusList = response.data;
                            angular.forEach($scope.jobStatusList, function (val, i) {
                                if (val.LookupId == data && val.LookupCode == 'SU') {
                                    var _url = "/ReportFeeder/GetEquipmentsByJob?jId=" + $scope.SelectedJob.JobId + "&lId=" + $scope.language.LanguageId + "&statusId=0&ServiceId=null";
                                    $http.get(_url)
                                        .then(function (response) {
                                            angular.forEach(response.data, function (val, i) {
                                                if (val.JobEquipmentId == row.JobEquipmentId && val.IsWorkNotification == 'Y') {
                                                    $scope.LeverageService(val);
                                                }
                                            });
                                        });
                                }
                            });
                        }
                    });


            } else {
                $scope.loadEquipmentByJob();
            }

        }, function () {

        });
    };

    //Leverage Service Pop up
    $scope.LeverageService = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfLeverageService.html',
            controller: 'skfLeverageServiceCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.selectedRow = data;
            }
        }, function () {

        });
    };

    //Drive Unit
    $scope.columns2 = [
        {
            name: 'sno', displayName: '#', width: "4%", cellClass: getCellClass, minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'UnitType', displayName: 'Unit Type', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100,
        },
        {
            name: 'AssetName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "18%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-ServiceName"><a ng-click="grid.appScope.viewDetailRow(row.entity)">{{row.entity.AssetName}}</a></div>'
        },
        {
            name: 'ServiceName', displayName: 'Reporting Services', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 100,

        },
        {
            name: 'IsWorkNotification', displayName: 'Work Notification', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100
        },
        {
            name: 'OpenWorkNotifications', displayName: 'Open WN', cellClass: getCellClass, enableColumnResizing: true, width: "4%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents openwn-status" ng-hide={{row.entity.OpenWorkNotifications==0}}>&nbsp;{{row.entity.OpenWorkNotifications}}&nbsp;&nbsp;<span class="worknotification-status" ng-class="{wncolor:row.entity.OpenWorkNotifications > 0}"><i class="fa fa-bell"tooltip-append-to-body="true" uib-tooltip="You have {{row.entity.OpenWorkNotifications}} Open Work Notifications for this asset." aria-hidden="true" tooltip-class="customClass"></i></span></div>'
        },
        {
            name: 'DataValidationStatus', displayName: 'Data Status', enableColumnResizing: true, enableCellEdit: false, width: "13%", minWidth: 100, cellClass: getCellClass,
            cellTemplate: '<div class="job-status"><span class="grid-status" tooltip-append-to-body="true" uib-tooltip={{row.entity.DatavalidationText}} tooltip-class="customClass import-tooltip" ng-attr-style="border: 1px solid {{row.entity.StatusColour}};color: {{row.entity.StatusColour}}">{{row.entity.DataValidationStatus}}</span></span>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.FeedReport(row.entity)" ng-class="{disable:row.entity.IsEditable == 0 || row.entity.DataCollectionDone == 0}"><i class="fa fa-window-restore  icon-space-before" tooltip-append-to-body="true" uib-tooltip="Report Data" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.editDriveRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Drive" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.viewDriveRow(row.entity)"><i class="fa fa-info icon-space-before" tooltip-append-to-body="true" uib-tooltip="View Drive" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.UnitStatus(row.entity)"<i class="fa fa-sun-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Status" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.FileUpload(row.entity)" ng-class="{disable:row.entity.StatusCode == \'N\'}" <i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "8%",
            minWidth: 100
        }
    ];

    $scope.isNoNext = false;
    $scope.isNoPre = false;
    $scope.FeedReport = function (data) {
        $scope.readOnlyDetailsPage = false;
        $scope.attachData = data;
        if (data.DataCollectionDone) {
            for (i = 0; i <= $scope.gridOpts2.data.length; i++) {
                if (data.UnitType == $scope.gridOpts2.data[i].UnitType && data.UnitId == $scope.gridOpts2.data[i].UnitId) {
                    $scope.sno = i;
                    break;
                }
            }

            if ($scope.sno == 0) {
                $scope.isNoPre = true;
            } else {
                $scope.isNoPre = false;
            }
            if ($scope.sno == $scope.gridOpts2.data.length - 1) {
                $scope.isNoNext = true;
            } else {
                $scope.isNoNext = false;
            }

            switch (data.UnitType) {
                case 'DR':
                    $scope.FeedData(data);
                    break;
                case 'IN':
                    $scope.FeedData1(data);
                    break;
                case 'DN':
                    $scope.FeedData2(data);
                    break;
            }
        }
    }

    $scope.viewDetailRow = function (data) {
        $scope.readOnlyDetailsPage = true;
        switch (data.UnitType) {
            case 'DR':
                $scope.viewDriveRow(data);
                break;
            case 'IN':
                $scope.viewInterRow(data);
                break;
            case 'DN':
                $scope.viewDrivenRow(data);
                break;
        }
    }

    $scope.AssetChange = function (val) {
        for (i = 0; i <= $scope.gridOpts2.data.length; i++) {
            if ($scope.sno === i && val == 'Next') {
                i = i + 1;
                $scope.FeedReport($scope.gridOpts2.data[i]);
                break;
            } else if ($scope.sno === i && val == 'Pre') {
                i = i - 1;
                $scope.FeedReport($scope.gridOpts2.data[i]);
                break;
            }
        }
    }

    $scope.ValidationPopup = function (_d) {
        var modalInstance = $uibModal.open({
            templateUrl: 'ValidationPopupModal.html',
            controller: 'ValidationPopModalCtrl',
            windowClass: 'alert-popup',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return {};
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.AssetChange(_d);
            }
        }, function () {
        });
    };

    $scope.ValidateQc = function (_data, val) {
        var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + $scope.jobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts2.data = response.data;
                for (i = 0; i < response.data.length; i++) {
                    if (response.data[i].UnitAnalysisId == _data) {
                        if (response.data[i].DataValidationStatus == 'QC Failed') {
                            $scope.ValidationPopup(val);
                            break;
                        } else {
                            $scope.AssetChange(val);
                        }
                    }
                }
            });
    }

    $scope.SaveAssetChange = function (data, val) {
        switch (val) {
            case 'DR':
                $scope.saveDrive($scope.D_Data, 'SA');
                setTimeout(function () {
                    if ($scope.D_Data == 'VA') {
                        $scope.ValidateQc($scope.v_Drive.UnitAnalysisId, data);
                    } else if ($scope.D_Data == 'OA') {
                        $scope.ValidateQc($scope.o_Drive.UnitAnalysisId, data);
                    }
                }, 20);

                break;
            case 'IN':
                $scope.saveInter($scope.I_Data, 'SA');
                setTimeout(function () {
                    if ($scope.I_Data == 'VA') {
                        $scope.ValidateQc($scope.v_Intermediate.UnitAnalysisId, data);
                    } else if ($scope.I_Data == 'OA') {
                        $scope.ValidateQc($scope.o_Inter.UnitAnalysisId, data);
                    }
                }, 20);
                break;
            case 'DN':
                $scope.saveDriven($scope.Dn_Data, 'SA');
                setTimeout(function () {
                    if ($scope.Dn_Data == 'VA') {
                        $scope.ValidateQc($scope.v_Driven.UnitAnalysisId, data);
                    } else if ($scope.Dn_Data == 'OA') {
                        $scope.ValidateQc($scope.o_Driven.UnitAnalysisId, data);
                    }
                }, 20);
                break;
        }
    }

    $scope.gridOpts2 = {
        columnDefs: $scope.columns2,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
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
        exporterExcelFilename: 'EMaintenance_Drive.xlsx',
        exporterExcelSheetName: 'EMaintenance_Drive',
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

    $scope.searchDriveToggle = function (data) {
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = true;
        $scope.isViewDrive = false;

        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;
        if (data == 'back') {
            $scope.loadDrive();
        }
        $scope.ServiceName = "";
        //$scope.gridOpts2.data = [];
    };

    $scope.FeedData = function (row) {
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };

        $scope.ServiceName = row.ServiceName;
        $scope.SColor = row.StatusColour;
        $scope.UType = row.UnitType;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.isDrive1 = false;
        $scope.isDrive2 = false;
        $scope.D_Data = "";
        $scope.isCreateDrive = true;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;
        $scope.isViewDrive = false;

        $scope.readOnlyDrivePage = false;

        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;

        $scope.clearModal();

        $scope.UnitId = row.UnitId;
        $scope.JobEquipmentId = row.JobEquipmentId;
        $scope.ServiceId = row.ServiceId;
        $scope.EquipmentId = row.EquipmentId;

        $scope.EquipmentName = row.EquipmentName;
        $scope.StatusId = row.StatusId;
        $scope.StatusName = row.StatusName;
        $scope.DrAssetName = row.AssetName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.D_Data = "OA";
            $scope.isDrive1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DR&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Drive = response.data;
                        $scope.Drive = response.data;
                        $scope.isEditDrive = true;
                        $scope.isCreateDrive = false;
                        $scope.OADriveData = [];
                        //$scope.VADriveData = $scope.v_Drive.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OADriveData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            //$scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Drive.Symptoms = val.Symptoms;
                            $scope.o_Drive.FailureModeId = val.FailureModeId;
                            $scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OADriveData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OADriveData, function (val, i) {
                                $scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Drive.Symptoms = val.Symptoms;
                                $scope.o_Drive.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }

        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isDrive2 = true;
            $scope.D_Data = "VA";

            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $scope.isEditDrive = true;
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DR&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Drive = response.data;
                        $scope.Drive = response.data;
                        $scope.isEditDrive = true;
                        $scope.isCreateDrive = false;

                        $scope.VADriveData = $scope.v_Drive.JobUnitSymptomsList;
                        angular.forEach($scope.VADriveData, function (val, i) {
                            if (val.FailureModeId) {
                                $scope.loadFrequency(val.FailureModeId, i);
                            }
                        });
                        $scope.AmplitudeDrive = $scope.v_Drive.JobUnitAmplitudeList;
                        if ($scope.AmplitudeDrive == null) {
                            var a = 0;
                        } else {
                            var a = $scope.AmplitudeDrive.length;
                        }

                        setTimeout(function () {
                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeDrive.push(b);
                            }
                        }, 500);
                    });

            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VADriveData = JSON.parse(val.JobUnitSymptomsListJson);
                        })
                    });

                $scope.AmplitudeDrive = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }

    }

    $scope.viewDriveRow = function (row) {
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };

        $scope.ServiceName = row.ServiceName;
        $scope.SColor = row.StatusColour;
        $scope.UType = row.UnitType;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.isDrive1 = false;
        $scope.isDrive2 = false;
        $scope.D_Data = "";
        $scope.readOnlyDrivePage = true;
        $scope.isViewDrive = true;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;
        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;

        $scope.clearModal();

        $scope.UnitId = row.UnitId;
        $scope.JobEquipmentId = row.JobEquipmentId;
        $scope.ServiceId = row.ServiceId;
        $scope.EquipmentId = row.EquipmentId;

        $scope.EquipmentName = row.EquipmentName;
        $scope.StatusId = row.StatusId;
        $scope.StatusName = row.StatusName;
        $scope.DrAssetName = row.AssetName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.D_Data = "OA";
            $scope.isDrive1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DR&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Drive = response.data;
                        $scope.Drive = response.data;
                        $scope.isEditDrive = true;
                        $scope.isCreateDrive = false;
                        $scope.OADriveData = [];
                        //$scope.VADriveData = $scope.v_Drive.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OADriveData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            //$scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Drive.Symptoms = val.Symptoms;
                            $scope.o_Drive.FailureModeId = val.FailureModeId;
                            $scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OADriveData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OADriveData, function (val, i) {
                                $scope.o_Drive.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Drive.Symptoms = val.Symptoms;
                                $scope.o_Drive.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }

        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isDrive2 = true;
            $scope.D_Data = "VA";
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $scope.isEditDrive = true;
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DR&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Drive = response.data;
                        $scope.Drive = response.data;
                        $scope.isEditDrive = true;
                        $scope.isCreateDrive = false;

                        $scope.VADriveData = $scope.v_Drive.JobUnitSymptomsList;
                        angular.forEach($scope.VADriveData, function (val, i) {
                            $scope.loadFrequency(val.FailureModeId, i);
                        });
                        $scope.AmplitudeDrive = $scope.v_Drive.JobUnitAmplitudeList;
                        if ($scope.AmplitudeDrive == null) {
                            var a = 0;
                        } else {
                            var a = $scope.AmplitudeDrive.length;
                        }

                        setTimeout(function () {
                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeDrive.push(b);
                            }
                        }, 500);
                    });

            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VADriveData = JSON.parse(val.JobUnitSymptomsListJson);
                        })
                    });

                $scope.AmplitudeDrive = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }

    }

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Drive = {
            AssetId: 0,
            AssetName: null,
            AssetConditionCode: 0,
            ConditionId: null

        };

        $scope.AmplitudeDrive = [{
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        }
        ]

        angular.forEach($scope.VADriveData, function (val, i) {
            val.IndicatedFaultId = 0;
            val.FailureModeId = 0;
            val.Symptoms = null;
        });


        $scope.v_Drive = {
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            WorkNotification: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null,
            OAVibration: null,
            OAGELevelPkPk: null,
            OASensorDirection: null,
            OASensorLocation: null,
            OAVibChangePercentage: null,
            JobUnitSymptomsList: []
        };

        $scope.o_Drive = {
            FailureModeId: 0,
            Symptoms: null,
            IndicatedFaultId: 0,
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null
        };

        $scope.resetForm();
    };

    $scope.saveDrive = function (data, value) {
        if (data == 'VA') {
            for (i = 0; i < $scope.VADriveData.length; i++) {
                if ($scope.VADriveData[i].IndicatedFaultId != 0) {
                    if ($scope.VADriveData[i].Symptoms != "") {
                        $scope.isSymptomValidate = true;
                    } else {
                        $scope.isSymptomValidate = false;
                        break;
                    }
                    $scope.isSymptomValidate = true;
                }
            }

            if ($scope.v_Drive.UnitAnalysisId == null) {
                $scope.v_Drive.UnitAnalysisId = 0;
            }

            var _postdata = {
                "UnitAnalysisId": $scope.v_Drive.UnitAnalysisId,
                "UnitId": $scope.UnitId,
                "JobEquipmentId": $scope.JobEquipmentId,
                "ServiceId": $scope.ServiceId,
                "Comment": $scope.v_Drive.Comment,
                "ConditionId": $scope.Drive.ConditionId,
                "EquipmentId": $scope.EquipmentId,
                "EquipmentName": $scope.EquipmentName,
                "StatusId": $scope.StatusId,
                "StatusName": $scope.StatusName,
                "UnitType": "DR",
                "JobUnitAmplitudeList": $scope.AmplitudeDrive,
                "JobUnitSymptomsList": $scope.VADriveData,
                "ConfidentFactorId": $scope.v_Drive.ConfidentFactorId,
                "FailureProbFactorId": $scope.v_Drive.FailureProbFactorId,
                "PriorityId": $scope.v_Drive.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Drive.WorkNotification,
                "NoOfDays": $scope.v_Drive.NoOfDays,
                "Recommendation": $scope.v_Drive.Recommendation,
            };
        } else {

            angular.forEach($scope.OADriveData, function (val, i) {
                val.IndicatedFaultId = $scope.o_Drive.IndicatedFaultId;
                val.Symptoms = $scope.o_Drive.Symptoms;
                val.FailureModeId = $scope.o_Drive.FailureModeId;
            });

            if ($scope.o_Drive.UnitAnalysisId == null) {
                $scope.o_Drive.UnitAnalysisId = 0;
            }

            for (i = 0; i < $scope.OADriveData.length; i++) {
                if ($scope.OADriveData[i].IndicatedFaultId != 0) {
                    if ($scope.OADriveData[i].Symptoms != "") {
                        $scope.isSymptomValidate = true;
                    } else {
                        $scope.isSymptomValidate = false;
                        break;
                    }
                    $scope.isSymptomValidate = true;
                }
            }

            _postdata = {
                "UnitAnalysisId": $scope.o_Drive.UnitAnalysisId,
                "JobEquipmentId": $scope.JobEquipmentId,
                "ServiceId": $scope.ServiceId,
                "Comment": $scope.o_Drive.Comment,
                "UnitId": $scope.UnitId,
                "ConditionId": $scope.Drive.ConditionId,
                "EquipmentId": $scope.EquipmentId,
                "EquipmentName": $scope.EquipmentName,
                "StatusId": $scope.StatusId,
                "StatusName": $scope.StatusName,
                "UnitType": "DR",
                "ConfidentFactorId": $scope.o_Drive.ConfidentFactorId,
                "FailureProbFactorId": $scope.o_Drive.FailureProbFactorId,
                "PriorityId": $scope.o_Drive.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Drive.WorkNotification,
                "NoOfDays": $scope.o_Drive.NoOfDays,
                "Recommendation": $scope.o_Drive.Recommendation,
                "JobUnitSymptomsList": $scope.OADriveData

            };
        }

        if (_postdata) {
            var _postUrl = "/ReportFeeder/Create";
            $scope.isProcess = true;
            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data.isException) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }
                else {
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });

                }
                if (value == 'SU') {
                    $scope.QCFailed = false;
                    var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + $scope.jobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
                    $http.get(_url)
                        .then(function (response) {
                            $scope.gridOpts2.data = response.data;
                            for (i = 0; i < response.data.length; i++) {
                                if (response.data[i].DataValidationStatus == 'QC Failed') {
                                    $scope.QCFailed = false;
                                    break;
                                } else {
                                    $scope.QCFailed = true;
                                }
                            }
                            if ($scope.QCFailed) {
                                $scope.next('stage1');
                                setTimeout(function () {
                                    $scope.OpenEqComment($scope.EquipmentId, $scope.ServiceId);
                                }, 200);
                            } else {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please check the Validation Status"
                                });
                                $scope.searchDriveToggle();
                            }
                        });
                } else {
                    $scope.loadDrive('SA');
                }

                //$scope.searchDriveToggle('back');
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            });
        }
        //else if (_postdata && value == 'SM') {

        //    var _postUrl = "/ReportFeeder/Create";
        //    $scope.isProcess = true;
        //    _postdata.IsEC = 'Y';
        //    $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
        //        if (response.data.isException) {
        //            alertFactory.setMessage({
        //                type: "warning",
        //                msg: String(response.data.message),
        //                exc: String(response.data.exception)
        //            });
        //        }
        //        else {
        //            alertFactory.setMessage({
        //                msg: "Data saved Successfully."
        //            });
        //            $scope.isValidated = false;
        //            $scope.isSymptomValidate = false;
        //            $scope.searchDriveToggle('back');
        //        }
        //        $scope.isProcess = false;
        //    }, function (response) {
        //        $scope.isProcess = false;
        //        alertFactory.setMessage({
        //            type: "warning",
        //            msg: String(response.data.message),
        //            exc: String(response.data.exception)
        //        });
        //    });

        //} else {
        //    alertFactory.setMessage({
        //        type: "warning",
        //        msg: String(response.data.message),
        //        exc: String(response.data.exception)
        //    });

        //}

    };

    //$scope.updateDrive = function (data, value) {

    //    if (data == 'VA') {

    //        for (i = 0; i < $scope.VADriveData.length; i++) {
    //            if ($scope.VADriveData[i].IndicatedFaultId != 0) {
    //                if ($scope.VADriveData[i].Symptoms != "") {
    //                    $scope.isSymptomValidate = true;
    //                } else {
    //                    $scope.isSymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isSymptomValidate = true;
    //            }
    //        }

    //        var _postdata = {

    //            "UnitAnalysisId": $scope.Drive.UnitAnalysisId,
    //            "UnitId": $scope.UnitId,
    //            "JobEquipmentId": $scope.JobEquipmentId,
    //            "ServiceId": $scope.ServiceId,
    //            "Comment": $scope.v_Drive.Comment,
    //            "ConditionId": $scope.Drive.ConditionId,
    //            "EquipmentId": $scope.EquipmentId,
    //            "EquipmentName": $scope.EquipmentName,
    //            "StatusId": $scope.StatusId,
    //            "StatusName": $scope.StatusName,
    //            "UnitType": "DR",
    //            "JobUnitAmplitudeList": $scope.AmplitudeDrive,
    //            "JobUnitSymptomsList": $scope.VADriveData,
    //            "ConfidentFactorId": $scope.v_Drive.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.v_Drive.FailureProbFactorId,
    //            "PriorityId": $scope.v_Drive.PriorityId,
    //            "IsWorkNotification": 'N', // $scope.v_Drive.WorkNotification,
    //            "NoOfDays": $scope.v_Drive.NoOfDays,
    //            "Recommendation": $scope.v_Drive.Recommendation,
    //        };
    //    }
    //    else {

    //        angular.forEach($scope.OADriveData, function (val, i) {
    //            val.IndicatedFaultId = $scope.o_Drive.IndicatedFaultId;
    //            val.Symptoms = $scope.o_Drive.Symptoms;
    //            val.FailureModeId = $scope.o_Drive.FailureModeId;
    //        });

    //        for (i = 0; i < $scope.OADriveData.length; i++) {
    //            if ($scope.OADriveData[i].IndicatedFaultId != 0) {
    //                if ($scope.OADriveData[i].Symptoms != "") {
    //                    $scope.isSymptomValidate = true;
    //                } else {
    //                    $scope.isSymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isSymptomValidate = true;
    //            }
    //        }


    //        _postdata = {
    //            "UnitAnalysisId": $scope.Drive.UnitAnalysisId,
    //            "JobEquipmentId": $scope.JobEquipmentId,
    //            "ServiceId": $scope.ServiceId,
    //            "UnitId": $scope.UnitId,
    //            "Comment": $scope.o_Drive.Comment,
    //            "ConditionId": $scope.Drive.ConditionId,
    //            "EquipmentId": $scope.EquipmentId,
    //            "EquipmentName": $scope.EquipmentName,
    //            "StatusId": $scope.StatusId,
    //            "StatusName": $scope.StatusName,
    //            "UnitType": "DR",
    //            "ConfidentFactorId": $scope.o_Drive.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.o_Drive.FailureProbFactorId,
    //            "PriorityId": $scope.o_Drive.PriorityId,
    //            "IsWorkNotification": 'N', //$scope.v_Drive.WorkNotification,
    //            "NoOfDays": $scope.o_Drive.NoOfDays,
    //            "Recommendation": $scope.o_Drive.Recommendation,
    //            "JobUnitSymptomsList": $scope.OADriveData

    //        };
    //    }

    //    if (_postdata && value == 'UP') {

    //        var _postUrl = "/ReportFeeder/Update";
    //        $scope.isProcess = true;
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data updated Successfully."
    //                });
    //                $scope.searchDriveToggle('back');

    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });
    //    } else if (_postdata && value == 'US') {

    //        var _postUrl = "/ReportFeeder/update";
    //        _postdata.IsEC = 'Y';
    //        $scope.isProcess = true;
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data Updated Successfully."
    //                });
    //                $scope.isValidated = false;
    //                $scope.isSymptomValidate = false;
    //                $scope.searchDriveToggle('back');
    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });

    //    } else {
    //        alertFactory.setMessage({
    //            type: "warning",
    //            msg: String(response.data.message),
    //            exc: String(response.data.exception)
    //        });
    //    }

    //};

    $scope.UnitStatus = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfUnitStatus.html',
            controller: 'skfUnitStatusCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadDrive();
            }
        }, function () {

        });
    };

    $scope.searchInterToggle = function (data) {
        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = true;
        $scope.isViewInter = false;

        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;

        $scope.ServiceName = "";
        //if (data == 'back') {
        //    $scope.loadInter();
        //}
        //$scope.gridOpts3.data = [];
    };

    $scope.FeedData1 = function (row) {
        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };
        $scope.UType = row.UnitType;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.SColor = row.StatusColour;
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL9 = $scope.FaultsDDL10 = $scope.FaultsDDL11 = $scope.FaultsDDL12 = $scope.FaultsDDL13 = $scope.FaultsDDL14 = $scope.FaultsDDL15 = $scope.FaultsDDL16 = [];
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.ServiceName = row.ServiceName;
        $scope.isInter1 = false;
        $scope.isInter2 = false;
        $scope.isCreateInter = true;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;

        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;
        $scope.clearInterModal();
        $scope.InAssetName = row.AssetName;

        $scope.IUnitId = row.UnitId;
        $scope.IJobEquipmentId = row.JobEquipmentId;
        $scope.IServiceId = row.ServiceId;
        $scope.IEquipmentId = row.EquipmentId;

        $scope.IEquipmentName = row.EquipmentName;
        $scope.IStatusId = row.StatusId;
        $scope.IStatusName = row.StatusName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.I_Data = "OA";
            $scope.isInter1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=IN&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Inter = response.data;
                        $scope.Intermediate = response.data;
                        $scope.isEditInter = true;
                        $scope.isCreateInter = false;
                        $scope.OAInterData = [];
                        //$scope.VAInterData = $scope.v_Intermediate.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OAInterData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            $scope.o_Inter.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Inter.Symptoms = val.Symptoms;
                            $scope.o_Inter.FailureModeId = val.FailureModeId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=IN&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OAInterData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OAInterData, function (val, i) {
                                $scope.o_Inter.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Inter.Symptoms = val.Symptoms;
                                $scope.o_Inter.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }

        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isInter2 = true;
            $scope.I_Data = "VA";
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $scope.isEditInter = true;
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=IN&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Intermediate = response.data;
                        $scope.Intermediate = response.data;
                        $scope.isEditInter = true;
                        $scope.isCreateInter = false;

                        $scope.VAInterData = $scope.v_Intermediate.JobUnitSymptomsList;
                        angular.forEach($scope.VAInterData, function (val, i) {
                            if (val.FailureModeId) {
                                $scope.loadFrequency(val.FailureModeId, i);
                            }
                        });
                        $scope.AmplitudeInter = $scope.v_Intermediate.JobUnitAmplitudeList;

                        if ($scope.AmplitudeInter == null) {
                            var a = 0;
                        } else {
                            a = $scope.AmplitudeInter.length;
                        }
                        setTimeout(function () {

                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeInter.push(b);
                            }
                        }, 500);
                    });

            } else {

                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=IN&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VAInterData = JSON.parse(val.JobUnitSymptomsListJson);

                        })
                    });

                $scope.AmplitudeInter = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }
    }

    $scope.viewInterRow = function (row) {

        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };
        $scope.UType = row.UnitType;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.SColor = row.StatusColour;
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL9 = $scope.FaultsDDL10 = $scope.FaultsDDL11 = $scope.FaultsDDL12 = $scope.FaultsDDL13 = $scope.FaultsDDL14 = $scope.FaultsDDL15 = $scope.FaultsDDL16 = [];
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.ServiceName = row.ServiceName;
        $scope.isInter1 = false;
        $scope.isInter2 = false;
        $scope.D_Data = "";
        $scope.readOnlyInterPage = true;
        $scope.isViewInter = true;
        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;

        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;

        $scope.clearInterModal();

        $scope.InAssetName = row.AssetName;

        $scope.IUnitId = row.UnitId;
        $scope.IJobEquipmentId = row.JobEquipmentId;
        $scope.IServiceId = row.ServiceId;
        $scope.IEquipmentId = row.EquipmentId;

        $scope.IEquipmentName = row.EquipmentName;
        $scope.IStatusId = row.StatusId;
        $scope.IStatusName = row.StatusName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.I_Data = "OA";
            $scope.isInter1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=IN&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Inter = response.data;
                        $scope.Intermediate = response.data;
                        $scope.isEditInter = true;
                        $scope.isCreateInter = false;
                        $scope.OAInterData = [];
                        //$scope.VAInterData = $scope.v_Intermediate.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OAInterData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            $scope.o_Inter.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Inter.Symptoms = val.Symptoms;
                            $scope.o_Inter.FailureModeId = val.FailureModeId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=IN&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OAInterData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OAInterData, function (val, i) {
                                $scope.o_Inter.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Inter.Symptoms = val.Symptoms;
                                $scope.o_Inter.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }

        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isInter2 = true;
            $scope.I_Data = "VA";
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $scope.isEditInter = true;
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=IN&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Intermediate = response.data;
                        $scope.Intermediate = response.data;
                        $scope.isEditInter = true;
                        $scope.isCreateInter = false;

                        $scope.VAInterData = $scope.v_Intermediate.JobUnitSymptomsList;
                        angular.forEach($scope.VAInterData, function (val, i) {
                            $scope.loadFrequency(val.FailureModeId, i);
                        });
                        $scope.AmplitudeInter = $scope.v_Intermediate.JobUnitAmplitudeList;

                        if ($scope.AmplitudeInter == null) {
                            var a = 0;
                        } else {
                            a = $scope.AmplitudeInter.length;
                        }
                        setTimeout(function () {

                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeInter.push(b);
                            }
                        }, 500);
                    });

            } else {

                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=IN&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VAInterData = JSON.parse(val.JobUnitSymptomsListJson);

                        })
                    });

                $scope.AmplitudeInter = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }
    }

    $scope.clearInterModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Intermediate = {
            AssetId: 0,
            AssetName: null,
            AssetConditionCode: null,
            ConditionId: null
        };
        $scope.v_Intermediate = {
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            WorkNotification: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null

        };
        $scope.o_Inter = {
            Symptoms: null,
            IndicatedFaultId: 0,
            FailureModeId: 0,
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            WorkNotification: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null

        };

        $scope.AmplitudeInter = [{
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        }
        ]

        angular.forEach($scope.VAInterData, function (val, i) {
            val.IndicatedFaultId = 0;
            val.Symptoms = null;
            val.FailureModeId = 0;
        });

        $scope.resetForm();
    };

    $scope.saveInter = function (data, value) {
        if (data == 'VA') {
            for (i = 0; i < $scope.VAInterData.length; i++) {
                if ($scope.VAInterData[i].IndicatedFaultId != 0) {
                    if ($scope.VAInterData[i].Symptoms != "") {
                        $scope.isISymptomValidate = true;
                    } else {
                        $scope.isISymptomValidate = false;
                        break;
                    }
                    $scope.isISymptomValidate = true;
                }
            }
            if ($scope.v_Intermediate.UnitAnalysisId == null) {
                $scope.v_Intermediate.UnitAnalysisId = 0;
            }

            var _postdata = {

                "UnitAnalysisId": $scope.v_Intermediate.UnitAnalysisId,
                "JobEquipmentId": $scope.IJobEquipmentId,
                "ServiceId": $scope.IServiceId,
                "Comment": $scope.v_Intermediate.Comment,
                "ConditionId": $scope.Intermediate.ConditionId,
                "EquipmentId": $scope.IEquipmentId,
                "EquipmentName": $scope.IEquipmentName,

                "StatusId": $scope.IStatusId,
                "StatusName": $scope.IStatusName,
                "UnitType": "IN",
                "UnitId": $scope.IUnitId,
                "JobUnitAmplitudeList": $scope.AmplitudeInter,
                "JobUnitSymptomsList": $scope.VAInterData,
                "ConfidentFactorId": $scope.v_Intermediate.ConfidentFactorId,
                "FailureProbFactorId": $scope.v_Intermediate.FailureProbFactorId,
                "PriorityId": $scope.v_Intermediate.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Intermediate.WorkNotification,
                "NoOfDays": $scope.v_Intermediate.NoOfDays,
                "Recommendation": $scope.v_Intermediate.Recommendation,
            };
        } else {
            angular.forEach($scope.OAInterData, function (val, i) {
                val.IndicatedFaultId = $scope.o_Inter.IndicatedFaultId;
                val.Symptoms = $scope.o_Inter.Symptoms;
                val.FailureModeId = $scope.o_Inter.FailureModeId;
            });

            if ($scope.o_Inter.UnitAnalysisId == null) {
                $scope.o_Inter.UnitAnalysisId = 0;
            }

            for (i = 0; i < $scope.OAInterData.length; i++) {
                if ($scope.OAInterData[i].IndicatedFaultId != 0) {
                    if ($scope.OAInterData[i].Symptoms != "") {
                        $scope.isISymptomValidate = true;
                    } else {
                        $scope.isISymptomValidate = false;
                        break;
                    }
                    $scope.isISymptomValidate = true;
                }
            }

            _postdata = {
                "UnitAnalysisId": $scope.o_Inter.UnitAnalysisId,
                "JobEquipmentId": $scope.IJobEquipmentId,
                "ServiceId": $scope.IServiceId,

                "ConditionId": $scope.Intermediate.ConditionId,
                "EquipmentId": $scope.IEquipmentId,
                "EquipmentName": $scope.IEquipmentName,
                "UnitId": $scope.IUnitId,

                "StatusId": $scope.IStatusId,
                "StatusName": $scope.IStatusName,
                "UnitType": "IN",

                "ConfidentFactorId": $scope.o_Inter.ConfidentFactorId,
                "FailureProbFactorId": $scope.o_Inter.FailureProbFactorId,
                "PriorityId": $scope.o_Inter.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Intermediate.WorkNotification,
                "NoOfDays": $scope.o_Inter.NoOfDays,
                "Recommendation": $scope.o_Inter.Recommendation,
                "Comment": $scope.o_Inter.Comment,
                "JobUnitSymptomsList": $scope.OAInterData
            };
        }

        if (_postdata) {
            var _postUrl = "/ReportFeeder/create";
            $scope.isProcess = true;
            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data.isException) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }
                else {
                    alertFactory.setMessage({
                        msg: "Data Saved Successfully."
                    });

                    //$scope.searchDriveToggle('back');
                }
                if (value == 'SU') {
                    $scope.QCFailed = false;
                    var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + $scope.jobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
                    $http.get(_url)
                        .then(function (response) {
                            $scope.gridOpts2.data = response.data;
                            for (i = 0; i < response.data.length; i++) {
                                if (response.data[i].DataValidationStatus == 'QC Failed') {
                                    $scope.QCFailed = false;
                                    break;
                                } else {
                                    $scope.QCFailed = true;
                                }
                            }
                            if ($scope.QCFailed) {
                                $scope.next('stage1');
                                setTimeout(function () {
                                    $scope.OpenEqComment($scope.IEquipmentId, $scope.IServiceId);
                                }, 200);
                            } else {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please check the Validation Status"
                                });
                                $scope.searchDriveToggle();
                            }
                        });

                } else {
                    $scope.loadDrive('SA');
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            });
        }
        //else if (_postdata && value == 'SM') {

        //    var _postUrl = "/ReportFeeder/create";
        //    $scope.isProcess = true;
        //    _postdata.IsEC = 'Y';
        //    $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
        //        if (response.data.isException) {
        //            alertFactory.setMessage({
        //                type: "warning",
        //                msg: String(response.data.message),
        //                exc: String(response.data.exception)
        //            });
        //        }
        //        else {
        //            alertFactory.setMessage({
        //                msg: "Data Saved Successfully."
        //            });
        //            $scope.searchDriveToggle('back');
        //            $scope.isValidated = false;
        //            $scope.isISymptomValidate = false;
        //        }
        //        $scope.isProcess = false;
        //    }, function (response) {
        //        $scope.isProcess = false;
        //        alertFactory.setMessage({
        //            type: "warning",
        //            msg: String(response.data.message),
        //            exc: String(response.data.exception)
        //        });
        //    });

        //} else {
        //    alertFactory.setMessage({
        //        type: "warning",
        //        msg: String(response.data.message),
        //        exc: String(response.data.exception)
        //    });
        //}

    };

    //$scope.updateInter = function (data, value) {
    //    if (data == 'VA') {
    //        for (i = 0; i < $scope.VAInterData.length; i++) {
    //            if ($scope.VAInterData[i].IndicatedFaultId != 0) {
    //                if ($scope.VAInterData[i].Symptoms != "") {
    //                    $scope.isISymptomValidate = true;
    //                } else {
    //                    $scope.isISymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isISymptomValidate = true;
    //            }
    //        }

    //        var _postdata = {

    //            "UnitAnalysisId": $scope.Intermediate.UnitAnalysisId,
    //            "JobEquipmentId": $scope.IJobEquipmentId,
    //            "ServiceId": $scope.IServiceId,
    //            "Comment": $scope.v_Intermediate.Comment,
    //            "ConditionId": $scope.Intermediate.ConditionId,
    //            "EquipmentId": $scope.IEquipmentId,
    //            "EquipmentName": $scope.IEquipmentName,

    //            "StatusId": $scope.IStatusId,
    //            "StatusName": $scope.IStatusName,
    //            "UnitType": "IN",
    //            "UnitId": $scope.IUnitId,

    //            "JobUnitAmplitudeList": $scope.AmplitudeInter,

    //            "JobUnitSymptomsList": $scope.VAInterData,

    //            "ConfidentFactorId": $scope.v_Intermediate.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.v_Intermediate.FailureProbFactorId,
    //            "PriorityId": $scope.v_Intermediate.PriorityId,
    //            "IsWorkNotification": 'N', //$scope.v_Intermediate.WorkNotification,
    //            "NoOfDays": $scope.v_Intermediate.NoOfDays,
    //            "Recommendation": $scope.v_Intermediate.Recommendation,
    //        };


    //    }
    //    else {
    //        angular.forEach($scope.OAInterData, function (val, i) {
    //            val.IndicatedFaultId = $scope.o_Inter.IndicatedFaultId;
    //            val.Symptoms = $scope.o_Inter.Symptoms;
    //            val.FailureModeId = $scope.o_Inter.FailureModeId;
    //        });

    //        for (i = 0; i < $scope.OAInterData.length; i++) {
    //            if ($scope.OAInterData[i].IndicatedFaultId != 0) {
    //                if ($scope.OAInterData[i].Symptoms != "") {
    //                    $scope.isISymptomValidate = true;
    //                } else {
    //                    $scope.isISymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isISymptomValidate = true;
    //            }
    //        }

    //        _postdata = {
    //            "UnitAnalysisId": $scope.Intermediate.UnitAnalysisId,
    //            "JobEquipmentId": $scope.IJobEquipmentId,
    //            "ServiceId": $scope.IServiceId,

    //            "ConditionId": $scope.Intermediate.ConditionId,
    //            "EquipmentId": $scope.IEquipmentId,
    //            "EquipmentName": $scope.IEquipmentName,
    //            "UnitId": $scope.IUnitId,

    //            "StatusId": $scope.IStatusId,
    //            "StatusName": $scope.IStatusName,
    //            "UnitType": "IN",

    //            "ConfidentFactorId": $scope.o_Inter.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.o_Inter.FailureProbFactorId,
    //            "PriorityId": $scope.o_Inter.PriorityId,
    //            "IsWorkNotification": 'N', //$scope.v_Intermediate.WorkNotification,
    //            "NoOfDays": $scope.o_Inter.NoOfDays,
    //            "Recommendation": $scope.o_Inter.Recommendation,
    //            "Comment": $scope.o_Inter.Comment,
    //            "JobUnitSymptomsList": $scope.OAInterData
    //        };
    //    }

    //    if (_postdata && value == 'UP') {

    //        var _postUrl = "/ReportFeeder/Update";
    //        $scope.isProcess = true;
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data Updated Successfully."
    //                });
    //                $scope.searchDriveToggle('back');

    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });
    //    } else if (_postdata && value == 'US') {
    //        var _postUrl = "/ReportFeeder/Update";
    //        $scope.isProcess = true;
    //        _postdata.IsEC = 'Y';
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data Updated Successfully."
    //                });
    //                $scope.searchDriveToggle('back');
    //                $scope.isValidated = false;
    //                $scope.isISymptomValidate = false;
    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });

    //    } else {
    //        alertFactory.setMessage({
    //            type: "warning",
    //            msg: String(response.data.message),
    //            exc: String(response.data.exception)
    //        });
    //    }
    //};

    $scope.searchDrivenToggle = function (data) {
        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = true;
        $scope.isViewDriven = false;
        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;
        $scope.ServiceName = "";
    };

    $scope.FeedData2 = function (row) {
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };
        $scope.UType = row.UnitType;
        $scope.SColor = row.StatusColour;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.ServiceName = row.ServiceName;
        $scope.isDriven1 = false;
        $scope.isDriven2 = false;
        $scope.isCreateDriven = true;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isViewDriven = false;

        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;
        $scope.clearDrivenModal();
        $scope.DnAssetName = row.AssetName;

        $scope.DUnitId = row.UnitId;
        $scope.DJobEquipmentId = row.JobEquipmentId;
        $scope.DServiceId = row.ServiceId;
        $scope.DEquipmentId = row.EquipmentId;

        $scope.DEquipmentName = row.EquipmentName;
        $scope.DStatusId = row.StatusId;
        $scope.DStatusName = row.StatusName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.Dn_Data = "OA";
            $scope.isDriven1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DN&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Driven = response.data;
                        $scope.Driven = response.data;
                        $scope.isEditDriven = true;
                        $scope.isCreateDriven = false;
                        $scope.OADrivenData = [];
                        //$scope.VADrivenData = $scope.v_Driven.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OADrivenData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            $scope.o_Driven.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Driven.Symptoms = val.Symptoms;
                            $scope.o_Driven.FailureModeId = val.FailureModeId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OADrivenData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OADrivenData, function (val, i) {
                                $scope.o_Driven.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Driven.Symptoms = val.Symptoms;
                                $scope.o_Drive.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }
        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isDriven2 = true;
            $scope.Dn_Data = "VA";
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DN&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Driven = response.data;
                        $scope.Driven = response.data;
                        $scope.isEditDriven = true;
                        $scope.isCreateDriven = false;
                        $scope.VADrivenData = $scope.v_Driven.JobUnitSymptomsList;

                        angular.forEach($scope.VADrivenData, function (val, i) {
                            if (val.FailureModeId) {
                                $scope.loadFrequency(val.FailureModeId, i);
                            }
                        });
                        $scope.AmplitudeDriven = $scope.v_Driven.JobUnitAmplitudeList;

                        if ($scope.AmplitudeDriven == null) {
                            var a = 3;
                        } else {
                            a = $scope.AmplitudeDriven.length;
                        }
                        setTimeout(function () {

                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeDriven.push(b);
                            }
                        }, 500);
                    });

            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DN&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VADrivenData = JSON.parse(val.JobUnitSymptomsListJson);
                        })
                    });

                $scope.AmplitudeDriven = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }
    }

    $scope.viewDrivenRow = function (row) {
        $scope.FaultsDDL = 0;
        $scope.FaultsDDL0 = $scope.FaultsDDL1 = $scope.FaultsDDL2 = $scope.FaultsDDL3 = $scope.FaultsDDL4 = $scope.FaultsDDL5 = $scope.FaultsDDL6 = $scope.FaultsDDL7 = $scope.FaultsDDL8 = [];
        $scope.Accstatus = {
            isFirstOpen: true,
            isSecondOpen: true,
            isThirdOpen: true
        };
        $scope.UType = row.UnitType;
        $scope.SColor = row.StatusColour;
        $scope.DataValidationStatus = row.DataValidationStatus;
        $scope.DatavalidationText = row.DatavalidationText;
        $scope.OpenWorkNotification = row.OpenWorkNotifications;
        $scope.ServiceName = row.ServiceName;
        $scope.isDriven1 = false;
        $scope.isDriven2 = false;
        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.readOnlyDrivenPage = true;
        $scope.isViewDriven = true;

        $scope.readOnlyDrivePage = false;
        $scope.isViewDrive = false;
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = false;

        $scope.isCreateInter = false;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.readOnlyInterPage = false;
        $scope.isViewInter = false;
        $scope.clearDrivenModal();
        $scope.DnAssetName = row.AssetName;

        $scope.DUnitId = row.UnitId;
        $scope.DJobEquipmentId = row.JobEquipmentId;
        $scope.DServiceId = row.ServiceId;
        $scope.DEquipmentId = row.EquipmentId;

        $scope.DEquipmentName = row.EquipmentName;
        $scope.DStatusId = row.StatusId;
        $scope.DStatusName = row.StatusName;

        if (row.ServiceName == "Oil Analysis") {
            $scope.Dn_Data = "OA";
            $scope.isDriven1 = true;
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DN&sType=OA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.o_Driven = response.data;
                        $scope.Driven = response.data;
                        $scope.isEditDriven = true;
                        $scope.isCreateDriven = false;
                        $scope.OADrivenData = [];
                        //$scope.VADrivenData = $scope.v_Driven.JobUnitSymptomsList;
                        angular.forEach(response.data.JobUnitSymptomsList, function (val, i) {
                            $scope.OADrivenData.push(val);
                            $scope.loadOAInFault(val.FailureModeId);
                            $scope.o_Driven.IndicatedFaultId = val.IndicatedFaultId;
                            $scope.o_Driven.Symptoms = val.Symptoms;
                            $scope.o_Driven.FailureModeId = val.FailureModeId;

                        });
                    });
            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DR&sType=OA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.OADrivenData = JSON.parse(val.JobUnitSymptomsListJson);
                            angular.forEach($scope.OADrivenData, function (val, i) {
                                $scope.o_Driven.IndicatedFaultId = val.IndicatedFaultId;
                                $scope.o_Driven.Symptoms = val.Symptoms;
                                $scope.o_Drive.FailureModeId = val.FailureModeId;
                            });

                        });
                    });
            }
        } else if (row.ServiceName == "Vibration Analysis") {
            $scope.isDriven2 = true;
            $scope.Dn_Data = "VA";
            $scope.loadFailureMode(row.AssetId);
            if (row.UnitAnalysisId != 0) {
                $http.get("/ReportFeeder/GetAnalysisByUnit?type=DN&sType=VA&uaId=" + row.UnitAnalysisId + "&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        $scope.v_Driven = response.data;
                        $scope.Driven = response.data;
                        $scope.isEditDriven = true;
                        $scope.isCreateDriven = false;
                        $scope.VADrivenData = $scope.v_Driven.JobUnitSymptomsList;

                        angular.forEach($scope.VADrivenData, function (val, i) {
                            $scope.loadFrequency(val.FailureModeId, i);
                        });
                        $scope.AmplitudeDriven = $scope.v_Driven.JobUnitAmplitudeList;

                        if ($scope.AmplitudeDriven == null) {
                            var a = 3;
                        } else {
                            a = $scope.AmplitudeDriven.length;
                        }
                        setTimeout(function () {

                            for (i = a; i < 3; i++) {
                                var b = {
                                    "UnitAmplitudeId": 0,
                                    "UnitAnalysisId": 0,
                                    "OAVibration": null,
                                    "OAGELevelPkPk": null,
                                    "OASensorDirection": null,
                                    "OASensorLocation": null,
                                    "OAVibChangePercentage": null,
                                    "Active": "Y"
                                }
                                $scope.AmplitudeDriven.push(b);
                            }
                        }, 500);
                    });

            } else {
                $http.get("/ReportFeeder/GetSymptomsByUnitAnalysis?type=DN&sType=VA&uaId=0&lId=" + $scope.language.LanguageId)
                    .then(function (response) {
                        angular.forEach(response.data, function (val, i) {
                            $scope.VADrivenData = JSON.parse(val.JobUnitSymptomsListJson);
                        })
                    });

                $scope.AmplitudeDriven = [{
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                },
                {
                    "UnitAmplitudeId": 0,
                    "UnitAnalysisId": 0,
                    "OAVibration": null,
                    "OAGELevelPkPk": null,
                    "OASensorDirection": null,
                    "OASensorLocation": null,
                    "OAVibChangePercentage": null,
                    "Active": "Y"
                }]
            }
        }
    }

    $scope.clearDrivenModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Driven = {
            AssetId: 0,
            AssetName: null,
            AssetConditionCode: 0,
            ConditionId: null
        };

        $scope.v_Driven = {
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            WorkNotification: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null,

        };
        $scope.o_Driven = {
            Symptoms: null,
            IndicatedFaults: 0,
            FailureModeId: 0,
            ConfidentFactorId: null,
            FailureProbFactorId: null,
            PriorityId: null,
            WorkNotification: null,
            NoOfDays: 0,
            Recommendation: null,
            Comment: null

        }

        $scope.AmplitudeDriven = [{
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        },
        {
            "UnitAmplitudeId": 0,
            "UnitAnalysisId": 0,
            "OAVibration": null,
            "OAGELevelPkPk": null,
            "OASensorDirection": null,
            "OASensorLocation": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        }
        ]

        angular.forEach($scope.VADrivenData, function (val, i) {
            val.IndicatedFaultId = 0;
            val.Symptoms = null;
            val.FailureModeId = 0;
        });
        $scope.resetForm();
    };

    $scope.saveDriven = function (data, value) {

        if (data == 'VA') {
            for (i = 0; i < $scope.VADrivenData.length; i++) {
                if ($scope.VADrivenData[i].IndicatedFaultId != 0) {
                    if ($scope.VADrivenData[i].Symptoms != "") {
                        $scope.isDSymptomValidate = true;
                    } else {
                        $scope.isDSymptomValidate = false;
                        break;
                    }
                    $scope.isDSymptomValidate = true;
                }
            }

            if ($scope.v_Driven.UnitAnalysisId == null) {
                $scope.v_Driven.UnitAnalysisId = 0;
            }

            var _postdata = {
                "UnitAnalysisId": $scope.v_Driven.UnitAnalysisId,
                "JobEquipmentId": $scope.DJobEquipmentId,
                "ServiceId": $scope.DServiceId,
                "Comment": $scope.v_Driven.Comment,
                "ConditionId": $scope.Driven.ConditionId,
                "EquipmentId": $scope.DEquipmentId,
                "EquipmentName": $scope.DEquipmentName,
                "StatusId": $scope.DStatusId,
                "StatusName": $scope.DStatusName,
                "UnitType": "DN",
                "UnitId": $scope.DUnitId,
                "JobUnitAmplitudeList": $scope.AmplitudeDriven,
                "JobUnitSymptomsList": $scope.VADrivenData,

                "ConfidentFactorId": $scope.v_Driven.ConfidentFactorId,
                "FailureProbFactorId": $scope.v_Driven.FailureProbFactorId,
                "PriorityId": $scope.v_Driven.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Driven.WorkNotification,
                "NoOfDays": $scope.v_Driven.NoOfDays,
                "Recommendation": $scope.v_Driven.Recommendation,
            };

        } else {
            angular.forEach($scope.OADrivenData, function (val, i) {
                val.IndicatedFaultId = $scope.o_Driven.IndicatedFaultId;
                val.Symptoms = $scope.o_Driven.Symptoms;
                val.FailureModeId = $scope.o_Driven.FailureModeId;
            });


            if ($scope.o_Driven.UnitAnalysisId == null) {
                $scope.o_Driven.UnitAnalysisId = 0;
            }


            for (i = 0; i < $scope.OADrivenData.length; i++) {
                if ($scope.OADrivenData[i].IndicatedFaultId != 0) {
                    if ($scope.OADrivenData[i].Symptoms != "") {
                        $scope.isDSymptomValidate = true;
                    } else {
                        $scope.isDSymptomValidate = false;
                        break;
                    }
                    $scope.isDSymptomValidate = true;
                }
            }

            _postdata = {
                "UnitType": "DN",
                "UnitAnalysisId": $scope.o_Driven.UnitAnalysisId,
                "UnitId": $scope.DUnitId,
                "JobEquipmentId": $scope.DJobEquipmentId,
                "ServiceId": $scope.DServiceId,
                "Comment": $scope.o_Driven.Comment,
                "ConditionId": $scope.Driven.ConditionId,
                "StatusId": $scope.DStatusId,
                "StatusName": $scope.DStatusName,
                "ConfidentFactorId": $scope.o_Driven.ConfidentFactorId,
                "FailureProbFactorId": $scope.o_Driven.FailureProbFactorId,
                "PriorityId": $scope.o_Driven.PriorityId,
                "IsWorkNotification": 'N', //$scope.v_Driven.WorkNotification,
                "NoOfDays": $scope.o_Driven.NoOfDays,
                "Recommendation": $scope.o_Driven.Recommendation,
                "JobUnitSymptomsList": $scope.OADrivenData
            };
        }


        if (_postdata) {
            var _postUrl = "/ReportFeeder/Create";
            $scope.isProcess = true;
            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data.isException) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }
                else {
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });

                    //$scope.searchDriveToggle('back');
                }

                if (value == 'SU') {
                    $scope.QCFailed = false;
                    var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + $scope.jobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
                    $http.get(_url)
                        .then(function (response) {
                            $scope.gridOpts2.data = response.data;
                            for (i = 0; i < response.data.length; i++) {
                                if (response.data[i].DataValidationStatus == 'QC Failed') {
                                    $scope.QCFailed = false;
                                    break;
                                } else {
                                    $scope.QCFailed = true;
                                }
                            }
                            if ($scope.QCFailed) {
                                $scope.next('stage1');
                                setTimeout(function () {
                                    $scope.OpenEqComment($scope.DEquipmentId, $scope.DServiceId);
                                }, 200);
                            } else {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please check the Validation Status"
                                });
                                $scope.searchDriveToggle();
                            }
                        });

                } else {
                    $scope.loadDrive('SA');
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            });
        }
        //else if (_postdata && value == 'SM') {

        //    var _postUrl = "/ReportFeeder/create";
        //    _postdata.IsEC = 'Y';
        //    $scope.isProcess = true;
        //    $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
        //        if (response.data.isException) {
        //            alertFactory.setMessage({
        //                type: "warning",
        //                msg: String(response.data.message),
        //                exc: String(response.data.exception)
        //            });
        //        }
        //        else {
        //            alertFactory.setMessage({
        //                msg: "Data Saved Successfully."
        //            });
        //            $scope.isValidated = false;
        //            $scope.isDSymptomValidate = false;
        //            $scope.searchDriveToggle('back');
        //        }
        //        $scope.isProcess = false;
        //    }, function (response) {
        //        $scope.isProcess = false;
        //        alertFactory.setMessage({
        //            type: "warning",
        //            msg: String(response.data.message),
        //            exc: String(response.data.exception)
        //        });
        //    });

        //} else {
        //    alertFactory.setMessage({
        //        type: "warning",
        //        msg: String(response.data.message),
        //        exc: String(response.data.exception)
        //    });
        //}
    };

    //$scope.updateDriven = function (data, value) {

    //    if (data == 'VA') {

    //        for (i = 0; i < $scope.VADrivenData.length; i++) {
    //            if ($scope.VADrivenData[i].IndicatedFaultId != 0) {
    //                if ($scope.VADrivenData[i].Symptoms != "") {
    //                    $scope.isDSymptomValidate = true;
    //                } else {
    //                    $scope.isDSymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isDSymptomValidate = true;
    //            }
    //        }

    //        var _postdata = {
    //            "UnitAnalysisId": $scope.Driven.UnitAnalysisId,
    //            "JobEquipmentId": $scope.DJobEquipmentId,
    //            "ServiceId": $scope.DServiceId,
    //            "Comment": $scope.v_Driven.Comment,
    //            "ConditionId": $scope.Driven.ConditionId,
    //            "EquipmentId": $scope.DEquipmentId,
    //            "EquipmentName": $scope.DEquipmentName,
    //            "StatusId": $scope.DStatusId,
    //            "StatusName": $scope.DStatusName,
    //            "UnitType": "DN",
    //            "UnitId": $scope.DUnitId,

    //            "JobUnitAmplitudeList": $scope.AmplitudeDriven,
    //            "JobUnitSymptomsList": $scope.VADrivenData,

    //            "ConfidentFactorId": $scope.v_Driven.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.v_Driven.FailureProbFactorId,
    //            "PriorityId": $scope.v_Driven.PriorityId,
    //            "IsWorkNotification": 'N', //$scope.v_Driven.WorkNotification,
    //            "NoOfDays": $scope.v_Driven.NoOfDays,
    //            "Recommendation": $scope.v_Driven.Recommendation,
    //        };

    //    } else {

    //        angular.forEach($scope.OADrivenData, function (val, i) {
    //            val.IndicatedFaultId = $scope.o_Driven.IndicatedFaultId;
    //            val.Symptoms = $scope.o_Driven.Symptoms;
    //            val.FailureModeId = $scope.o_Driven.FailureModeId;
    //        });


    //        for (i = 0; i < $scope.OADrivenData.length; i++) {
    //            if ($scope.OADrivenData[i].IndicatedFaultId != 0) {
    //                if ($scope.OADrivenData[i].Symptoms != "") {
    //                    $scope.isDSymptomValidate = true;
    //                } else {
    //                    $scope.isDSymptomValidate = false;
    //                    break;
    //                }
    //                $scope.isDSymptomValidate = true;
    //            }
    //        }

    //        _postdata = {

    //            "UnitType": "DN",
    //            "UnitAnalysisId": $scope.Driven.UnitAnalysisId,
    //            "UnitId": $scope.DUnitId,
    //            "JobEquipmentId": $scope.DJobEquipmentId,
    //            "ServiceId": $scope.DServiceId,
    //            "Comment": $scope.o_Driven.Comment,
    //            "ConditionId": $scope.Driven.ConditionId,

    //            "ConfidentFactorId": $scope.o_Driven.ConfidentFactorId,
    //            "FailureProbFactorId": $scope.o_Driven.FailureProbFactorId,
    //            "PriorityId": $scope.o_Driven.PriorityId,
    //            "IsWorkNotification": 'N', //$scope.v_Driven.WorkNotification,
    //            "NoOfDays": $scope.o_Driven.NoOfDays,
    //            "Recommendation": $scope.o_Driven.Recommendation,
    //            "JobUnitSymptomsList": $scope.OADrivenData
    //        };
    //    }


    //    if (_postdata && value == 'UP') {

    //        var _postUrl = "/ReportFeeder/Update";
    //        $scope.isProcess = true;
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data updated Successfully."
    //                });
    //                $scope.searchDriveToggle('back');
    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });
    //    }
    //    else if (_postdata && value == 'US') {

    //        var _postUrl = "/ReportFeeder/update";
    //        _postdata.IsEC = 'Y';
    //        $scope.isProcess = true;
    //        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
    //            if (response.data.isException) {
    //                alertFactory.setMessage({
    //                    type: "warning",
    //                    msg: String(response.data.message),
    //                    exc: String(response.data.exception)
    //                });
    //            }
    //            else {
    //                alertFactory.setMessage({
    //                    msg: "Data Updated Successfully."
    //                });
    //                $scope.isValidated = false;
    //                $scope.isDSymptomValidate = false;
    //                $scope.searchDriveToggle('back');
    //            }
    //            $scope.isProcess = false;
    //        }, function (response) {
    //            $scope.isProcess = false;
    //            alertFactory.setMessage({
    //                type: "warning",
    //                msg: String(response.data.message),
    //                exc: String(response.data.exception)
    //            });
    //        });

    //    } else {
    //        alertFactory.setMessage({
    //            type: "warning",
    //            msg: String(response.data.message),
    //            exc: String(response.data.exception)
    //        });
    //    }

    //};

    $scope.OAPopup = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfOAPopup.html',
            controller: 'skfOAPopupCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, 'languageId': $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (flag) {
            if (flag) {
                $scope.loadData();
            }
        }, function () {

        });
    };

    $scope.FileUpload = function (row) {
        $scope.aId = row.UnitAnalysisId;
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAttachmentModal.html',
            controller: 'skfAttachmentCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "languageId": $scope.language.LanguageId, "aId": row.UnitAnalysisId, "Type": "UnitAnalysis", "AssetName": row.AssetName, "IsEditable": row.IsEditable };
                }
            }
        });

        modalInstance.result.then(function (data) {

        }, function () {
        });
    };

    $scope.showContent = function (code) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfCfModal.html',
            controller: 'skfCfModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: { 'code': code }
            }
        });
        modalInstance.result.then(function (data) {
        }, function () {
        });
    };

    $scope.SelectAssetList = function (row) {
        var _url = "/ReportFeeder/GetUnitsByEquipment?jId=" + row.JobEquipmentId + "&lId=" + $scope.language.LanguageId + "&statusId=" + $scope.EstatusId;
        $http.get(_url)
            .then(function (response) {
                if (response.data > 0) {
                    $scope.hasAssetList = false;
                } else {
                    $scope.hasAssetList = true;
                }
            });
        var modalInstance = $uibModal.open({
            templateUrl: 'SelectAssetModal.html',
            controller: 'SelectAssetModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.Asset(row);
                if ($scope.hasAssetList) {
                    setTimeout(function () {
                        $scope.FeedReport($scope.gridOpts2.data[0]);
                    }, 500);
                }
            }

        }, function () {

        });

    };

    $scope.DataCollectorList = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfDataCollectorModal.html',
            controller: 'skfDataCollectorModalCtrl',
            windowClass: 'failure-report-modal',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.Asset(row);
                setTimeout(function () {
                    $scope.FeedReport($scope.gridOpts2.data[0]);
                }, 500);
            }

        }, function () {

        });

    };

});

//Job Status popup controller
app.controller('skfStatusCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.jId = params.row.JobId;
    $scope.TypeId = params.row.JobId;
    $scope.CurrentStatusId = params.row.StatusId;
    $scope.JobNumber = params.row.JobNumber;
    $scope.JobName = params.row.JobName;
    $scope.StatusName = params.row.StatusName;
    $scope.IsEditable = params.row.IsEditable;
    $scope.JobReportEditable = params.row.JobReportEditable;
    $scope.ClientSiteId = params.ClientSiteId;
    $scope.AssignId = params.row.JobApprovedBy;

    if (params.row.StatusCode == 'C') {
        $scope.isJcStatus = true;
        $scope.JcStatus = params.row.StatusName;
    } else {
        $scope.isJcStatus = false;
    }

    $scope.DisabledField = function () {
        if (params.row.IsReportSentAllowed == 1) {
            $scope.ReportSentAllowed = true;
        } else {
            $scope.ReportSentAllowed = false;
        }

        if (params.row.IsDCDoneAllowed == 1) {
            $scope.isDCDoneAllowed = true;
        } else {
            $scope.isDCDoneAllowed = false;
        }

    }();


    //// Restrict Date to Future date
    if (params.row.ReportDate !== null) {
        $scope.ReportDate = new Date(params.row.ReportDate);
    } else if (params.row.ReportDate === null && $scope.JobReportEditable === 1) {
        $scope.ReportDate = new Date(params.row.ReportingDate);
    }


    if (params.row.DataCollectionDate) {
        $scope.DataCollectionDate = new Date(params.row.DataCollectionDate);
        $scope.reportdateoptions = {
            minDate: new Date(params.row.DataCollectionDate) // restrict min date to Start date
        };
    } else {
        $scope.DataCollectionDate = new Date(params.row.EstStartDate);
        $scope.reportdateoptions = {
            minDate: new Date(params.row.EstStartDate) // restrict min date to Start date
        };
    }

    //$scope.ChangeColDate = function () {
    //    if ($scope.DataCollectionDate > $scope.ReportDate) {
    //        $scope.ReportDate = "";
    //        $scope.reportdateoptions = {
    //            minDate: new Date($scope.DataCollectionDate)
    //        };
    //    } else {
    //        $scope.reportdateoptions = {
    //            minDate: new Date($scope.DataCollectionDate)
    //        };
    //    }
    //};

    $scope.loadStatus = function () {
        $scope.jobStatusList = [];
        $http.get("ReportFeeder/GetStatusByRole?type=J&csId=" + $scope.CurrentStatusId + "&lId=" + $scope.languageId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.jobStatusList = response.data;
                }
            });
    }();

    $scope.loadComments = function () {
        $http.get("/ReportFeeder/GetCommentsByType?type=J&jId=" + $scope.jId + "&lId=" + $scope.languageId)
            .then(function (response) {
                $scope.statusLogs = response.data;
            });
    }();

    $scope.dataCollection = function () {
        if (params.row.DataCollectionDone == 1) {
            $scope.Datacollection = true;
            $scope.DataCollectionStatus = 'Y';
        } else {
            $scope.Datacollection = false;
        }
    }();

    $scope.ReportSent = function () {
        if (params.row.ReportSent == 1) {
            $scope.isReportSent = true;
            $scope.ReportSentStatus = 'Y';
        } else {
            $scope.isReportSent = false;
        }
    }();

    $scope.save = function () {
        $scope._postdata = [];
        //if ($scope.skfForm.$valid && (!$scope.isProcess) && $scope.Comments != null && $scope.Comments.length > 0) {
        if (!$scope.StatusId > 0) {
            $scope.StatusId = $scope.CurrentStatusId;
        }
        if ($scope.Datacollection) {
            $scope.Datacollectiondone = 0;
        } else {
            if ($scope.DataCollectionStatus == 'Y' && !$scope.Datacollection) {
                $scope.Datacollectiondone = 1;
            } else {
                $scope.Datacollectiondone = 0;
            }
        }

        if ($scope.ReportSentStatus == 'Y') {
            $scope.reportSent = 1;
        } else {
            $scope.reportSent = 0;
        }
        if (typeof $scope.DataCollectionDate !== "undefined" && (typeof $scope.ReportDate === "undefined" || $scope.DataCollectionDate <= $scope.ReportDate)) {
            var _postdata = {
                "Comments": $scope.Comments,
                "DataCollectionDate": $filter('date')($scope.DataCollectionDate, "yyyy-MM-dd 00:00:00"),
                "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
                "StatusId": $scope.StatusId,
                "TypeId": $scope.TypeId,
                "ReviewerId": $scope.AssignId,
                "OldStatusId": params.row.StatusId,
                "Datacollectiondone": $scope.Datacollectiondone,
                "ReportSent": $scope.reportSent,
                "Type": "J"
            };

            var _postUrl = "/ReportFeeder/CreateComments/" + $scope.StatusId;
            $scope.isProcess = true;
            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data.type == 'Confirmation') {
                    $scope.confirmJobEC(response.data.message);
                }
                else {
                    alertFactory.setMessage({
                        type: "success",
                        msg: "Status saved Successfully."
                    });
                    setTimeout(function () {
                        $uibModalInstance.close($scope.StatusId);
                    }, 100);
                }
                $scope.isProcess = false;
            }, function (response) {
                if (response.data.type == 'Confirmation') {
                    $scope.confirmJobEC(response.data.message);
                } else {
                    $scope.isProcess = false;
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }

            });
        } else {
            if (typeof $scope.DataCollectionDate === "undefined") {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill date fields"
                });
            }
            else if ($scope.DataCollectionDate > $scope.ReportDate) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Data Collection date should be Lesser than Report Date"
                });
            }
        }
        //}
        //else {
        //    alertFactory.setMessage({
        //        type: "warning",
        //        msg: "Please fill Mandatory(*) Fields"
        //    });
        //}
    };

    $scope.confirmJobEC = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfJobConfirmationModal.html',
            controller: 'skfJobConfirmationCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "csId": $scope.ClientSiteId, "message": data };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                var _postdata = {
                    "TypeId": $scope.TypeId,
                    "StatusId": $scope.StatusId,
                    "DataCollectionDate": $filter('date')($scope.DataCollectionDate, "yyyy-MM-dd 00:00:00"),
                    "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
                    "Comments": $scope.Comments,
                    "ConditionId": $scope.ConditionId,
                    "EquipmentComment": $scope.EquipmentComment,
                    "Type": "J",
                    "OldStatusId": params.row.StatusId,
                    "IsWarningAccepted": 1
                };

                var _postUrl = "/ReportFeeder/CreateComments/" + $scope.StatusId;
                $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                    if (response) {
                        alertFactory.setMessage({
                            msg: "Status saved Successfully."
                        });
                        $uibModalInstance.close('Ok');
                    }
                });
            }
        }, function () {

        });
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $scope.comments = "";
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };
});

//Equipment Comments
app.controller('skfEquipStatusCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.row = params.row;
    $scope.languageId = params.languageId;
    $scope.StatusName = params.row.StatusName;
    $scope.isDataCollectionDone = params.row.DataCollectionDone;
    $scope.TypeId = params.row.JobEquipmentId;
    $scope.CurrentStatusId = params.row.StatusId;
    $scope.ClientSiteId = params.ClientSiteId;
    $scope.EquipmentName = params.row.EquipmentName;
    $scope.IsEditable = params.row.IsEditable;
    $scope.ReportDate = null;
    $scope.DataCollectionDate = null;

    // Restrict Date to Future date
    if (params.row.ReportDate) {
        $scope.ReportDate = new Date(params.row.ReportDate);
    } else {
        $scope.ReportDate = new Date(params.row.ReportingDate);
    }


    if (params.row.DataCollectionDate) {
        $scope.DataCollectionDate = new Date(params.row.DataCollectionDate);
        //$scope.reportdateoptions = {
        //    minDate: new Date() // restrict min date to Start date
        //};
    } else {
        $scope.DataCollectionDate = new Date(params.row.EstStartDate);
        //$scope.reportdateoptions = {
        //    minDate: new Date() // restrict min date to Start date
        //};
    }

    //$scope.ChangeColDate = function () {
    //    if ($scope.DataCollectionDate > $scope.ReportDate) {
    //        $scope.ReportDate = "";
    //        $scope.reportdateoptions = {
    //            minDate: new Date()
    //        };
    //    } else {
    //        $scope.reportdateoptions = {
    //            minDate: new Date()
    //        };
    //    }
    //};

    //if ($scope.row.ReportDate) {
    //    $scope.ReportDate = new Date($scope.row.ReportDate);
    //} else {
    //    $scope.ReportDate = new Date();
    //}

    //if ($scope.row.DataCollectionDate) {
    //    $scope.DataCollectionDate = new Date($scope.row.DataCollectionDate);
    //} else {
    //    $scope.DataCollectionDate = new Date(params.DataColDate);
    //}

    $scope.ConditionId = params.row.ConditionId;
    $scope.EquipmentComment = params.row.EquipmentComment;

    //$scope.CheckEqReportDate = function () {
    //    if ($scope.DataCollectionDate > $scope.ReportDate) {
    //        $scope.DataCollectionDate = "";
    //    }

    //    $scope.DColEqdateoptions = {
    //        maxDate: new Date($scope.ReportDate) - 1
    //    };

    //    $scope.reportEqdateoptions = {
    //        minDate: new Date($scope.DataCollectionDate) + 1
    //    };
    //}();

    $scope.loadAssetConditionCode = function () {
        var _url = "/ConditionCodeMap/Get?lId=" + $scope.languageId + "&csId=" + $scope.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetConditionCodeDDL = response.data;
            });
    }();

    $scope.loadStatus = function () {
        $scope.jobStatusList = [];
        $http.get("ReportFeeder/GetStatusEquipmentByRole?csId=" + $scope.TypeId + "&lId=" + $scope.languageId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.jobStatusList = response.data;
                }
            });
    }();

    $scope.loadEqComments = function () {
        $http.get("/ReportFeeder/GetCommentsByType?type=E&jId=" + $scope.TypeId + "&lId=" + $scope.languageId)
            .then(function (response) {
                $scope.EqStatusLogs = response.data;
            });
    }();

    $scope.save = function () {
        //if ($scope.skfForm.$valid && (!$scope.isProcess) && $scope.Comments != null && $scope.Comments.length > 0) {
        if (!$scope.StatusId > 0) {
            $scope.StatusId = $scope.CurrentStatusId;
        }
        if (typeof $scope.DataCollectionDate !== "undefined" && typeof $scope.ReportDate !== "undefined" && $scope.DataCollectionDate <= $scope.ReportDate) {
            var _postdata = {
                "TypeId": $scope.TypeId,
                "StatusId": $scope.StatusId,
                "DataCollectionDate": $filter('date')($scope.DataCollectionDate, "yyyy-MM-dd 00:00:00"),
                "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
                "Comments": $scope.Comments,
                "ConditionId": $scope.ConditionId,
                "EquipmentComment": $scope.EquipmentComment,
                "Type": "E",
                "OldStatusId": params.row.StatusId
            };

            var _postUrl = "/ReportFeeder/CreateComments/" + $scope.StatusId;
            $scope.isProcess = true;

            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data.type == 'Confirmation') {
                    $scope.confirmEquipEC(response.data.message);
                }
                else {
                    alertFactory.setMessage({
                        type: "success",
                        msg: "Status saved Successfully."
                    });
                    setTimeout(function () {
                        $uibModalInstance.close($scope.StatusId);
                    }, 100);
                }
                $scope.isProcess = false;
            }, function (response) {
                if (response.data.type == 'Confirmation') {
                    $scope.confirmEquipEC(response.data.message);
                } else {
                    $scope.isProcess = false;
                    alertFactory.setMessage({
                        type: "warning",
                        msg: String(response.data.message),
                        exc: String(response.data.exception)
                    });
                }

            });
        }
        else {
            if (typeof $scope.DataCollectionDate === "undefined" || typeof $scope.ReportDate === "undefined") {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill date fields"
                });
            }
            else if ($scope.DataCollectionDate > $scope.ReportDate) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Data Collection date should be Lesser than Report Date"
                });
            }
        }
    };

    $scope.confirmEquipEC = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfEquipConfirmationModal.html',
            controller: 'skfEquipConfirmationCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "csId": $scope.ClientSiteId, "message": data };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                var _postdata = {
                    "TypeId": $scope.TypeId,
                    "StatusId": $scope.StatusId,
                    "DataCollectionDate": $filter('date')($scope.DataCollectionDate, "yyyy-MM-dd 00:00:00"),
                    "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
                    "Comments": $scope.Comments,
                    "ConditionId": $scope.ConditionId,
                    "EquipmentComment": $scope.EquipmentComment,
                    "Type": "E",
                    "IsWarningAccepted": 1,
                    "OldStatusId": params.row.StatusId,

                };

                var _postUrl = "/ReportFeeder/CreateComments/" + $scope.StatusId;
                $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                    if (response) {
                        alertFactory.setMessage({
                            msg: "Status saved Successfully."
                        });
                        $uibModalInstance.close($scope.StatusId);
                    }
                });
            }
        }, function () {

        });
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $scope.comments = "";
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };
});

// Units Comment Popup
app.controller('skfUnitStatusCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.TypeId = params.row.UnitAnalysisId;
    $scope.CurrentStatusId = params.row.StatusId;
    $scope.JobEquipmentId = params.row.JobEquipmentId;
    $scope.ServiceId = params.row.ServiceId;
    $scope.UnitType = params.row.UnitType;

    $scope.UnitName = function () {
        switch ($scope.UnitType) {
            case 'DR':
                $scope.UnitTypeName = 'Drive Unit';
                break;
            case 'IN':
                $scope.UnitTypeName = 'Intermediate Unit';
                break;
            case 'DN':
                $scope.UnitTypeName = 'Driven Unit';
                break;

        }
    }();

    $scope.UnitId = params.row.UnitId;
    $scope.AssetName = params.row.AssetName;

    $scope.loadStatus = function () {
        $http.get("ReportFeeder/GetStatusByRole?type=U&csId=" + $scope.CurrentStatusId + "&lId=" + $scope.languageId)
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.jobStatusList = response.data;
                }
            });
    };
    $scope.loadStatus();


    $scope.loadUnitComments = function () {
        $http.get("/ReportFeeder/GetCommentsByType?type=U&jId=" + $scope.TypeId + "&lId=" + $scope.languageId)
            .then(function (response) {
                $scope.UnitStatusLogs = response.data;
            });
    };

    $scope.loadUnitComments();


    $scope.save = function () {
        // if ($scope.skfForm.$valid && (!$scope.isProcess) && $scope.Comments != null && $scope.Comments.length > 0) {
        if (!$scope.StatusId > 0) {
            $scope.StatusId = $scope.CurrentStatusId;
        }
        var _postdata = {
            "Comments": $scope.Comments,
            "StatusId": $scope.StatusId,
            "TypeId": $scope.TypeId,
            "Type": "U",
            "JobEquipmentId": $scope.JobEquipmentId,
            "ServiceId": $scope.ServiceId,
            "UnitType": $scope.UnitType,
            "UnitId": $scope.UnitId,
            "OldStatusId": params.row.StatusId,
        };

        var _postUrl = "/ReportFeeder/CreateComments/" + $scope.StatusId;
        $scope.isProcess = true;
        $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
            if (response.data.isException) {
                alertFactory.setMessage({
                    type: response.data.type,
                    msg: response.data.message
                });
            }
            else {
                alertFactory.setMessage({
                    type: "success",
                    msg: "Status saved Successfully."
                });
                setTimeout(function () {
                    $uibModalInstance.close($scope.UnitType);
                }, 1000);
            }
            $scope.isProcess = false;
        }, function (response) {
            $scope.isProcess = false;
            alertFactory.setMessage({
                type: "warning",
                msg: String(response.data.message),
                exc: String(response.data.exception)
            });
        });
        //}
        //else {
        //    alertFactory.setMessage({
        //        type: "warning",
        //        msg: "Please enter the comments"
        //    });
        //}
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $scope.comments = "";
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };
});

app.controller('skfOAPopupCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.IsEditable = params.row.IsEditable;


    // Oil Analysis DropDown
    $scope.loadOilProperties = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.languageId + "&lName=DiagnosisOilProperties";
        $http.get(_url)
            .then(function (response) {
                $scope.oilPropertiesDDL = response.data;
            });
    }();

    $scope.loadSeverity = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.languageId + "&lName=DiagnosisSeverity";
        $http.get(_url)
            .then(function (response) {
                $scope.severityDDL = response.data;
            });
    }();

    $scope.loadVibChange = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.languageId + "&lName=DiagnosisOAVibChange";
        $http.get(_url)
            .then(function (response) {
                $scope.VibChangeDDL = response.data;
            });
    }();


    $scope.oilProperties = function () {
        var _url = "/ReportFeeder/GetOilPropertiesByEquipment?jeId=" + params.row.JobEquipmentId + "&lId" + $scope.languageId;
        $http.get(_url)
            .then(function (response) {
                $scope.OilPropDDL = response.data;
                if ($scope.OilPropDDL.length <= 0) {
                    $scope.OilPropDDL = [
                        {
                            "JobEquipOilPropertiesId": 0,
                            "JobEquipmentId": params.row.JobEquipmentId,
                            "OilLevel": null,
                            "SeverityId": null,
                            "Severity": null,
                            "OilPropertiesId": null,
                            "OilProperties": null,
                            "OAVibChangePercentageId": null,
                            "OAVibChangePercentage": null,
                            "Active": "Y"
                        }
                    ];
                }
            });
    }();

    $scope.addMore = function () {
        $scope.AddData = {
            "JobEquipOilPropertiesId": 0,
            "JobEquipmentId": params.row.JobEquipmentId,
            "OilLevel": null,
            "SeverityId": null,
            "Severity": null,
            "OilPropertiesId": null,
            "OilProperties": null,
            "OAVibChangePercentageId": null,
            "OAVibChangePercentage": null,
            "Active": "Y"
        }
        $scope.OilPropDDL.push($scope.AddData);
    }


    $scope.removeItem = function (i) {
        console.log(i);
        angular.forEach($scope.OilPropDDL, function (val, j) {
            if (i == j && val.JobEquipOilPropertiesId != 0) {
                val.Active = 'N';
            } else if (i == j) {
                $scope.OilPropDDL.splice(i, 1);
            }
        });
        console.log($scope.OilPropDDL);
    }

    $scope.save = function () {
        var _postUrl = "/ReportFeeder/CreateOilProperties";

        $http.post(_postUrl, JSON.stringify($scope.OilPropDDL)).then(function (response) {
            if (response.data.isException) {
                alertFactory.setMessage({
                    type: response.data.type,
                    msg: response.data.message
                });
            }
            else {
                alertFactory.setMessage({
                    type: "success",
                    msg: "Data saved Successfully."
                });
                setTimeout(function () {
                    $uibModalInstance.close(true);
                }, 1000);
            }
            $scope.isProcess = false;
        }, function (response) {
            $scope.isProcess = false;
            alertFactory.setMessage({
                type: "warning",
                msg: String(response.data.message),
                exc: String(response.data.exception)
            });
        });
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

//Attachment popup
app.controller('skfAttachmentCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {
    $scope.iframe = false;
    $scope.noAttachment = false;
    $scope.previewImg = true;
    $scope.uploadFile = true;
    $scope.languageId = params.languageId;
    $scope.aid = params.aId;
    $scope.Type = params.Type;
    $scope.AssetName = params.AssetName;
    $scope.rowData = params.row;
    $scope.IsEditable = params.IsEditable;

    $scope.attach = function () {
        $scope.attachments = $scope.rowData.attachment;
    };

    $scope.saveDoc = function () {
        $scope.uploadDocument();
    };

    $scope.getAttachment = function () {
        var _url = "/ReportFeeder/GetAttachmentByUnitAnalysis?uaid=" + $scope.aid + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attachment = response.data;
                angular.forEach($scope.attachment, function (val, i) {
                    //if (val.EquipmentId) {
                    val.attachId = val.UnitAnalysisAttachId;
                    val.type = "UnitAnalysis";
                    //}
                });
                if ($scope.attachment.length <= 0) {
                    $scope.noAttachment = true;
                }
                $scope.attImage = "";
                $scope.previewImg = true;
                $scope.FileName = "";
            });
    };
    $scope.getAttachment();

    $scope.removeAttachment = function (AttachmentId, Type) {
        var _url = "/ReportFeeder/DeleteAttachment?Type=" + Type + "&aId=" + AttachmentId;
        $http.post(_url)
            .then(function (response) {
                $timeout(function () {
                    $scope.getAttachment();
                    $scope.attImage = "";
                    $scope.FileName = "";
                    $scope.previewImg = true;
                }, 50);
            });
    }

    $scope.readURL = function (input) {
        $scope.thumb = [];
        for (var i = 0; i < input.files.length; i++) {
            if (input.files && input.files[i]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.thumb.push(e.target.result);
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
    }

    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if ($scope.aid) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/ReportFeeder/UploadFiles",
                contentType: false,
                processData: false,
                headers: { 'aId': $scope.aid, 'type': $scope.Type },
                data: data,
                success: function (message) {
                    $timeout(function () {
                        alertFactory.setMessage({
                            msg: "Document uploaded successfully."
                        });
                        $scope.noAttachment = false;
                        $scope.getAttachment();
                    }, 50);
                    $('#files').val("");
                    var _files = $.map($('#files').prop("files"), function (val) { return val.name; });
                    $scope.fileLength = _files.length;
                },
                error: function () {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Document not uploaded successfully."
                    });
                }
            });
        }
    };

    // Validate the uploaded files
    $scope.validFormat = false;
    $scope.uploadImageStart = function () {
        $scope.validFormat = false;
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var _files = $.map($('#files').prop("files"), function (val) { return val.name; });
        angular.forEach(_files, function (filename, i) {
            var filext = filename.substring(filename.lastIndexOf(".") + 1);
            filext = filext.toLowerCase();
        });
        if (fileUpload) {
            $timeout(function () {
                $scope.readURL(fileUpload);
                $scope.validFormat = true;
                $scope.uploadDocument();
            }, 10);

        } else {
            $timeout(function () {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Upload valid Image Format (png,jpg,jpeg and svg)"
                });
                $scope.validFormat = false;
                $('#files').val("");
            }, 10);
        }
    }

    $scope.showAttach = function (data, index) {
        $scope.docindex = index;
        var _url = "/ReportFeeder/GetAttachmentByUnitAnalysis?uaid=" + $scope.aid + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attach = response.data;
                angular.forEach($scope.attach, function (val, i) {
                    //if (val.EquipmentAttachId) {
                    //    $scope.attachId = val.EquipmentAttachId;
                    //}
                    //if (val.DriveAttachId) {
                    //    $scope.attachId = val.DriveAttachId;
                    //}
                    //if (val.IntermediateAttachId) {
                    //    $scope.attachId = val.IntermediateAttachId;
                    //}
                    //if (val.DrivenAttachId) {
                    //    $scope.attachId = val.DrivenAttachId;
                    //}
                    if (data == val.UnitAnalysisAttachId) {
                        $scope.FileName = val.FileName;
                        $scope.attImage = val.PhysicalPath;
                        $scope.previewImg = false;
                    }

                });
            });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

//Leverage Popup
app.controller('skfLeverageServiceCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.languageId = params.languageId;
    $scope.jeId = params.row.JobEquipmentId;
    $scope.EquipmentName = params.row.EquipmentName;
    //$scope.SelectedRow = params.row;
    $scope.formatters = {};

    var _columnsla = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'OpportunityType', displayName: 'Opportunities', enableCellEdit: false, enableFiltering: true, width: "35%",
            minWidth: 50
        },
        {
            name: 'Descriptions', displayName: 'Description', enableColumnResizing: true, enableCellEdit: true, enableFiltering: true, width: "40%", minWidth: 50
        },
        {
            name: 'Active', displayName: 'Action', enableFiltering: false, enableCellEdit: false,
            //filter: {
            //    type: uiGridConstants.filter.SELECT,
            //    selectOptions: [{ value: 'Y', label: 'Selected' }, { value: 'N', label: 'Unselected' }]
            //},
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" class="header-checkbox" ng-disabled="row.entity.isView == \'T\'" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "20%",
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
    }

    $scope.columns = angular.copy(_columnsla);
    $scope.gridOptsLA = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_LeverageService.xlsx',
        exporterExcelSheetName: 'EMaintenance_LeverageService',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts2.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts2.columnDefs = angular.copy(_columns);
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

    $scope.loadLeverageService = function () {
        $http.get("/LeverageExport/GetLeveragesByEquipment?jeId=" + $scope.jeId + "&lId=" + $scope.languageId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    $scope.gridOptsLA.data = response.data;
                    angular.forEach($scope.gridOptsLA.data, function (val, i) {
                        val.sno = i + 1;
                    });
                });
            });
    }
    $scope.loadLeverageService();


    $scope.save = function () {
        var postData = [];
        angular.forEach($scope.gridOptsLA.data, function (val, i) {
            if (val.isDirty === true) {
                postData.push(val);
            }
        });

        if (!$scope.isProcess && postData.length > 0) {
            $scope.isProcess = true;
            var postUrl = "/LeverageExport/Create";
            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
                if (response.status) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        alertFactory.setMessage({
                            type: "success",
                            msg: "Data updated Successfully."
                        });
                    }
                    $uibModalInstance.dismiss('cancel');
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message)
                });
            });
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: 'Opportunity already exists. Please make change in any of the opportunity.'
            });
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

// Confirmation for Equipment Entry Complete
app.controller('skfEquipConfirmationCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.Message = params.message;

    $scope.proceedEC = function () {
        $uibModalInstance.close('ok');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

// Confirmation for Job Entry Complete
app.controller('skfJobConfirmationCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.Message = params.message;

    $scope.proceedEC = function () {
        $uibModalInstance.close('ok');
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

//Confidence factor CMS Content
app.controller('skfCfModalCtrl', function ($scope, $http, $uibModalInstance, params) {
    $scope.cmsContent = null;
    $http.get("/PageSetup/GetContentByTypeCode?typeCode=" + params.code).then(function (response) {
        if (response.data) {
            $scope.CfContent = response.data;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('SelectAssetModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.row = params.row;
    $scope.jeId = params.row.JobEquipmentId;
    $scope.EqName = params.row.EquipmentName;
    $scope.ServiceName = params.row.ServiceName;

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantName', displayName: 'Plant Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'AreaName', displayName: 'Area Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'System', displayName: 'System Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'AssetName', displayName: 'Asset Name', enableCellEdit: false, enableFiltering: true,
            minWidth: 100
        },
        {
            name: 'Active', displayName: 'Action', enableFiltering: false, enableCellEdit: false,
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" class="header-checkbox" ng-disabled="row.entity.isView == \'T\'" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "15%",
            minWidth: 100
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

    $scope.loadAsset = function () {
        var _url = "ReportFeeder/GetJobEquipUnitUnselected?jeId=" + $scope.jeId + "&lId=" + $scope.languageId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (data, i) {
                    data.ServiceId = params.row.ServiceId;
                    data.ServiceName = params.row.ServiceName;
                    data.EquipmentName = params.row.EquipmentName;
                    data.languageId = $scope.languageId;
                });
            });
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
        $scope.selectedRecord = [];
        angular.forEach($scope.gridOpts.data, function (val, i) {
            if (val.isDirty == true && val.Active == 'Y') {
                $scope.selectedRecord.push(val);
            }
        });

        var _postUrl = "/ReportFeeder/SaveJobEquipUnitSelected";
        if ($scope.selectedRecord.length > 0) {
            $http.post(_postUrl, JSON.stringify($scope.selectedRecord)).then(function (response) {
                if (response.data.isException) {
                    alertFactory.setMessage({
                        type: response.data.type,
                        msg: response.data.message
                    });
                }
                else {
                    alertFactory.setMessage({
                        type: "success",
                        msg: "Data saved Successfully."
                    });
                    $uibModalInstance.close("data");
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });
            });
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please select a record"
            });
        }
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('ValidationPopModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {

    $scope.ok = function () {
        $uibModalInstance.close('Success');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

//app.controller('skfDataCollectorModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
//    $scope.formatters = {};
//    $scope.languageId = params.languageId;
//    $scope.JobName = params.row.entity.JobName;

//    $scope.save = function () {
//        var postUrl = "/job/SaveAssignUser?at=" + $scope.JobList.AnalystId + "&dcId=" + $scope.JobList.DataCollectorId + "&RId=" + $scope.JobList.ReviewerId + "&Tp=Equipment";

//        angular.forEach($scope.gridOpts.data, function (val, i) {
//            if (val.isDirty == true && val.Active == 'Y') {
//                $scope.SelectedRecord.push(val);
//            }

//        });

//        $http.post(postUrl, JSON.stringify($scope.SelectedRecord)).then(function (response) {
//            if (response) {
//                alertFactory.setMessage({
//                    msg: "Data saved Successfully."
//                });
//                $uibModalInstance.close('Success');
//            }

//        }, function (response) {
//            if (response.data.message) {
//                alertFactory.setMessage({
//                    type: "warning",
//                    msg: String(response.data.message),
//                    exc: String(response.data.exception)
//                });
//            }
//        });
//    };

//    $scope.cancel = function () {
//        $uibModalInstance.dismiss('cancel');
//    };

//    var _columns = [
//        {
//            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
//            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
//        },
//        {
//            name: 'PlantName', displayName: 'Plant', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'AreaName', displayName: 'Area', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'SystemName', displayName: 'System', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'EquipmentName', displayName: 'Equipment', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'ServiceName', displayName: 'Service', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'AnalystName', displayName: 'Analyst', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'DataCollectorName', displayName: 'DataCollector', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'ReviewerName', displayName: 'Reviewer', enableCellEdit: false, enableFiltering: true,
//            minWidth: 100
//        },
//        {
//            name: 'Active', displayName: 'Action', enableFiltering: false,
//            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Select All &nbsp;&nbsp</span><input type="checkbox" class="header-checkbox" ng-disabled="row.entity.isView == \'T\'" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
//            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-disabled="row.entity.isView == \'T\'" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
//            width: "7%",
//            minWidth: 50
//        }
//    ];

//    $scope.SelectAll = function () {
//        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
//        if (!$scope.selectAll) {
//            angular.forEach($scope.filteredRows, function (val, i) {
//                val.entity.Active = 'Y';
//                val.entity.isDirty = true;
//                $scope.selectAll = true;
//            });
//        } else if ($scope.selectAll) {
//            angular.forEach($scope.filteredRows, function (val, i) {
//                val.entity.isDirty = true;
//                val.entity.Active = 'N';
//                $scope.selectAll = false;
//            });
//        }
//    }

//    $scope.DirtyValues = function (row) {
//        row.isDirty = true;
//    };

//    $scope.columns = angular.copy(_columns);

//    $scope.gridOpts = {
//        columnDefs: $scope.columns,
//        enablePinning: true,
//        enableSorting: true,
//        enableFiltering: true,
//        enableGridMenu: true,
//        enableColumnResizing: true,
//        exporterMenuPdf: false,
//        exporterMenuCsv: false,
//        exporterExcelFilename: 'EMaintenance_Machine.xlsx',
//        exporterExcelSheetName: 'EMaintenance_Machine',
//        onRegisterApi: function (gridApi) {
//            $scope.gridApi = gridApi;
//            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
//                if (newValue !== oldValue) {
//                    rowEntity.isDirty = true;
//                }
//            });
//            $scope.gridApi.grid.clearAllFilters = function () {
//                $scope.gridOpts.columnDefs = [];
//                $timeout(function () {
//                    $scope.gridOpts.columnDefs = angular.copy(_columns);
//                }, 2);
//            };

//        },
//        exporterExcelCustomFormatters: function (grid, workbook, docDefinition) {

//            var stylesheet = workbook.getStyleSheet();
//            var stdStyle = stylesheet.createFontStyle({
//                size: 9, fontName: 'Calibri'
//            });
//            var boldStyle = stylesheet.createFontStyle({
//                size: 9, fontName: 'Calibri', bold: true
//            });
//            var aFormatDefn = {
//                "font": boldStyle.id,
//                "alignment": { "wrapText": true }
//            };
//            var formatter = stylesheet.createFormat(aFormatDefn);
//            // save the formatter
//            $scope.formatters['bold'] = formatter;
//            var dateFormatter = stylesheet.createSimpleFormatter('date');
//            $scope.formatters['date'] = dateFormatter;

//            aFormatDefn = {
//                "font": stdStyle.id,
//                "fill": { "type": "pattern", "patternType": "solid", "fgColor": "FFFFC7CE" },
//                "alignment": { "wrapText": true }
//            };
//            var singleDefn = {
//                font: stdStyle.id,
//                format: '#,##0.0'
//            };
//            formatter = stylesheet.createFormat(aFormatDefn);
//            // save the formatter
//            $scope.formatters['red'] = formatter;

//            Object.assign(docDefinition.styles, $scope.formatters);

//            return docDefinition;
//        },
//        exporterExcelHeader: function (grid, workbook, sheet, docDefinition) {
//            // this can be defined outside this method
//            var stylesheet = workbook.getStyleSheet();
//            var aFormatDefn = {
//                "font": { "size": 11, "fontName": "Calibri", "bold": true },
//                "alignment": { "wrapText": true }
//            };
//            var formatterId = stylesheet.createFormat(aFormatDefn);

//            // excel cells start with A1 which is upper left corner
//            sheet.mergeCells('B1', 'C1');
//            var cols = [];
//            // push empty data
//            cols.push({ value: '' });
//            // push data in B1 cell with metadata formatter
//            cols.push({ value: 'SKF', metadata: { style: formatterId.id } });
//            sheet.data.push(cols);
//        },
//        exporterFieldFormatCallback: function (grid, row, gridCol, cellValue) {
//            // set metadata on export data to set format id. See exportExcelHeader config above for example of creating
//            // a formatter and obtaining the id
//            var formatterId = null;
//            if (gridCol.field === 'name' && cellValue && cellValue.startsWith('W')) {
//                formatterId = $scope.formatters['red'].id;
//            }

//            if (gridCol.field === 'updatedDate') {
//                formatterId = $scope.formatters['date'].id;
//            }

//            if (formatterId) {
//                return { metadata: { style: formatterId } };
//            } else {
//                return null;
//            }
//        },
//        exporterColumnScaleFactor: 4.5,
//        exporterFieldApplyFilters: true
//    };

//    $scope.loadEquipment = function () {
//        var _url = "Job/GetJobEquipmentAssignUser?jId=" + params.row.entity.JobId + "&lId=" + $scope.languageId;
//        $http.get(_url)
//            .then(function (response) {
//                $scope.gridOpts.data = response.data;
//            });
//    }();

//});