app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'angucomplete-alt', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, $timeout, clientFactory, $window) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isEditDrive = false;
    $scope.isEditInter = false;
    $scope.isEditDriven = false;
    $scope.isViewDriven = false;
    $scope.isViewDrive = false;
    $scope.isView = false;
    $scope.isViewInter = false;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.isCreate = true;
    $scope.isCreateDrive = true;
    $scope.isCreateInter = true;
    $scope.isCreateDriven = true;
    $scope.isSearch = true;
    $scope.isSearchInter = false;
    $scope.isSearchDriven = false;
    $scope.Active = "Y";
    $scope.stage = "";
    $scope.isEdit = false;
    $scope.isSaved = false;
    $scope.equipmentListActive = true;
    $scope.equipment = {
        EquipmentId: 0,
    }

    $scope.resetForm = function (_) {
        setTimeout(function () {
            var elements = document.getElementsByName(_)[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    // Toggle Validation Script
    $scope.next = function (stage) {
        $scope.DriveActive = false;
        $scope.equipmentListActive = false;
        $scope.IntermediateActive = false;
        $scope.DrivenActive = false;
        $scope.equipmentActive = false;
        if (stage == "stage2" || stage == "stage1" || stage == "stage0") {
            if (stage == "stage2") {
                $scope.DriveActive = true;
                if ($scope.userForm.$valid && $scope.isSaved && $scope.readOnlyPage) {
                    if (!$scope.isEditDrive && !$scope.isViewDrive) {
                        if ($scope.driveUnit.IdentificationName == null) {
                            $scope.createDriveToggle();
                        }
                    }
                    $scope.readOnlyPage = true;
                } else if ($scope.userForm.$valid && $scope.isSaved) {
                    if (!$scope.isEditDrive && !$scope.isViewDrive) {
                        if ($scope.driveUnit.IdentificationName == null) {
                            $scope.createDriveToggle();
                        }
                    }
                }

            } else if (stage == "stage1") {
                $scope.equipmentActive = true;
                $scope.isSaved = true;
                $scope.isSearch = false;
                $timeout(function () {
                    if (!$scope.isEdit && !$scope.isView) {
                        //$scope.clearModal();
                        if ($scope.responseId) {
                            $scope.equipment.PlantAreaId = $scope.responseId;
                            sessionStorage.removeItem('responseId');
                        } else {
                            //$scope.equipment.PlantAreaId = null;
                        }
                        if ($scope.EqlistOrder) {
                            $scope.equipment.ListOrder = $scope.EqlistOrder;

                        } else {
                            $scope.equipment.ListOrder = 1;
                        }
                    }

                }, 50);

            } else {
                if ($scope.userForm.$valid) {
                    $scope.isSaved = true;
                } else {
                    $scope.isSaved = false;
                }
                $scope.equipmentListActive = true;
            }
        } else if (stage == "stage3" || stage == "stage4") {
            if (stage == "stage3") {
                $scope.IntermediateActive = true;
                if ($scope.isCreateInter) {
                    $scope.createInterToggle();
                }
            } else {
                $scope.DrivenActive = true;
                if ($scope.isCreateDriven) {
                    $scope.createDrivenToggle();
                }
            }
        }
        $scope.stage = stage;
        $scope.moreFields = false;
    };

    $scope.moreFields = false;
    $scope.morefields = function () {
        if ($scope.moreFields) {
            $scope.moreFields = false;
        } else {
            $scope.moreFields = true;
        }
    }

    $scope.loadDrive = function (data) {
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=" + $scope.equipment.EquipmentId + "&rId=0&type=Drive&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts1.data = response.data;
                $scope.DriveOrderIndex = $scope.gridOpts1.data.length + 1;
                angular.forEach($scope.gridOpts1.data, function (val, i) {
                    val.sno = i + 1;
                    val.Type = 'Drive';
                    //$scope.DriveOrderIndex = val.sno + 1;
                });
                if (data) {
                    return $scope.next('stage2');
                }
            });
    }

    $scope.GotoDrive = function () {
        if ($scope.equipment.EquipmentId) {
            $scope.loadDrive("load");
        } else if ($scope.userForm.$valid && $scope.isSaved) {
            if (!$scope.isEditDrive || !$scope.isViewDrive) {
                if ($scope.driveUnit.IdentificationName == null) {
                    $scope.clearDriveModal();
                }
                $scope.driveUnit.ListOrder = 1;
            }
            $scope.next('stage2');
        }
    };

    // Equipment List
    // Grid Content
    $scope.columns = [
        {
            name: 'sno', displayName: '#', width: "2%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', cellClass: getCellClass, enableColumnResizing: true, width: "14%", minWidth: 100, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'AreaName', displayName: 'Area', cellClass: getCellClass, enableColumnResizing: true, width: "13%", minWidth: 100 },
        { name: 'SystemName', displayName: 'System', cellClass: getCellClass, enableColumnResizing: true, width: "13%", minWidth: 100 },
        { name: 'EquipmentCode', displayName: 'Equipment Number', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass, enableColumnResizing: true, width: "14%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.viewRow(row.entity)">{{row.entity.EquipmentName}}</a></div>'
        },
        { name: 'ListOrder', displayName: 'Reporting Order', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 100 },
        {
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "4%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Equipment" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.newFile(row)"><i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.clone(row)"><i class="fa fa-clone icon-space-before" tooltip-append-to-body="true" uib-tooltip="Clone Unit" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.failureReport(row.entity)"><i class="fa fa-openid icon-space-before" tooltip-append-to-body="true" uib-tooltip="Failure Report" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.AvoidedPlMain(row.entity)"><i class="fa fa-gg icon-space-before" tooltip-append-to-body="true" uib-tooltip="Avoided Planned Maintenance" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "14%",
            minWidth: 150
        }
    ];

    $scope.editRow = function (row) {
        $scope.readOnlyPage = false;
        $scope.isEdit = true;
        $scope.isView = false;
        $scope.clearModal();
        $scope.equipment = row;
        $scope.loadArea(row.PlantAreaId, 'Edit');
        $scope.loadSystem(row.AreaId, 'Edit');
        $scope.isCreate = false;
        $scope.isCreate = false;
        $scope.isSearch = false;
        $scope.createDrivenToggle();
        $scope.createInterToggle();
        $scope.createDriveToggle();
        $scope.next('stage1');
    };

    $scope.viewRow = function (row) {
        $scope.readOnlyPage = true;
        $scope.isView = true;
        $scope.isEdit = false;
        $scope.clearModal();
        $scope.equipment = row;
        $scope.loadArea(row.PlantAreaId, 'Edit');
        $scope.loadSystem(row.AreaId, 'Edit');
        $scope.isCreate = false;
        $scope.isSearch = false;
        //$scope.isDriveBearing = true;
        //$scope.isNDriveBearing = true;
        $scope.createDrivenToggle();
        $scope.createInterToggle();
        $scope.createDriveToggle();
        $scope.next('stage1');
    };

    $scope.clearModal = function () {
        $scope.isProcess = false;
        $scope.equipment = {
            EquipmentId: 0,
            PlantAreaId: null,
            PlantAreaName: null,
            AreaId: null,
            AreaName: null,
            SystemId: null,
            SystemName: null,
            EquipmentCode: null,
            EquipmentName: null,
            Descriptions: null,
            ListOrder: null,
            OrientationId: null,
            MountingId: null,
            StandByEquipId: null,
            Active: 'Y'
        };
        var data = "userForm";
        $scope.resetForm(data);
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
    };

    $scope.clearValue = function () {
        $scope.S_Equipment = {
            Status: 'All'
        };
    };
    $scope.clearValue();

    // Use case related functionalities
    $scope.searchToggle = function () {
        $scope.isSearch = true;
        $scope.isView = false;
        $scope.readOnlyPage = false;
        $scope.next('stage0');
    };

    $scope.createToggle = function () {
        $scope.readOnlyPage = false;
        $scope.isCreate = true;
        $scope.isSearch = false;
        $scope.isEdit = false;
        $scope.isView = false;
        $scope.isSaved = true;
        $scope.next('stage1');
        $scope.createDrivenToggle();
        $scope.createInterToggle();
        $scope.createDriveToggle();
        $scope.gridOpts1.data = [];
        $scope.gridOpts2.data = [];
        $scope.gridOpts3.data = [];
        $scope.clearOut();
        $timeout(function () {
            if ($scope.EqlistOrder) {
                $scope.equipment.ListOrder = $scope.EqlistOrder;
            } else {
                $scope.equipment.ListOrder = 1;
            }

        }, 50);

        if ($scope.responseId) {
            $scope.equipment.PlantAreaId = $scope.responseId;
            sessionStorage.removeItem('responseId');
        } else {
            $scope.equipment.PlantAreaId = null;
        }
    };

    $scope.loadIndex = function () {
        var data = 0;
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&eId=" + data + "&rId=0&type=Equipment" + "&status=All";
        $http.get(_url)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.index = i + 1;
                    $scope.EqlistOrder = val.index + 1;
                });
            });
    };

    $scope.loadEq = function () {
        $scope.isPageLoad = true;
        $scope.gridOpts.data = [];
        var data = 0;
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&eId=" + data + "&rId=0&type=Equipment" + "&status=" + $scope.S_Equipment.Status;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                    val.Type = 'Equipment';
                });
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();

            $scope.responseId = JSON.parse(sessionStorage.getItem("responseId"));
            if ($scope.responseId != null) {
                $scope.next('stage1');
            }
            $scope.loadStandByEquipment();
            $scope.loadMounting();
            $scope.loadOrientation();
            $scope.loadCoupling();
            $scope.loadPlant();
            $scope.loadDriveMFT();
            $scope.loadDrivenMFT();
            $scope.loadIntermediateMFT();
            $scope.loadOperationMode();
            $scope.loadIndex();
            $scope.loadEq();
            $scope.loadlineFrequency();
            $scope.loadspeedType();
            $scope.loadSensorProvider();
            //if ($scope.isPageLoad) {
            //    $scope.loadEq();
            //}
        }
    });

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);

        if (clientInfo == null) {

            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo != 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    }

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

    $scope.loadPlant = function () {
        $scope.PlantDDL = [];
        $scope.defaultplant = {
            PlantAreaId: null,
            PlantAreaName: "--Select--"
        };
        var _url = "/Plant/GetPlantByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;
                $scope.PlantDDL.splice(0, 0, $scope.defaultplant);
            });
    };

    $scope.loadArea = function (data, val) {
        if (val == 'change') {
            $scope.equipment.AreaId = null;
            $scope.equipment.SystemId = null;
        }
        $scope.AreaDDL = [];
        $scope.defaultarea = {
            AreaId: null,
            AreaName: "--Select--"
        };
        var _url = "/taxonomy/GetLoadListItem?Type=Area&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.AreaDDL = response.data;
                $scope.AreaDDL.splice(0, 0, $scope.defaultarea);
            });
    };

    $scope.loadSystem = function (data, val) {
        $scope.SystemDDL = [];
        if (val == 'change') {
            $scope.equipment.SystemId = null;
        }

        $scope.defaultsystem = {
            SystemId: null,
            SystemName: "--Select--"
        };
        var _url = "/taxonomy/GetLoadListItem?Type=System&lId=" + $scope.language.LanguageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.SystemDDL = response.data;
                $scope.SystemDDL.splice(0, 0, $scope.defaultsystem);
            });
    };

    $scope.loadOrientation = function (data) {
        $scope.OrientationDDL = [];
        $scope.defaultorientation = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=Orientation";
        $http.get(_url)
            .then(function (response) {
                $scope.OrientationDDL = response.data;
                $scope.OrientationDDL.splice(0, 0, $scope.defaultorientation);
            });
    };

    $scope.loadlineFrequency = function () {
        $scope.LineFrequencyDDL = [];
        $scope.defaultLineFrequency = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=LineFrequency";
        $http.get(_url)
            .then(function (response) {
                $scope.LineFrequencyDDL = response.data;
                $scope.LineFrequencyDDL.splice(0, 0, $scope.defaultLineFrequency);
            });
    };


    $scope.onTypechange = function (val) {
        for (i = 0; i < $scope.SpeedTypeDDL.length; i++) {
            if (val === $scope.SpeedTypeDDL[i].LookupId && $scope.SpeedTypeDDL[i].LookupCode === 'SUV') {
                $scope.isTypeDrive = true;
            } else if (val === $scope.SpeedTypeDDL[i].LookupId && $scope.SpeedTypeDDL[i].LookupCode !== 'SUV') {
                $scope.isTypeDrive = false;
            }
        }
    }

    $scope.loadspeedType = function () {
        $scope.SpeedTypeDDL = [];
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=SpeedType";
        $http.get(_url)
            .then(function (response) {
                $scope.SpeedTypeDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    if (val.LookupCode === 'STC') {
                        $scope.DefaultSpeedTypeId = val.LookupId;
                    }
                });
            });
    };

    $scope.loadSensorProvider = function () {
        $scope.SensorProviderDDL = [];
        $scope.defaultSensorProvider = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=SensorProvider";
        $http.get(_url)
            .then(function (response) {
                $scope.SensorProviderDDL = response.data;
                $scope.SensorProviderDDL.splice(0, 0, $scope.defaultSensorProvider);
            });
    };

    $scope.loadMounting = function () {
        $scope.MountingDDL = [];
        $scope.defaultmounting = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=Mounting";
        $http.get(_url)
            .then(function (response) {
                $scope.MountingDDL = response.data;
                $scope.MountingDDL.splice(0, 0, $scope.defaultmounting);
            });
    };

    $scope.loadStandByEquipment = function () {
        $scope.StandByEquipmentDDL = [];
        $scope.defaultStandbyEquip = {
            EquipmentId: null,
            EquipmentName: "--Select--"
        };
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&eId=" + $scope.equipment.EquipmentId + "&rId=0&type=Equipment" + "&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.StandByEquipmentDDL = response.data;
                $scope.StandByEquipmentDDL.splice(0, 0, $scope.defaultStandbyEquip);
            });
    };

    $scope.loadCoupling = function () {
        $scope.CouplingDDL = [];
        $scope.defaultcoupling = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=Coupling";
        $http.get(_url)
            .then(function (response) {
                $scope.CouplingDDL = response.data;
                $scope.CouplingDDL.splice(0, 0, $scope.defaultcoupling);
            });
    };

    $scope.ReportingSerSettings = {
        checkBoxes: true,
        dynamicTitle: true,
        showUncheckAll: false,
        showCheckAll: false
    };

    $scope.loadDriveReporting = function (data) {
        $scope.DriveSelectedData = [];
        $scope.DriveReporting = [];
        if (data) {
            var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=" + data + "&type=" + "Drive" + "&at=Services&status=All";
        } else {
            _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=0&type=" + "Drive" + "&at=Services&status=All";
        }

        $http.get(_url)
            .then(function (response) {
                $scope.DrivereportingDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    if ($scope.isCreateDrive) {
                        if (i == 0) {
                            val.Active = "Y";
                        }
                    }
                    $scope.DriveReporting.push({
                        id: val.ServiceId, label: val.ServiceName
                    });
                    if (val.Active == 'Y') {
                        $scope.DriveSelectedData.push({ id: val.ServiceId });
                    }
                });
            });
    };

    $scope.loadEdit = function (data) {
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&csId=" + $scope.ClientSiteId + "&eId=" + data + "&rId=0&type=Equipment" + "&status=" + $scope.S_Equipment.Status;
        $http.get(_url)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    if (val.EquipmentId === data) {
                        $scope.readOnlyPage = false;
                        $scope.isEdit = true;
                        $scope.isView = false;
                        $scope.clearModal();
                        $scope.isSaved = true;
                        $scope.equipment = val;
                        $scope.isCreate = false;
                        $scope.isSearch = false;
                    }

                });
            });
    }

    $scope.save = function (data) {
        let shaftlen = $scope.driveUnit.Shaft.length;
        $scope.shaftDriveValid = false;
        if (shaftlen > 0) {
            for (let i = 0; i < shaftlen; i++) {
                if ($scope.driveUnit.Shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.driveUnit.Shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                    $scope.shaftDriveValid = true;
                } else {
                    $scope.shaftDriveValid = false;
                    return alertFactory.setMessage({
                        type: "warning",
                        msg: "Please fill the shaft details"
                    });
                }
            }
        } else {
            return alertFactory.setMessage({
                type: "warning",
                msg: "Please fill the shaft details"
            });
        }

        if ($scope.isTypeDrive) {
            if ($scope.driveUnit.MinRPM === null || $scope.driveUnit.MinRPM === '' || $scope.driveUnit.MaxRPM === null || $scope.driveUnit.MaxRPM === '') {
                return alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill the speed type RPM Values"
                });
            }
        }
        if ($scope.equipment.EquipmentId === 0) {
            if ($scope.userForm.$valid && !$scope.readOnlyPage && $scope.shaftDriveValid) {
                $scope.driveUnit.FirstInstallationDate = $scope.driveUnit.FirstInstallationDate ? $filter('date')($scope.driveUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
                //$scope.isProcess = true;
                var postUrl = "/Equipment/Create";
                var DriveUnits = [];
                //$scope.driveUnit.BearingDriveEnd = $scope.saveDrBRow;
                //$scope.driveUnit.BearingNonDriveEnd = $scope.saveNDBRow;
                //$scope.driveunit.DriveEndSensorId = $scope.DriveEndSensorId;
                //$scope.driveunit.NonDriveEndSensorId = $scope.NDriveEndSensorId;
                DriveUnits.push($scope.driveUnit);

                angular.forEach($scope.DrivereportingDDL, function (val, i) {
                    angular.forEach($scope.DriveSelectedData, function (value, index) {
                        if (val.ServiceId == value.id) {
                            val.Active = "Y";
                            val.isDirty = true;
                        } else if (!(val.isDirty)) {
                            val.Active = "N";
                        }
                    });
                });

                $scope.driveUnit.ReportingServices = $scope.DrivereportingDDL;

                var header = {
                    "EquipmentId": $scope.equipment.EquipmentId,
                    "PlantAreaId": $scope.equipment.PlantAreaId,
                    "AreaId": $scope.equipment.AreaId,
                    "SystemId": $scope.equipment.SystemId,
                    "EquipmentCode": $scope.equipment.EquipmentCode,
                    "EquipmentName": $scope.equipment.EquipmentName,
                    "Descriptions": $scope.equipment.Descriptions,
                    "ListOrder": $scope.equipment.ListOrder,
                    "OrientationId": $scope.equipment.OrientationId,
                    "MountingId": $scope.equipment.MountingId,
                    "StandByEquipId": $scope.equipment.StandByEquipId,
                    "Active": $scope.equipment.Active,
                    "UserId": 0,
                    "Type": 'Equipment',
                    "DriveUnits": DriveUnits
                };

                $http.post(postUrl, JSON.stringify(header)).then(function (response) {
                    if (response.data) {
                        if (response.data.toString().indexOf("<!DOCTYE html>") >= 0) {
                            alertFactory.setMessage({
                                type: "warning",
                                msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                            });
                        }
                        else {
                            alertFactory.setMessage({
                                msg: "Data saved Successfully."
                            });

                            angular.forEach(response.data, function (val, i) {
                                var Eid = val.EquipmentId;
                                $scope.equipment.EquipmentId = Eid;
                                $scope.loadEdit(Eid);
                            });
                            $timeout(function () {
                                $scope.loadDrive();
                                $scope.loadEq();
                                $scope.loadIndex();
                                //$scope.createDrivenToggle();
                                //$scope.createInterToggle();
                            }, 200);

                            if (data) {
                                if (data == 'stage3') {
                                    $scope.GotoIntermediate();
                                } else if (data == 'stage4') {
                                    $scope.GotoDriven();
                                }
                                //$scope.next(data);
                            }
                            $timeout(function () {
                                $scope.createDriveToggle();
                            }, 500);

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
        } else {
            if ($scope.equipment.EquipmentId) {
                $scope.driveUnit.EquipmentId = $scope.equipment.EquipmentId;
                $scope.driveUnit.FirstInstallationDate = $scope.driveUnit.FirstInstallationDate ? $filter('date')($scope.driveUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
            }
            angular.forEach($scope.DrivereportingDDL, function (val, i) {
                angular.forEach($scope.DriveSelectedData, function (value, index) {
                    if (val.ServiceId == value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!(val.isDirty)) {
                        val.Active = "N";
                    }
                });
            });
            //$scope.driveUnit.BearingDriveEnd = $scope.saveDrBRow;
            //$scope.driveUnit.BearingNonDriveEnd = $scope.saveNDBRow;
            $scope.driveUnit.ReportingServices = $scope.DrivereportingDDL;
            //$scope.driveunit.DriveEndSensorId = $scope.DriveEndSensorId;
            //$scope.driveunit.NonDriveEndSensorId = $scope.NDriveEndSensorId;

            if (!$scope.isProcess && !$scope.readonlyDrivePage && $scope.shaftDriveValid) {
                $scope.isProcess = true;
                postUrl = "/Equipment/DriveCreate";
                $http.post(postUrl, JSON.stringify($scope.driveUnit)).then(function (response) {
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
                            //$scope.createToggle();
                            $scope.createDriveToggle();
                            $scope.loadDrive();
                            if (data) {
                                if (data == 'stage3') {
                                    $scope.GotoIntermediate();
                                } else if (data == 'stage4') {
                                    $scope.GotoDriven();
                                }
                            }
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
        }

    };

    $scope.update = function () {

        if ($scope.userForm.$valid && !$scope.isProcess && !$scope.readOnlyPage) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/Update";
            $http.post(postUrl, JSON.stringify($scope.equipment)).then(function (response) {
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
                        $scope.loadEq();
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

    //Plant Popup
    $scope.Plant = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfPlant.html',
            controller: 'skfPlantCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { language: $scope.language, 'ClientSiteId': $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.loadPlant();
            if (data) {
                $scope.equipment.PlantAreaId = data;
            }
        }, function () {
        });
    };

    //Area Popup
    $scope.Area = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfArea.html',
            controller: 'skfAreaCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { language: $scope.language, 'ClientSiteId': $scope.ClientSiteId, 'PlantAreaId': $scope.equipment.PlantAreaId };
                }
            }
        });

        modalInstance.result.then(function (flag) {
            $scope.loadArea($scope.equipment.PlantAreaId);
            if (flag) {
                $scope.equipment.AreaId = flag;
            }
        }, function () {
        });
    };

    //System Popup
    $scope.System = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfSystem.html',
            controller: 'skfSystemCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { language: $scope.language, 'ClientSiteId': $scope.ClientSiteId, 'PlantAreaId': $scope.equipment.PlantAreaId, 'AreaId': $scope.equipment.AreaId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.loadSystem($scope.equipment.AreaId);
            if (data) {
                $scope.equipment.SystemId = data;
            }
        }, function () {
        });
    };

    // Drive Unit
    $scope.columns1 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'IdentificationName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "28%", minWidth: 250, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-IdentificationName"><a ng-click="grid.appScope.viewDriveRow(row.entity)">{{row.entity.IdentificationName}}</a></div>'
        },
        {
            name: 'AssetCode', displayName: 'Taxonomy Code', cellClass: getCellClass, enableColumnResizing: true, width: "20%", minWidth: 200
        },
        {
            name: 'ListOrder', displayName: 'List Order', cellClass: getCellClass, enableColumnResizing: true, width: "18%", minWidth: 200
        },
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
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "18%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editDriveRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Drive" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.viewDriveRow(row.entity)"><i class="fa fa-info icon-space-before" tooltip-append-to-body="true" uib-tooltip="View Drive" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.newFile(row)"><i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.clone(row)"><i class="fa fa-clone icon-space-before" tooltip-append-to-body="true" uib-tooltip="Clone Unit" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "12%",
            minWidth: 100
        }
    ];

    $scope.editDriveRow = function (row) {
        $scope.readOnlyDrivePage = false;
        $scope.isEditDrive = true;
        $scope.isViewDrive = false;
        $scope.clearDriveModal();
        $scope.driveUnit = row;
        //$scope.isDriveBearing = true;
        //$scope.isNDriveBearing = true;
        //$scope.DriveDBearingCount = row.DESelectedCount;
        //$scope.DriveNBearingCount = row.NDESelectedCount;
        $scope.driveUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateDrive = false;
        $scope.isSearchDrive = false;
        $scope.loadDriveReporting(row.DriveUnitId);
        $scope.onTypechange(row.SpeedTypeId, 'DR');
        $scope.driveUnit.Shaft = [];
        //$scope.loadNDriveBearing(row.DriveUnitId, row.Type);
        //$scope.loadDriveBearing(row.DriveUnitId, row.Type);
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);

    };

    $scope.viewDriveRow = function (row) {
        $scope.readOnlyDrivePage = true;
        $scope.isViewDrive = true;
        $scope.isEditDrive = false;
        $scope.clearDriveModal();
        $scope.driveUnit = row;
        //$scope.isDriveBearing = true;
        //$scope.isNDriveBearing = true;
        //$scope.DriveDBearingCount = row.DESelectedCount;
        //$scope.DriveNBearingCount = row.NDESelectedCount;
        $scope.driveUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateDrive = false;
        $scope.isSearchDrive = false;
        $scope.loadDriveReporting(row.DriveUnitId);
        $scope.driveUnit.Shaft = [];
        $scope.onTypechange(row.SpeedTypeId, 'DR');
        //$scope.loadNDriveBearing(row.DriveUnitId, row.Type);
        //$scope.loadDriveBearing(row.DriveUnitId, row.Type);
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);
    };

    $scope.clearDriveModal = function () {
        $scope.selectedDBRow = [];
        $scope.selectedNDBRow = [];
        $scope.saveDrBRow = [];
        $scope.saveNDBRow = [];
        $scope.isProcess = false;
        $scope.driveUnit = {
            DriveUnitId: 0,
            EquipmentId: 0,
            IdentificationName: null,
            AssetId: 0,
            AssetCode: null,
            ReportingServices: [],
            ListOrder: null,
            //BearingDriveEnd: [],
            //BearingNonDriveEnd: [],
            MeanRepairManHours: null,
            DownTimeCostPerHour: null,
            CostToRepair: null,
            MeanFailureRate: null,
            DriveFilePath: null,
            ManufacturerId: null,
            LineFrequencyId: null,
            Model: null,
            Frame: null,
            SerialNumber: null,
            RPM: null,
            Voltage: null,
            PowerFactor: null,
            UnitRate: null,
            HP: null,
            MType: null,
            MotorFanBlades: null,
            RotorBars: null,
            Poles: null,
            Slots: null,
            PulleyDiaDrive: null,
            PulleyDiaDriven: null,
            BeltLength: null,
            CouplingId: null,
            Active: 'Y',
            SensorProviderId: null,
            ManufactureYear: null,
            FirstInstallationDate: null,
            OperationModeId: null,
            MinRPM: null,
            MaxRPM: null,
            SpeedTypeId: null,
            Shaft: []
        }
        $scope.isTypeDrive = false;
        var data = "DriveUserForm";
        $scope.resetForm(data);
    };
    $scope.clearDriveModal();

    $scope.loadDriveMFT = function () {
        $scope.ManufactureDDL = [];
        var _url = "/taxonomy/GetLoadListItem?Type=DriveMFT&lId=" + $scope.language.LanguageId + "&sId=0&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.DriveMFTDDL = response.data;
            });
    };

    $scope.loadIntermediateMFT = function () {
        $scope.ManufactureDDL = [];
        var _url = "/taxonomy/GetLoadListItem?Type=IntermediateMFT&lId=" + $scope.language.LanguageId + "&sId=0&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.IntermediateMFTDDL = response.data;
            });
    };

    $scope.loadDrivenMFT = function () {
        $scope.ManufactureDDL = [];
        var _url = "/taxonomy/GetLoadListItem?Type=DrivenMFT&lId=" + $scope.language.LanguageId + "&sId=0&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.DrivenMFTDDL = response.data;
            });
    };

    $scope.loadOperationMode = function () {
        $scope.OperationModeDDL = [];
        $scope.defaultoperationmode = {
            LookupId: null,
            LValue: "--Select--"
        };
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=OperationMode";
        $http.get(_url)
            .then(function (response) {
                $scope.OperationModeDDL = response.data;
                $scope.OperationModeDDL.splice(0, 0, $scope.defaultoperationmode);
            });
    };

    $scope.createDriveToggle = function () {
        //$scope.isDriveBearing = false;
        //$scope.isNDriveBearing = false;
        $scope.isCreateDrive = true;
        $scope.readOnlyDrivePage = false;
        $scope.isSearchDrive = false;
        $scope.isEditDrive = false;
        $scope.isViewDrive = false;
        $scope.clearOutDrive();
        $scope.clearDriveModal();
        //$scope.DriveNBearingCount = 0;
        //$scope.DriveDBearingCount = 0;
        $timeout(function () {
            if ($scope.DriveOrderIndex) {
                $scope.driveUnit.ListOrder = $scope.DriveOrderIndex;
            } else {
                $scope.driveUnit.ListOrder = 1;
            }

        }, 50);
        $scope.loadDriveReporting();
        $scope.driveUnit.SpeedTypeId = $scope.DefaultSpeedTypeId;
    }

    $scope.searchToggleDrive = function () {
        $scope.isCreateDrive = false;
        $scope.isEditDrive = false;
        $scope.isSearchDrive = true;
        $scope.isViewDrive = false;
        $scope.gridOpts1.data = [];
    };

    $scope.clearOutDrive = function () {
        $scope.isEditDrive = false;
        $scope.clearDriveModal();
    };

    $scope.clearValue = function () {
        $scope.S_Drive = {
            Status: 'All'
        };
    };
    $scope.clearValue();

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
        exporterExcelFilename: 'EMaintenance_DriveUnit.xlsx',
        exporterExcelSheetName: 'EMaintenance_DriveUnit',
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

    $scope.updateIndex = function () {
        angular.forEach($scope.gridOpts2.data, function (val, i) {
            val.sno = i + 1;
        });
    };

    $scope.updateDrive = function (data) {
        $scope.shaftDriveValid = false;
        if ($scope.driveUnit.Shaft.length > 0) {
            let shaftlen = $scope.driveUnit.Shaft.length;
            for (let i = 0; i < shaftlen; i++) {
                if ($scope.driveUnit.Shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.driveUnit.Shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                    $scope.shaftDriveValid = true;
                } else {
                    $scope.shaftDriveValid = false;
                    return alertFactory.setMessage({
                        type: "warning",
                        msg: "Please fill the shaft details"
                    });
                }
            }
        } else {
            $scope.shaftDriveValid = true;
        }

        if ($scope.isTypeDrive) {
            if ($scope.driveUnit.MinRPM === null || $scope.driveUnit.MinRPM === '' || $scope.driveUnit.MaxRPM === null || $scope.driveUnit.MaxRPM === '') {
                return alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill the speed type RPM Values"
                });
            }
        }

        angular.forEach($scope.DrivereportingDDL, function (val, i) {
            angular.forEach($scope.DriveSelectedData, function (value, index) {
                if (val.ServiceId == value.id) {
                    val.Active = "Y";
                    val.isDirty = true;
                } else if (!(val.isDirty)) {
                    val.Active = "N";
                }
            });
        });

        $scope.driveUnit.ReportingServices = $scope.DrivereportingDDL;
        //$scope.driveUnit.BearingDriveEnd = $scope.saveDrBRow;
        //$scope.driveUnit.BearingNonDriveEnd = $scope.saveNDBRow;
        //$scope.driveunit.DriveEndSensorId = $scope.DriveEndSensorId;
        //$scope.driveunit.NonDriveEndSensorId = $scope.NDriveEndSensorId;

        $scope.driveUnit.FirstInstallationDate = $scope.driveUnit.FirstInstallationDate ? $filter('date')($scope.driveUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
        if (!$scope.isProcess && !$scope.readOnlyDrivePage && $scope.shaftDriveValid) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/DriveUpdate";
            $http.post(postUrl, JSON.stringify($scope.driveUnit)).then(function (response) {
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
                        //$scope.searchToggleInter();
                        //$scope.GotoDrive();
                        $scope.loadDrive();
                        if (data) {
                            if (data === 'stage3') {
                                $scope.GotoIntermediate();
                            } else if (data == 'stage4') {
                                $scope.GotoDriven();
                            }
                        }
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

    //Intermediate Unit
    $scope.columns2 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'IdentificationName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "28%", minWidth: 250, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-IdentificationName"><a ng-click="grid.appScope.viewIntermediateRow(row.entity)">{{row.entity.IdentificationName}}</a></div>'
        },
        {
            name: 'AssetCode', displayName: 'Taxonomy Code', cellClass: getCellClass, enableColumnResizing: true, width: "20%", minWidth: 200
        },
        {
            name: 'ListOrder', displayName: 'Reporting Order', cellClass: getCellClass, enableColumnResizing: true, width: "18%", minWidth: 150
        },
        {
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "18%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editIntermediateRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Intermediate" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.viewIntermediateRow(row.entity)"><i class="fa fa-info icon-space-before" tooltip-append-to-body="true" uib-tooltip="View Intermediate" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.newFile(row)"><i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.clone(row)"><i class="fa fa-clone icon-space-before" tooltip-append-to-body="true" uib-tooltip="Clone Unit" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "12%",
            minWidth: 100
        }
    ];

    $scope.editIntermediateRow = function (row) {
        $scope.readOnlyInterPage = false;
        $scope.isEditInter = true;
        $scope.clearIntermediateModal();
        $scope.intermediateUnit = row;
        // $scope.isInBearing = true;
        // $scope.isNInBearing = true;
        // $scope.InDBearingCount = row.DESelectedCount;
        // $scope.InNBearingCount = row.NDESelectedCount;   Commenting for now to implement shaft
        $scope.intermediateUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateInter = false;
        $scope.isViewInter = false;
        $scope.isSearchInter = false;
        $scope.loadInterReporting(row.IntermediateUnitId);
        $scope.onTypechange(row.SpeedTypeId, 'IN');
        $scope.intermediateUnit.Shaft = [];
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);
    };

    $scope.viewIntermediateRow = function (row) {
        $scope.readOnlyInterPage = true;
        $scope.isViewInter = true;
        // $scope.isInBearing = true;
        // $scope.isNInBearing = true;  Commenting for now to implement shaft
        $scope.isEditInter = false;
        $scope.clearIntermediateModal();
        $scope.intermediateUnit = row;
        $scope.intermediateUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateInter = false;
        $scope.isSearchInter = false;
        // $scope.InDBearingCount = row.DESelectedCount;
        // $scope.InNBearingCount = row.NDESelectedCount;
        $scope.loadInterReporting(row.IntermediateUnitId);
        $scope.onTypechange(row.SpeedTypeId, 'IN');
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);
    };

    $scope.clearIntermediateModal = function () {
        $scope.isProcess = false;
        $scope.selectedInBRow = [];
        $scope.selectedNDBRow = [];
        $scope.saveInNDBRow = [];
        $scope.saveInDBRow = [];
        $scope.intermediateUnit = {
            IntermediateUnitId: 0,
            IdentificationName: null,
            EquipmentId: 0,
            AssetId: 0,
            AssetCode: null,
            ListOrder: null,
            //BearingDriveEnd: [],
            //BearingNonDriveEnd: [],   Commenting for now to implement shaft
            Shaft: [],
            MeanRepairManHours: null,
            DownTimeCostPerHour: null,
            CostToRepair: null,
            MeanFailureRate: null,
            ManufacturerId: null,
            Model: null,
            Serial: null,
            Size: null,
            Ratio: null,
            BeltLength: null,
            PulleyDiaDrive: null,
            PulleyDiaDriven: null,
            //RatedRPMInput: null,
            //RatedRPMOutput: null,
            PinionInputGearTeeth: null,
            PinionOutputGearTeeth: null,
            IdlerInputGearTeeth: null,
            IdlerOutputGearTeeth: null,
            BullGearTeeth: null,
            ReportingServices: [],
            Active: 'Y',
            ManufactureYear: null,
            FirstInstallationDate: null,
            OperationModeId: null,
            SensorProviderId: null
        }

        $scope.isTypeInter = false;
        var data = "IntermediateUserForm";
        $scope.resetForm(data);
    };

    $scope.createInterToggle = function () {
        //$scope.isInBearing = false;
        //$scope.isNInBearing = false;
        $scope.readOnlyInterPage = false;
        $scope.isCreateInter = true;
        $scope.isSearchInter = false;
        $scope.isEditInter = false;
        $scope.isViewInter = false;
        $scope.clearOutInter();
        $scope.clearIntermediateModal();
        //$scope.InDBearingCount = 0;
        //$scope.InNBearingCount = 0;
        //$scope.isInBearing = false;
        //$scope.isNInBearing = false;
        $timeout(function () {
            if ($scope.InterOrderIndex) {
                $scope.intermediateUnit.ListOrder = $scope.InterOrderIndex;
            } else {
                $scope.intermediateUnit.ListOrder = 1;
            }

        }, 50);
        $scope.loadInterReporting();
        $scope.intermediateUnit.SpeedTypeId = $scope.DefaultSpeedTypeId;
    }

    $scope.searchToggleInter = function () {
        $scope.isCreateInter = true;
        $scope.isEditInter = false;
        $scope.isSearchInter = false;
        $scope.isViewInter = false;
        $scope.gridOpts2.data = [];
    };

    $scope.clearOutInter = function () {
        $scope.isEditInter = false;
        $scope.clearIntermediateModal();
    };

    $scope.clearValue = function () {
        $scope.S_Intermeadiate = {
            Status: 'All'
        };
    };
    $scope.clearValue();

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
        exporterExcelFilename: 'EMaintenance_IntermediateUnit.xlsx',
        exporterExcelSheetName: 'EMaintenance_IntermediateUnit',
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

    $scope.openShaftModal = function (row, readonly, type) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfShaftModal.html',
            controller: 'skfShaftModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'languageId': $scope.language.LanguageId, 'row': row, 'readOnlyPage': readonly, 'type': type };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                switch (type) {
                    case 'DR':
                        $scope.driveUnit.Shaft = data;
                        $scope.driveUnit.isDirty = true;
                        break;
                    case 'DN':
                        $scope.DrivenUnit.Shaft = data;
                        $scope.DrivenUnit.isDirty = true;
                        break;
                }
            }

        }, function () {

        });
    };

    // for intermediate shaft used a seperarte method since the drive end bearings comes after non bearing end
    $scope.openIntermediateShaftModal = function (row, readonly, type) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfIntermediateShaftModal.html',
            controller: 'skfShaftModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'languageId': $scope.language.LanguageId, 'row': row, 'readOnlyPage': readonly, 'type': type };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.intermediateUnit.Shaft = data;
                $scope.intermediateUnit.isDirty = true;
                $scope.shaftCountIntermediate = data.length;
            }

        }, function () {

        });
    };

    $scope.SelectShaft = function (type) {
        switch (type) {
            case 'DR':
                $scope.openShaftModal($scope.driveUnit, $scope.readOnlyDrivePage, type);
                break;
            case 'IN':
                $scope.openIntermediateShaftModal($scope.intermediateUnit, $scope.readOnlyInterPage, type);
                break;
            case 'DN':
                $scope.openShaftModal($scope.DrivenUnit, $scope.readOnlyDrivenPage, type);
                break;
        }
    };

    $scope.loadIntermediate = function (data) {
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=" + $scope.equipment.EquipmentId + "&rId=0&type=Intermediate&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts2.data = response.data;
                $scope.InterOrderIndex = $scope.gridOpts2.data.length + 1;
                angular.forEach($scope.gridOpts2.data, function (val, i) {
                    val.sno = i + 1;
                    val.Type = 'Intermediate';
                    //$scope.InterOrderIndex = val.sno + 1;
                });
                if (data) {
                    return $scope.next('stage3');
                }
            });
    };

    $scope.GotoIntermediate = function () {
        if (!$scope.isEditInter && !$scope.isViewInter) {
            $scope.clearIntermediateModal();
        }
        if ($scope.equipment.EquipmentId) {
            $scope.loadIntermediate("load");
        }
    };

    $scope.loadInterReporting = function (data) {
        $scope.InterReporting = [];
        $scope.InterSelectedData = [];
        if (data) {
            var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=" + data + "&type=" + "Intermediate" + "&at=Services&status=All";
        } else {
            _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=0&type=" + "Intermediate" + "&at=Services&status=All";
        }

        $http.get(_url)
            .then(function (response) {
                $scope.InterreportingDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    if ($scope.isCreateInter) {
                        if (i === 0) {
                            val.Active = "Y";
                        }
                    }
                    $scope.InterReporting.push({
                        id: val.ServiceId, label: val.ServiceName
                    });
                    if (val.Active === 'Y') {
                        $scope.InterSelectedData.push({ id: val.ServiceId });
                    }
                });
            });
    };

    $scope.saveIntermediate = function (data) {
        if ($scope.equipment.EquipmentId) {
            $scope.intermediateUnit.EquipmentId = $scope.equipment.EquipmentId;
            $scope.intermediateUnit.FirstInstallationDate = $scope.intermediateUnit.FirstInstallationDate ? $filter('date')($scope.intermediateUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
        }
        //$scope.intermediateUnit.BearingDriveEnd = $scope.saveInDBRow;
        //$scope.intermediateUnit.BearingNonDriveEnd = $scope.saveInNDBRow;

        angular.forEach($scope.InterreportingDDL, function (val, i) {
            angular.forEach($scope.InterSelectedData, function (value, index) {
                if (val.ServiceId === value.id) {
                    val.Active = "Y";
                    val.isDirty = true;
                } else if (!val.isDirty) {
                    val.Active = "N";
                }
            });
        });

        $scope.isShaftValidate = false;
        let slength = $scope.intermediateUnit.Shaft.length;
        for (let i = 0; i < slength; i++) {
            if ($scope.intermediateUnit.Shaft[i].ShaftName === 'Input Shaft') {
                $scope.isShaftValidate = true;
            }
        }

        $scope.intermediateUnit.ReportingServices = $scope.InterreportingDDL;

        if ($scope.IntermediateUserForm.$valid && !$scope.isProcess && !$scope.readOnlyInterPage && $scope.isShaftValidate) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/IntermediateCreate";
            $http.post(postUrl, JSON.stringify($scope.intermediateUnit)).then(function (response) {
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
                        $scope.loadIntermediate();
                        if (data) {
                            if (data == 'stage4') {
                                $scope.GotoDriven();
                            }
                        }
                        $timeout(function () {
                            $scope.createInterToggle();
                        }, 200);
                        //$scope.GotoIntermediate();
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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please fill the shaft details"
            });
        }
    };

    $scope.updateIntermediate = function (data) {
        $scope.isShaftValidate = false;
        $scope.oShaftValidate = false;
        let slength = $scope.intermediateUnit.Shaft.length;
        if (slength > 0) {
            for (let i = 0; i < slength; i++) {
                if ($scope.intermediateUnit.Shaft[i].ShaftName === 'Input Shaft') {
                    $scope.isShaftValidate = true;
                }
                if ($scope.intermediateUnit.Shaft[i].ShaftName === 'Output Shaft') {
                    $scope.oShaftValidate = true;
                }
            }
        }
        else {
            $scope.isShaftValidate = true;
            $scope.oShaftValidate = true;
        }

        if (!$scope.isProcess && !$scope.readOnlyInterPage && $scope.isShaftValidate && $scope.oShaftValidate) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/IntermediateUpdate";
            //$scope.intermediateUnit.BearingDriveEnd = $scope.saveInDBRow;
            //$scope.intermediateUnit.BearingNonDriveEnd = $scope.saveInNDBRow;
            angular.forEach($scope.InterreportingDDL, function (val, i) {
                angular.forEach($scope.InterSelectedData, function (value, index) {
                    if (val.ServiceId == value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!val.isDirty) {
                        val.Active = "N";
                    }
                });
            });
            $scope.intermediateUnit.ReportingServices = $scope.InterreportingDDL;
            $scope.intermediateUnit.FirstInstallationDate = $scope.intermediateUnit.FirstInstallationDate ? $filter('date')($scope.intermediateUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
            $http.post(postUrl, JSON.stringify($scope.intermediateUnit)).then(function (response) {
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
                        //$scope.searchToggleInter();
                        //$scope.GotoIntermediate();
                        //$scope.createInterToggle();
                        $scope.loadIntermediate();
                        if (data) {
                            if (data == 'stage4') {
                                $scope.GotoDriven();
                            }
                        }
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
        else {
            if (!$scope.isShaftValidate || !$scope.oShaftValidate) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill the shaft details"
                });
            }
        }
    };

    //Driven Unit
    $scope.columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'IdentificationName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "28%", minWidth: 250, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-IdentificationName"><a ng-click="grid.appScope.viewDrivenRow(row.entity)">{{row.entity.IdentificationName}}</a></div>'
        },
        {
            name: 'AssetCode', displayName: 'Taxonomy Code', cellClass: getCellClass, enableColumnResizing: true, width: "22%", minWidth: 200
        },
        {
            name: 'ListOrder', displayName: 'Reporting Order', cellClass: getCellClass, enableColumnResizing: true, width: "12%", minWidth: 150
        },
        {
            name: 'Active', displayName: 'Status', cellClass: getCellClass,
            cellTemplate: '<div class="status"> {{ row.entity.Active == "Y" ? "&nbsp;Active" : "&nbsp;Inactive" }}</div>',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{ value: 'Y', label: 'Active' }, { value: 'N', label: 'Inactive' }]
            },
            width: "18%",
            minWidth: 100
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editDrivenRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Driven" tooltip-class="customClass"></i></a>' +
                //'<a ng-click="grid.appScope.viewDrivenRow(row.entity)"><i class="fa fa-info icon-space-before" tooltip-append-to-body="true" uib-tooltip="View Driven" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.newFile(row)"><i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Upload File" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.clone(row)"><i class="fa fa-clone icon-space-before" tooltip-append-to-body="true" uib-tooltip="Clone Unit" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "15%",
            minWidth: 100
        }
    ];

    $scope.editDrivenRow = function (row) {
        $scope.readOnlyDrivenPage = false;
        $scope.isEditDriven = true;
        $scope.isViewDriven = false;
        $scope.clearDrivenModal();
        $scope.DrivenUnit = row;
        $scope.DrivenUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateDriven = false;
        $scope.isSearchDriven = false;
        //$scope.isDnBearing = true;
        //$scope.isNDnBearing = true;
        //$scope.DnDBearingCount = row.DESelectedCount;
        //$scope.DnNBearingCount = row.NDESelectedCount;
        $scope.loadDrivenReporting(row.DrivenUnitId);
        $scope.DrivenUnit.Shaft = [];
        $scope.onTypechange(row.SpeedTypeId, 'DN');
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);
    };

    $scope.viewDrivenRow = function (row) {
        $scope.readOnlyDrivenPage = true;
        $scope.isViewDriven = true;
        $scope.isEditDriven = false;
        $scope.clearDrivenModal();
        $scope.DrivenUnit = row;
        //$scope.isDnBearing = true;
        //$scope.isNDnBearing = true;
        $scope.DrivenUnit.FirstInstallationDate = row.FirstInstallationDate ? new Date(row.FirstInstallationDate) : null;
        $scope.isCreateDriven = false;
        $scope.isSearchDriven = false;
        //$scope.DnDBearingCount = row.DESelectedCount;
        //$scope.DnNBearingCount = row.NDESelectedCount;
        $scope.loadDrivenReporting(row.DrivenUnitId);
        $scope.onTypechange(row.SpeedTypeId, 'DN');
        $scope.DrivenUnit.Shaft = [];
        $timeout(function () {
            $window.scrollTo(0, 0);
        }, 500);
    };

    $scope.clearDrivenModal = function () {
        $scope.isProcess = false;
        $scope.selectedDnBRow = [];
        $scope.selectedNDnBRow = [];
        $scope.saveDnDBRow = [];
        $scope.saveDnNDBRow = [];
        $scope.DrivenUnit = {
            DrivenUnitId: 0,
            EquipmentId: 0,
            IdentificationName: null,
            AssetId: 0,
            AssetCode: null,
            ListOrder: null,
            //BearingDriveEnd: [],
            //BearingNonDriveEnd: [],
            MeanRepairManHours: null,
            DownTimeCostPerHour: null,
            CostPerUnit: null,
            MeanFailureRate: null,
            Manufacturer: null,
            ManufacturerId: null,
            Model: null,
            ReportingServices: [],
            SerialNumber: null,
            MaxRPM: null,
            Capacity: null,
            Lubrication: null,
            RatedFlowGPM: null,
            PumpEfficiency: null,
            RatedSuctionPressure: null,
            Efficiency: null,
            RatedDischargePressure: null,
            ImpellerVanes: null,
            ImpellerVanesKW: null,
            Stages: null,
            NumberOfPistons: null,
            PumpType: null,
            CostToRepair: null,
            Active: 'Y',
            ManufactureYear: null,
            FirstInstallationDate: null,
            OperationModeId: null,
            SensorProviderId: null,
            //DrivenDriveSensorId: 0,
            //DrivenNonDriveSensorId: 0,
            Shaft: []
        };

        $scope.isTypeDriven = false;
        var data = "DrivenUserForm";
        $scope.resetForm(data);
    };

    $scope.clearOutDriven = function () {
        $scope.isEditDriven = false;
        $scope.clearDrivenModal();
    };

    $scope.searchToggleDriven = function () {
        $scope.isCreateDriven = false;
        $scope.isEditDriven = false;
        $scope.isSearchDriven = false;
        $scope.isViewDriven = false;
        $scope.gridOpts3.data = [];
    };

    $scope.createDrivenToggle = function () {
        //$scope.isDnBearing = false;
        //$scope.isNDnBearing = false;
        $scope.readOnlyDrivenPage = false;
        $scope.isCreateDriven = true;
        $scope.isSearchDriven = false;
        $scope.isEditDriven = false;
        $scope.isViewDriven = false;
        $scope.clearOutDriven();
        //$scope.DnDBearingCount = 0;
        //$scope.DnNBearingCount = 0;
        $scope.clearDrivenModal();
        $timeout(function () {
            if ($scope.DrivenOrderIndex) {
                $scope.DrivenUnit.ListOrder = $scope.DrivenOrderIndex;
            } else {
                $scope.DrivenUnit.ListOrder = 1;
            }

        }, 50);
        $scope.loadDrivenReporting();
        $scope.DrivenUnit.SpeedTypeId = $scope.DefaultSpeedTypeId;
    };

    $scope.clearValue = function () {
        $scope.S_Driven = {
            Status: 'All'
        };
    };
    $scope.clearValue();

    $scope.gridOpts3 = {
        columnDefs: $scope.columns3,
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
        exporterExcelFilename: 'EMaintenance_DrivenUnit.xlsx',
        exporterExcelSheetName: 'EMaintenance_DrivenUnit',
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

    $scope.loadDriven = function (data) {
        var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=" + $scope.equipment.EquipmentId + "&rId=0&type=Driven&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts3.data = response.data;
                angular.forEach($scope.gridOpts3.data, function (val, i) {
                    val.sno = i + 1;
                    val.Type = "Driven";
                    $scope.DrivenOrderIndex = val.sno + 1;
                });
                if (data) {
                    return $scope.next('stage4');
                }
            });
    }

    $scope.GotoDriven = function () {
        var elem = document.getElementById("dropdownMenuButton");
        if (!$scope.isEditDriven && !$scope.isViewDriven) {
            $scope.clearDrivenModal();
        }

        if ($scope.equipment.EquipmentId) {
            $scope.loadDriven("data");
        }
    };

    $scope.loadDrivenReporting = function (data) {
        $scope.DrivenreportingDDL = [];
        $scope.DrivenReporting = [];
        $scope.DrivenSelectedData = [];
        if (data) {
            var _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=" + data + "&type=" + "Driven" + "&at=Services&status=All";
        } else {
            _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.language.LanguageId + "&eId=0&rId=0&type=" + "Driven" + "&at=Services&status=All";
        }

        $http.get(_url)
            .then(function (response) {
                $scope.DrivenreportingDDL = response.data;
                angular.forEach(response.data, function (val, i) {
                    val.ScheduleServiceId = 0;
                    val.ScheduleSetupId = 0;
                    if ($scope.isCreateDriven) {
                        if (i == 0) {
                            val.Active = "Y";
                        }
                    }
                    $scope.DrivenReporting.push({
                        id: val.ServiceId, label: val.ServiceName
                    });
                    if (val.Active == 'Y') {
                        $scope.DrivenSelectedData.push({ id: val.ServiceId });
                    }
                });
            });
    };

    $scope.saveDriven = function () {
        if ($scope.equipment.EquipmentId) {
            $scope.DrivenUnit.EquipmentId = $scope.equipment.EquipmentId;
            $scope.DrivenUnit.FirstInstallationDate = $scope.DrivenUnit.FirstInstallationDate ? $filter('date')($scope.DrivenUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
        }
        //$scope.DrivenUnit.BearingDriveEnd = $scope.saveDnDBRow;
        //$scope.DrivenUnit.BearingNonDriveEnd = $scope.saveDnNDBRow;

        let shaftlen = $scope.DrivenUnit.Shaft.length;
        $scope.shaftDrivenValid = false;
        if (shaftlen > 0) {
            for (let i = 0; i < shaftlen; i++) {
                if ($scope.DrivenUnit.Shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.DrivenUnit.Shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                    $scope.shaftDrivenValid = true;
                } else {
                    $scope.shaftDrivenValid = false;
                    return alertFactory.setMessage({
                        type: "warning",
                        msg: "Please fill the shaft details"
                    });
                }
            }
        } else {
            return alertFactory.setMessage({
                type: "warning",
                msg: "Please fill the shaft details"
            });
        }


        angular.forEach($scope.DrivenreportingDDL, function (val, i) {
            angular.forEach($scope.DrivenSelectedData, function (value, index) {
                if (val.ServiceId == value.id) {
                    val.Active = "Y";
                    val.isDirty = true;
                } else if (!(val.isDirty)) {
                    val.Active = "N";
                }
            });
        });

        $scope.DrivenUnit.ReportingServices = $scope.DrivenreportingDDL;

        if ($scope.DrivenUserForm.$valid && !$scope.isProcess && !$scope.readOnlyDrivenPage && $scope.shaftDrivenValid) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/DrivenCreate";
            $http.post(postUrl, JSON.stringify($scope.DrivenUnit)).then(function (response) {
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
                        $scope.loadDriven();
                        $timeout(function () {
                            $scope.createDrivenToggle();
                        }, 150);

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

    $scope.updateDriven = function () {
        let shaftlen = $scope.DrivenUnit.Shaft.length;
        $scope.shaftDrivenValid = false;
        if (shaftlen > 0) {
            for (let i = 0; i < shaftlen; i++) {
                if ($scope.DrivenUnit.Shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.DrivenUnit.Shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                    $scope.shaftDrivenValid = true;
                } else {
                    $scope.shaftDrivenValid = false;
                    return alertFactory.setMessage({
                        type: "warning",
                        msg: "Please fill the shaft details"
                    });
                }
            }
        } else {
            $scope.shaftDrivenValid = true;
        }

        if ($scope.DrivenUserForm.$valid && !$scope.isProcess && !$scope.readOnlyDrivenPage && $scope.shaftDrivenValid) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/DrivenUpdate";
            //$scope.DrivenUnit.BearingDriveEnd = $scope.saveDnDBRow;
            //$scope.DrivenUnit.BearingNonDriveEnd = $scope.saveDnNDBRow;
            angular.forEach($scope.DrivenreportingDDL, function (val, i) {
                angular.forEach($scope.DrivenSelectedData, function (value, index) {
                    if (val.ServiceId === value.id) {
                        val.Active = "Y";
                        val.isDirty = true;
                    } else if (!val.isDirty) {
                        val.Active = "N";
                    }
                });
            });

            $scope.DrivenUnit.ReportingServices = $scope.DrivenreportingDDL;
            //$scope.DrivenUnit.DrivenDriveEndSensorId = $scope.DrivenDriveEndSensorId;
            //$scope.DrivenUnit.DrivenNonDriveSensorId = $scope.DrivenNDriveEndSensorId;
            $scope.DrivenUnit.FirstInstallationDate = $scope.DrivenUnit.FirstInstallationDate ? $filter('date')($scope.DrivenUnit.FirstInstallationDate, "yyyy-MM-dd 00:00:00") : null;
            $http.post(postUrl, JSON.stringify($scope.DrivenUnit)).then(function (response) {
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
                        $scope.loadDriven();
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

    $scope.ChooseAsset = function (data) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAssetTypeModal.html',
            controller: 'skfAssetTypeModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { Type: data, language: $scope.language, csId: $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                if (data.Type == 'Drive') {
                    $scope.driveUnit.AssetCode = data.AssetClassTypeCode;
                    $scope.driveUnit.AssetId = data.TaxonomyId;
                    $scope.driveUnit.MeanRepairManHours = data.MTTR;
                    $scope.driveUnit.MeanFailureRate = data.MTBF;
                    $scope.driveUnit.DownTimeCostPerHour = data.DownTimeCostPerHour;
                } else if (data.Type === 'Intermediate' || data.Type === 'Driven') {
                    if (data.Type === 'Intermediate') {
                        $scope.intermediateUnit.AssetCode = data.AssetClassTypeCode;
                        $scope.intermediateUnit.AssetId = data.TaxonomyId;
                        $scope.intermediateUnit.MeanRepairManHours = data.MTTR;
                        $scope.intermediateUnit.MeanFailureRate = data.MTBF;
                        $scope.intermediateUnit.DownTimeCostPerHour = data.DownTimeCostPerHour;
                    } else {
                        $scope.DrivenUnit.AssetCode = data.AssetClassTypeCode;
                        $scope.DrivenUnit.AssetId = data.TaxonomyId;
                        $scope.DrivenUnit.MeanRepairManHours = data.MTTR;
                        $scope.DrivenUnit.MeanFailureRate = data.MTBF;
                        $scope.DrivenUnit.DownTimeCostPerHour = data.DownTimeCostPerHour;
                    }
                }
            }
        }, function () {

        });
    };

    // To read the File and display as thumbnail 
    //Attachment Modal
    $scope.newFile = function (row) {
        if (row.entity.Type == 'Equipment' || row.entity.Type == 'Drive') {
            if (row.entity.Type == 'Equipment') {
                $scope.aId = row.entity.EquipmentId;
                $scope.Uname = row.entity.EquipmentName;
            } else {
                $scope.aId = row.entity.DriveUnitId;
                $scope.Uname = row.entity.IdentificationName;
            }
        } else if (row.entity.Type == 'Intermediate' || row.entity.Type == 'Driven') {
            if (row.entity.Type == 'Intermediate') {
                $scope.aId = row.entity.IntermediateUnitId;
                $scope.Uname = row.entity.IdentificationName;
            } else {
                $scope.aId = row.entity.DrivenUnitId;
                $scope.Uname = row.entity.IdentificationName;
            }
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAttachmentModal.html',
            controller: 'skfAttachmentCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { language: $scope.language, aId: $scope.aId, Type: row.entity.Type, Name: $scope.Uname };
                }
            }
        });

        modalInstance.result.then(function () {
            $timeout(function () {
                $window.scrollTo(0, 0);
            }, 500);
        }, function () {
        });
    };

    /** The below method is used to call Clone API **/
    $scope.clone = function (row) {

        var modalInstance = $uibModal.open({
            templateUrl: 'skfClonePopupModal.html',
            controller: 'skfCloneCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (data) {

            switch (data) {
                case 'DR':
                    $scope.loadDrive();
                    break;
                case 'IN':
                    $scope.loadIntermediate();
                    break;
                case 'DN':
                    $scope.loadDriven();
                    break;
                case 'EQ':
                    $scope.loadEq();
                    break;
            }
            if (data === "EQ") {
                $timeout(function () {
                    $scope.readOnlyPage = false;
                    $scope.isCreate = true;
                    $scope.isSearch = false;
                    $scope.isEdit = false;
                    $scope.isView = false;
                    $scope.isSaved = true;
                    //$scope.next('stage1');
                    $scope.createDrivenToggle();
                    $scope.createInterToggle();
                    $scope.createDriveToggle();
                    $scope.gridOpts1.data = [];
                    $scope.gridOpts2.data = [];
                    $scope.gridOpts3.data = [];
                    $scope.clearOut();

                    $window.scrollTo(0, 0);
                }, 500);
            }
        }, function () {

        });
    }

    // Failure Report 
    $scope.failureReport = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfFailureReport.html',
            controller: 'skfFailureReportCtrl',
            windowClass: 'failure-report-modal',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId, 'ClientSiteId': $scope.ClientSiteId, 'FailureModeId': $scope.FailureModeId };
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                $scope.failRepoPopup();
            }
        }, function () {
        });
    };

    // Avoided Planned Maintainence
    $scope.AvoidedPlMain = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAvoidedplmaint.html',
            controller: 'skfAvoidedplmaintCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'row': row, "languageId": $scope.language.LanguageId, 'ClientSiteId': $scope.ClientSiteId, 'FailureModeId': $scope.FailureModeId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.avoidplmainPopup();
            }

        }, function () {

        });
    };

});

