app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.M_Active = 'All';

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ManufacturerCode', displayName: 'Manufacturer Code', enableColumnResizing: true, width: "10%", minWidth: 80, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'ManufacturerName', displayName: 'Manufacturer Name', enableColumnResizing: true, width: "16%", minWidth: 150 },
        { name: 'BearingMFT', displayName: 'BearingMFT', enableColumnResizing: true, width: "6%", minWidth: 100 },
        { name: 'DriveMFT', displayName: 'DriveMFT', enableColumnResizing: true, width: "6%", minWidth: 100 },
        { name: 'IntermediateMFT', displayName: 'IntermediateMFT', enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'DrivenMFT', displayName: 'DrivenMFT', enableColumnResizing: true, width: "6%", minWidth: 100 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, width: "16%", minWidth: 150 },
 
        {
            name: 'Active', displayName: 'Status',
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
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
            width: "8%",
            minWidth: 80
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Manufacture" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "10%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.Manufacture = row;
        $scope.isCreate = false;
        $scope.isSearch = false;
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
        $scope.Manufacture = {
            ManufacturerId: 0,
            LanguageId: $scope.language.LanguageId,
            ManufacturerCode: null,
            ManufacturerName: null,
            Descriptions: null,
            Active: null,
            BearingMFT: 'N',
            DriveMFT: 'N',
            IntermediateMFT: 'N',
            DrivenMFT: 'N'

        };
        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.clearModal();
        $scope.M_Active = 'All';
    };

    $scope.searchToggle = function () {
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.gridOpts.data = [];
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.clearModal();
        $scope.loadDriveReporting();
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
        },
        enableGridMenu: true,
        enableSelectAll: false,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Manufacture.xlsx',
        exporterExcelSheetName: 'EMaintenance_Manufacture',
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
        //$scope.clearOut();
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/Manufacturer/GetManufactureByStatus?lId=" + $scope.language.LanguageId + "&status=" + $scope.M_Active;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            if ($scope.isPageLoad) {
                $scope.loadData();
            }
        }
    });

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Manufacturer/Create";

            $http.post(postUrl, JSON.stringify($scope.Manufacture)).then(function (response) {
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
            var postUrl = "/Manufacturer/Update";
            $http.post(postUrl, JSON.stringify($scope.Manufacture)).then(function (response) {
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
                        $scope.searchToggle();
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

    $scope.multiLanguage = function (row) {
        $http.get("/Manufacturer/GetTransManufacture?mId=" + row.ManufacturerId)
            .then(function (response) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'skfMultiLanguageModal.html',
                    controller: 'skfMultiLanguageModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        params: function () {
                            return { "row": row, "data": response.data };
                        }
                    }
                });

                modalInstance.result.then(function (gridData) {
                    $scope.loadData();
                }, function () {
                    $scope.loadData();
                });
            });
    };


    $scope.TypeSettings = {
        checkBoxes: true,
        dynamicTitle: true,
        showUncheckAll: false,
        showCheckAll: false
    };

    $scope.loadDriveReporting = function (data) {
        $scope.TypeSelectedData = [];
        $scope.Type = [];
        if (data) {
            //var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=" + data + "&type=" + "Drive" + "&at=Services&status=All";
            var _url = "/Lookup/GetLookupByName?lId = " + $scope.language.LanguageId + "&lName=ManufacturerType";
        } else {
            _url = "/Lookup/GetLookupByName?lId = " + $scope.language.LanguageId + "&lName=ManufacturerType";
        }

        $http.get(_url)
            .then(function (response) {
                $scope.TypeDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    $scope.Type.push({
                        id: val.LookupId, label: val.LValue
                    });
                    if (val.Active == 'Y') {
                        $scope.TypeSelectedData.push({ id: val.LookupId });
                    }
                });
            });
    };

});

//MultiLanguage popup controller
app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.ManufacturerName = params.row.ManufacturerName;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false, enableFiltering: true,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>',
            minWidth: 150
        },
        { name: 'ManufacturerName', displayName: 'Manufacture Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 200 }
    ];


    $scope.columns = angular.copy(_columns);
    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Manufacture.xlsx',
        exporterExcelSheetName: 'EMaintenance_Manufacture',
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

    $scope.save = function () {
        var postData = [];
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            if (val.isDirty === true) {
                postData.push(val);
            }
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/Manufacturer/SaveMultilingual";
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
                            msg: "Data updated Successfully."
                        });
                    }
                }
                $scope.isProcess = false;
            }, function (response) {
                $scope.isProcess = false;
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message)
                });
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


