app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, $window, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.readOnlyPage = false;
    $scope.formatters = {};
    $scope.language = null;
    $scope.Active = "All";

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'ClientName', displayName: 'Client Group', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 120 },
        {
            name: 'SiteName', displayName: 'Client Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 120, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'CountryName', displayName: 'Country', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 100 },
        { name: 'CostCentreName', displayName: 'Branch', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 100 },
        { name: 'City', displayName: 'City', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 100 },
        { name: 'StateName', displayName: 'State', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 100 },
        { name: 'InternalRefId', displayName: 'COH Number', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 100 },
        {
            name: 'ClientSiteStatusName', displayName: 'Status', cellClass: getCellClass,
            width: "3%",
            minWidth: 80
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.editRow(row.entity)" <i class="fa fa-pencil-square-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Edit Client" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.multiLanguage(row.entity)" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Language" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.conditioncodemapping(row.entity)" <i class="fa fa-arrows  icon-space-before" tooltip-append-to-body="true" uib-tooltip="Condition Code Mapping" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.configuration(row.entity)" <i class="fa fa-th-large  icon-space-before" tooltip-append-to-body="true" uib-tooltip="ClientSite Configuration" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.UserSiteAccess(row.entity)" <i class="fa fa-sitemap icon-space-before" tooltip-append-to-body="true" uib-tooltip="User Site Access" tooltip-class="customClass"></i></a>' +
                /*'<a ng-click="grid.appScope.Nofify(row.entity)" <i class="fa fa-envelope icon-space-before" tooltip-append-to-body="true" uib-tooltip="Notify Data Collector" tooltip-class="customClass"></i></a>'*/ +
                '</div>',
            width: "14%",
            minWidth: 190
        }
    ];

    $scope.editRow = function (row) {
        $('#blah').attr('src', '');
        $scope.isEdit = true;
        $scope.clearModal();
        $scope.validFormat = false;
        $scope.ClientSite = row;
        $scope.Logo = row.Logo;
        $scope.isCreate = false;
        $scope.ClientSite.LookupId = row.ClientSiteStatus;
        $scope.loadCostCentre(row.CountryId);
    };

    $scope.clearOut = function () {
        $scope.isEdit = false;
        $scope.clearModal();
        $('#files').val("");
        $('#blah').attr('src', '');
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
        $scope.ClientSite = {
            ClientSiteId: 0,
            LanguageId: $scope.language.LanguageId,
            SiteName: null,
            Address1: null,
            Address2: null,
            City: null,
            StateName: null,
            POBox: null,
            Zip: null,
            Phone: null,
            CostCentreName: null,
            ClientSiteStatus: 0,
            ClientSiteStatusName: null,
            ClientId: null,
            CountryId: null,
            IndustryId: 0,
            InternalRefId: null,
            CostCentreId: null,
            LookupId: 0,
            LookupName: null,
            Email: null,
            SiebelId: null,
            ExcludeFromAnalytics: 0
        };
        $scope.resetForm();
    };

    $scope.clearValue = function () {
        $scope.S_ClientSite = {
            LookupId: ""
        };
    }();

    //$scope.searchToggle = function () {
    //    $scope.isCreate = false;
    //    $scope.isEdit = false;
    //    $scope.isSearch = true;
    //    $scope.Logo = "";
    //};

    $scope.createToggle = function () {
        $scope.isCreate = true;
        $scope.isEdit = false;
        $scope.Logo = "";
        $scope.clearOut();
        if ($scope.responseId) {
            $scope.ClientSite.ClientId = $scope.responseId;
            sessionStorage.removeItem('responseId');
        } else {
            $scope.ClientSite.ClientId = null;
        }
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
        exporterExcelFilename: 'EMaintenance_ClientSite.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientSite',
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

    $scope.loadData = function (data) {
        $scope.gridOpts.data = [];
        $scope.isPageLoad = true;
        var _url = "/ClientSite/GetClientSiteByStatus?lId=" + $scope.language.LanguageId + "&cliSiteStatus=All";
        $http.get(_url)
            .then(function (response) {
                $scope.gridOpts.data = response.data;
                angular.forEach($scope.gridOpts.data, function (val, i) {
                    val.sno = i + 1;
                    if (data) {
                        if (val.ClientSiteId == data) {
                            $scope.conditioncodemapping(val);
                        }
                    }
                });

            });
    };

    $scope.loadCountry = function () {
        $scope.CountryDDL = [];
        $scope.defaultCountry = {
            CountryId: 0,
            CountryName: "--Select--"
        }

        var _url = "/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=Country&cId=0&ccId=";
        $http.get(_url)
            .then(function (response) {
                $scope.CountryDDL = response.data;
                $scope.CountryDDL.splice(0, 0, $scope.defaultCountry);
            });
    };

    $scope.loadIndustry = function () {
        $scope.IndustryDDL = [];
        $scope.defaultIndustry = {
            IndustryName: "--Select--",
            IndustryId: 0,
            SectorName: "Select",
            SegmentName: "Select"
        }

        var _url = "/Industry/GetIndustryByStatus?lId=" + $scope.language.LanguageId + "&status=All";
        $http.get(_url)
            .then(function (response) {
                $scope.IndustryDDL = response.data;
                $scope.IndustryDDL.splice(0, 0, $scope.defaultIndustry);
            });
    };

    $scope.loadCostCentre = function (_data) {
        var _url = "/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=CostCentre&cId=" + _data + "&ccId=";
        $http.get(_url)
            .then(function (response) {
                $scope.CostCentreDDL = response.data;
            });
    };

    $scope.loadClient = function (_data) {
        var _url = "/Client/GetClientByStatus?clId=" + $scope.language.LanguageId + "&cliStatus=All";
        $http.get(_url)
            .then(function (response) {
                $scope.ClientDDL = response.data;
            });
    };

    $scope.loadClientStatus = function (_data) {
        var _url = "/Lookup/GetLookupByName?lId=" + $scope.language.LanguageId + "&lName=ClientSiteStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.ClientStatusDDL = response.data;
            });
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.language = newValue;
            $scope.responseId = JSON.parse(sessionStorage.getItem("responseId"));
            $scope.loadIndustry();
            $scope.loadCountry();
            $scope.loadClient();
            $scope.loadClientStatus();
            $scope.loadData();
            $scope.createToggle();
            //if ($scope.isPageLoad) {
            //    $scope.loadData();
            //}
        }
    });

    $scope.save = function (data) {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/ClientSite/Create";

            $http.post(postUrl, JSON.stringify($scope.ClientSite)).then(function (response) {
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
                            $scope.Id = val.ClientSiteId;
                            $scope.uploadDocument();
                        });

                        if (data == "goto") {
                            //sessionStorage.setItem("responseId", $scope.Id);
                            //$http.get("/UserClientSiteRel/GetUserClientSites?lId=" + $scope.language.LanguageId + "&type=ClientSite&cId=&ccId=")
                            //    .then(function (response) {
                            //        $scope.ClientSiteDDL = response.data;
                            //        angular.forEach($scope.ClientSiteDDL, function (val, i) {
                            //            if (val.ClientSiteId == $scope.Id) {
                            //                sessionStorage.setItem("clientInfo", JSON.stringify(val));
                            //                $scope.clientName = val.ClientSiteName.toLowerCase();
                            //                $scope.logo = val.logo;
                            //                clientFactory.setClient(val);
                            //                //$window.location.href = "/Plant";
                            //            }
                            //        });
                            //    });
                            $scope.loadData($scope.Id);
                        } else {
                            $scope.clearOut();
                            $scope.loadData();
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

    $scope.update = function () {
        if ($scope.ClientSite.LookupId) {
            $scope.ClientSite.ClientSiteStatus = $scope.ClientSite.LookupId;
            $scope.ClientSite.ClientSiteStatusName = $scope.ClientSite.LookupName;
        }
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/ClientSite/Update";
            $http.post(postUrl, JSON.stringify($scope.ClientSite)).then(function (response) {
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
                        $scope.Id = $scope.ClientSite.ClientSiteId;
                        var fileUpload = $("#files").get(0);
                        var files = fileUpload.files;
                        if (files.length > 0) {
                            $scope.uploadDocument();
                        } else { $scope.loadData(); }

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

    $scope.readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if ($scope.Id && $scope.validFormat) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/ClientSite/UploadFilesAjax",
                contentType: false,
                processData: false,
                headers: { 'aId': $scope.Id, 'Type': 'ClientSite' },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "Data updated successfully."
                    });
                    $('#files').val("");
                    $scope.loadData();
                },
                error: function () {
                    alertFactory.setMessage({
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
            if (filext == "png" || filext == "jpg" || filext == "svg" || filext == "jpeg") {
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
        });
    }

    $scope.multiLanguage = function (row) {
        $http.get("/ClientSite/GetTransClientSite?cliSiteId=" + row.ClientSiteId)
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

    //Client Modal
    $scope.newClient = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfClientModal.html',
            controller: 'skfClientCtrl',
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { language: $scope.language };
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.loadClient();
            if (data) {
                $scope.ClientSite.ClientId = data;
            }
        }, function () {
        });
    };

    $scope.conditioncodemapping = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfConditionCodeMapModal.html',
            controller: 'skfConditionCodeMapModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row };
                }
            }
        });

        modalInstance.result.then(function (data) {
            $scope.loadData();
            if (data) {
                $scope.configuration(data);
            }
        }, function () {
            $scope.loadData();
        });
        //});
    };

    $scope.configuration = function (row) {
        $http.get("/ClientSite/GetConfiguration?cliSiteId=" + row.ClientSiteId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.sno = i + 1;
                    if (val.ClientSiteConfigId == null) {
                        val.ClientSiteConfigId = 0;
                    }
                });

                var modalInstance = $uibModal.open({
                    templateUrl: 'skfConfigurationModal.html',
                    controller: 'skfConfigurationModalCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        params: function () {
                            return { "row": row, "data": response.data };
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    if (data) {
                        $scope.UserSiteAccess(data);
                    }
                }, function () {
                });
            });
    };

    $scope.UserSiteAccess = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfUsersiteAccess.html',
            controller: 'skfUsersiteAccessCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, "languageId": $scope.language.LanguageId };
                }
            }
        });

        modalInstance.result.then(function (gridData) {
        }, function () {
        });
    };

});


