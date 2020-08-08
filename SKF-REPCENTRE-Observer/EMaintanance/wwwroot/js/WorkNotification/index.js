app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.stage = "";
    $scope.equipmentListActive = true;
    $scope.isSelect = false;
    $scope.ReportDate = new Date();

    // Toggle Validation Script
    $scope.next = function (stage) {
        $scope.assetDetailsActive = false;
        $scope.equipmentListActive = false;
        $scope.assetActive = false;

        if (stage == "stage2" || stage == "stage1" || stage == "stage0") {
            if (stage == "stage2") {
                $scope.assetDetailsActive = true;
            } else if (stage == "stage1") {
                $scope.assetActive = true;
            } else {
                $scope.equipmentListActive = true;
                $scope.loadData();
            }
        }
        $scope.stage = stage;
    };

    var _column = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'JobNumber', displayName: 'Job Number', enableColumnResizing: true, enableCellEdit: false, width: "12%", minWidth: 100, cellClass: getCellClass, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'WorkNotificationNumber', displayName: 'Work Notification Number', enableColumnResizing: true, enableCellEdit: false, width: "15%", minWidth: 100, cellClass: getCellClass },
        { name: 'PlantAreaName', displayName: 'Plant Name', enableColumnResizing: true, enableCellEdit: false, minWidth: 80, width: "12%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        { name: 'EquipmentName', displayName: 'Equipment Name', enableColumnResizing: true, enableCellEdit: false, minWidth: 80, width: "12%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        { name: 'ConditionName', displayName: 'Equipment Condition Code', enableColumnResizing: true, enableCellEdit: false, minWidth: 100, width: "15%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass },
        {
            name: 'DataCollectionDate', displayName: 'Date', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100, cellFilter: 'date:\'dd/MM/yyyy\''
        },
        {
            name: 'StatusName', displayName: 'Status', enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 100, cellClass: getCellClass,
            //cellTemplate: '<div class="job-status"><span class="grid-status" style="border: 1px solid {{row.entity.StatusColour}};color: {{row.entity.StatusColour}}">{{row.entity.StatusName}}</span></span>'

        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.loadAssetByEq(row.entity)"<i class="fa fa-compass icon-space-before" tooltip-append-to-body="true" uib-tooltip="Asset" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.Status(row.entity)" ng-class="{disable:row.entity.StatusCode == \'CL\'}"><i class="fa fa-sun-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Status" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.OppPopup(row.entity)"<i class="fa fa-gg icon-space-before" tooltip-append-to-body="true" uib-tooltip="Opportunistic Work" tooltip-class="customClass import-tooltip"></i></a>' +
                //'<a ng-click="grid.appScope.FileUpload(row)" ng-class="{disable:row.entity.StatusCode == \'N\'}" <i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "10%",
            minWidth: 100
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
    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.resetForm();
        $scope.EqSearch = {
            FromDate: new Date(y, m, d - 30),
            ToDate: new Date,
            statusId: 0
        }
    }();

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);
        if (clientInfo == null) {
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
                    window.location.reload();
                }
            }, function () {

            });
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    }

    $scope.columns = angular.copy(_column);

    $scope.loadData = function (data) {
        if ($scope.EqSearch.ToDate) {
            $scope.EqSearch.ToDate = $filter('date')($scope.EqSearch.ToDate, "yyyy-MM-dd")
        } else {
            $scope.EqSearch.ToDate = null;
        }

        if ($scope.EqSearch.FromDate) {
            $scope.EqSearch.FromDate = $filter('date')($scope.EqSearch.FromDate, "yyyy-MM-dd")
        } else {
            $scope.EqSearch.FromDate = null;
        }
        if (data) {
            $scope.next('stage0');
        }
        var getdata = {
            FromDate: $scope.EqSearch.FromDate,
            ToDate: $scope.EqSearch.ToDate,
            ClientSiteId: $scope.ClientSiteId,
            LanguageId: $scope.language.LanguageId,
            StatusId: $scope.EqSearch.statusId
        };
        var _url = "/WorkNotification/GetWorkNotificationByStatus";
        $http.post(_url, JSON.stringify(getdata)).then(function (response) {
            $scope.gridOpts.data = response.data;
            $scope.EqSearch.FromDate = new Date($scope.EqSearch.FromDate);
            $scope.EqSearch.ToDate = new Date($scope.EqSearch.ToDate);
            // $scope.EqSearch.statusId = $scope.EqSearch.statusId;

            angular.forEach($scope.gridOpts.data, function (val, i) {
                if (val.StatusCode === 'OP') {
                    val.Status === 'N';
                } else {
                    val.Status === 'Y';
                }
                if (data) {
                    if (val.WNEquipmentId === data) {
                        $scope.Status(val);
                    }
                }
            });
        });
    };

    $scope.LoadWorkNotificatinStatus = function () {
        $scope.WorkNotificatinStatusDDL = [];
        $scope.defaultWorkNotificatinStatus = {
            LookupId: null,
            LValue: "--ALL--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=WorkNotificationStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.WorkNotificatinStatusDDL = response.data;
                $scope.WorkNotificatinStatusDDL.splice(0, 0, $scope.defaultWorkNotificatinStatus);
            });
    };

    $scope.DownloadWorkNotificationExcelReport = function () {
        $scope.smReport = {
            ClientSiteId: $scope.ClientSiteId,
            FromDate: $filter('date')($scope.EqSearch.FromDate, "yyyy-MM-dd"),
            ToDate: $filter('date')($scope.EqSearch.ToDate, "yyyy-MM-dd"),
            LanguageId: $scope.language.LanguageId,
            Statusid: $scope.EqSearch.statusId
        };

        if ($scope.gridOpts.data.length > 0) {
            angular.forEach($scope.WorkNotificatinStatusDDL, function (val, i) {
                if ($scope.EqSearch.statusId === val.LookupId) {
                    $scope.LValue = val.LValue;
                }
            });
            var postUrl = "/WorkNotification/WorkNoficationOpenExcelDownload";
            $http.post(postUrl, JSON.stringify($scope.smReport)).then(function (response) {
                $scope.template = $filter('date')($scope.EqSearch.FromDate, "yyyy-MM-dd") + "-" + $filter('date')($scope.EqSearch.ToDate, "yyyy-MM-dd");
                $scope.download = response.data;

                // if ($scope.Statusid)
                var ws = XLSX.utils.json_to_sheet($scope.download);

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, $scope.template + "");

                /* write workbook */
                XLSX.writeFile(wb, "Emaintenance_" + $scope.LValue + "_WN_" + $scope.template + ".xlsx");

            });
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Data Not Available to Export"
            });
        }

    };

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
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
            $scope.loadData();
            $scope.LoadWorkNotificatinStatus();
        }
    });

    $scope.Status = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfStatus.html',
            controller: 'skfStatusCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row };
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

    $scope.columns1 = [
        {
            name: 'sno', displayName: '#', width: "4%", cellClass: getCellClass, minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'AssetName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 100, aggregationType: uiGridConstants.aggregationTypes.count,

        },
        {
            name: 'UnitType', displayName: 'Unit Type', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "8%", minWidth: 100,
        },
        {
            name: 'MeanRepairManHours', displayName: 'Total Outage Time(hrs)', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "10%", minWidth: 100
        },
        {
            name: 'DownTimeCostPerHour', displayName: 'Down Time Cost $', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "10%", minWidth: 100
        },
        {
            name: 'CostToRepair', displayName: 'Cost of Repair $', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "10%", minWidth: 100
        },
        {
            name: 'StatusName', displayName: 'Status', cellClass: getCellClass, enableColumnResizing: true, enableCellEdit: false, width: "6%", minWidth: 200
        },
        {
            name: 'ActualRepairCost', displayName: 'Repair Cost', enableColumnResizing: true, width: "10%", minWidth: 100, cellClass: getCellClass,
            cellEditableCondition: function ($scope1) {
                return ($scope1.row.entity.StatusCode == 'OP') ? true : false;
            },
            cellTemplate: '<div class="ui-grid-cell-contents grid-checkbox"><input type="text" class="grid-text"  ng-model="row.entity.ActualRepairCost"></div>',
        },
        {
            name: 'ActualOutageHours', displayName: 'Actual Outage', enableColumnResizing: true, width: "10%", minWidth: 100, cellClass: getCellClass,
            cellEditableCondition: function ($scope1) {
                return ($scope1.row.entity.StatusCode == 'OP') ? true : false;
            },
            cellTemplate: '<div class="ui-grid-cell-contents grid-checkbox"><input class="grid-text" type="text" ng-model="row.entity.ActualOutageHours"></div>',
        },
        {
            name: 'Status', displayName: 'Select', enableFiltering: false, cellClass: getCellClass,
            headerCellTemplate: '<div class="ui-grid-cell-contents job-user">' +
                '<span>Select &nbsp;&nbsp</span><div><input type="checkbox" class="header-checkbox" ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></div>',
            type: 'boolean', cellTemplate: '<div class="ui-grid-cell-contents grid-checkbox"><input type="checkbox" ng-disabled="row.entity.StatusCode != \'OP\'" ng-model="row.entity.Status"  tooltip-append-to-body="true" uib-tooltip="Select to cancel the work notification" tooltip-class="customClass" ng-click="grid.appScope.selectUser(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></div>',
            width: "7%",
            minWidth: 50
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.AssetDetails(row.entity)"<i class="fa fa-info icon-space-before" tooltip-append-to-body="true" uib-tooltip="View" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.StatusChange(row.entity)"<i class="fa fa-comment icon-space-before" tooltip-append-to-body="true" uib-tooltip="Equipment Status" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "6%",
            minWidth: 100
        }
    ];

    $scope.SelectAll = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        if (!$scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                if (val.entity.StatusCode == 'OP') {
                    val.entity.Status = 'Y';
                    val.entity.isDirty = true;
                    val.entity.ActualRepairCost = null;
                    val.entity.ActualOutageHours = null;
                    $scope.selectAll = true;
                }

            });
        } else if ($scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                if (val.entity.StatusCode == 'OP') {
                    val.entity.isDirty = false;
                    val.entity.Status = 'N';
                    $scope.selectAll = false;
                    val.entity.ActualRepairCost = null;
                    val.entity.ActualOutageHours = null;
                }
            });
        }

        angular.forEach($scope.gridOpts1.data, function (val, i) {
            $scope.isSelect = false;
            if (val.StatusCode == 'OP' && val.Status == 'Y') {
                $scope.isSelect = true;
            }
        });
    }

    $scope.selectUser = function (row) {
        row.isDirty = true;
        for (i = 0; i < $scope.gridOpts1.data.length; i++) {
            if ($scope.gridOpts1.data[i].StatusCode == 'OP' && $scope.gridOpts1.data[i].Status == 'Y') {
                $scope.isSelect = true;
                $scope.gridOpts1.data[i].ActualRepairCost = null;
                $scope.gridOpts1.data[i].ActualOutageHours = null;
                break;
            } else {
                $scope.isSelect = false;
            }
        }
    }

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

    $scope.loadAssetByEq = function (row) {
        $scope.rowData = row;
        $scope.isSave = false;
        $scope.gridOpts1.data = [];
        $scope.worknotificationNumber = row.WorkNotificationNumber;
        $scope.EqId = row.WNEquipmentId;
        var _url = "/WorkNotification/GetWNEquipUnitAnalysisByEqId?csId=" + $scope.ClientSiteId + "&eId=" + row.WNEquipmentId + "&lId=" + $scope.language.LanguageId;
        $http.get(_url).then(function (response) {
            $scope.gridOpts1.data = response.data;
            angular.forEach($scope.gridOpts1.data, function (val, i) {
                $scope.isSave = true;
                if (val.StatusCode == 'OP') {
                    val.Status = 'N';
                } else {
                    val.Status = 'Y';
                }
            });
            $scope.next('stage1');
        });
    };

    $scope.AssetDetails = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssetDatailPopup.html',
            controller: 'skfAssetDatailPopupCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row };
                }
            }
        });

        modalInstance.result.then(function (data) {

        }, function () {

        });
    };

    $scope.saveUnitAnalysis = function () {
        $scope.completeRecord = [];
        var postUrl = "/WorkNotification/SaveWNUnitAnalysis";
        angular.forEach($scope.gridOpts1.data, function (val, i) {
            if (val.StatusCode == 'OP') {
                if (val.ActualRepairCost != null && val.ActualOutageHours != null) {
                    $scope.completeRecord.push(val);
                }
            }
        });

        $http.post(postUrl, JSON.stringify($scope.completeRecord)).then(function (response) {
            if (response.data.length == 0) {
                if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                    });
                }
                else {
                    alertFactory.setMessage({
                        msg: "Data Saved Successfully."
                    });
                }
                $scope.loadAssetByEq($scope.rowData);
                for (i = 0; i < $scope.gridOpts1.data.length; i++) {
                    if ($scope.gridOpts1.data[i].StatusCode == 'OP') {
                        $scope.isComplete = false;
                        break;
                    } else {
                        $scope.isComplete = true;
                    }
                }
                $timeout(function () {
                    if ($scope.isComplete) {
                        $scope.loadData($scope.EqId);
                    }
                }, 300);

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

    $scope.cancelUnitAnalysis = function () {
        $scope.cancelRecord = [];

        angular.forEach($scope.gridOpts1.data, function (val, i) {
            if (val.StatusCode == 'OP') {
                if (val.ActualRepairCost == null && val.ActualOutageHours == null && val.Status == 'Y') {
                    $scope.cancelRecord.push(val);
                }
            }
        });
        var modalInstance = $uibModal.open({
            templateUrl: 'skfCancelPopup.html',
            controller: 'skfCancelCtrl',
            size: 'lg',
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
                angular.forEach($scope.cancelRecord, function (val, i) {
                    val.CancelRemarks = data;
                });
                var postUrl = "/WorkNotification/CancelWNUnitAnalysis";
                $http.post(postUrl, JSON.stringify($scope.cancelRecord)).then(function (response) {
                    if (response.data.length == 0) {
                        if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                            alertFactory.setMessage({
                                type: "warning",
                                msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                            });
                        }
                        else {
                            alertFactory.setMessage({
                                msg: "Data Saved Successfully."
                            });
                        }
                        $scope.loadAssetByEq($scope.rowData);
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
        }, function () {

        });

    }

    $scope.OppPopup = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfOppPopup.html',
            controller: 'skfOppPopupCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId, 'ClientSiteId': $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {

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
                    return { "languageId": $scope.language.LanguageId, "aId": row.UnitAnalysisId, "Type": "UnitAnalysis" };
                }
            }
        });

        modalInstance.result.then(function (data) {

        }, function () {
        });
    };

});

