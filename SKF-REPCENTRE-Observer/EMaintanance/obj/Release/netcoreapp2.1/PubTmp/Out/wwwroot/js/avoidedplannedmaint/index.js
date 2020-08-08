app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, languageFactory, alertFactory, clientFactory, $timeout) {
    $scope.startIndex = 1;
    $scope.isEdit = false;
    $scope.isCreate = false;
    $scope.isSearch = true;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.B_Active = 'All';

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'ActualRepairCost', displayName: 'Avoided PM Cost ($)', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 100 },
        { name: 'DownTimeCost', displayName: 'Down Time Cost ($)', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'TrueSavingsCost', displayName: 'True Savings', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'TrueSavingsHrs', displayName: 'True Savings Hrs', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'CreatedBy', displayName: 'Action Taken', cellClass: getCellClass, enableColumnResizing: true, width: "16%", minWidth: 100 },
        {
            name: 'ReportDate', displayName: 'Date of Report', enableColumnResizing: true, enableCellEdit: false, minWidth: 80, width: "18%", cellFilter: 'date:\'dd/MM/yyyy\'', cellClass: getCellClass, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Avoided Planned Maintenance" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.FileUpload(row)"><i class="fa fa-file-picture-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="View Attachment" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "13%",
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

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;

        $scope.resetForm();
    };

    $scope.clearOut = function () {
        $scope.clearValue();

    };

    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate()


    $scope.clearValue = function () {
        $scope.L_FailureReport = {
            ReportFromDate: new Date(y, m, d - 30),
            ReportToDate: new Date()

        };

    };
    $scope.clearValue();


    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }

    var highlightRow = null;

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
        exporterExcelFilename: 'EMaintenance_FailureReport.xlsx',
        exporterExcelSheetName: 'EMaintenance_FailureReport',
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
        $scope.L_FailureReport = {
            "ReportFromDate": $filter('date')($scope.L_FailureReport.ReportFromDate, "yyyy-MM-dd 00:00:00"),
            "ReportToDate": $filter('date')($scope.L_FailureReport.ReportToDate, "yyyy-MM-dd 00:00:00"),
            "LanguageId": $scope.language.LanguageId,
            "ClientSiteId": $scope.ClientSiteId,
            "FailureReportHeaderId": 0,
            "ReportType": "APM"
        };


        var postUrl = "/AvoidedPlannedMaintenance/GetAvoidPlannedMaintenance";
        $http.post(postUrl, JSON.stringify($scope.L_FailureReport)).then(function (response) {
            if (response.data) {
                $scope.gridOpts.data = response.data;
                $scope.L_FailureReport.ReportFromDate = new Date($scope.L_FailureReport.ReportFromDate);
                $scope.L_FailureReport.ReportToDate = new Date($scope.L_FailureReport.ReportToDate);

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


    $scope.editRow = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAvoidedplmaint.html',
            controller: 'skfAvoidedplmaintCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    if (row) {
                        return { 'row': row, "languageId": $scope.language.LanguageId, 'ClientSiteId': $scope.ClientSiteId, "DriveUnitList": $scope.DriveUnitList, "IntermediateUnitList": $scope.IntermediateUnitList, "DrivenUnitList": $scope.DrivenUnitList, 'FailureReportHeaderId': $scope.FailureReportHeaderId, 'isEdit': true };
                    } else {
                        return { 'languageId': $scope.language.LanguageId, 'ClientSiteId': $scope.ClientSiteId, 'isEdit': false };
                    }
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.loadData();
            }

        }, function () {

        });
    };


    $scope.FileUpload = function (row) {
        $scope.aId = row.entity.FailureReportHeaderId;
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAttachmentModal.html',
            controller: 'skfAttachmentCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "languageId": $scope.language.LanguageId, "aId": row.entity.FailureReportHeaderId, "Type": "AvoidedPlannedMaintenence" };
                }
            }
        });

        modalInstance.result.then(function (data) {

        }, function () {
        });
    };

});