//MultiLanguage popup controller
app.controller('skfMultiLanguageModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.SiteName = params.row.SiteName;

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
        { name: 'SiteName', displayName: 'Site Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 },
        { name: 'StateName', displayName: 'State Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 },
        { name: 'City', displayName: 'City', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 },
        { name: 'Address1', displayName: 'Address 1', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 },


    ];

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: false,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ClientSite.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientSite',
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
            var postUrl = "/ClientSite/SaveMultilingual";
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

//Client popup controller
app.controller('skfClientCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory) {

    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.Client = {
            LanguageId: params.language.LanguageId,
            InternalRefId: null,
            ClientName: null,
            ClientStatus: 0,
            ClientStatusName: null
        };
    };

    $scope.clearModal();

    $scope.loadClientStatus = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + params.language.LanguageId + "&lName=ClientStatus";
        $http.get(_url)
            .then(function (response) {
                $scope.ClientDDL = response.data;
            });
    };
    $scope.loadClientStatus();

    $scope.save = function (data) {
        if ($scope.skfForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Client/Create";

            $http.post(postUrl, JSON.stringify($scope.Client)).then(function (response) {
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
                        if (data == "goto") {
                            angular.forEach(response.data, function (val, i) {
                                $uibModalInstance.close(val.ClientId);
                            });
                        }
                        // $scope.clearModal();
                        //document.getElementById("skfForm").reset();

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

//ConditionCodeMap popup controller
app.controller('skfConditionCodeMapModalCtrl', function ($scope, $http, $uibModalInstance, params, $uibModal, alertFactory, $timeout) {
    var _param = params;
    $scope.sitename = params.row.SiteName;
    $scope.lanid = params.row.LanguageId;
    $scope.ClientSiteId = params.row.ClientSiteId;

    $scope.LoadData = function () {
        $http.get("/ConditionCodeMap/GetConditionCodeSetup?lId=" + $scope.lanid + "&csId=" + $scope.ClientSiteId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    $scope.gridOpts3.data = response.data;
                    angular.forEach($scope.gridOpts3.data, function (val, i) {
                        val.sno = i + 1;
                    });
                });
            });
    }();

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'SKFConditionname', displayName: 'SKF Condition Name', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, minWidth: 120 },
        { name: 'SKFConditionCode', displayName: 'SKF Condition Code', enableColumnResizing: true, enableCellEdit: false, enableFiltering: true, minWidth: 120 },
        { name: 'ClientsConditionName', displayName: 'Client Condition Name*', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 100 },
        { name: 'Descriptions', displayName: 'Descriptions', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 80 },
        {
            name: 'Active', displayName: 'Linked', enableFiltering: false,
            headerCellTemplate: '<label class="ui-grid-cell-contents"><span>Active &nbsp;&nbsp</span><ng-click="grid.appScope.SelectAll()" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            type: 'boolean', cellTemplate: '<label class="ui-grid-cell-contents"><input type="checkbox" ng-model="row.entity.Active" ng-click="grid.appScope.DirtyValues(row.entity)" ng-true-value="\'Y\'" ng-false-value="\'N\'"></label>',
            width: "6%",
            minWidth: 80
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.ConditionCodeLanguage(row.entity)" ng-class="{disable: (row.entity.CMappingId == null)}" <i class="fa fa-language icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Langauge" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "6%",
            minWidth: 80
        }
    ];

    $scope.SelectAll = function () {
        $scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
        if (!$scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.Active = 'Y';
                val.entity.isDirty = true;
                $scope.selectAll = true;
            });
        } else if ($scope.selectAll) {
            angular.forEach($scope.filteredRows, function (val, i) {
                val.entity.isDirty = true;
                val.entity.Active = 'N';
                $scope.selectAll = false;
            });
        }
    }

    $scope.DirtyValues = function (row) {
        row.isDirty = true;
    };

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts3 = {
        columnDefs: $scope.columns,
        //data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ConditionCodeClientMapping.xlsx',
        exporterExcelSheetName: 'EMaintenance_ConditionCodeClientMapping',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts3.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts3.columnDefs = angular.copy(_columns);
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

    $scope.save = function (data) {
        $scope.isClientConditionName = true;
        var postData = [];
        angular.forEach($scope.gridOpts3.data, function (val, i) {
            if (val.ClientsConditionName == null || val.ClientsConditionName == "") {
                $scope.isClientConditionName = false;
            }
            val.LanguageId = $scope.lanid;
            if (val.CMappingId === null) {
                val.CMappingId = 0;
                val.CMappingTId = 0;
                val.UserId = 0;
            }
            postData.push(val);
        });

        if (!$scope.isProcess && $scope.isClientConditionName) {
            $scope.isProcess = true;
            var postUrl = "/ConditionCodeMap/Create";
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
                            msg: "Data saved Successfully."
                        });

                        if (data) {
                            $uibModalInstance.close(params.row);
                        } else {
                            $uibModalInstance.close();
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
        } else {
            alertFactory.setMessage({
                type: "warning",
                msg: "Client Condition name should not be empty",
            });
        }

    };

    $scope.Next = function () {
        $uibModalInstance.close(params.row);
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.ConditionCodeLanguage = function (row) {
        $http.get("/ConditionCodeMap/GetTransConditionCodeMapping?CMappingId=" + row.CMappingId)
            .then(function (response) {
                angular.forEach(response.data, function (val, i) {
                    val.sno = i + 1;
                });

                var modalInstance = $uibModal.open({
                    templateUrl: 'skfConditionCodeLagModal.html',
                    controller: 'skfConditionCodeLagModalCtrl',
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

//Condition Code MultiLanguage popup controller
app.controller('skfConditionCodeLagModalCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    var _param = params;
    $scope.conditionName = params.row.SKFConditionname;

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
        { name: 'ClientsConditionName', displayName: 'Condition Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 },
        { name: 'Descriptions', displayName: 'Description', enableColumnResizing: true, enableCellEdit: true, enableFiltering: false, minWidth: 120 }
    ];

    $scope.columns = angular.copy(_columns);
    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: false,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ConditionCodeLanguage.xlsx',
        exporterExcelSheetName: 'EMaintenance_ConditionCodeLanguage',
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
            if (val.CMappingId === null) {
                val.CMappingId = 0;
                val.CMappingTId = 0;
                val.UserId = 0;
            }
            if (val.isDirty === true) {
                postData.push(val);
            }
            val.ClientSiteId = params.row.ClientSiteId;
            val.conditionId = params.row.ConditionId;
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/ConditionCodeMap/Create";
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

//Configuration popup 
app.controller('skfConfigurationModalCtrl', function ($scope, $http, $uibModalInstance, params, $uibModal, alertFactory, $timeout) {
    var _param = params;
    $scope.sitename = params.row.SiteName;

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        { name: 'ConfigName', displayName: 'Config Name', enableColumnResizing: true, enableCellEdit: false, minWidth: 120 },
        { name: 'ConfigCode', displayName: 'Config Code', enableColumnResizing: true, enableCellEdit: false, minWidth: 80 },
        { name: 'ClientSiteConfigValue', displayName: 'Config Value', enableColumnResizing: true, enableCellEdit: true, minWidth: 80 }

    ];

    $scope.columns = angular.copy(_columns);

    $scope.gridOpts = {
        columnDefs: $scope.columns,
        data: _param.data,
        enablePinning: true,
        enableSorting: true,
        enableFiltering: false,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ClientSiteConfiguration.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientSiteConfiguration',
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

    $scope.save = function (data) {
        var postData = [];
        angular.forEach($scope.gridOpts.data, function (val, i) {
            if (val.isDirty === true) {
                val.UserId = 0;
                postData.push(val);
            }
        });

        if (!$scope.isProcess) {
            $scope.isProcess = true;
            var postUrl = "/ClientSite/CreateConfiguration";
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
                            msg: "Data saved Successfully."
                        });

                        if (data) {
                            $uibModalInstance.close(params.row);
                        } else {
                            $uibModalInstance.close();
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

    $scope.Next = function () {
        $uibModalInstance.close(params.row);
    }

    $scope.Next = function () {
        $uibModalInstance.close(params.row);
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

//UserSite popup controller
app.controller('skfUsersiteAccessCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $uibModal) {
    $scope.userName = params.row.UserName;
    $scope.oneAtATime = true;
    $scope.sitename = params.row.SiteName;

    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    $scope.intern = {};
    $scope.intern.selectedAnalyst = [];
    $scope.intern.selectedPlanner = [];
    $scope.intern.selectedReviewer = [];
    $scope.intern.selectedDataCollector = [];


    $scope.UserClientRelation = function () {
        angular.forEach($scope.UserClientRel, function (val, a) {
            $scope.AnalystDDL = JSON.parse(val.Analyst);
            $scope.PlannerDDL = JSON.parse(val.Planner);
            $scope.ReviewerDDL = JSON.parse(val.Reviewer);
            $scope.DataCollectorDDL = JSON.parse(val.DataCollector);
            $scope.gridOpts2.data = JSON.parse(val.AssignedUsers);
        });
    }

    $scope.UserClientRelinfo = function () {
        var _url = "/ClientSite/GetSiteUserAccess?lId=" + params.languageId + "&csId=" + params.row.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.UserClientRel = response.data;
                $scope.UserClientRelation();
            });
    };
    $scope.UserClientRelinfo();

    $scope.save = function () {
        $scope.postData = {};
        $scope.postData.ClientSiteId = params.row.ClientSiteId;
        $scope.postData.AssignedUsers = [];

        angular.forEach($scope.AnalystDDL, function (value, k) {
            if ($scope.intern.selectedAnalyst.length > 0) {
                angular.forEach($scope.intern.selectedAnalyst, function (_d, j) {
                    if (value.UserId == _d.UserId) {
                        if (_d.Active == 'N') {
                            _d.Active = "Y";
                            _d.isDirty = true;
                            $scope.postData.AssignedUsers.push(_d);
                        } else {
                            _d.isDirty = false;
                        }
                    }
                });
            }
        });

        angular.forEach($scope.PlannerDDL, function (value, k) {
            if ($scope.intern.selectedPlanner.length > 0) {
                angular.forEach($scope.intern.selectedPlanner, function (_e, k) {
                    if (value.UserId == _e.UserId) {
                        if (_e.Active == 'N') {
                            _e.Active = "Y";
                            _e.isDirty = true;
                            $scope.postData.AssignedUsers.push(_e);
                        } else {
                            _e.isDirty = false;
                        }
                    }
                });
            }
        });

        angular.forEach($scope.DataCollectorDDL, function (value, k) {
            if ($scope.intern.selectedDataCollector.length > 0) {
                angular.forEach($scope.intern.selectedDataCollector, function (_f, l) {
                    if (value.UserId == _f.UserId) {
                        if (_f.Active == 'N') {
                            _f.Active = "Y";
                            _f.isDirty = true;
                            $scope.postData.AssignedUsers.push(_f);
                        } else {
                            _f.isDirty = false;
                        }
                    }
                });
            }
        });

        angular.forEach($scope.ReviewerDDL, function (value, j) {
            if ($scope.intern.selectedReviewer.length > 0) {
                angular.forEach($scope.intern.selectedReviewer, function (_g, k) {
                    if (value.UserId == _g.UserId) {
                        if (_g.Active == 'N') {
                            _g.Active = "Y";
                            _g.isDirty = true;
                            $scope.postData.AssignedUsers.push(_g);
                        } else {
                            _g.isDirty = false;
                        }
                    }
                });
            }
        });

        if ($scope.postData.AssignedUsers.length > 0) {
            $scope.isProcess = true;
            var postUrl = "/ClientSite/SaveUserSiteAccess";
            $http.post(postUrl, JSON.stringify($scope.postData)).then(function (response) {
                if (response.data) {
                    if (response.data.toString().indexOf("<!DOCTYPE html>") >= 0) {
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "User not a privileged to perform this Action. Please Contact your Admin.."
                        });
                    }
                } else {
                    alertFactory.setMessage({
                        msg: "Data saved Successfully."
                    });
                    $uibModalInstance.close();
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
                msg: "Please select user"
            });
        }
    };



    var _columns = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: getCellClass, enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'UserName', displayName: 'User Name', enableCellEdit: false, enableFiltering: true, cellClass: getCellClass, minWidth: 150
        },
        { name: 'FirstName', displayName: 'First Name', enableCellEdit: false, enableColumnResizing: true, enableFiltering: true, cellClass: getCellClass, minWidth: 120 },
        { name: 'LastName', displayName: 'Last Name', enableCellEdit: false, enableColumnResizing: true, enableFiltering: true, cellClass: getCellClass, minWidth: 120 },
        { name: 'RoleGroupName', displayName: 'Role Group Name', enableCellEdit: false, enableColumnResizing: true, enableFiltering: true, cellClass: getCellClass, minWidth: 120 }

    ];

    $scope.columns = angular.copy(_columns);

    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }
    var highlightRow = null;
    $scope.gridOpts2 = {
        columnDefs: $scope.columns,
        enablePinning: false,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        exporterMenuPdf: false,
        exporterMenuCsv: false,
        exporterExcelFilename: 'EMaintenance_ClientSite.xlsx',
        exporterExcelSheetName: 'EMaintenance_ClientSite',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                if (newValue !== oldValue) {
                    rowEntity.isDirty = true;
                }
            });
            gridApi.cellNav.on.navigate($scope, function (selected) {

                if ('.ui-grid-cell-focus') {
                    highlightRow = selected.row.uid;
                    gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
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

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.AddUser = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfAddUser.html',
            controller: 'skfUserCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": params.row, "languageId": params.languageId };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                $scope.UserClientRelinfo();
            }
        }, function () {
        });
    };
});

//Create User popup controller
app.controller('skfUserCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $uibModal) {
    $scope.sitename = params.row.SiteName;
    $scope.clearModal = function () {
        $scope.readOnlyPage = false;
        $scope.isProcess = false;
        $scope.User = {
            LanguageId: params.languageId,
            UserName: null,
            FirstName: null,
            LastName: null,
            Mobile: null,
            RoleGroupName: null,
            UserTypeId: null,
            ReturnKey: 1
        };
    }();

    $scope.LoadRoleGroup = function () {
        var _url = "/UserRoleGroupRel/GetUserRoleGroupAccess?lId=" + params.languageId + "&uId=0";
        $http.get(_url)
            .then(function (response) {
                var Temp = JSON.parse(response.data[0].RoleGroupRelation);
                $scope.RoleGroupDDL = Temp[0].Available;
            });
    }();

    $scope.SaveRoleGroup = function (data) {
        if ($scope.userForm.$valid) {
            $scope.isProcess = true;
            var postUrl = "/UserRoleGroupRel/Create";
            $scope.postData = {};
            $scope.postData.UserId = data;
            $scope.postData.Relations = [];

            angular.forEach($scope.RoleGroupDDL, function (value, k) {
                angular.forEach($scope.User.RoleGroupId, function (_d, j) {
                    if (value.RoleGroupId == _d.RoleGroupId) {
                        if (_d.Active == 'N') {
                            _d.Active = "Y";
                            _d.isDirty = true;
                            $scope.postData.Relations.push(_d);
                        } else {
                            _d.isDirty = false;
                        }
                    }
                });
            });

            $http.post(postUrl, JSON.stringify($scope.postData)).then(function (response) {
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
                        $uibModalInstance.close("success");
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

    $scope.save = function (data) {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Users/Create";

            $http.post(postUrl, JSON.stringify($scope.User)).then(function (response) {
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
                        if (response.data.length > 0) {
                            $scope.Id = response.data[0].UserId;
                            $scope.SaveRoleGroup($scope.Id);
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

    $scope.validateDomain = function () {
        if ($scope.User.UserName.length > 0) {
            var domain = $scope.User.UserName.replace(/.*@/, "");
            if (domain.length > 0) {
                if (domain.toUpperCase() == "SKF.COM") {
                    angular.forEach($scope.UserTypeDDL, function (val, i) {
                        if (val.LookupCode == 'IUSR') {
                            $scope.User.UserTypeId = val.LookupId;
                        }
                    });
                } else {
                    angular.forEach($scope.UserTypeDDL, function (val, i) {
                        if (val.LookupCode == 'EUSR') {
                            $scope.User.UserTypeId = val.LookupId;
                        }
                    });
                }
            }
        }
    }

    $scope.loadUserType = function (data) {
        var _url = "/Lookup/GetLookupByName?lId=" + params.languageId + "&lName=UserType";
        $http.get(_url)
            .then(function (response) {
                $scope.UserTypeDDL = response.data;
            });
    }();

    $scope.ok = function () {
        $uibModalInstance.close($scope.rowData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});
