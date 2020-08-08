app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning');

app.controller('skfCtrl', function ($scope, $filter, $window, $timeout, $http, $uibModal, uiGridConstants, utility, clientFactory, languageFactory) {

    $scope.columns = [
        { name: 'sno', displayName: '#', width: "50", enablePinning: false, enableCellEdit: false, cellClass: getCellClass, enableFiltering: false },
        { name: 'PlantAreaName', displayName: 'PlantArea Name', width: '18%', enableCellEdit: false, cellClass: getCellClass },
        { name: 'JobNumber', displayName: 'Job No', enableColumnResizing: true, width: '7%', enableCellEdit: false, cellClass: getCellClass },
        { name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, width: '18%', enableCellEdit: false, cellClass: getCellClass },
        { name: 'EquipmentName', displayName: 'Equipment Name', width: '12%', enableCellEdit: false, cellClass: getCellClass },
        {
            name: 'VA', displayName: 'VA', enableColumnResizing: true, width: '6%', type: 'boolean', enableCellEdit: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header"> VA <span class="common-report-heading job-list">Job Services</span></span>',
            cellTemplate: '<label class="ui-grid-cell-contents"><a ng-click="grid.appScope.Report(row, \'Vibration Analysis Report\')"  ng-class="{disable: row.entity.VA == \'N\'}" ng-model="row.entity.VA"><i class="fa fa-print icon-space-before"></i></a></label>'
        },
        {
            name: 'OA', displayName: 'OA', enableColumnResizing: true, width: '6%', type: 'boolean', enablePinning: false, enableCellEdit: false, cellClass: getCellClass,
            headerCellTemplate: '<span class="report-header"> OA</span>',
            cellTemplate: '<label class="ui-grid-cell-contents"><a ng-click="grid.appScope.Report(row, \'Oil Analysis Report\')"  ng-class="{disable: row.entity.OA == \'N\'}" ng-model="row.entity.OA"><i class="fa fa-print icon-space-before"></i></a></label>'
        },
        {
            name: 'ReportDate', displayName: 'Report Date', enableColumnResizing: true, width: '11%', enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.ReportDate | date:\'dd/MM/yyyy\' }}</div>'
        },
        {
            name: 'DataCollectionDate', displayName: 'Data Collection Date', width: '16%', enableCellEdit: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.DataCollectionDate | date:\'dd/MM/yyyy\' }}</div>'
        },
    ];

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

    $scope.open = function (row) {

        var modalInstance = $uibModal.open({
            templateUrl: 'skfPopupModal.html',
            controller: 'skfPopupModalCtrl',
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
            //log
        }, function () {
            //Log
        });
    }

    $scope.clearValue = function () {
        $scope.FromDate = null;
        $scope.ToDate = null;
        $scope.ConditionCodeId = null;
    };

    var date = new Date();
    var d = date.getDate() - 90;
    y = date.getFullYear(), m = date.getMonth();
    $scope.FromDate = new Date(y, m, d);

    $scope.loadData = function () {
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        $scope.cmReport = {
            ClientSiteId: $scope.ClientSiteId,
            ReportFromDate: $filter('date')($scope.FromDate, "yyyy-MM-dd"),
            ReportToDate: $filter('date')($scope.ToDate, "yyyy-MM-dd"),
            ConditionCodeId: $scope.ConditionCodeId,
            LanguageId: $scope.language.LanguageId
        };

        var _url = "/ConditionalMonitoring/GetConditionReportList/";
        $http.post(_url, JSON.stringify($scope.cmReport)).then(function (response) {
            $scope.gridOpts.data = response.data;
            angular.forEach($scope.gridOpts.data, function (val, i) {
                val.sno = i + 1;
            });
        });
    };

    $scope.loadAssetConditionCode = function () {
        var _url = "/ConditionCodeMap/GetConditionCodeSetup?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetConditionCodeDDL = response.data;
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

            //if ($scope.isPageLoad) {
                $scope.loadData();
           // }
            $scope.loadAssetConditionCode();
        }
    });

    $scope.Report = function (row, val) {

        var mapForm = document.createElement("form");
        mapForm.target = "Map";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = "/report";
        mapForm.setAttribute("class", "report-append-view");

        var JobEquipment = document.createElement("input");
        JobEquipment.type = "text";
        JobEquipment.name = "JobEquipmentId";
        JobEquipment.value = row.entity.JobEquipmentId;
        mapForm.appendChild(JobEquipment);

        var Language = document.createElement("input");
        Language.type = "text";
        Language.name = "LanguageId";
        Language.value = $scope.language.LanguageId;
        mapForm.appendChild(Language);

        var Type = document.createElement("input");
        Type.type = "text";
        Type.name = "Type";
        Type.value = "CMR";
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

