app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'dndLists');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, apiFactory, alertFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.P_Status = "All";

    var _columns = [
        {
            name: 'sno', displayName: '#', pinnedLeft: true, width: "4%",cellClass: getCellClass, minWidth: 50,enableFiltering: false, enableSorting: false, enableHiding: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ProgramCode', displayName: 'Program Code', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'ProgramName', pinnedLeft: true, displayName: 'Program Name', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 150 },
        { name: 'MenuOrder', type:'number', displayName: 'Menu Order', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 80 },
        { name: 'ControllerName', displayName: 'Controller Name', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 150 },
        { name: 'GroupCode', displayName: 'Group Code', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 150 },
        { name: 'MenuGroupName', displayName: 'Menu Group',cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'MenuName', displayName: 'Menu Name', cellClass: getCellClass,enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'SubgroupCode', displayName: 'Sub-Group Code', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'Descriptions', displayName: 'Description', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'IconName', displayName: 'Icon Name',cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'LinkUrl', displayName: 'Link Url', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        { name: 'ActionName', displayName: 'Action Name',cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 150 },
        {
            name: 'Active', displayName: 'Status',cellClass: getCellClass,
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
            name: 'Action', enableFiltering: false, enableSorting: false,cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Program" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.ProgramPrivilegeRel(row.entity)" <i class="fa fa-link icon-space-before" tooltip-append-to-body="true" uib-tooltip="Program Privilege Relation" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "9%",
            minWidth: 100
        }
    ];

    $scope.editRow = function (row) {
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.Program = row;
        $scope.Program.MenuGroupId = row.MenuGroupid;
        $scope.isCreate = false;
       
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
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
        $scope.Program = {
            ProgramId: 0,
            LanguageId: $scope.language.LanguageId,
            ProgramCode: null,
            MenuOrder: null,
            ControllerName: null,
            ProgramName: null,
            MenuName: null,
            IconName: null,
            GroupCode: null,
            SubgroupCode: null,
            Descriptions: null,
            Active: null,
            MenuGroupId: 0,
            LookupId: 0,
            LinkUrl: null,
            Internal: 'N',
            ActionName: null
        };
        $scope.resetForm();
    };

    $scope.clearvalue = function () {
        $scope.P_Status = 'All';
    };
    $scope.clearvalue();

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //    $scope.gridOpts.data = [];
    //};

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
        exporterExcelFilename: 'EMaintenance_Program.xlsx',
        exporterExcelSheetName: 'EMaintenance_Program',
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
        $scope.isPageLoad = true;
        var _url = "/Program/GetProgramByStatus?lId=" + $scope.language.LanguageId + "&status=" + $scope.P_Status;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                });
            });
    };

    $scope.loadProgram = function () {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=MenuGroup";
        $http.get(_url)
            .then(function (response) {
                $scope.ProgramDDL = response.data;
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.loadProgram();
            $scope.loadData();
            $scope.createToggle();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
        }
    });

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Program/Create";

            $http.post(postUrl, JSON.stringify($scope.Program)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else if (response.data.isException) {
                        if (response.data.message) {
                            alertFactory.setMessage({
                                type: "warning",
                                msg: String(response.data.message),
                                exc: String(response.data.exception)
                            });
                        }
                    }
                    else {
                        alertFactory.setMessage({
                            msg: "Data saved Successfully."
                        });
                        $scope.createToggle();
                        $scope.clearvalue();
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
            var postUrl = "/Program/Update";
            $http.post(postUrl, JSON.stringify($scope.Program)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                    else if (response.data.isException) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: response.data.message
                        });
                    }
                    else {
                        alertFactory.setMessage({
                            msg: "Data updated Successfully."
                        });
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
        $http.get("/Program/GetTransProgram?pId=" + row.ProgramId)
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

    $scope.ProgramPrivilegeRel = function (row) {
        $http.get("/ProgramPrivilegeRel/GetProgramPrivilegeAccess?pId=" + row.ProgramId + "&lId=" + $scope.language.LanguageId)
            .then(function (response) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'skfRoleGroupModal.html',
                    controller: 'skfRoleGroupModalCtrl',
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

});

//MultiLanguage popup controller
app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.ProgramName = params.row.ProgramName;
    $scope.formatters = {};

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'LanguageName', displayName: 'Language ', enableCellEdit: false, 
            cellTemplate: '<div> &nbsp;&nbsp;&nbsp;<img class="grid-flag" src="/images/flags/{{row.entity.LanguageCountryCode.toLowerCase()}}.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ row.entity.LanguageName }}</div>',
            minWidth: 150
        },
        { name: 'ProgramName', displayName: 'Program Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 },
        { name: 'MenuName', displayName: 'Menu Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 150 }

    ];

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_Program.xlsx',
        exporterExcelSheetName: 'EMaintenance_Program',
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
            var postUrl = "/Program/SaveMultilingual";
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

//program popup controller
app.controller('skfRoleGroupModalCtrl', function ($scope, $http, $uibModalInstance, params, alertFactory) {
    var _data = JSON.parse(params.data[0].RrogramPrivilegeRelation)[0];
    $scope.ProgramName = params.row.ProgramName;

    $scope.models = [
        { listName: "Available", cssClass: 'warning', items: _data.Available ? _data.Available : [], dragging: false },
        { listName: "Associated", cssClass: 'success', items: _data.Associated ? _data.Associated : [], dragging: false }
    ];

    /**
     * dnd-dragging determines what data gets serialized and send to the receiver
     * of the drop. While we usually just send a single object, we send the array
     * of all selected items here.
     */
    $scope.getSelectedItemsIncluding = function (list, item) {
        item.selected = true;
        return list.items.filter(function (item) { return item.selected; });
    };

    $scope.btnright = false;
    $scope.btnleft = false;
    $scope.setSelected = function (list, item) {
        item.selected = !item.selected;
        list.selectFlag = !(list.items.length == list.items.filter(function (item) { return item.selected; }).length);
        if (item.selected && list.listName == "Available") {
            $scope.btnright = true;
        } else {
            $scope.btnright = false;
        }

        if (item.selected && list.listName == "Associated") {
            $scope.btnleft = true;
        } else {
            $scope.btnleft = false;
        }
    };

    /**
     * We set the list into dragging state, meaning the items that are being
     * dragged are hidden. We also use the HTML5 API directly to set a custom
     * image, since otherwise only the one item that the user actually dragged
     * would be shown as drag image.
     */
    $scope.onDragstart = function (list, event) {
        list.dragging = true;
        if (event.dataTransfer.setDragImage) {
            var img = new Image();
            img.src = 'images/ic_content_copy_black_24dp_2x.png';
            event.dataTransfer.setDragImage(img, 0, 0);
        }
    };

    /**
     * In the dnd-drop callback, we now have to handle the data array that we
     * sent above. We handle the insertion into the list ourselves. By returning
     * true, the dnd-list directive won't do the insertion itself.
     */
    $scope.onDrop = function (list, items, index) {
        angular.forEach(items, function (item) { item.selected = false; });
        list.selectFlag = true;
        list.items = list.items.slice(0, index)
            .concat(items)
            .concat(list.items.slice(index));
        $scope.btnright = false;
        $scope.btnleft = false;
        return true;
    };

    /**
     * Last but not least, we have to remove the previously dragged items in the
     * dnd-moved callback.
     */
    $scope.onMoved = function (list) {
        list.selectFlag = true;
        list.items = list.items.filter(function (item) { return !item.selected; });
    };

    //On move right only selected item
    $scope.ShuttleRight = function (list) {
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 1) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }
                    });
                }
            });
        }
    };

    //On move right all
    $scope.ShuttleRightAll = function (list) {
        //$scope.selectAll(list, flag);
        angular.forEach(list.items, function (item, i) {
            item.selected = true;
        });
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 1) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    // On Move Left only selected item
    $scope.ShuttleLeft = function (list, ) {
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 0) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    // On Move Left All
    $scope.ShuttleLeftAll = function (list) {
        //$scope.selectAll(list, flag);
        angular.forEach(list.items, function (item, i) {
            item.selected = true;
        });
        $scope.ListItems = list;
        for (var i = $scope.ListItems.items.length - 1; i >= 0; i--) {
            angular.forEach($scope.ListItems.items, function (item, i) {
                if (item.selected == true) {
                    item.selected = false;
                    angular.forEach($scope.models, function (data, _i) {
                        if (_i == 0) {
                            data.items.push(item);
                        } else {
                            data.items.splice(i, 1);
                            $scope.btnright = false;
                            $scope.btnleft = false;
                        }

                    });
                }
            });
        }
    };

    $scope.save = function () {
        var postData = {};
        postData.ProgramId = _data.ProgramId;
        postData.ProgramPrivilageRelations = [];
        angular.forEach($scope.models, function (m, i) {
            angular.forEach(m.items, function (item, j) {
                if (m.listName == 'Associated') {
                    item.Active = 'Y';
                }
                else {
                    item.Active = 'N';
                }

                postData.ProgramPrivilageRelations.push(item);
            });
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/ProgramPrivilegeRel/Create";
            $http.post(postUrl, JSON.stringify(postData)).then(function (response) {
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