app.controller('skfCloneCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {

    $scope.DispTypeName = params.row.entity.Type;
    $scope.PlantAreaName = params.row.entity.PlantAreaName;

    $scope.NoEq = true;
    switch ($scope.DispTypeName) {
        case 'Drive':
            $scope.headingName = params.row.entity.IdentificationName;
            $scope.TypeId = params.row.entity.DriveUnitId;
            $scope.Type = 'DR';
            $scope.NoEq = false;
            break;
        case 'Intermediate':
            $scope.headingName = params.row.entity.IdentificationName;
            $scope.TypeId = params.row.entity.IntermediateUnitId;
            $scope.NoEq = false;
            $scope.Type = 'IN';
            break;
        case 'Driven':
            $scope.headingName = params.row.entity.IdentificationName;
            $scope.TypeId = params.row.entity.DrivenUnitId;
            $scope.NoEq = false;
            $scope.Type = 'DN';
            break;
        case 'Equipment':
            $scope.EquipmentName = params.row.entity.EquipmentName;
            $scope.TypeId = params.row.entity.EquipmentId;
            $scope.Type = 'EQ';
            $scope.NoEq = true;
            break;
    }

    $scope.isClone = true;
    $scope.clone = function () {
        $scope.CloneCount;
        var _url = "/equipment/Clone?type=" + $scope.Type + "&typeId=" + $scope.TypeId + "&cc=" + $scope.CloneCount + "&plId=" + params.row.entity.PlantAreaId;

        $http.get(_url).then(function (response) {
            if (response) {
                $scope.cloneDDL = response.data;
                $scope.isClone = false;
                alertFactory.setMessage({
                    msg: "Data Cloned Successfully."
                });
            }

        }, function (response) {
            if (response.data.message) {
                alertFactory.setMessage({
                    type: "warning",
                    msg: String(response.data.message),
                    exc: String(response.data.exception)
                });

            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.save = function () {
        angular.forEach($scope.cloneDDL, function (val, i) {
            val.LanguageId = params.languageId;
            val.Type = $scope.Type;
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/Equipment/SaveCloneIdentifier";
            $http.post(postUrl, JSON.stringify($scope.cloneDDL)).then(function (response) {
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
                        $uibModalInstance.close($scope.Type);
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

});

app.controller('skfAttachmentCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {
    $scope.iframe = false;
    $scope.noAttachment = false;
    $scope.previewImg = true;
    $scope.uploadFile = true;
    $scope.languageId = params.language.LanguageId;
    $scope.aid = params.aId;
    $scope.Type = params.Type;
    $scope.Uname = params.Name;

    $scope.rowData = params.row;

    $scope.attach = function () {
        $scope.attachments = $scope.rowData.attachment;
    };

    $scope.saveDoc = function () {
        $scope.uploadDocument();
    };

    $scope.getAttachment = function () {
        var _url = "/Equipment/GetEquipmentByStatus?rid=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attachment = response.data;
                angular.forEach($scope.attachment, function (val, i) {
                    if (val.EquipmentId) {
                        val.attachId = val.EquipmentAttachId;
                        val.type = "Equipment";
                    }
                    if (val.DriveUnitId) {
                        val.attachId = val.DriveAttachId;
                        val.type = "Drive";
                    }
                    if (val.IntermediateUnitId) {
                        val.attachId = val.IntermediateAttachId;
                        val.type = "Intermediate";
                    }
                    if (val.DrivenUnitId) {
                        val.attachId = val.DrivenAttachId;
                        val.type = "Driven";
                    }

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
        var _url = "/equipment/DeleteAttachmentById?Type=" + Type + "&AttachmentId=" + AttachmentId;
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
                url: "/Equipment/UploadFilesAjax",
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
        var _url = "/Equipment/GetEquipmentByStatus?rid=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attach = response.data;
                angular.forEach($scope.attach, function (val, i) {
                    if (val.EquipmentAttachId) {
                        $scope.attachId = val.EquipmentAttachId;
                    }
                    if (val.DriveAttachId) {
                        $scope.attachId = val.DriveAttachId;
                    }
                    if (val.IntermediateAttachId) {
                        $scope.attachId = val.IntermediateAttachId;
                    }
                    if (val.DrivenAttachId) {
                        $scope.attachId = val.DrivenAttachId;
                    }
                    if (data == $scope.attachId) {
                        $scope.FileName = val.FileName;
                        $scope.attImage = val.PhysicalPath;
                        $scope.previewImg = false;
                    }

                });
            });
    }

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };
});

//Asset popup controller
app.controller('skfAssetTypeModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.Type = params.Type;


    $scope.loadAsset = function () {
        var _url = "/Equipment/GetAssetByClientSiteId?lId=" + $scope.languageId + "&csId=" + $scope.csId;
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                    $scope.IndustryName = val.IndustryName;
                });
            });
    }();

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'AssetCategoryName', displayName: 'Asset Category', enableCellEdit: false, enableFiltering: true,
            minWidth: 150
        },
        {
            name: 'AssetClassName', displayName: 'Asset Class', enableCellEdit: false, enableFiltering: true,
            minWidth: 150
        },
        {
            name: 'AssetTypeName', displayName: 'Asset Type', enableCellEdit: false, enableFiltering: true,
            minWidth: 150
        },
        {
            name: 'AssetSequenceName', displayName: 'Asset Sequence', enableCellEdit: false, enableFiltering: true,
            minWidth: 150
        },
        {
            name: 'Active', displayName: 'Action', enableFiltering: false, cellTemplate: '<button ng-click="grid.appScope.asset(row.entity)" class="btn btn-primary grid-select-btn">Select</button>',
            width: "15%",
            minWidth: 100
        },
    ];

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
        exporterExcelFilename: 'EMaintenance_FailureCause.xlsx',
        exporterExcelSheetName: 'EMaintenance_FailureCause',
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

    $scope.asset = function (data) {
        angular.forEach($scope.gridOpts.data, function (val, i) {
            if (val.TaxonomyId == data.TaxonomyId) {
                val.Type = $scope.Type;
                $scope.assetType = val;
            }
        });
        $uibModalInstance.close($scope.assetType);
    };

    //$scope.ok = function () {

    //};

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

// Failure Report Popup
app.controller('skfFailureReportCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.row = params.row;
    $scope.languageId = params.languageId;
    $scope.ReportDate = new Date();
    $scope.EquipmentName = params.row.EquipmentName;
    $scope.PlantAreaName = params.row.PlantAreaName;
    $scope.FailureModeId = params.FailureModeId;

    $scope.loadData = function () {
        var _url = "/Equipment/GetFailureReportDetail?eqId=" + params.row.EquipmentId;
        $http.get(_url)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    $scope.DriveUnitList = JSON.parse(val.DriveUnitList);
                    $scope.IntermediateUnitList = JSON.parse(val.IntermediateUnitList);
                    $scope.DrivenUnitList = JSON.parse(val.DrivenUnitList);
                });
            });
    }();

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.FailureReportList = [],
            $('#files').val("");
        $scope.resetForm();
    };


    $scope.clearOut = function () {
        $scope.clearModal();

    };

    $scope.save = function () {

        var FailureReportList = [];

        if ($scope.DriveUnitList) {

            var drivelength = $scope.DriveUnitList.length;
            for (i = 0; i < drivelength; i++) {

                if ($scope.DriveUnitList[i].FailureModeId != null || $scope.DriveUnitList[i].FailureCauseId != null || $scope.DriveUnitList[i].DActualRepairCost != null || $scope.DriveUnitList[i].DActualOutageTime != null) {
                    if ($scope.DriveUnitList[i].FailureModeId != null && $scope.DriveUnitList[i].FailureCauseId != null && $scope.DriveUnitList[i].DActualRepairCost != null && $scope.DriveUnitList[i].DActualOutageTime != null) {
                        $scope.isDriveValidate = true;
                        $scope.DriveUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.DriveUnitList[i]);
                    } else {
                        $scope.isDriveValidate = false;
                        break;
                    }
                } else {
                    $scope.isDriveValidate = true;
                }
            }
        } else {
            $scope.isDriveValidate = true;
        }

        if ($scope.IntermediateUnitList) {
            var interlength = $scope.IntermediateUnitList.length;
            for (i = 0; i < interlength; i++) {

                if ($scope.IntermediateUnitList[i].FailureModeId != null || $scope.IntermediateUnitList[i].FailureCauseId != null || $scope.IntermediateUnitList[i].DActualRepairCost != null || $scope.IntermediateUnitList[i].DActualOutageTime != null) {
                    if ($scope.IntermediateUnitList[i].FailureModeId != null && $scope.IntermediateUnitList[i].FailureCauseId != null && $scope.IntermediateUnitList[i].DActualRepairCost != null && $scope.IntermediateUnitList[i].DActualOutageTime != null) {
                        $scope.isInterValidate = true;
                        $scope.IntermediateUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.IntermediateUnitList[i]);
                    } else {
                        $scope.isInterValidate = false;
                        break;
                    }
                } else {
                    $scope.isInterValidate = true;
                }
            }
        } else {
            $scope.isInterValidate = true;
        }

        if ($scope.DrivenUnitList) {

            var drivenlength = $scope.DrivenUnitList.length;
            for (i = 0; i < drivenlength; i++) {

                if ($scope.DrivenUnitList[i].FailureModeId != null || $scope.DrivenUnitList[i].FailureCauseId != null || $scope.DrivenUnitList[i].DActualRepairCost != null || $scope.DrivenUnitList[i].DActualOutageTime != null) {
                    if ($scope.DrivenUnitList[i].FailureModeId != null && $scope.DrivenUnitList[i].FailureCauseId != null && $scope.DrivenUnitList[i].DActualRepairCost != null && $scope.DrivenUnitList[i].DActualOutageTime != null) {
                        $scope.isDrivenValidate = true;
                        $scope.DrivenUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.DrivenUnitList[i]);
                    } else {
                        $scope.isDrivenValidate = false;
                        break;
                    }
                } else {
                    $scope.isDrivenValidate = true;
                }
            }
        } else {
            $scope.isDrivenValidate = true;
        }


        var _postdata = {
            "ClientSiteId": params.ClientSiteId,
            "EquipmentId": params.row.EquipmentId,
            "ReportType": "FR",
            "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
            "Active": "Y",
            "FailureReportList": FailureReportList
        };

        $scope.isProcess = true;
        var postUrl = "/FailureReport/Create";
        if ($scope.isDriveValidate && $scope.isInterValidate && $scope.isDrivenValidate && FailureReportList.length > 0) {
            $http.post(postUrl, JSON.stringify(_postdata)).then(function (response) {
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
                        angular.forEach(response.data, function (val, i) {
                            $scope.id = val.FailureReportHeaderId;
                        });
                        $scope.uploadDocument($scope.id);
                        $scope.failRepoPopup();
                        //$scope.clearModal();

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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please Fill Atleast One Row"
            });
        }


    };

    $scope.failRepoPopup = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skffailRepopopupModal.html',
            controller: 'skffailRepopopupModalCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "csId": $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function () {
            $uibModalInstance.dismiss('cancel');
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


    $scope.uploadDocument = function (id) {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if (id) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/FailureReport/UploadFiles",
                contentType: false,
                processData: false,
                headers: { 'aId': id, 'type': 'FailureReport' },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "Data saved successfully."
                    });
                    $('#files').val("");
                },
                error: function () {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Error upload document please upload attachment again."
                    });
                }
            });
        }
    };

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
                    msg: "Upload valid Image Format"
                });
                $scope.validFormat = false;
                $('#files').val("");
            }, 10);

        }

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

    //Failure Mode popup
    $scope.failuremode = function (data, i) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skffailureMode.html',
            controller: 'skffailureModeCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "languageId": $scope.languageId, "data": data };
                }
            }
        });

        modalInstance.result.then(function (data) {

            if (data) {
                if (data.UnitType == "DR") {
                    angular.forEach($scope.DriveUnitList, function (val, j) {
                        if (val.UnitType == data.UnitType && j == i) {
                            val.FailureModeId = data.FailureModeId;
                            val.FailureCauseId = data.FailureCauseId;
                            val.FailureModeName = data.FailureModeName;
                            val.FailureCauseName = data.FailureCauseName;
                        }
                    });
                } else if (data.UnitType == "IN") {
                    angular.forEach($scope.IntermediateUnitList, function (val, j) {
                        if (val.UnitType == data.UnitType && j == i) {
                            val.FailureModeId = data.FailureModeId;
                            val.FailureCauseId = data.FailureCauseId;
                            val.FailureModeName = data.FailureModeName;
                            val.FailureCauseName = data.FailureCauseName;
                        }
                    });
                } else if (data.UnitType == "DN") {
                    angular.forEach($scope.DrivenUnitList, function (val, j) {
                        if (val.UnitType == data.UnitType && j == i) {
                            val.FailureModeId = data.FailureModeId;
                            val.FailureCauseId = data.FailureCauseId;
                            val.FailureModeName = data.FailureModeName;
                            val.FailureCauseName = data.FailureCauseName;
                        }
                    });
                }
            }
        }, function () {
        });
    };


});

