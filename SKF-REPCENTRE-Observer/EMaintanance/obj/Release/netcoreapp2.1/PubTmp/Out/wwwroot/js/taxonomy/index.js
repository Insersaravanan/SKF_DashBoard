app.requires.push('commonMethods', 'ngTouch', 'ui.select', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.Active = "All";

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50,cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'SectorName', displayName: 'Sector', cellClass: getCellClass,enableColumnResizing: true, width: "10%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'SegmentName', displayName: 'Segment', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'IndustryName', displayName: 'Industry', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'AssetClassTypeCode', displayName: 'Asset Class Type Code', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 140 },
        { name: 'TaxonomyCode', displayName: 'Taxonomy Code', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'AssetCategoryName', displayName: 'Asset Category',cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'AssetClassName', displayName: 'Asset Class', cellClass: getCellClass,enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'AssetTypeName', displayName: 'Asset Type', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        { name: 'AssetSequenceName', displayName: 'Asset Sequence', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        //{ name: 'AssetTypeName', displayName: 'Asset Type', enableColumnResizing: true, width: "12%", minWidth: 120 },
        //{ name: 'FailureModeName', displayName: 'Failure Mode', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        //{ name: 'FailureCauseName', displayName: 'Failure Cause', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 120 },
        //{ name: 'MTBFOld', displayName: 'MTBF(O)', enableColumnResizing: true, width: "7%", minWidth: 50 },
        //{ name: 'MTTROld', displayName: 'MTTR(O)', enableColumnResizing: true, width: "7%", minWidth: 50 },
        { name: 'MTBF', displayName: 'MTBF(Years)', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 50 },
        { name: 'MTTR', displayName: 'MTTR(Hours)', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 50 },
        {
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            //cellClass: function (grid, row, col, rowRenderIndex, colRenderIndex) {
            //    if (grid.getCellValue(row, col) === "Y") {
            //        return 'green';
            //    } else {
            //        if (grid.getCellValue(row, col) === "N") {
            //            return 'red';
            //        }
            //    }
            //},
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }],
            },
            width: "8%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Taxonomy" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "9%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.Taxonomy = row;
        $scope.loadSegment(row.SectorId);
        $scope.loadIndustry(row.SegmentId);
        $scope.loadAssetClass(row.AssetCategoryId);
        $scope.loadAssetType(row.AssetClassId);
        $scope.loadAssetSequence(row.AssetTypeId);
        $scope.loadFailureMode(row.AssetClassId);
        $scope.loadFailureCause(row.FailureModeId);
        $scope.isCreate = false;
        $scope.isSearch = false;
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
        $scope.SegmentDDL = "";
        $scope.IndustryDDL = "";
        $scope.AssetClassDDL = "";
        $scope.AssetTypeDDL = "";
        $scope.AssetSequenceDDL = "";
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
        $scope.Taxonomy = {
            TaxonomyId: 0,
            LanguageId: $scope.language.LanguageId,
            SectorId: 0,
            SegmentId: 0,
            IndustryId: 0,
            FailureModeId: 0,
            AssetCategoryId: 0,
            AssetClassId: 0,
            AssetTypeId: 0,
            AssetSequenceId: 0,
            FailureModeName: null,
            AssetTypeName: null,
            IndustryName: null,
            TaxonomyCode: null,
            FailureCauseName: null,
            FailureCauseId: 0,
            Active: null,
            MTBF: null,
            MTTR: null,
            MTTROld: null,
            MTBFOld: null
        };
        $scope.resetForm();
    };

    $scope.clearValue = function () {
        $scope.S_Taxonomy = {
            SectorId: 0,
            SegmentId: 0,
            IndustryId: 0,
            FailureModeId: 0,
            FailureCauseId: 0,
            AssetTypeId: 0,
            AssetCategoryId: 0,
            AssetClassId: 0,
            AssetSequenceId: 0,
            Status: 'All'
        };
    };
    $scope.clearValue();

    $scope.searchToggle = function () {
        $scope.isCreate = false;
        $scope.isEdit = false;
        $scope.isSearch = true;
        $scope.gridOpts.data = [];
        $scope.clearOut();
    };

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.clearOut();
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
        exporterExcelFilename: 'EMaintenance_Taxonomy.xlsx',
        exporterExcelSheetName: 'EMaintenance_Taxonomy',
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
        $scope.S_Taxonomy.languageId = $scope.language.LanguageId;
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var postUrl = "/Taxonomy/Search";
        $http.post(postUrl, JSON.stringify($scope.S_Taxonomy)).then(function (response) {
            if (response.data) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            }

        }, function (response) {
            $scope.alerts.push({
                type: "warning",
                msg: String(response.data.message)
            });
        });
    };

    //Create Drop down fields
    $scope.loadSector = function () {
        var _url = "/Sector/GetSectorByStatus?lId=" + $scope.language.LanguageId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.SectorDDL = response.data;                
            });
    }

    $scope.loadSegment = function (data) {
        var _url = "/Segment/GetSegmentBySector?lId=" + $scope.language.LanguageId + "&sectorId=" + data;
        $http.get(_url)
            .then(function (response) {
                $scope.SegmentDDL = response.data;
            });
    }

    $scope.loadIndustry = function (data) {
        var _url = "/Industry/GetIndustryBySegment?lId=" + $scope.language.LanguageId + "&segmentId=" + data;
        $http.get(_url)
            .then(function (response) {
                $scope.IndustryDDL = response.data;

            });
    }

    $scope.loadAssetCategory = function () {
        $scope.AssetCategoryDDL = [];
        var _url = "/taxonomy/GetAssetCategory?LanguageId=" + $scope.language.LanguageId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.AssetCategoryDDL = response.data;
            });
    }

    $scope.loadAssetClass = function (data) {
        var _url = "/taxonomy/GetLoadListItem?Type=IndustryCategoryAssetClass&lId=" + $scope.language.LanguageId + "&sId=" + $scope.Taxonomy.IndustryId + "&sId1=" + data;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetClassDDL = response.data;
            });
    }

    $scope.S_loadAssetClass = function (data) {
        var _url = "/taxonomy/GetLoadListItem?Type=IndustryCategoryAssetClass&lId=" + $scope.language.LanguageId + "&sId=" + $scope.S_Taxonomy.IndustryId + "&sId1=" + data;
        $http.get(_url)
            .then(function (response) {
                $scope.AssetClassDDL = response.data;
            });
    }

    $scope.loadAssetType = function (data) {
        var _url = "/taxonomy/GetLoadListItem?Type=AssetClassAssetType&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.AssetTypeDDL = response.data;
            });
    }


    $scope.AssetClassChange = function (data) {
        $scope.loadAssetType(data); 
        $scope.loadFailureMode(data);
    }

    $scope.s_AssetClassChange = function (data) {
        $scope.loadAssetType(data);
        //$scope.loadFailureMode(data);
    }

    $scope.loadAssetSequence = function (data) {
        var _url = "/taxonomy/GetLoadListItem?Type=AssetTypeAssetSequence&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.AssetSequenceDDL = response.data;
            });
    }

    //$scope.loadFailureMode = function (data) {
    //    var _url = "/taxonomy/GetLoadListItem?Type=FailureMode&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureModeDDL = response.data;
    //        });
    //}

    //$scope.loadFailureCause = function (data) {
    //    var _url = "/taxonomy/GetLoadListItem?Type=FailureCause&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureCauseDDL = response.data;
    //        });
    //};


    //$scope.loadAssetType = function (data) {
    //    var _url = "/AssetType/GetAssetTypeByIndustry?lId=" + $scope.language.LanguageId + "&industryId=" + data;
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.AssetTypeDDL = response.data;

    //        });
    //}

    //$scope.loadFailureMode = function (data) {
    //    var _url = "/FailureMode/GetFailureModeByAssetType?lId=" + $scope.language.LanguageId + "&assetTypeId=" + data;
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureModeDDL = response.data;

    //        });
    //}

    //$scope.loadFailureCause = function (data) {
    //    var _url = "/FailureCause/GetFailureCauseByFailureMode?lId=" + $scope.language.LanguageId + "&failureModeId=" + data;
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureCauseDDL = response.data;
    //        });
    //};

    //$scope.loadFailureMode = function (data) {
    //    var _url = "/FailureMode/GetFailureModeByStatus?lId=" + $scope.language.LanguageId + "&status=Y";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureModeDDL = response.data;

    //        });
    //}

    //$scope.loadFailureCause = function (data) {
    //    var _url = "/FailureCause/GetFailureCauseByStatus?lId=" + $scope.language.LanguageId + "&status=Y";
    //    $http.get(_url)
    //        .then(function (response) {
    //            $scope.FailureCauseDDL = response.data;
    //        });
    //};

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadSector();
            $scope.loadAssetCategory();
            $scope.loadFailureCause();
            //$scope.loadFailureMode();
            if ($scope.isPageLoad) {
                $scope.loadData();
            }
        }
    });

    $scope.save = function () {
        if (!$scope.Taxonomy.MTBF) {
            $scope.Taxonomy.MTBF = 0;
        }
        if (!$scope.Taxonomy.MTTR) {
            $scope.Taxonomy.MTTR = 0;
        }
        if (!$scope.Taxonomy.MTTROld) {
            $scope.Taxonomy.MTTROld = 0;
        }
        if (!$scope.Taxonomy.MTBFOld) {
            $scope.Taxonomy.MTBFOld = 0;
        }

        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Taxonomy/Create";

            $http.post(postUrl, JSON.stringify($scope.Taxonomy)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        $scope.alerts.push({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else {
                        $scope.alerts.push({
                            msg: "Data saved Successfully."
                        });
                        $scope.clearOut();
                        $scope.clearValue();
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
        if (!$scope.Taxonomy.MTBF) {
            $scope.Taxonomy.MTBF = 0;
        }
        if (!$scope.Taxonomy.MTTR) {
            $scope.Taxonomy.MTTR = 0;
        }
        if (!$scope.Taxonomy.MTTROld) {
            $scope.Taxonomy.MTTROld = 0;
        }
        if (!$scope.Taxonomy.MTBFOld) {
            $scope.Taxonomy.MTBFOld = 0;
        }

        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Taxonomy/Update";
            $http.post(postUrl, JSON.stringify($scope.Taxonomy)).then(function (response) {
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
        $http.get("/Taxonomy/GetTransTaxonomy?sId=" + row.SegmentId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.sno = i + 1;
                });

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

    $scope.import = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfImportModal.html',
            controller: 'skfImportModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "language": $scope.language, "templateName": 'Taxonomy' };
                }
            }
        });

        modalInstance.result.then(function (gridData) {
            $scope.loadData();
        }, function () {
            $scope.loadData();
        });
    };
});

//MultiLanguage popup controller
app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {
    var _param = params;
    $scope.formatters = {};

    $scope.columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false,
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>',
            minWidth: 150
        },
        { name: 'SegmentCode', displayName: 'Segment Code', enableColumnResizing: true, enableCellEdit: false, minWidth: 150 },
        { name: 'SegmentName', displayName: 'Segment Name', enableColumnResizing: true, enableCellEdit: true, minWidth: 150 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: true, minWidth: 200 }
    ];

    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: false,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'SEMaintenance_Taxonomy.xlsx',
        exporterExcelSheetName: 'EMaintenance_Taxonomy',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
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
            var postUrl = "/Segment/SaveMultilingual";
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

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

