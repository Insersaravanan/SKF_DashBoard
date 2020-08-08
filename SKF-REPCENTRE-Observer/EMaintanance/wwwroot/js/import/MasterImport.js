app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');
app.controller('skfImportModalCtrl', function ($scope, $timeout, $http, uiGridConstants, languageFactory) {
    $scope.formatters = {};
    $scope.alerts = [];
    $scope.closeAlert = function (index) {
        try {
            $scope.alerts.splice(index, 1);
        }
        catch (e) {
            //
        }
    };

    $scope.loadTemplate = function () {
        var _url = "/lookup/getlookupbyname?lid=" + $scope.language.LanguageId + "&lname=ImportMaster";
        $http.get(_url)
            .then(function (response) {
                $scope.TemplateDDL = response.data;
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadTemplate();
        }
    });

    var rowtpl = '<div ng-class="{\'invalid-input\':row.entity.validationStatus == \'E\',\'valid-input\':row.entity.validationStatus == \'V\'}"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';
    $scope.gridOptions = {
        rowTemplate: rowtpl,
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Export_' + $scope.template + '.xlsx',
        exporterExcelSheetName: $scope.template,
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
    
    $scope.reset = function () {
        $scope.gridOptions.data = [];
        $scope.gridOptions.columnDefs = [];
        $scope.stacked = [];
    };

    $scope.loadColumns = function (data) {
        $scope.gridOptions.colTemp = [];
        $http.get("/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=" + data + "_Template")
            .then(function (response) {
                if (response.data && response.data.length > 0) {
                    $scope.gridOptions.colTemp = response.data.map(function (d) {
                        var obj = {};
                        obj[d.LValue] = '';
                        return obj;
                    });
                }
            });
    };

    $scope.TempleteLoad = false;
    $scope.TemplateChange = function () {
        $scope.template = $scope.Template.LookupName
        $scope.loadColumns($scope.template);
        $scope.TempleteLoad = true;
    }

    $scope.downloadTemplate = function () {
        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet($scope.gridOptions.colTemp);

        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, $scope.template + "_Template");

        /* write workbook */
        XLSX.writeFile(wb, $scope.template + "_Template.xlsx");
        // XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //Cancel the Upload Progress
    $scope.cancelProgress = function () {
        $scope.progressCall(false);
    };

    //Initial call for Upload
    $scope.saveData = function () {
        $scope.SaveDataQueue = angular.copy($scope.gridOptions.data);
        $scope.progressCall(true);
    };

    //Update the progress based on items upload
    $scope.progressCall = function (flag) {
        $scope.isProgress = flag;
        $timeout(function () {
            var _total = $scope.gridOptions.data.length;
            var _progressed = _total - $scope.SaveDataQueue.length;
            var _errorCount = $scope.gridOptions.data.filter((data) => {
                return data.validationStatus && data.validationStatus === "E";
            }).length;

            if (flag) {
                $scope.sendDataToImport(5);
            }
            else {
                $scope.SaveDataQueue = [];
            }

            //Progressbar 
            $scope.stacked = [];
            $scope.stacked.push({
                value: Math.round(((_progressed - _errorCount) / _total) * 100),
                type: 'success',
                title: (_progressed - _errorCount) + ' items Successfully updated'
            });
            $scope.stacked.push({
                value: Math.round((_errorCount / _total) * 100),
                type: 'warning',
                title: _errorCount + ' items having issue to upload.'
            });
        }, 1);
    };

    $scope.updateGridData = function (col, flag) {
        var _grid = $scope.gridOptions.data;
        angular.forEach(col, function (val, i) {
            for (var i = 0, len = _grid.length; i < len; i++) {
                if (_grid[i].ReferenceNo == val.ReferenceNo) {
                    _grid[i].validationStatus = val.validationStatus;
                    _grid[i].ValidationResult = val.ValidationResult;
                    break;
                }
            }
        });
        var _flag = $scope.SaveDataQueue.length > 0 && flag ? true : false;
        $scope.progressCall(_flag);
    };

    $scope.sendDataToImport = function (chunk) {
        var postData = {};
        postData.PType = $scope.template;
        postData.LanguageId = $scope.language.LanguageId;
        postData.Flag = 'Save';
        postData.Detail = $scope.SaveDataQueue.splice(0, chunk);
        var postUrl = "/MasterImport/Import";
        $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
            if (response.data && response.data.length) {
                $scope.updateGridData(JSON.parse(response.data[0].MasterImport), true);
            }
            else if (response.data.isException) {
                $scope.alerts.push({
                    type: "warning",
                    msg: String(response.data.message)
                });
                var _col = postData.Detail.map(function (item, i) {
                    item.validationStatus = 'E';
                    item.ValidationResult = response.data.message;
                    return item;
                });
                $scope.updateGridData(_col, false);
            }
        }, function (response) {
            $scope.alerts.push({
                type: "warning",
                msg: String(response.data.message)
            });
            var _col = postData.Detail.map(function (item, i) {
                item.validationStatus = 'E';
                item.ValidationResult = response.data.message;
                return item;
            });
            $scope.updateGridData(_col, false);
        });
    };
});

app.directive("fileread", [function () {
    return {
        scope: {
            opts: '='
        },
        link: function ($scope, $elm, $attrs) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();
                $scope.opts.invalidUpload = false;
                reader.onload = function (evt) {
                    $scope.$apply(function () {
                        var _data = evt.target.result;

                        var workbook = XLSX.read(_data, { type: 'binary' });

                        var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];

                        var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

                        $scope.opts.columnDefs = [];
                        $scope.opts.columnDefs.push({
                            field: 'Sno',
                            width: 55,
                            enableFiltering: false,
                            cellTemplate: '<div class="ui-grid-cell-contents"><p>{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</p></div>'

                        });

                        var validateFile = true;
                        headerNames.forEach(function (h) {
                            if (validateFile) {
                                $scope.opts.columnDefs.push({ field: h, minWidth: 150 });

                                validateFile = $scope.opts.colTemp.some(function (val) {
                                    return val[h] !== undefined;
                                });
                            }
                        });

                        $scope.opts.columnDefs.push({
                            field: 'ValidationResult',
                            minWidth: 150,
                            cellTemplate: '<div class="ui-grid-cell-contents"><p tooltip-append-to-body="true" uib-tooltip="{{row.entity.ValidationResult}}" tooltip-class="customClass import-tooltip">{{row.entity.ValidationResult}}</p></div>'
                        });

                        if (validateFile && $scope.opts.colTemp.length === $scope.opts.columnDefs.length - 2) {
                            $scope.opts.data = data.map(function (item, i) {
                                item.ReferenceNo = i + 1;
                                return item;
                            });
                        }
                        else {
                            $scope.opts.columnDefs = [];
                            $scope.opts.invalidUpload = true;
                        }
                        $elm.val(null);
                    });
                };

                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    };
}]);