//Failure Report alert Popup
app.controller('skffailRepopopupModalCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.csId = params.csId;


    $scope.GotoFailureReport = function () {
        $window.location.href = "/failurereport";
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

});

//Failure Mode and failure Cause Dropdown Popup
app.controller('skffailureModeCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {
    $scope.assetName = params.data.IdentificationName;
    $scope.loadFailureCause = function (data) {
        var _url = "/taxonomy/GetLoadListItem?Type=FailureCause&lId=" + params.languageId + "&sId=" + data.FailureModeId + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.FailureCauseDDL = response.data;
            });
    };

    $scope.loadDriveFailureMode = function () {
        var _url = "/taxonomy/GetLoadListItem?Type=FailureModeByAsset&lId=" + params.languageId + "&sId=" + params.data.AssetId + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.FailureModeDDL = response.data;
            });
    }();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.save = function (fm, fc) {
        var _postdata = {
            "FailureCauseId": fc.FailureCauseId,
            "FailureModeId": fm.FailureModeId,
            "FailureModeName": fm.FailureModeName,
            "FailureCauseName": fc.FailureCauseName,
            "UnitType": params.data.UnitType
        };

        if (_postdata) {
            $uibModalInstance.close(_postdata);
        }
    };

});

//Avoided Planned Main Popup
app.controller('skfAvoidedplmaintCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.formatters = {};
    $scope.row = params.row;
    $scope.languageId = params.languageId;
    $scope.ReportDate = new Date();
    $scope.EquipmentName = params.row.EquipmentName;
    $scope.PlantAreaName = params.row.PlantAreaName;
    $scope.FailureModeId = params.FailureModeId;


    $scope.loadData = function () {
        var _url = "/Equipment/GetFailureReportDetail?eqId=" + params.row.EquipmentId;
        $http.get(_url)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    $scope.DriveUnitList = JSON.parse(val.DriveUnitList);
                    $scope.IntermediateUnitList = JSON.parse(val.IntermediateUnitList);
                    $scope.DrivenUnitList = JSON.parse(val.DrivenUnitList);
                });

            });
    }();

    $scope.save = function () {
        var FailureReportList = [];
        if ($scope.DriveUnitList) {
            var drivelength = $scope.DriveUnitList.length;
            for (i = 0; i < drivelength; i++) {

                if ($scope.DriveUnitList[i].Descriptions != "" || $scope.DriveUnitList[i].DActualRepairCost != null || $scope.DriveUnitList[i].DActualOutageTime != null) {
                    if ($scope.DriveUnitList[i].Descriptions != "" && $scope.DriveUnitList[i].DActualRepairCost != null && $scope.DriveUnitList[i].DActualOutageTime != null) {
                        $scope.isDriveValidate = true;
                        $scope.DriveUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.DriveUnitList[i]);
                    } else {
                        $scope.isDriveValidate = false;
                        break;
                    }
                } else {
                    $scope.isDriveValidate = true;
                }
            }
        } else {
            $scope.isDriveValidate = true;
        }

        if ($scope.IntermediateUnitList) {
            var interlength = $scope.IntermediateUnitList.length;
            for (i = 0; i < interlength; i++) {

                if ($scope.IntermediateUnitList[i].Descriptions != "" || $scope.IntermediateUnitList[i].DActualRepairCost != null || $scope.IntermediateUnitList[i].DActualOutageTime != null) {
                    if ($scope.IntermediateUnitList[i].Descriptions != "" && $scope.IntermediateUnitList[i].DActualRepairCost != null && $scope.IntermediateUnitList[i].DActualOutageTime != null) {
                        $scope.isInterValidate = true;
                        $scope.IntermediateUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.IntermediateUnitList[i]);
                    } else {
                        $scope.isInterValidate = false;
                        break;
                    }
                } else {
                    $scope.isInterValidate = true;
                }
            }
        } else {
            $scope.isInterValidate = true;
        }

        if ($scope.DrivenUnitList) {

            var drivenlength = $scope.DrivenUnitList.length;
            for (i = 0; i < drivenlength; i++) {

                if ($scope.DrivenUnitList[i].Descriptions != "" || $scope.DrivenUnitList[i].DActualRepairCost != null || $scope.DrivenUnitList[i].DActualOutageTime != null) {
                    if ($scope.DrivenUnitList[i].Descriptions != "" && $scope.DrivenUnitList[i].DActualRepairCost != null && $scope.DrivenUnitList[i].DActualOutageTime != null) {
                        $scope.isDrivenValidate = true;
                        $scope.DrivenUnitList[i].DActive = 'Y';
                        FailureReportList.push($scope.DrivenUnitList[i]);
                    } else {
                        $scope.isDrivenValidate = false;
                        break;
                    }
                } else {
                    $scope.isDrivenValidate = true;
                }
            }
        } else {
            $scope.isDrivenValidate = true;
        }

        var _postdata = {
            "ClientSiteId": params.ClientSiteId,
            "EquipmentId": params.row.EquipmentId,
            "ReportType": "APM",
            "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
            "Active": "Y",
            "FailureReportList": FailureReportList

        };

        $scope.isProcess = true;
        var postUrl = "/AvoidedPlannedMaintenance/Create";

        if ($scope.isDriveValidate && $scope.isInterValidate && $scope.isDrivenValidate && FailureReportList.length > 0) {
            $http.post(postUrl, JSON.stringify(_postdata)).then(function (response) {
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
                        angular.forEach(response.data, function (val, i) {
                            $scope.id = val.FailureReportHeaderId;
                        });
                        $scope.uploadDocument($scope.id);
                        $scope.avoidplmainPopup();
                        //$scope.clearModal();

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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Please Fill Atleast One Row"
            });
        }

    };

    $scope.avoidplmainPopup = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfavoidplmainpopopupModal.html',
            controller: 'skfavoidplmainpopopupModalCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "csId": $scope.ClientSiteId };
                }
            }
        });

        modalInstance.result.then(function () {
            $uibModalInstance.dismiss('cancel');
        }, function () {

        });
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $scope.isProcess = true;
    };

    $scope.uploadDocument = function (id) {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if (id) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/AvoidedPlannedMaintenance/UploadFiles",
                contentType: false,
                processData: false,
                headers: { 'aId': id, 'type': 'AvoidedPlannedMaintenence' },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "File Uploaded successfully."
                    });
                    $('#files').val("");
                },
                error: function () {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Error upload document please upload attachment again."
                    });
                }
            });
        }
    };

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
                    msg: "Upload valid Image Format"
                });
                $scope.validFormat = false;
                $('#files').val("");
            }, 10);

        }

    };

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
    };
});