app.controller('skfAvoidedplmaintCtrl', function ($scope, $http, $filter, $uibModal, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _params = params;
    $scope.isEdit = params.isEdit;
    $scope.ReportDate = new Date();
    if (params.isEdit) {
        $scope.formatters = {};
        $scope.row = params.row;
        $scope.languageId = params.languageId;
        $scope.ReportDate = new Date($scope.row.ReportDate);
        $scope.EquipmentName = params.row.EquipmentName;
        $scope.PlantAreaName = params.row.PlantAreaName;
        $scope.FailureModeId = params.FailureModeId;
    }

    $scope.loadEq = function () {
        if (typeof $scope.AreaId === 'undefined') {
            $scope.AreaId = 0;
        }
        if (typeof $scope.SystemId === 'undefined') {
            $scope.SystemId = 0;
        }
        var _url = "/equipment/loadEqbyPlantAreaSystem?PlId=" + $scope.PlantAreaId + "&ArId=" + $scope.AreaId + "&SyId=" + $scope.SystemId;
        $http.get(_url)
            .then(function (response) {
                $scope.EqDDL = response.data;
            });
    };

    $scope.loadPlant = function () {
        var _url = "/Plant/GetPlantByStatus?lId=" + params.languageId + "&csId=" + params.ClientSiteId + "&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.PlantDDL = response.data;
            });
    }();

    $scope.loadArea = function (data, val) {
        var _url = "/taxonomy/GetLoadListItem?Type=Area&lId=" + params.languageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.AreaDDL = response.data;
                $timeout(function () {
                    $scope.loadEq();
                }, 10);
            });
        $scope.DriveUnitList = [];
        $scope.IntermediateUnitList = [];
        $scope.DrivenUnitList = [];
    };

    $scope.loadSystem = function (data, val) {
        var _url = "/taxonomy/GetLoadListItem?Type=System&lId=" + params.languageId + "&sId=" + data + "&sId1=0";
        $http.get(_url)
            .then(function (response) {
                $scope.SystemDDL = response.data;
                $timeout(function () {
                    $scope.loadEq();
                }, 10);
            });
        $scope.DriveUnitList = [];
        $scope.IntermediateUnitList = [];
        $scope.DrivenUnitList = [];
    };

    $scope.loadAsset = function (data) {
        var _url = "/Equipment/GetFailureReportDetail?eqId=" + data;
        $http.get(_url)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    $scope.DriveUnitList = JSON.parse(val.DriveUnitList);
                    $scope.IntermediateUnitList = JSON.parse(val.IntermediateUnitList);
                    $scope.DrivenUnitList = JSON.parse(val.DrivenUnitList);
                });
            });

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
            "EquipmentId": $scope.EquipmentId,
            "ReportType": "APM",
            "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
            "Active": "Y",
            "FailureReportList": FailureReportList
        };


        $scope.isProcess = true;
        var postUrl = "/AvoidedPlannedMaintenance/Update";

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
                            msg: "Data Updated Successfully."
                        });
                        $uibModalInstance.close("Ok");
                        angular.forEach(response.data, function (val, i) {
                            $scope.id = val.FailureReportHeaderId;
                        });
                        $scope.uploadDocument($scope.id);
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


    $scope.loadData = function () {
        if ($scope.row) {
            if ($scope.row.DriveUnitList) {
                $scope.DriveUnitList = JSON.parse($scope.row.DriveUnitList);
            }
            if ($scope.row.IntermediateUnitList) {
                $scope.IntermediateUnitList = JSON.parse($scope.row.IntermediateUnitList);
            }
            if ($scope.row.DrivenUnitList) {
                $scope.DrivenUnitList = JSON.parse($scope.row.DrivenUnitList);
            }
        }
    }();


    $scope.update = function () {

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
            "FailureReportHeaderId": params.row.FailureReportHeaderId,
            "ClientSiteId": params.ClientSiteId,
            "EquipmentId": params.row.EquipmentId,
            "ReportType": "APM",
            "ReportDate": $filter('date')($scope.ReportDate, "yyyy-MM-dd 00:00:00"),
            "Active": "Y",
            "FailureReportList": FailureReportList
        };


        $scope.isProcess = true;
        var postUrl = "/AvoidedPlannedMaintenance/Update";

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
                            msg: "Data Updated Successfully."
                        });
                        $uibModalInstance.close("Ok");
                        angular.forEach(response.data, function (val, i) {
                            $scope.id = val.FailureReportHeaderId;
                        });
                        $scope.uploadDocument($scope.id);
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
                msg: "Please fill all the fields"
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
    $scope.attach = function () {
        $scope.attachments = $scope.rowData.attachment;
    };


    $scope.saveDoc = function () {
        $scope.uploadDocument();
    };

    $scope.getAttachment = function () {
        var _url = "/FailureReport/GetAttachmentById?frhId=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attachment = response.data;
                angular.forEach($scope.attachment, function (val, i) {

                    val.attachId = val.FailureReportAttachId;
                    val.type = "AvoidedPlannedMaintenence";

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


    $scope.showAttach = function (data, index) {
        $scope.docindex = index;
        var _url = "/FailureReport/GetAttachmentById?frhId=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
        $http.get(_url)
            .then(function (response) {
                $scope.attach = response.data;
                angular.forEach($scope.attach, function (val, i) {
                    if (data == val.FailureReportAttachId) {
                        $scope.FileName = val.FileName;
                        $scope.attImage = val.PhysicalPath;
                        $scope.previewImg = false;
                    }

                });
            });
    }

    $scope.removeAttachment = function (AttachmentId, Type) {
        var _url = "/FailureReport/DeleteAttachment?Type=" + Type + "&AttachmentId=" + AttachmentId;
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

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});