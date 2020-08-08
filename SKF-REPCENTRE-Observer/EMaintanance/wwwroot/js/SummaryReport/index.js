app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning');

app.controller('skfCtrl', function ($scope, $filter, $window, $timeout, $http, alertFactory, $uibModal, uiGridConstants, utility, clientFactory, languageFactory) {

    $scope.columns = [
        { name: 'sno', displayName: '#', width: "50", enablePinning: false, enableCellEdit: false, enableFiltering: false },
        { name: 'JobNumber', displayName: 'Job No', enableColumnResizing: true, width: '20%', enableCellEdit: false },
        { name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, width: '30%', enableCellEdit: false },
        { name: 'EstStartDate', displayName: 'Est. Start Date', enableColumnResizing: true, width: '30%', enableCellEdit: false },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass, enableCellEdit: false,
            width: "15%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.Report(row)" <i class="fa fa-print icon-space-before" tooltip-append-to-body="true" uib-tooltip="Summary Report" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.downloadExcel(row.entity)"}> <i class="fa fa-file-excel-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Download" tooltip-class="customClass"></i></a>' +
                '</div>'
        }
    ];

    $scope.DownloadSummaryReportExcelByDateRange = function () {
        $scope.smReport = {
            ClientSiteId: $scope.ClientSiteId,
            ReportFromDate: $filter('date')($scope.FromDate, "yyyy-MM-dd"),
            ReportToDate: $filter('date')($scope.ToDate, "yyyy-MM-dd"),
            LanguageId: $scope.language.LanguageId
        };

        if (typeof $scope.smReport.ReportFromDate !== 'undefined' && typeof $scope.smReport.ReportToDate !== 'undefined') {
            var postUrl = "/SummaryReport/GetSummaryReportDateRangeToDownload";
            $http.post(postUrl, JSON.stringify($scope.smReport)).then(function (response) {
                $scope.template = $filter('date')($scope.FromDate, "yyyy-MM-dd") + "-" + $filter('date')($scope.ToDate, "yyyy-MM-dd");
                $scope.download = response.data;
                var ws = XLSX.utils.json_to_sheet($scope.download);

                /* add to workbook */
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, $scope.template + "");

                /* write workbook */
                XLSX.writeFile(wb, "SummaryReport-" + $scope.template + ".xlsx");
            });
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please fill the Start and End date"
            });
        }
       
    };


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
        $scope.smReport = {
            ClientSiteId: $scope.ClientSiteId,
            ReportFromDate: $filter('date')($scope.FromDate, "yyyy-MM-dd"),
            ReportToDate: $filter('date')($scope.ToDate, "yyyy-MM-dd"),
            LanguageId: $scope.language.LanguageId
        };

        var _url = "/SummaryReport/GetSummaryReportList/";
        $http.post(_url, JSON.stringify($scope.smReport)).then(function (response) {
            $scope.gridOpts.data = response.data;
            angular.forEach($scope.gridOpts.data, function (val, i) {
                val.sno = i + 1;
            });
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
            //}
        }
    });

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

