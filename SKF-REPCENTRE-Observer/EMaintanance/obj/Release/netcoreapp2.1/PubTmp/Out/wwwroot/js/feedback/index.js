app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, $timeout, $uibModal, uiGridConstants, $http, languageFactory, alertFactory) {
    $scope.formatters = {};

    $scope.columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'id', displayName: 'Id', enableColumnResizing: true, width: "4%", minWidth: 15
        },
        {
            name: 'fields["System.WorkItemType"]', displayName: 'Type', enableColumnResizing: true, width: "5%", minWidth: 30,
            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.fields[\'System.WorkItemType\']}}" tooltip-class="customClass">{{row.entity.fields["System.WorkItemType"]}} </p></div>'
        },
        {
            name: 'fields["System.Title"]', displayName: 'Title', enableColumnResizing: true, width: "20%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.fields[\'System.Title\']}}" tooltip-class="customClass">{{row.entity.fields["System.Title"]}} </p></div>'
        },
        {
            name: 'fields["System.Tags"]', displayName: 'Tags', enableColumnResizing: true, width: "15%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.fields[\'System.Tags\']}}" tooltip-class="customClass">{{row.entity.fields["System.Tags"]}} </p></div>'
        },
        {
            name: 'fields["System.State"]', displayName: 'Status', enableColumnResizing: true, width: "6%", minWidth: 20,
            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.fields[\'System.State\']}}" tooltip-class="customClass">{{row.entity.fields["System.State"]}} </p></div>'
        },
        { name: 'fields["System.CreatedDate"]', displayName: 'Created On', enableColumnResizing: true, width: "14%", minWidth: 100, cellFilter: 'date:"medium"' },
        {
            name: 'fields["System.Description"]', displayName: 'Descriptions', enableColumnResizing: true, width: "27%", minWidth: 200,
            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.fields[\'System.Description\']}}" tooltip-class="customClass">{{row.entity.fields["System.Description"]}}</p></div>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "4%",
            minWidth: 50
        }
    ];

    $scope.editRow = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfFeedbackModal.html',
            controller: 'skfFeedbackModalCtrl',
            size: 'lg',
            backdropClass: 'feedback-modal-wrapper',
            windowTopClass: 'feedback-modal-wrapper',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: { taskId: row.id }
            }
        });
        modalInstance.result.then(function (data) {
            // $scope.loadData();
        }, function () {
            //  $scope.loadData();
        });
    };

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
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Task.xlsx',
        exporterExcelSheetName: 'EMaintenance_Task',
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
        var _url = "/Feedback/GetWorkItems";
        $http.get(_url)
            .then(function (response) {
                if (response.data) {
                    $scope.gridOpts.data = response.data;
                    // console.log(response.data);
                }
            });
    };

    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadData();
        }
    });
});

