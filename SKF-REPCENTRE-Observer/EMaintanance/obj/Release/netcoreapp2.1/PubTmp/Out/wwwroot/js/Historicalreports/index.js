app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.O_Active = 'All';
    $scope.ReportDate = new Date();

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
       
        {
            name: 'PlantAreaName', displayName: 'Plant Name', enableColumnResizing: true, cellClass: getCellClass, width: "16%", minWidth: 110, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 110, aggregationHideLabel: false
        },
        {
            name: 'UnitName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 110, aggregationHideLabel: false
       },
        {
            name: 'ObserverNodeName', displayName: 'Sensor Name', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 110, aggregationHideLabel: false
        },
        {
            name: 'ReadingTime', displayName: 'Reading Date & Time', enableColumnResizing: true, width: "15%", minWidth: 100, cellFilter: 'date:\'dd-MM-yyyy hh:mm:ss a\'', cellClass: getCellClass
        },
        {
            name: 'ReadingValue', displayName: 'Reading Value', enableColumnResizing: true, width: "8%", minWidth: 100,cellClass: getCellClass
        },
        {
            name: 'ReadingUnit', displayName: 'Reading Unit', cellClass: getCellClass, enableColumnResizing: true, width: "5%", minWidth: 100, aggregationHideLabel: false
        }
     
    ];


    $scope.resetForm = function () {
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.editRow = function () {
        $scope.readOnlyPage = false;
        $scope.isEdit = true;
        $scope.isView = false;
        $scope.clearModal();
    };


    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.PlantAreaId = 0;
        $scope.EquipmentId = 0;
        $scope.UnitId = 0;
        $scope.ObserverNodeId= 0;
        $scope.FileDescription = "";
        $scope.ReportDate = "";
        $('#files').val("");
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.O_Active = 'All';
    };

    $scope.searchToggle = function () {
        $scope.isCreate = false;
        $scope.isSearch = true;
        $scope.gridOpts.data = [];
        $scope.clearModal();
        $scope.readOnlyPage = false;
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.isView = false;
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.clearModal();
       // $scope.loadSensor();
        $scope.ReportDate = new Date();
    };

    $scope.columns = angular.copy(_columns);

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
        exporterExcelFilename: 'SKF-REP-Online-HistorialReport.xlsx',
        exporterExcelSheetName: 'SKF-REP_History',
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

    $scope.O_HistoricalReportList = {
        ReportDate: null
    }
    
    $scope.loadData = function () {
        var date = new Date();
        var d = date.getDate() - 30;
        y = date.getFullYear(), m = date.getMonth();
        if ($scope.O_HistoricalReportList.StartDate == null) {
            $scope.O_HistoricalReportList.StartDate = new Date(y, m, d);
        }
        var datec = new Date();
        var dc = datec.getDate()+1;
        yc = datec.getFullYear(), mc = datec.getMonth();
        if ($scope.O_HistoricalReportList.EstEndDate == null) {
            $scope.O_HistoricalReportList.EstEndDate = new Date(yc, mc, dc);
        }
       


      // var _url = "/HistoricalReports/GetHistoricalReportsByStatus?csId=" + $scope.ClientSiteId + "&status=ALL";
        var _url = "/HistoricalReports/GetHistoricalPlantByStatus?csId=" + $scope.ClientSiteId + "&plantId=" + $scope.PlantAreaId & "EquipmentId=" + $scope.EquipmentId & "UnitId=" + $scope.UnitId & "&SensorId=" + $scope.ObserverNodeId & "&status=ALL&FromDate=" + $filter('date')($scope.O_HistoricalReportList.StartDate, "yyyy-MM-dd 00:00:00") + "&ToDate=" + $filter('date')($scope.O_HistoricalReportList.EstEndDate, "yyyy-MM-dd 00:00:00");
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    $scope.HistoryData = function () {
        //var date = new Date();
        //var d = date.getDate() - 30;
        //y = date.getFullYear(), m = date.getMonth();
        //var datec = new Date();
        //var dc = datec.getDate();
        //yc = datec.getFullYear(), mc = datec.getMonth();
        //if ($scope.O_HistoricalReportList.StartDate == null) {
        //    $scope.O_HistoricalReportList.StartDate = new Date(y, m, d);
        //}
        //if ($scope.O_HistoricalReportList.EstEndDate == null) {
        //    $scope.O_HistoricalReportList.EstEndDate = new Date(yc, mc, dc);
        //}


        // var _url = "/HistoricalReports/GetHistoricalReportsByStatus?csId=" + $scope.ClientSiteId + "&status=ALL";
        var _url = "/HistoricalReports/GetHistoricalReportsByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&plantId=" + $scope.PlantAreaId + "&EquipmentId=" + $scope.EquipmentId + "&UnitId=" + $scope.UnitId + "&SensorId=" + $scope.ObserverNodeId + "&status=ALL&FromDate=" + $filter('date')($scope.O_HistoricalReportList.StartDate, "yyyy-MM-dd 00:00:00") + "&ToDate=" + $filter('date')($scope.O_HistoricalReportList.EstEndDate, "yyyy-MM-dd 00:00:00");
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };


    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;


    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
        
            $scope.loadPlantName();
            $scope.loadEquipment();
            $scope.loadAsset();
           // $scope.S_Reporting();
            $scope.loadSensor();
            $scope.loadData();  
            $scope.HistoryData();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();

            //}
        }
    });


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

    $scope.S_jobList = {
        JobNumber: null,
        StartDate: null,
        EstEndDate: null
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
            var _url = "/HistoricalReports/GetSensorByUnit?lId=" + $scope.language.LanguageId + "&UnitId=" + $scope.UnitId;
            $http.get(_url)
                .then(function (response) {
                    $scope.reportingDDL = response.data;
                    angular.forEach(response.data, function (val, i) {
                        val.ScheduleSetupId = 0;
                       // val.ScheduleObserverNodeId = 0;
                        val.ScheduleServiceId = 0;
                        if ($scope.isCreate) {
                            if (i == 0) {
                                val.Active = "Y";
                            }
                        }
                        $scope.Reporting.push({
                            id: val.ObserverNodeId, label: val.ObserverNodeName
                        });
                        if (val.Active == 'Y') {
                            $scope.ScheduleSelectedData.push({ id: val.ObserverNodeId });
                        }
                    });
                });
        } else {
            var _d = JSON.parse(data);
            $scope.reportingDDL = JSON.parse(data);
            angular.forEach(_d, function (val, i) {
                $scope.Reporting.push({
                    id: val.ObserverNodeId, label: val.ObserverNodeName
                });
                if (val.Active == 'Y') {
                    $scope.ScheduleSelectedData.push({ id: val.ObserverNodeId });
                }
            });
        }
    };


    $scope.loadPlantName = function () {
        var _url = "/HistoricalReports/GetHistoricalPlantByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=ALL";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantAreaDDL = response.data;
            });
    };

    $scope.loadEquipment = function () {
        var _url = "/HistoricalReports/GetEquipmentByPlant?lId=" + $scope.language.LanguageId + "&plantId=" + $scope.PlantAreaId;
        $http.get(_url)
            .then(function (response) {
                $scope.EquipmentDDL = response.data;

            });
    };

    $scope.loadAsset = function (data) {
       var _url = "/HistoricalReports/GetHistoricalEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=" + data + "&rId=0&type=Drive&status=All";
      //  var _url = "/HistoricalReports/GetHistoricalEquipmentByStatus?lId=" + $scope.language.LanguageId + " &EquipmentId=" + $scope.EquipmentId;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetDDL = response.data;

            });
    };

    $scope.loadSensor = function () {
        var _url = "/HistoricalReports/GetSensorByUnit?lId=" + $scope.language.LanguageId + "&UnitId=" + $scope.UnitId;
        $http.get(_url)
            .then(function (response) {
                $scope.SensorNameDDL = response.data;

            });
    };

    $scope.validFormat = false;
   
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


});