//Avoided Planned Maint Alert Popup
app.controller('skfavoidplmainpopopupModalCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.languageId;
    $scope.csId = params.csId;


    $scope.GotoAvoidedPlMain = function () {
        $window.location.href = "/avoidedplannedmaintenance";
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

});

app.controller('skfGenerateJobModalCtrl', function ($scope, $http, $uibModalInstance, params, $window, uiGridConstants, alertFactory, $timeout) {
    $scope.formatters = {};
    $scope.languageId = params.language.LanguageId;
    $scope.csId = params.csId;
    $scope.ScheduleSetupId = params.ssId;
    $scope.ScName = params.scName;

    $scope.Gotojoblist = function () {
        $window.location.href = "/job";
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

//Plant Ctrl
app.controller('skfPlantCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Plant = {
            LanguageId: params.language.LanguageId,
            PlantAreaName: null,
            Descriptions: null,
            PlantAreaCode: null,
            Active: null,
            ClientSiteId: 0
        };
    };

    $scope.clearModal();

    $scope.save = function (data) {
        if ($scope.skfForm.$valid && !$scope.isProcess && !$scope.readOnlyPage) {
            $scope.isProcess = true;
            var postUrl = "/Plant/Create";
            if (params.ClientSiteId) {
                $scope.Plant.ClientSiteId = params.ClientSiteId;
            }

            $http.post(postUrl, JSON.stringify($scope.Plant)).then(function (response) {
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
                        angular.forEach(response.data, function (val, i) {
                            $uibModalInstance.close(val.PlantAreaId);
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

//Area Ctrl
app.controller('skfAreaCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {
    $scope.PlantAreaId = params.PlantAreaId;

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Area = {
            LanguageId: params.language.LanguageId,
            PlantAreaId: null,
            AreaName: null,
            Descriptions: null,
            Active: null


        };
    };

    $scope.clearModal();

    $scope.loadPlant = function () {
        var _url = "/Plant/GetPlantByStatus?lId=" + params.language.LanguageId + "&csId=" + params.ClientSiteId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;
            });
    }();

    $scope.save = function () {
        if ($scope.skfForm.$valid && !$scope.isProcess && !$scope.readOnlyPage) {
            $scope.isProcess = true;
            var postUrl = "/Area/Create";
            $scope.Area.PlantAreaId = $scope.PlantAreaId;
            $http.post(postUrl, JSON.stringify($scope.Area)).then(function (response) {
                if (response.data) {
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
                        angular.forEach(response.data, function (val) {
                            $uibModalInstance.close(val.AreaId);
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

//System Ctrl
app.controller('skfSystemCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {
    $scope.PlantAreaId = params.PlantAreaId;
    $scope.AreaId = params.AreaId;

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.System = {
            LanguageId: params.language.LanguageId,
            PlantAreaId: null,
            PlantAreaName: null,
            AreaId: null,
            AreaName: null,
            SystemName: null,
            Descriptions: null,
            Active: null

        };
    };
    $scope.clearModal();

    $scope.loadPlant = function () {

        var _url = "/Plant/GetPlantByStatus?lId=" + params.language.LanguageId + "&csId=" + params.ClientSiteId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;

            });
    }();

    $scope.loadArea = function (data) {

        var _url = "/taxonomy/GetLoadListItem?Type=Area&lId=" + params.language.LanguageId + "&sId=" + params.PlantAreaId + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.AreaDDL = response.data;

            });
    }();

    $scope.save = function () {
        if ($scope.skfForm.$valid && !$scope.isProcess && !$scope.readOnlyPage) {
            $scope.isProcess = true;
            var postUrl = "/System/Create";
            $scope.System.PlantAreaId = $scope.PlantAreaId;
            $scope.System.AreaId = $scope.AreaId;
            $http.post(postUrl, JSON.stringify($scope.System)).then(function (response) {
                if (response.data) {
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
                        angular.forEach(response.data, function (val) {
                            $uibModalInstance.close(val.SystemId);
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

app.controller('skfShaftModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.DispName = params.row.IdentificationName;
    $scope.Type = params.type;
    $scope.readOnly = params.Readonly;
    $scope.languageId = params.languageId;
    $scope.unitId = params.row.unitId;
    $scope.showMode1 = true;
    $scope.showMode2 = $scope.showMode3 = $scope.showMode4 = $scope.showMode5 = $scope.showMode6 = false;

    $scope.AddShaft = function () {
        for (let i = 0; i < $scope.shaft.length; i++) {
            if ($scope.shaft[i].RPM === "") {
                $scope.shaft[i].RPM = null;
            }
        }
        if ($scope.shaft.length > 2) {
            var InterShaft = [];
            var ValidInterShaft = [];
            angular.forEach($scope.shaft, function (val, i) {
                if (val.ShaftName !== 'Input Shaft' && val.ShaftName !== 'Output Shaft'&& val.Active ==='Y') {
                    InterShaft.push(val);
                }
            });
            for (let j = 0; j < InterShaft.length; j++) {
                if (InterShaft[j].DriveEnd[0].Bearings.length > 0 && InterShaft[j].NonDriveEnd[0].Bearings.length > 0 && InterShaft[j].RPM !== null && InterShaft[j].Active === 'Y') {
                    ValidInterShaft.push(InterShaft[j]);
                }
            }
            if (ValidInterShaft.length === InterShaft.length) {
                $scope.AddValidShaft();
            }
            else {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Please fill the existing Intermediate Shaft Detail"
                });
            }
        }
        else {
            $scope.AddValidShaft();
        }
    };
    $scope.AddValidShaft = function () {
        let slength = $scope.shaft.length;
        //for (i = 0; i < $scope.shaft.length; i++) {
        //    if ($scope.shaft[i].Active === 'Y') {
        //        activeInterShafts.push($scope.shaft[i]);
        //    }
        //}
        if (slength <= 5) {
            for (i = slength; i <= 5; i++) {
                var a = i - 1;
                $scope.sName = 'Intermediate Shaft ' + a;
                $scope.shaftNumber = i;
                $scope.shaft.splice(a, 0, {
                    'ShaftId': 0,
                    'ShaftName': $scope.sName,
                    'ShaftOrder': $scope.shaftNumber,
                    "UnitId": params.row.IntermediateUnitId,
                    'Active': 'Y',
                    "RPM": null,
                    "DriveEnd": [
                        {
                            "ShaftSideId": 0,
                            "ShaftSide": "DE",
                            "Bearings": []
                        }
                    ],
                    "NonDriveEnd": [
                        {
                            "ShaftSideId": 0,
                            "ShaftSide": "NDE",
                            "Bearings": []
                        }
                    ]
                });
                break;
            }
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Maximum 4 shafts are allowed to add"
            });
        }
    };

    $scope.showAcc = function (data) {
        $scope.showMode1 = $scope.showMode2 = $scope.showMode3 = $scope.showMode4 = $scope.showMode5 = $scope.showMode6 = false;
        switch (data) {
            case 1:
                $scope.showMode1 = true;
                break;
            case 2:
                $scope.showMode2 = true;
                break;
            case 3:
                $scope.showMode3 = true;
                break;
            case 4:
                $scope.showMode4 = true;
                break;
            case 5:
                $scope.showMode5 = true;
                break;
            case 6:
                $scope.showMode6 = true;
                break;
        }
    };

    if (params.type && typeof params.row.isDirty === 'undefined') {
        switch (params.type) {
            case 'DR':
                if (params.row.DriveUnitId !== null && params.row.DriveUnitId !== 0) {
                    // $scope.shaft = params.row.shaft;
                    let _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.languageId + "&eId=0&rId=" + params.row.DriveUnitId + "&type=Drive&at=Shaft&status=All";
                    $http.get(_url)
                        .then((response) => {
                            $scope.shaft = JSON.parse(response.data[0].Shaft);
                        });
                } else {
                    $scope.shaft = [
                        {
                            "ShaftId": 0,
                            "ShaftOrder": 1,
                            "ShaftName": "Input Shaft",
                            "UnitId": params.row.DriveUnitId,
                            "DriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "DE",
                                    "Bearings": [

                                    ]
                                }
                            ],
                            "NonDriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "NDE",
                                    "Bearings": [

                                    ]
                                }
                            ]
                        }
                    ];
                }
                break;
            case 'IN':
                if (params.row.IntermediateUnitId !== null && params.row.IntermediateUnitId !== 0) {
                    _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.languageId + "&eId=0&rId=" + params.row.IntermediateUnitId + "&type=Intermediate&at=Shaft&status=All";
                    $http.get(_url)
                        .then((response) => {
                            $scope.shaft = JSON.parse(response.data[0].Shaft);
                            let slength = $scope.shaft.length;
                            for (let i = 0; i < slength; i++) {
                                if ($scope.shaft[i].ShaftName === 'Output Shaft') {
                                    $scope.isOutputshaft = true;
                                    break;
                                }
                            }
                            if (!$scope.isOutputshaft) {
                                return $scope.shaft.splice(slength, 0, {
                                    "ShaftId": 0,
                                    "ShaftOrder": 6,
                                    "ShaftName": "Output Shaft",
                                    "UnitId": params.row.IntermediateUnitId,
                                    "RPM": null,
                                    "Active": "Y",
                                    "DriveEnd": [
                                        {
                                            "ShaftSideId": 0,
                                            "ShaftSide": "DE",
                                            "Bearings": [

                                            ]
                                        }
                                    ],
                                    "NonDriveEnd": [
                                        {
                                            "ShaftSideId": 0,
                                            "ShaftSide": "NDE",
                                            "Bearings": [

                                            ]
                                        }
                                    ]
                                });
                            }
                        });

                } else {
                    $scope.shaft = [
                        {
                            "ShaftId": 0,
                            "ShaftOrder": 1,
                            "ShaftName": "Input Shaft",
                            "UnitId": params.row.IntermediateUnitId,
                            "RPM": null,
                            "Active": "Y",
                            "DriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "DE",
                                    "Bearings": [

                                    ]
                                }
                            ],
                            "NonDriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "NDE",
                                    "Bearings": [

                                    ]
                                }
                            ]
                        }, {
                            "ShaftId": 0,
                            "ShaftOrder": 6,
                            "ShaftName": "Output Shaft",
                            "UnitId": params.row.IntermediateUnitId,
                            "RPM": null,
                            "Active": "Y",
                            "DriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "DE",
                                    "Bearings": [

                                    ]
                                }
                            ],
                            "NonDriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "NDE",
                                    "Bearings": [

                                    ]
                                }
                            ]
                        }
                    ];
                }
                break;
            case 'DN':
                if (params.row.DrivenUnitId !== null && params.row.DrivenUnitId !== 0) {
                    _url = "/Equipment/GetEquipmentByStatus?lId=" + $scope.languageId + "&eId=0&rId=" + params.row.DrivenUnitId + "&type=Driven&at=Shaft&status=All";
                    $http.get(_url)
                        .then((response) => {
                            $scope.shaft = JSON.parse(response.data[0].Shaft);
                        });
                } else {
                    $scope.shaft = [
                        {
                            "ShaftId": 0,
                            "ShaftOrder": 1,
                            "ShaftName": "Input Shaft",
                            "UnitId": params.row.DriveUnitId,
                            "DriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "DE",
                                    "Bearings": [

                                    ]
                                }
                            ],
                            "NonDriveEnd": [
                                {
                                    "ShaftSideId": 0,
                                    "ShaftSide": "NDE",
                                    "Bearings": [

                                    ]
                                }
                            ]
                        }
                    ];
                }
                break;
        }
    } else {
        if (params.type === 'IN') {
            $scope.isOutputshaft = false;
            $scope.shaft = angular.copy(params.row.Shaft);
            let slength = $scope.shaft.length;
            for (let i = 0; i < slength; i++) {
                if ($scope.shaft[i].ShaftName === 'Output Shaft') {
                    $scope.isOutputshaft = true;
                }
            }
            if (!$scope.isOutputshaft) {
                $scope.shaft.splice(slength, 0, {
                    "ShaftId": 0,
                    "ShaftOrder": 6,
                    "ShaftName": "Output Shaft",
                    "UnitId": params.row.IntermediateUnitId,
                    "RPM": null,
                    "Active":"Y",
                    "DriveEnd": [
                        {
                            "ShaftSideId": 0,
                            "ShaftSide": "DE",
                            "Bearings": [

                            ]
                        }
                    ],
                    "NonDriveEnd": [
                        {
                            "ShaftSideId": 0,
                            "ShaftSide": "NDE",
                            "Bearings": [

                            ]
                        }
                    ]
                });
            }
        } else {
            $scope.shaft = angular.copy(params.row.Shaft);
        }

    }

    $scope.DirtyValues = function (sh, e, j) {
        let slength = $scope.shaft.length;
        for (let i = 0; i < slength; i++) {
            if ($scope.shaft[i].ShaftOrder === e) {
                if ($scope.shaft[i].DriveEnd[0].ShaftSide === sh) {
                    $scope.shaft[i].DriveEnd[0].Bearings = $scope.shaft[i].DriveEnd[0].Bearings.filter(function (item) {
                        return item !== j;
                    });
                } else if ($scope.shaft[i].NonDriveEnd[0].ShaftSide === sh) {
                    $scope.shaft[i].NonDriveEnd[0].Bearings = $scope.shaft[i].NonDriveEnd[0].Bearings.filter(function (item) {
                        return item !== j;
                    });
                }
            }
        }
    };

    $scope.focusautoIn = function (a, b) {
        $scope.shaftOrder = a;
        $scope.shaftsec = b;
    };

    $scope.selectedBearingStatusFn = function (selected) {
        if (typeof selected !== 'undefined') {
            var _data = {
                "BearingId": selected.originalObject.BearingId,
                "BearingName": selected.originalObject.BearingName,
                "Designation": selected.originalObject.Designation,
                "ManufacturerName": selected.originalObject.ManufacturerName,
                "ManufacturerId": selected.originalObject.ManufacturerId,
                "Active": 'Y'
            };
            let slength = $scope.shaft.length;
            for (let i = 0; i < slength; i++) {
                if ($scope.shaft[i].ShaftOrder === $scope.shaftOrder) {
                    if ($scope.shaft[i].DriveEnd[0].ShaftSide === $scope.shaftsec) {
                        $scope.shaft[i].DriveEnd[0].Bearings.push(_data);
                    } else if ($scope.shaft[i].NonDriveEnd[0].ShaftSide === $scope.shaftsec) {
                        $scope.shaft[i].NonDriveEnd[0].Bearings.push(_data);
                    }
                }
            }
            $scope.$broadcast('angucomplete-alt:clearInput', 'BearingId');
        }
    };

    $scope.save = function () {
        if ($scope.shaft) {
            switch ($scope.Type) {
                case 'DR':
                    let slength = $scope.shaft.length;
                    for (let i = 0; i < slength; i++) {
                        if ($scope.shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                            $uibModalInstance.close($scope.shaft);
                        } else {
                            if ($scope.shaft[i].DriveEnd[0].Bearings.length === 0 && $scope.shaft[i].NonDriveEnd[0].Bearings.length === 0) {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill bearing details for Drive & Non Drive End"
                                });
                            } else {
                                if ($scope.shaft[i].DriveEnd[0].Bearings.length === 0) {
                                    alertFactory.setMessage({
                                        type: "warning",
                                        msg: "Please fill the bearing details for Drive end"
                                    });
                                }
                                else {
                                    if ($scope.shaft[i].NonDriveEnd[0].Bearings.length === 0) {
                                        alertFactory.setMessage({
                                            type: "warning",
                                            msg: "Please fill the bearing details for Non Drive end"
                                        });
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'IN':
                    let isValid = false;
                    $scope.OrginalShaftData = [];
                    let sIlength = $scope.shaft.length;
                    for (let i = 0; i < sIlength; i++) {
                            $scope.shaft[i].Active = 'Y';
                        if ($scope.shaft[i].RPM === "") {
                            $scope.shaft[i].RPM = null;
                        }
                        if ($scope.shaft[i].DriveEnd[0].Bearings.length > 0 || $scope.shaft[i].NonDriveEnd[0].Bearings.length > 0 || $scope.shaft[i].RPM !== null) {
                            if ($scope.shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.shaft[i].NonDriveEnd[0].Bearings.length > 0 && $scope.shaft[i].RPM !== null) {
                                isValid = true;
                                $scope.OrginalShaftData.push($scope.shaft[i]);
                                $scope.shaft[i].isValid = true;
                            } else {
                                isValid = false;
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill RPM and at least one Drive End and Non Drive End Bearing details for each shaft"
                                });
                                break;
                            }
                        }
                    }
                    if (isValid) {
                        $scope.isShaftValidate = false;
                        $scope.oShaftValidate = false;
                        let slength = $scope.OrginalShaftData.length;
                        for (let i = 0; i < slength; i++) {
                            if ($scope.OrginalShaftData[i].ShaftName === 'Input Shaft') {
                                $scope.isShaftValidate = true;
                            }
                            if ($scope.OrginalShaftData[i].ShaftName === 'Output Shaft') {
                                $scope.oShaftValidate = true;
                            }
                        }
                        if ($scope.isShaftValidate && $scope.oShaftValidate) {
                            return $uibModalInstance.close($scope.OrginalShaftData);
                        }
                        else {
                            if (!$scope.isShaftValidate && !$scope.oShaftValidate) {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill both Input and Output shaft details"
                                });
                            }
                            if (!$scope.isShaftValidate) {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill Input shaft detail"
                                });
                            }
                            if (!$scope.oShaftValidate) {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill Output shaft detail"
                                });
                            }
                        }

                    } else {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "Please fill RPM & at least one Drive & Non Drive End Bearing details for each shaft"
                        });
                    }
                    break;
                case 'DN':
                    let sDnlength = $scope.shaft.length;
                    for (let i = 0; i < sDnlength; i++) {
                        if ($scope.shaft[i].DriveEnd[0].Bearings.length > 0 && $scope.shaft[i].NonDriveEnd[0].Bearings.length > 0) {
                            $uibModalInstance.close($scope.shaft);
                        } else {
                            if ($scope.shaft[i].DriveEnd[0].Bearings.length === 0 && $scope.shaft[i].NonDriveEnd[0].Bearings.length === 0) {
                                alertFactory.setMessage({
                                    type: "warning",
                                    msg: "Please fill bearing details for Drive & Non Drive End"
                                });
                            } else {
                                if ($scope.shaft[i].DriveEnd[0].Bearings.length === 0) {
                                    alertFactory.setMessage({
                                        type: "warning",
                                        msg: "Please fill the bearing details for Drive end"
                                    });
                                }
                                else {
                                    if ($scope.shaft[i].NonDriveEnd[0].Bearings.length === 0) {
                                        alertFactory.setMessage({
                                            type: "warning",
                                            msg: "Please fill the bearing details for Non Drive end"
                                        });
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        }
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.close();
    };

});