app.controller('skfStatusCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.eqName = params.row.EquipmentName;
    $scope.WNEquipmentId = params.row.WNEquipmentId;
    $scope._postdata = [];

    $scope.save = function () {
        if ($scope.skfForm.$valid && (!$scope.isProcess)) {

            var _postdata = {
                "WNEquipmentId": $scope.WNEquipmentId,
                "Feedback": $scope.Comments,
                "WNCompletionDate": $filter('date')($scope.JobCompletionDate, "yyyy-MM-dd 00:00:00"),
                "RiAmperage": $scope.RiAmperage,
                "IsAccurate": $scope.IsAccurate
            };

            var _postUrl = "/WorkNotification/SaveWorkNoficationFeedBack/";
            $scope.isProcess = true;
            $http.post(_postUrl, JSON.stringify(_postdata)).then(function (response) {
                if (response.data[0].Result == 'E') {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: response.data[0].ResultText
                    });
                }
                else {
                    alertFactory.setMessage({
                        type: "success",
                        msg: "Status saved Successfully."
                    });
                }
                $uibModalInstance.close('Ok');
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
        else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please fill Mandatory(*) Fields"
            });
        }
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

app.controller('skfOppPopupCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.EqName = params.row.EquipmentName;
    $scope.formatters = {};
    $scope.languageId = params.languageId;

    $scope.loadEquipment = function (data) {
        var _url = "/WorkNotification/GetLoadWNListItem?Type=Equipment&lId=" + params.languageId + "&sId=0&csId=" + params.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.EquipmentDDL = response.data;
            });
    }();

    $scope.loadFailureCause = function (data) {
        var _url = "/WorkNotification/GetLoadWNListItem?Type=FailureCause&lId=" + params.languageId + "&sId=" + data + "&csId=" + params.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.FailureCauseDDL = response.data;
            });
    };

    $scope.loadFailureMode = function () {
        var _url = "/WorkNotification/GetLoadWNListItem?Type=FailureMode&lId=" + params.languageId + "&sId=0&csId=" + params.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.FailureModeDDL = response.data;
            });
    }();

    $scope.oilProperties = function () {
        var _url = "/WorkNotification/GetListWNEquipmentOpportunity?eqId=" + params.row.WNEquipmentId + "&wnNo=" + params.row.WorkNotificationNumber + "&lId=" + $scope.languageId;
        $http.get(_url)
            .then(function (response) {
                $scope.OppDDL = response.data;
                if ($scope.OppDDL.length <= 0) {
                    $scope.OppDDL = [
                        {
                            "WNOpportunityId": 0,
                            //"WorkNotificationNumber": params.row.WorkNotificationNumber,
                            "WNEquipmentId": params.row.WNEquipmentId,
                            "ActualOutageHours": null,
                            "ActualRepairCost": null,
                            "TrueSavings": 0,
                            "FailureModeId": null,
                            "FailureCauseId": null,
                            "Active": "Y",
                            //"ActionDoneBy": 0
                        }
                    ];
                } else {
                    angular.forEach($scope.OppDDL, function (val, i) {
                        $scope.loadFailureCause(val.FailureModeId);
                    });
                }
            });
    }();

    $scope.addMore = function () {
        $scope.AddData = {
            "WNOpportunityId": 0,
            //"WorkNotificationNumber": params.row.WorkNotificationNumber,
            "WNEquipmentId": params.row.WNEquipmentId,
            "ActualOutageHours": null,
            "ActualRepairCost": null,
            "TrueSavings": 0,
            "FailureModeId": null,
            "FailureCauseId": null,
            "Active": "Y",
            //"ActionDoneBy": 0
        }
        $scope.OppDDL.push($scope.AddData);
    }


    $scope.removeItem = function (i) {
        angular.forEach($scope.OppDDL, function (val, j) {
            if (i == j && val.JobEquipOilPropertiesId != 0) {
                val.Active = 'N';
            } else if (i == j) {
                $scope.OppDDL.splice(i, 1);
            }
        });
    }

    $scope.save = function () {
        var _postUrl = "/WorkNotification/SaveWNEquipmentOpportunity";

        $http.post(_postUrl, JSON.stringify($scope.OppDDL)).then(function (response) {
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
        var _url = "/WorkNotification/GetWNAttachmentByEquipment?eid=" + $scope.eid + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attachment = response.data;
                angular.forEach($scope.attachment, function (val, i) {
                    val.attachId = val.WNId;


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
        var _url = "/WorkNotification/DeleteAttachment?Type=" + Type + "&aId=" + AttachmentId;
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
                url: "/WorkNotification/UploadFiles",
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
                        msg: "Document uploaded successfully."
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

    $scope.showAttach = function (data) {
        var _url = "/WorkNotification/GetWNAttachmentByEquipment?eid=" + $scope.eid + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attach = response.data;
                angular.forEach($scope.attach, function (val, i) {

                    if (data == val.WNAttachmentId) {
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

app.controller('skfAssetDatailPopupCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {
    $scope.AssetName = params.row.AssetName
    $scope.ConditionCode = params.row.ConditionName;
    $scope.ConfidentFactor = params.row.ConfidentFactor;
    //$scope.DownTimeCost = params.row.DownTimeCost;
    $scope.FailureProbFactor = params.row.FailureProbFactor;
    //$scope.MeanRepairManHours = params.row.MeanRepairManHours;
    $scope.Recommendation = params.row.Recommendation;
    $scope.RepairCost = params.row.RepairCost;
    $scope.IndicatedFault = params.row.IndicatedFault;
    $scope.TotalOutageTime = params.row.TotalOutageTime;
    $scope.WNPriority = params.row.Priority;
    $scope.Comment = params.row.Comment;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('skfCancelCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.CancelRemarks = "";
    $scope.save = function () {
        if ($scope.CancelRemarks.length > 0) {
            $uibModalInstance.close($scope.CancelRemarks);
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please fill the Comments to cancel the work notification"
            });
        }

    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});