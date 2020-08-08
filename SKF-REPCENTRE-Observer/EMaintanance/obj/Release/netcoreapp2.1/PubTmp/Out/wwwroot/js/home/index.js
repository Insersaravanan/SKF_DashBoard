app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter', 'ui.bootstrap', 'ui.grid.selection');
app.controller('skfCtrl', function ($scope, uiGridConstants, $http, $uibModal, $filter, $timeout, $window) {
    $scope.unitType = "Location Wise Failure & Warning Status";
    $scope.dashboardThemeColor = false;
    $scope.isSankeyChart = false;
    $scope.isGrid = false;
    $scope.isTagChart = false;
    $scope.refresh = false;
    $scope.areapage = false;
    // $scope.isReportSection = false;
    //$scope.isFirstClient = true;
    $scope.isFirstCountry = true;
    $scope.isclientChart = false;
    //$scope.healthChart = true;

    $scope.gridSection = function () {
        $scope.isGrid = true;
        $scope.isSankeyChart = false;
        $scope.isTagChart = false;
        $scope.isReportSection = false;
        $scope.isclientChart = false;
    };


    //$http.get("/ObserverDashboard/GetUserInfo")
    //    .then(function (response) {
    //        var UserId = response.data;
    //        if (UserId === 190) {
    //            $scope.showAdmininfo = true;
    //            $scope.isSankeyChart = true;
    //        } else {
    //            $scope.showAdmininfo = false;
    //            $scope.isGrid = true;
    //        }
    //    });
    $http.get("/ObserverDashboard/GetUserRoleID")
        .then(function (response) {
            var UserRole = response.data;
            if (UserRole.length > 0) {
                $scope.showAdmininfo = true;
                $scope.isSankeyChart = true;
            } else {
                $scope.showAdmininfo = false;
                $scope.isGrid = true;
            }
        });
    //$scope.reportSection = function () {
    //    $scope.isGrid = false;
    //    $scope.isSankeyChart = false;
    //    $scope.isTagChart = false;
    //    $scope.isReportSection = true;
    //    $scope.isclientChart = false;
    //};
    $scope.sankeySection = function () {
        $scope.isGrid = false;
        $scope.isSankeyChart = true;
        $scope.isTagChart = false;
        //$timeout(function () {
        //    $scope.sankey();
        //}, 2);
        $scope.isReportSection = false;
        $scope.isclientChart = false;
    };

    $scope.clientChartSection = function () {
        $scope.isclientChart = true;
        $scope.isGrid = false;
        $scope.isSankeyChart = false;
        $scope.isTagChart = false;
        $scope.isReportSection = false;
        $timeout(function () {
            $scope.SectorChart();
            $scope.SegmentChart();
        }, 2);
    };
    $scope.tagChartSection = function () {
        $scope.isGrid = false;
        $scope.isSankeyChart = false;
        $scope.isTagChart = true;
        $scope.isReportSection = false;
        $timeout(function () {
            $scope.tagChart();
        }, 2);
        $scope.isclientChart = false;
    };

    $scope.dashbordThemeColor = false;
    $scope.setBackgroudColor = function () {
        $scope.dashbordThemeColor = true;
    };

    //$scope.settingsDetails = false;
    //$scope.settingsMenu = function () {
    //    $scope.settingsDetails = !$scope.settingsDetails;
    //};

    $scope.setBackgroudColor = function () {
        $scope.dashboardThemeColor = !$scope.dashboardThemeColor;
    };

    $scope.fullScreenDetails = false;
    $scope.isfullScreenDetails = false;
    var elem = document.getElementById("mainController");
    $scope.fullScreen = function () {
        if (elem && !$scope.fullScreenDetails) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
            $scope.fullScreenDetails = true;
            document.body.isfullScreenDetails = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            $scope.fullScreenDetails = false;
            document.body.isfullScreenDetails = false;
        }
    };


    $scope.fullScreenChart = function (id) {
        var element2 = document.getElementById(id);
        var sliceId = document.getElementById('slice-chart');
        element2.style.backgroundColor = '#fff';
        if (element2 && !$scope.fullScreenDetails) {
            sliceId.style.height = '640px';
            if (element2.requestFullscreen) {
                element2.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                element2.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                element2.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                element2.msRequestFullscreen();
            }
            $scope.fullScreenDetails = true;
            document.body.isfullScreenDetails = true;
        } else {
            sliceId.style.height = '341px';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            $scope.fullScreenDetails = false;
            document.body.isfullScreenDetails = false;
        }
    }

    var _columns = [
        {
            name: 'sno', displayName: '#', width: "2%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ObserverDBId', displayName: 'OB Id', cellClass: getCellClass, enableColumnResizing: true, width: "2%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'CL\')">{{row.entity.ObserverDBId}}</a></div>'
        },
        {
            name: 'ClientSiteName', displayName: 'Client', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'CL\')">{{row.entity.ClientSiteName}}</a></div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'PL\')">{{row.entity.PlantAreaName}}</a></div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment', cellClass: getCellClass, enableColumnResizing: true, width: "20%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'EQ\')">{{row.entity.EquipmentName}}</a></div>'
        },
        {
            name: 'UnitName', displayName: 'Asset', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'AS\')">{{row.entity.UnitName}}</a></div>'
        },
        { name: 'TotalPoints', displayName: 'Total Points', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 70 },
        { name: 'NormalCount', displayName: 'Normal Count', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 70 },
        { name: 'WarningCount', displayName: 'Warning Count', cellClass: getCellClass, enableColumnResizing: true, width: "9%", minWidth: 70 },
        { name: 'AlarmCount', displayName: 'Alarm Count', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 50 },
        {
            name: 'Status', displayName: 'Status', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 70,
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="status-dot" style="background:{{row.entity.HealthColor}}"></span> &nbsp;&nbsp;<span>{{row.entity.HealthStatus}}</span></div>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false, cellClass: getCellClass,
            cellTemplate:
                '<div class="ui-grid-cell-contents">' +
                '<a  ng-class="{disable:!row.entity.TendingMetrix}" ng-click="grid.appScope.multiSensorTracking(row.entity.TendingMetrix)"><i class="fa fa-area-chart  icon-space-before" tooltip-append-to-body="true" uib-tooltip="Multi Trend" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "6%",
            minWidth: 50
        }
    ];

    $scope.multiSensorTracking = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfMultiTrendingModal.html',
            controller: 'skfMultiTrendingCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, "AssetName": $scope.displayName };
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.reportSection = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'skfEMaintReportModal.html',
            controller: 'skfEMaintReportCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "data": $scope.EMaintReportData, "title": $scope.displayName, "ClientSiteId": $scope.S_dashboard.ClientSiteId };
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });

    }

    $scope.ShowMappedDetail = function (d, _t) {
        $scope.S_dashboard.Type = _t;
        switch (_t) {
            case 'CL':
                $scope.S_dashboard.ClientSiteId = d.entity.ClientSiteId;
                $scope.S_dashboard.PlantAreaId = null;
                $scope.isPlantClientchart = true;
                break;
            case 'PL':
                $scope.S_dashboard.PlantAreaId = d.entity.PlantAreaId;
                $scope.isPlantClientchart = true;
                $scope.loadReport(d.entity.ClientSiteId);
                break;
            case 'AR':
                $scope.S_dashboard.AreaId = d.entity.AreaId;
                $scope.isPlantClientchart = true;
                $scope.loadReport(d.entity.ClientSiteId);
                break;
            case 'EQ':
                $scope.S_dashboard.EquipmentId = d.entity.EquipmentId;
                $scope.isPlantClientchart = false;
                break;
            case 'AS':
                $scope.S_dashboard.UnitId = d.entity.UnitId;
                $scope.S_dashboard.UnitType = d.entity.UnitType;
                $scope.isPlantClientchart = false;
                break;
        }
        $scope.loadData();
        $scope.loadEquipmentPriority();
    };

    $scope.columns = angular.copy(_columns);
    function getCellClass(grid, row) {
        return row.uid === highlightRow ? 'highlight' : '';
    }
    var highlightRow = null;

    $scope.gridOpts = {
        columnDefs: $scope.columns,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
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
        exporterExcelFilename: 'EMaintenance_AssetMapping.xlsx',
        exporterExcelSheetName: 'EMaintenance_AssetMapping',
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

    $scope.sankey = function () {
        am4core.useTheme(am4themes_animated);
        // Themes end
        var chart = am4core.create("chartdiv3", am4charts.SankeyDiagram);
        //chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data = $scope.sankeyData;

        let hoverState = chart.links.template.states.create("hover");
        hoverState.properties.opacity = 0.6;
        //hoverState.properties.fill = '#0f58d6';

        chart.dataFields.fromName = "from";
        chart.dataFields.toName = "to";
        chart.dataFields.value = "value";
        chart.dataFields.color = "nodeColor";
        chart.links.template.propertyFields.id = "id";
        chart.links.template.propertyFields.ptype = "Ptype";
        chart.links.template.propertyFields.etype = "Etype";
        chart.links.template.propertyFields.PlantAreaId = "PlantAreaId";
        chart.links.template.propertyFields.EquipmentId = "EquipmentId";
        chart.links.template.propertyFields.UnitId = "UnitId";
        chart.links.template.propertyFields.UnitType = "UnitType";

        chart.links.template.colorMode = "solid";
        chart.titles.template.fontSize = 20;
        //chart.padding(0, 100, 10, 0);
        chart.links.template.fill = am4core.color("grey");
        chart.links.template.stroke = am4core.color("grey");
        //chart.links.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
        //chart.links.template.fillOpacity = 0.2;
        chart.links.template.tooltipText = "{fromName} → {toName}";

        // highlight all links with the same id beginning
        chart.links.template.events.on("hit", function (ev) {
            $scope.ptype = null;
            $scope.etype = null;
            $scope.Sanid = null;
            let link = ev.target;
            $scope.Sanid = link.id;
            if (link.ptype) {
                $scope.ptype = link.ptype;
            }
            if (link.etype) {
                $scope.etype = link.etype;
            }
            if (link.EquipmentId) {
                //$scope.S_dashboard.PlantAreaId = link.PlantAreaId;
                $scope.S_dashboard.EquipmentId = link.EquipmentId;
                $scope.S_dashboard.Type = 'EQ';
            }
            if (link.UnitId) {
                $scope.S_dashboard.UnitId = link.UnitId;
                $scope.S_dashboard.UnitType = link.UnitType;
                $scope.S_dashboard.Type = 'AS';
            }
            $scope.loadData();

            //chart.links.each(function (link) {
            //    //link.fillOpacity = 0.1;
            //    link.fill = am4core.color("grey");
            //    link.stroke = am4core.color("grey");
            //    if (link.$scope.Sanid.indexOf($scope.ptype) !== -1) {
            //        console.log(link.to);
            //        //link.fillOpacity = 0.3;
            //        link.fill = am4core.color("blue");
            //        link.stroke = am4core.color("blue");
            //        link.isHover = false;
            //    }
            //    if (link.$scope.Sanid.indexOf($scope.etype) !== -1) {
            //        //link.fillOpacity = 0.3;
            //        link.fill = am4core.color("blue");
            //        link.stroke = am4core.color("blue");
            //        link.isHover = false;
            //    }
            //    if (link.$scope.Sanid.indexOf($scope.Sanid) !== -1) {
            //        //link.fillOpacity = 0.3;
            //        link.fill = am4core.color("blue");
            //        link.stroke = am4core.color("blue");
            //        link.isHover = false;
            //    }
            //});
        });

        chart.links.template.events.on("over", function (ev) {
            let link = ev.target;
            let id = link.id;
            if (link.ptype) {
                var ptype = link.ptype;
            }
            if (link.etype) {
                var etype = link.etype;
            }
            //link.isHover = false;
            chart.links.each(function (link) {
                if (link.id.indexOf(id) !== -1) {
                    link.isHover = true;
                }
                if (link.id.indexOf(ptype) !== -1) {
                    link.isHover = true;
                }
                if (link.id.indexOf(etype) !== -1) {
                    link.isHover = true;
                }
            });
        });

        chart.links.template.events.on("out", function (event) {
            chart.links.each(function (link) {
                link.isHover = false;
            });
        });

        // for right-most label to fit
        chart.paddingRight = 40;

        // make nodes draggable
        //var nodeTemplate = chart.nodes.template;
        //nodeTemplate.inert = true;
        //nodeTemplate.readerTitle = "Drag me!";
        //nodeTemplate.showSystemTooltip = true;
        //nodeTemplate.width = 20;

        //// make nodes draggable
        ////var nodeTemplate = chart.nodes.template;
        //nodeTemplate.readerTitle = "Click to show details";
        //nodeTemplate.showSystemTooltip = true;
        //nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;


        if ($scope.Sanid) {
            chart.links.template.events.on("inited", function (ev) {
                let link = ev.target;
                let id = $scope.Sanid;
                if (link.ptype) {
                    var pitype = $scope.ptype;
                }
                if (link.etype) {
                    var eitype = $scope.etype;
                }

                chart.links.each(function (link) {
                    //if (link.nodeId === data) {
                    if (link.id.indexOf(pitype) !== -1) {
                        link.fill = am4core.color("blue");
                        link.stroke = am4core.color("blue");
                    }
                    if (link.id.indexOf(eitype) !== -1) {
                        link.fill = am4core.color("blue");
                        link.stroke = am4core.color("blue");
                    }
                    if (link.id.indexOf(id) !== -1) {
                        link.fill = am4core.color("blue");
                        link.stroke = am4core.color("blue");
                    }
                    //}
                });
            }, 3000);
        }
    };

    $scope.Interval = 9000000;
    setInterval(() => {
        //if ($scope.sensorDetail) {
        //    $scope.loadSensorDetail('r', $scope.SensorId);
        //}
        $scope.reload();
        //$http.get("https://18.138.91.203:7788/api/InvokeEmaintenance/SyncLiveDetails")
        //    .then(function (response) {
        //        if (response.data) {
        //            $scope.reload();
        //        }
        //    });
    }, $scope.Interval);

    $scope.loadDashboardFilter = function (Id, _t) {
        $http.get("/ObserverDashboard/GetFilterListByType?type=" + _t + "&id=" + Id)
            .then(function (response) {
                switch (_t) {
                    case 'CR':
                        $scope.DefaultCountry = {
                            ListId: null,
                            ListName: "--Select--"
                        };
                        $scope.CountryDDL = response.data;
                        $scope.CountryDDL.splice(0, 0, $scope.DefaultCountry);
                        $scope.ClientDDL = [];
                        $scope.PlantDDL = [];

                        if ($scope.isFirstCountry) {
                            $scope.Dropdown = $scope.CountryDDL.find((obj) => obj.ListName === 'India');
                            $scope.Dropdown.CountryId = $scope.Dropdown.ListId;
                            $scope.cseletedId = $scope.Dropdown.ListId;
                            $scope.isFirstCountry = false;
                            $scope.loadDashboardFilter($scope.Dropdown.CountryId, 'CL');
                        }
                        break;
                    case 'CL':
                        $scope.Dropdown.ClientSiteId = null;
                        $scope.Dropdown.PlantAreaId = null;
                        $scope.S_dashboard.ClientSiteId = null;
                        $scope.S_dashboard.PlantAreaId = null;
                        $scope.DefaultClient = {
                            ListId: null,
                            ListName: "--Select--"
                        };

                        $scope.ClientDDL = response.data;
                        $scope.ClientDDL.splice(0, 0, $scope.DefaultClient);
                        $scope.S_dashboard.CountryId = Id;
                        $scope.PlantDDL = [];
                        //if ($scope.isFirstClient) {
                        //    $scope.Dropdown = $scope.ClientDDL[1];
                        //    $scope.Dropdown.CountryId = $scope.cseletedId;
                        //    $scope.Dropdown.ClientSiteId = $scope.Dropdown.ListId;
                        //    $scope.isFirstClient = false;
                        //    $scope.loadDashboardFilter($scope.Dropdown.ClientSiteId, 'PL');
                        //    $scope.loadFilterData($scope.Dropdown.CountryId, $scope.Dropdown.ClientSiteId, null);
                        //}
                        break;
                    case 'PL':
                        $scope.Dropdown.PlantAreaId = null;
                        $scope.S_dashboard.PlantAreaId = null;
                        $scope.DefaultPlant = {
                            ListId: null,
                            ListName: "--Select--"
                        };
                        $scope.S_dashboard.ClientSiteId = Id;
                        $scope.PlantDDL = response.data;
                        $scope.PlantDDL.splice(0, 0, $scope.DefaultPlant);
                }
            });
    };

    $scope.clearModal = function () {
        $scope.S_dashboard = {
            CountryId: null,
            ClientSiteId: null,
            PlantAreaId: null,
            EquipmentId: 0,
            UnitId: 0,
            UnitType: null,
            Type: 'CL'
        };
        $scope.Dropdown = {
            CountryId: null,
            ClientSiteId: null,
            PlantAreaId: null
        };
        $scope.loadDashboardFilter(0, 'CR');
    };
    $scope.clearModal();

    $scope.loadFilterData = function () {
        $scope.isloading = true;
        $scope.isPlantClientchart = true;
        if ($scope.Dropdown.PlantAreaId) {
            $scope.Showmenu = false;
            $scope.S_dashboard.Type = 'PL';
            $scope.S_dashboard.PlantAreaId = $scope.Dropdown.PlantAreaId;
            $scope.loadData();
            $scope.loadEquipmentPriority();
            $scope.loadReport($scope.Dropdown.ClientSiteId);
        }
        else {
            $scope.Showmenu = false;
            $scope.S_dashboard.Type = 'CL';
            $scope.S_dashboard.CountryId = $scope.Dropdown.CountryId;
            $scope.S_dashboard.ClientSiteId = $scope.Dropdown.ClientSiteId;
            $scope.loadData();
            $scope.loadEquipmentPriority();
        }
    };

    $scope.reload = function () {
        $scope.Showmenu = false;
        $scope.refresh = true;
        $scope.loadData();
    };

    $scope.sankeyData = [];
    $scope.PhysicalPath = [];
    $scope.loadData = function () {

        $scope.isloading = true;
        $scope.sensorDetail = false;
        if (!$scope.refresh) {
            let b = angular.copy($scope.S_dashboard.Type);
            $scope.PreType = b;
            $scope.MapData = [];
            $scope.sankeyData = [];
            $scope.PhysicalPath = [];
        } else {
            $scope.S_dashboard.Type = $scope.PreType;
        }
        if ($scope.S_dashboard.Type === 'AS' || $scope.S_dashboard.Type === 'AR' || $scope.S_dashboard.Type === 'SR') {
            $scope.AssetGrid = true;
        } else {
            $scope.AssetGrid = false;
        }

        if ($scope.S_dashboard.PlantAreaId == 3343 && $scope.S_dashboard.Type === "PL" && $scope.S_dashboard.EquipmentId == 0) {
            $scope.S_dashboard.Type = "AR";
            $scope.areapage = true;
            $scope.S_dashboard.ClientSiteId = 1805;
            $scope.S_dashboard.PlantAreaId = null;
        }
        else if ($scope.S_dashboard.ClientSiteId == 1805 && $scope.S_dashboard.Type === "PL" && $scope.S_dashboard.EquipmentId == 0) {
            $scope.S_dashboard.Type = "AR";
            $scope.areapage = true;
            $scope.S_dashboard.ClientSiteId = 1805;
            $scope.S_dashboard.PlantAreaId = null;
        }
        else if ($scope.S_dashboard.ClientSiteId == 1805 && $scope.S_dashboard.Type === "PL" && $scope.S_dashboard.EquipmentId != 0) {
            $scope.S_dashboard.Type = "PL";
            $scope.areapage = false;
            $scope.S_dashboard.EquipmentId = 0;
            $scope.S_dashboard.ClientSiteId = null;
            //  $scope.S_dashboard.PlantAreaId = 3343;

        }
        else {
            $scope.areapage = false;
        }
        var data = {
            "Type": $scope.S_dashboard.Type,
            "UserId": 0,
            "CountryId": $scope.S_dashboard.CountryId,
            "ClientSiteId": $scope.S_dashboard.ClientSiteId,
            "PlantAreaId": $scope.S_dashboard.PlantAreaId,
            "AreaId": 0,
            "EquipmentId": $scope.S_dashboard.EquipmentId,
            "UnitType": $scope.S_dashboard.UnitType,
            "UnitId": $scope.S_dashboard.UnitId
        };
        if ($scope.S_dashboard.Type === "CL") {
            data.EquipmentId = null;
            data.UnitId = null;
            data.PlantAreaId = null;
            data.AreaId = null;
        }


        if ($scope.isReportSection === true && $scope.S_dashboard.Type !== 'EQ') {
            $scope.isReportSection = false;
            $scope.sankeySection();
        }
        if ($scope.isclientChart === true && $scope.S_dashboard.Type !== 'CL') {
            $scope.isclientChart = false;
            $scope.sankeySection();
        }
        var postUrl = "/ObserverDashboard/GetDashboardDetails/";
        $http.post(postUrl, JSON.stringify(data)).then(function (response) {
            if (response.data) {
                $scope.DetailData = JSON.parse(response.data[0].Plotting);
                $scope.DGBBMetrics = $scope.DetailData[0].DGBBMetrics;
                $scope.TRBMetrics = $scope.DetailData[0].TRBMetrics;
                $scope.HUBMetrics = $scope.DetailData[0].HUBMetrics;

                switch ($scope.DetailData[0].NodeType) {
                    case 'PL':
                        if (!$scope.refresh) {
                            $scope.sankeyheight = '800px';
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.S_dashboard.PlantAreaId = null;
                            $scope.MapData = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.SectorMetricsData = $scope.DetailData[0].SectorMetrics;
                            $scope.SegmentMetricsData = $scope.DetailData[0].SegmentMetrics;

                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            $timeout(function () {
                                $scope.isloading = false;
                                $scope.map();
                            }, 2);
                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            //$scope.MapData = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }
                        break;
                    // START TO DISPLAY AREA 
                    case 'AR':
                        if (!$scope.refresh) {
                            $scope.sankeyheight = '800px';
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.S_dashboard.ClientSiteId = $scope.DetailData[0].GridMetrics[0].ClientSiteId;
                            $scope.S_dashboard.PlantAreaId = $scope.DetailData[0].GridMetrics[0].PlantAreaId;
                            $scope.MapData = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.SectorMetricsData = $scope.DetailData[0].SectorMetrics;
                            $scope.SegmentMetricsData = $scope.DetailData[0].SegmentMetrics;

                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            $timeout(function () {
                                $scope.isloading = false;
                                $scope.map();
                            }, 2);
                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.MapData = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }

                        break;

                    //END TO DISPLAY AREA
                    case 'EQ':
                        if (!$scope.refresh) {
                            $scope.sankeyheight = '300px';

                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.PhysicalPath = $scope.DetailData[0].PhysicalPath;
                            $scope.imgWidth = $scope.DetailData[0].ImageWidth;
                            $scope.imgheight = $scope.DetailData[0].ImageHeight;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;

                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.S_dashboard.ClientSiteId = $scope.DetailData[0].GridMetrics[0].ClientSiteId;
                            $scope.S_dashboard.PlantAreaId = $scope.DetailData[0].GridMetrics[0].PlantAreaId;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            if ($scope.gridOpts.data) {
                                $scope.displayName = $scope.gridOpts.data[0].PlantAreaName;
                                $scope.displayType = 'Plant';
                            }
                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = [];
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }
                        break;
                    case 'EQ1805':
                        if (!$scope.refresh) {
                            $scope.sankeyheight = '300px';

                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.PhysicalPath = $scope.DetailData[0].PhysicalPath;
                            $scope.imgWidth = $scope.DetailData[0].ImageWidth;
                            $scope.imgheight = $scope.DetailData[0].ImageHeight;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            //SSK ON CHANGING THE CHART 
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;

                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.S_dashboard.ClientSiteId = $scope.DetailData[0].GridMetrics[0].ClientSiteId;
                            $scope.S_dashboard.PlantAreaId = $scope.DetailData[0].GridMetrics[0].PlantAreaId;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            if ($scope.gridOpts.data) {
                                $scope.displayName = $scope.gridOpts.data[0].PlantAreaName;
                                $scope.displayType = 'Plant';
                            }
                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ObserverDBId = $scope.gridOpts.data[0].ObserverDBId;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.EquipmentHealthMetricsData = $scope.DetailData[0].EMEQHealthMetrics;
                            $scope.FailureCauseMetricsData = [];
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }
                        break;
                    case 'AS':
                        if (!$scope.refresh) {
                            $scope.sankeyheight = '300px';
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.PhysicalPath = $scope.DetailData[0].PhysicalPath;
                            $scope.imgWidth = $scope.DetailData[0].ImageWidth;
                            $scope.imgheight = $scope.DetailData[0].ImageHeight;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;

                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.loadEquipmentHistory();
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            if ($scope.loadTable) {
                                $scope.displayName = $scope.loadTable[0].EquipmentName;
                                $scope.displayType = 'Equipment';
                            }

                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.gridOpts.data = $scope.DetailData[0].GridMetrics;
                            $scope.tagChartData = $scope.DetailData[0].GridMetrics;
                            $scope.ClName = $scope.gridOpts.data[0].ClientSiteName;
                            $scope.ChartMetrics = $scope.DetailData[0].ChartMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }
                        break;
                    case 'SR':
                        if (!$scope.refresh) {
                            $scope.sensorDetail = true;
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.PhysicalPath = $scope.DetailData[0].PhysicalPath;
                            $scope.imgWidth = $scope.DetailData[0].ImageWidth;
                            $scope.imgheight = $scope.DetailData[0].ImageHeight;
                            $scope.gridOpts1.data = $scope.DetailData[0].GridMetrics;
                            $scope.GaugeData = $scope.DetailData[0].GridMetrics;
                            $scope.tagChartData = $scope.DetailData[0].TextMetrics;
                            $scope.loadAssetHistory();
                            $scope.FailureCauseMetricsData = $scope.DetailData[0].FailureCauseMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                            if ($scope.loadTable) {
                                $scope.displayName = $scope.loadTable[0].UnitName;
                                $scope.displayType = 'Asset';
                            }
                        } else {
                            $scope.S_dashboard.Type = $scope.DetailData[0].NodeType;
                            $scope.GaugeData = $scope.DetailData[0].GridMetrics;
                            $scope.gridOpts1.data = $scope.DetailData[0].GridMetrics;
                            $scope.loadTable = $scope.DetailData[0].PlottingMetricsData;
                            $scope.tagChartData = $scope.DetailData[0].TextMetrics;
                            $scope.sankeyData = [...$scope.DetailData[0].SankeyMetrics[0].SankeyPLEQ, ...$scope.DetailData[0].SankeyMetrics[0].SankeyEQAS, ...$scope.DetailData[0].SankeyMetrics[0].SankeyASSE];
                        }
                        break;
                }

                $scope.PieChartData = $scope.DetailData[0].ChartMetrics;
                $scope.chart();


                if ($scope.isTagChart) {
                    $scope.tagChart();
                }
                if ($scope.isSankeyChart) {
                    //$scope.sankey();
                    $scope.piedata1();
                    $scope.piedata2();
                    $scope.piedata3();
                }
                if (!$scope.refresh) {
                    $scope.EquipmentHealthStatistics();
                    $scope.FailureCauseStatistics();
                }
                $scope.Showmenu = true;
                $scope.refresh = false;
                $scope.isloading = false;
                $scope.Interval = 30000;
            }
        });
    };

    //for loading Equipment Condition History
    $scope.loadEquipmentHistory = function () {
        $scope.healthChart = false;
        $http.get("/ObserverDashboard/GetEquipmentConditionHistory?EId=" + $scope.S_dashboard.EquipmentId)
            .then(function (response) {
                $scope.EquipmentHistoryStatistics(response.data, 'EQ');
            });

    };

    $scope.loadAssetHistory = function () {
        $scope.healthChart = false;
        $http.get("/ObserverDashboard/GetAssetConditionHistory?Type=" + $scope.S_dashboard.UnitType + "&Id=" + $scope.S_dashboard.UnitId)
            .then(function (response) {
                $scope.EquipmentHistoryStatistics(response.data, 'AS');
            });
    };

    $scope.piedata1 = function () {
        $http.get("/ObserverDashboard/AssetClassSegmentWise?Cid=" + $scope.S_dashboard.CountryId + "&ClId=" + $scope.S_dashboard.ClientSiteId)
            .then(function (response) {
                $scope.pie1 = JSON.parse(response.data[0].OAppDBAssetClassSegmentWise);
                $scope.Piechart1();
            });

    };

    $scope.piedata2 = function () {
        $http.get("/ObserverDashboard/GetSegmentByCustomer?Cid=" + $scope.S_dashboard.CountryId)
            .then(function (response) {
                $scope.pie2 = JSON.parse(response.data[0].OAppDBSegmentByCustomer);
                $scope.Piechart2();
            });

    };

    $scope.piedata3 = function () {
        $http.get("/ObserverDashboard/GetFailureCauseSegmentWise?Cid=" + $scope.S_dashboard.CountryId + "&ClId=" + $scope.S_dashboard.ClientSiteId + "&PlId=" + $scope.S_dashboard.PlantAreaId)
            .then(function (response) {
                $scope.pie3 = JSON.parse(response.data[0].OAppDBFailureCauseSegmentWise);
                $scope.Piechart3();

            });

    };

    $scope.loadEquipmentPriority = function () {
        var data = {
            "UserId": 0,
            "CountryId": $scope.S_dashboard.CountryId,
            "ClientSiteId": $scope.S_dashboard.ClientSiteId,
            "PlantAreaId": $scope.S_dashboard.PlantAreaId,
            "AreaId": $scope.S_dashboard.AreaId,
            "EquipmentId": $scope.S_dashboard.EquipmentId,
            "UnitType": $scope.S_dashboard.UnitType,
            "UnitId": $scope.S_dashboard.UnitId
        };
        switch ($scope.S_dashboard.Type) {
            case 'EQ':
                data.UnitType = null;
                data.UnitId = null;
                break;
            case 'PL':
                data.UnitType = null;
                data.UnitId = null;
                data.EquipmentId = null;
                data.AreaId = null;
                break;
            case 'AR':
                data.UnitType = null;
                data.UnitId = null;
                data.EquipmentId = null;
                break;
            case 'CL':
                data.UnitType = null;
                data.UnitId = null;
                data.EquipmentId = null;
                data.PlantAreaId = null;
                //data.CountryId = null;
                break;
        }
        var postUrl = "/ObserverDashboard/GetEMaintEquipmentPriority";
        $http.post(postUrl, JSON.stringify(data)).then(function (response) {
            if (response.data) {
                $scope.EquipmentPriorityStatistics(response.data);
            }
        });
    };
    $scope.loadEquipmentPriority();
    $scope.loadImgDetail = function (data, _t) {
        $scope.homeType = false;
        $scope.isloading = true;
        switch ($scope.S_dashboard.Type) {
            case 'EQ':
                $scope.S_dashboard.EquipmentId = data;
                $scope.loadData();
                $scope.loadEquipmentPriority();
                $scope.isPlantClientchart = false;
                break;
            case 'AR':
                $scope.S_dashboard.AreaId = data;
                $scope.loadData();
                $scope.loadEquipmentPriority();
                $scope.isPlantClientchart = true;
                break;
            case 'AS':
                $scope.S_dashboard.UnitId = data;
                $scope.S_dashboard.UnitType = _t;
                $scope.loadData();
                $scope.loadEquipmentPriority();
                $scope.isPlantClientchart = false;
                break;
            case 'SR':
                $scope.S_dashboard.UnitId = data;
                $scope.loadData();
                $scope.loadEquipmentPriority();
                $scope.isPlantClientchart = false;
                break;
        };
    };

    $scope.isPlantClientchart = true;
    $scope.homeType = true;
    $scope.goTo = function (data) {
        if (data !== 'home') {
            $scope.homeType = false;
            if (data === 'PL' || data === 'CL' || data === 'AR') {
                $scope.isPlantClientchart = true;
            } else if (data === 'EQ' || data === 'AS') {
                $scope.isPlantClientchart = false;
            }
            $scope.Showmenu = false;
            $scope.S_dashboard.Type = data;
            $scope.loadData();
            $scope.loadEquipmentPriority();
            if (data === "PL") {
                $scope.loadReport($scope.S_dashboard.ClientSiteId);
            }
        }
        else {
            $scope.homeType = true;
            $window.location.reload();
        }

    };

    $scope.goToEQ = function (data, temp) {

        // var plantImg = ev.target.dataItem.dataContext;
        $scope.S_dashboard.PlantAreaId = temp.PlantAreaId;
        $scope.S_dashboard.EquipmentId = temp.EquipmentId;
        $scope.S_dashboard.Type = 'PL';
        $scope.loadData();
        $scope.loadEquipmentPriority();
        $scope.loadReport(temp.ClientSiteId);

        //if (data !== 'home') {
        //    $scope.homeType = false;
        //    if (data === 'PL' || data === 'CL') {
        //        $scope.isPlantClientchart = true;
        //    } else if (data === 'EQ' || data === 'AS' || data === 'AR') {
        //        $scope.isPlantClientchart = false;
        //    }
        //    $scope.Showmenu = false;
        //    $scope.S_dashboard.Type = 'PL';
        //    $scope.S_dashboard.PlantAreaId = temp.PlantAreaId;
        //    $scope.S_dashboard.EquipmentId = temp.EquipmentId;

        //    $scope.loadData();
        //    $scope.loadEquipmentPriority();
        //    if (data === "PL") {
        //        $scope.loadReport($scope.S_dashboard.ClientSiteId);
        //    }
        //}
        //else {
        //    $scope.homeType = true;
        //    $window.location.reload();
        //}

    };

    $scope.tagChart = function () {
        am4core.useTheme(am4themes_animated);

        // Themes end
        var chart = am4core.create("tagchart", am4plugins_wordCloud.WordCloud);
        chart.fontFamily = "Courier New";
        chart.preloader.disabled = true;
        var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
        series.randomness = 0.1;
        series.rotationThreshold = 0.5;

        series.data = $scope.tagChartData;

        series.dataFields.word = "UnitName";
        series.dataFields.value = "TrendOrder";
        series.dataFields.Name = "UnitName";

        series.labels.template.propertyFields.fill = "HealthColor";
        series.heatRules.push({
            "target": series.labels.template,
            "property": "fill",
            "min": 'color',
            "max": 'color',
            "dataField": "value"
        });
        series.labels.template.propertyFields.UnitId = "UnitId";
        series.labels.template.propertyFields.UnitType = "UnitType";
        series.labels.template.events.on("hit", function (event) {
            let link = event.target;
            $scope.S_dashboard.UnitId = link.UnitId;
            $scope.S_dashboard.UnitType = link.UnitType;
            $scope.S_dashboard.Type = 'AS';
            $scope.loadData();
        });

        //series.labels.template.url = "https://stackoverflow.com/questions/tagged/{word}";
        //series.labels.template.urlTarget = "_blank";
        series.labels.template.tooltipText = "ClientSite: {ClientSiteName} \n PlantArea: {PlantAreaName} \n Equipment: {EquipmentName} \n Health Status: {HealthStatus}";

        var hoverState = series.labels.template.states.create("hover");
        hoverState.properties.fill = am4core.color("#FF0000");

        //var subtitle = chart.titles.create();
        //subtitle.text = "(click to open)";

        var title = chart.titles.create();
        //title.text = "Most Popular Tags @ StackOverflow";
        title.fontSize = 20;
        title.fontWeight = "800";
        title.fill = "HealthColor";
    };

    $scope.map = function () {

        var chart = am4core.create("mapdiv", am4maps.MapChart);
        chart.preloader.disabled = true;
        //var title = chart.titles.create();
        //title.text = "Plant Wise Health Status";
        //title.fontSize = 15;
        //title.fontWeight = "600";
        //title.fill = "#2980b9";
        //title.marginBottom = 10;
        // Set map definition
        //  chart.geodata = am4geodata_worldIndiaLow;
        chart.geodata = am4geodata_worldIndiaLow;
        //chart.preloader.disabled = false;

        // Set projection
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series
        var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

        // Exclude Antartica
        polygonSeries.exclude = ["AQ"];
        polygonSeries.include = ["IN", 'NP', 'BT', 'LK'];

        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        // Configure series
        var polygonTemplate = polygonSeries.mapPolygons.template;
        //polygonTemplate.tooltipHTML = '<b>{name}</b><br><a href="https://en.wikipedia.org/wiki/{name.urlEncode()}">More info</a>';
        //polygonTemplate.tooltipHTML = '<b>{name}</b><br><a href="javascript:demo()">More info</a>';
        polygonTemplate.fill = am4core.color("#ffffff");

        // Set up tooltips
        //polygonSeries.calculateVisualCenter = true;
        //polygonTemplate.tooltipPosition = "fixed";
        //polygonSeries.tooltip.label.interactionsEnabled = true;
        //polygonSeries.tooltip.keepTargetHover = true;
        //var colorSet = new am4core.ColorSet();
        //polygonTemplate.adapter.add("fill", function (fill, target) {
        //    return colorSet.getIndex(target.dataItem.index + 1).saturate(0.2);
        //});

        // Create hover state and set alternative fill color
        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#ffffff");

        chart.events.on("ready", function (ev) {
            chart.zoomToMapObject(polygonSeries.getPolygonById("IN"));
        });

        //// Images series mapping 
        var imageSeries = chart.series.push(new am4maps.MapImageSeries());
        var imageSeriesTemplate = imageSeries.mapImages.template;
        imageSeriesTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        imageSeriesTemplate.propertyFields.latitude = "Latitude";
        imageSeriesTemplate.propertyFields.longitude = "Longitude";
        imageSeriesTemplate.propertyFields.id = "PlantAreaId";
        imageSeries.tooltip.keepTargetHover = true;
        imageSeries.tooltip.cursorOverStyle = am4core.MouseCursorStyle.grab;

        //// on clicking in the tooltip
        //imageSeries.tooltip.events.on("hit", function (ev) {
        //    console.log(ev.target.dataItem.dataContext);
        //});

        var circle = imageSeriesTemplate.createChild(am4core.Circle);
        circle.className = "plot-dash-point";
        circle.radius = 6;
        ////circle.fill = "{HealthColor}";
        //circle.stroke = am4core.color("#FFFFFF");
        //circle.strokeWidth = 2;
        circle.nonScaling = true;
        circle.tooltipText = "{PlantAreaName}";
        circle.tooltipPosition = "fixed";
        circle.propertyFields.fill = "HealthColor";
        //circle.adapter.add("fill", function (fill, target) {
        //    return target.dataItem;
        //    });
        //COMMENTS BY SSK ON 31-12-2019  circle.tooltipHTML = '<b style="cursor:pointer;">{ClientSiteName} <div>({PlantAreaName})</div></b>';
        circle.tooltipHTML = '<b style="cursor:pointer;">{ClientSiteName} </b>';
        // invoking a method clicking plotted point
        circle.events.on("hit", function (ev) {
            var plantImg = ev.target.dataItem.dataContext;
            $scope.S_dashboard.PlantAreaId = plantImg.PlantAreaId;
            $scope.S_dashboard.Type = 'PL';
            $scope.loadData();
            $scope.loadEquipmentPriority();
            $scope.loadReport(plantImg.ClientSiteId);
        });

        imageSeries.data = $scope.MapData;
        //Slider Options for maps 
        //var slider = chart.chartContainer.createChild(am4core.Slider);
        //slider.start = 0.5;
        //slider.margin(0, 0, 20, 0);
        //slider.valign = "bottom";
        //slider.align = "center";
        //slider.width = 500;
        //slider.events.on("rangechanged", () => {
        //    chart.deltaLongitude = slider.start * 360 - 180;
        //});
    };

    $scope.chart = function () {
        var chart = am4core.create("slice-chart", am4charts.RadarChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        let title = chart.titles.create();
        title.text = "";
        title.fontSize = 16;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        title.marginTop = 0;
        title.paddingTop = 0;
        title.marginBottom = 20;
        var label = chart.createChild(am4core.Label);
        label.text = "Drag slider to change radius";
        label.exportable = false;
        label.fill = "grey";
        chart.data = $scope.ChartMetrics;

        chart.radius = am4core.percent(95);
        chart.startAngle = 260 - 170;
        chart.endAngle = 260 + 170;
        chart.innerRadius = am4core.percent(50);

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.labels.template.fontSize = 10;
        categoryAxis.renderer.grid.template.strokeOpacity = 0.1;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.axisFills.template.disabled = true;
        categoryAxis.renderer.axisFills.template.tooltipText = "{ClientSiteName}";
        categoryAxis.mouseEnabled = false;
        let labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.fontSize = 10;
        labelTemplate.fontWeight = 200;
        label.truncate = true;
        label.tooltipText = "{ClientSiteName}";
        labelTemplate.tooltipPosition = "fixed";
        labelTemplate.wrap = true;
        labelTemplate.maxWidth = 100;
        labelTemplate.maxHeight = 200;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        //categoryAxis.events.on("sizechanged", function (ev) {
        //    var axis = ev.target;
        //    var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
        //    axis.renderer.labels.template.maxWidth = cellWidth;
        //});

        //categoryAxis.renderer.labels.template.events.on("hit", function (event) {
        //    console.log(event.target.dataItem.dataContext);
        //});

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.grid.template.strokeOpacity = 0.05;
        valueAxis.renderer.labels.template.fontSize = 10;
        valueAxis.renderer.axisFills.template.disabled = true;
        valueAxis.renderer.axisAngle = 260;
        valueAxis.renderer.labels.template.horizontalCenter = "right";
        valueAxis.min = 0;
        valueAxis.renderer.minGridDistance = 30;
        valueAxis.renderer.labels.template.adapter.add("text", function (text, target) {
            return text.match(/\./) ? "" : text;
        });
        var series1 = chart.series.push(new am4charts.RadarColumnSeries());
        series1.columns.template.radarColumn.strokeOpacity = 1;
        series1.name = $scope.ChartMetrics[0].title1;
        series1.dataFields.categoryX = "category";
        series1.columns.template.tooltipText = "{title1}\n Count: {valueY.value}";
        series1.dataFields.valueY = "value1";
        series1.fill = $scope.ChartMetrics[0].value1color;
        series1.stacked = true;
        series1.tooltip.label.interactionsEnabled = true;
        series1.tooltip.keepTargetHover = true;
        series1.columns.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series1.columns.template.adapter.add("fill", function (fill, target) {
            $scope.Series1Data = target.dataItem.dataContext;
            return target.dataItem.dataContext.value1color;
        });
        if ($scope.S_dashboard.Type !== 'AS') {
            series1.columns.template.tooltipHTML = '<b>{title1}<div>Count:{valueY.value}</div></b><a style="cursor:pointer;" onclick="set(1)">More info</a>';
        }


        var series2 = chart.series.push(new am4charts.RadarColumnSeries());
        series2.columns.template.radarColumn.strokeOpacity = 1;
        series2.columns.template.tooltipText = "{title2}\n Count: {valueY.value}";
        series2.name = $scope.ChartMetrics[0].title2;
        series2.dataFields.categoryX = "category";
        series2.dataFields.valueY = "value2";
        series2.stacked = true;
        series2.columns.template.propertyFields.fill = "value2Color";
        series2.fill = $scope.ChartMetrics[0].value2color;
        series2.tooltip.label.interactionsEnabled = true;
        series2.tooltip.keepTargetHover = true;
        series2.columns.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series2.columns.template.adapter.add("fill", function (fill, target) {
           $scope.Series2Data = target.dataItem.dataContext;
            return target.dataItem.dataContext.value2color;
        });
        if ($scope.S_dashboard.Type !== 'AS') {
            series2.columns.template.tooltipHTML = '<b>{title2}<div>Count:{valueY.value}</div></b><a style="cursor:pointer;" onclick="set(2)">More info</a>';
        }

        var series3 = chart.series.push(new am4charts.RadarColumnSeries());
        series3.columns.template.radarColumn.strokeOpacity = 1;
        series3.columns.template.propertyFields.fill = "color";
        series3.columns.template.tooltipText = "{title3}\n Count: {valueY.value}";
        series3.name = $scope.ChartMetrics[0].title3;
        series3.dataFields.categoryX = "category";
        series3.dataFields.valueY = "value3";
        series3.stacked = true;
        series3.columns.fill = "value3Color";
        series3.fill = $scope.ChartMetrics[0].value3color;
        series3.tooltip.label.interactionsEnabled = true;
        series3.tooltip.keepTargetHover = true;
        series3.columns.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series3.columns.template.adapter.add("fill", function (fill, target) {
           $scope.Series3Data = target.dataItem.dataContext;
            return target.dataItem.dataContext.value3color;
        });
        if ($scope.S_dashboard.Type !== 'AS') {
            series3.columns.template.tooltipHTML = '<b>{title3}<div>Count:{valueY.value}</div></b><a style="cursor:pointer;" onclick="set(3)">More info</a>';
        }

        var series4 = chart.series.push(new am4charts.RadarColumnSeries());
        series4.columns.template.radarColumn.strokeOpacity = 1;
        series4.columns.template.tooltipText = "{title4}\n Count: {valueY.value}";
        series4.name = $scope.ChartMetrics[0].title4;
        series4.dataFields.categoryX = "category";
        series4.dataFields.valueY = "value4";
        series4.stacked = true;
        series4.columns.fill = "value4Color";
        chart.seriesContainer.zIndex = -1;
        series4.fill = $scope.ChartMetrics[0].value4color;
        series4.tooltip.label.interactionsEnabled = true;
        series4.tooltip.keepTargetHover = true;
        series4.columns.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series4.columns.template.adapter.add("fill", function (fill, target) {
         $scope.Series4Data = target.dataItem.dataContext;
            return target.dataItem.dataContext.value4color;
        });
        if ($scope.S_dashboard.Type !== 'AS') {
            series4.columns.template.tooltipHTML = '<b>{title4}<div>Count:{valueY.value}</div></b><a style="cursor:pointer;" onclick="set(4)">More info</a>';
        }


        var slider = chart.createChild(am4core.Slider);
        slider.start = 0.5;
        slider.exportable = false;
        slider.events.on("rangechanged", function () {
            var start = slider.start;

            chart.startAngle = 270 - start * 179 - 1;
            chart.endAngle = 270 + start * 179 + 1;

            valueAxis.renderer.axisAngle = chart.startAngle;
        });
    };

    $scope.EquipmentHealthStatistics = function () {
        var chart = am4core.create("chartdiv4", am4charts.PieChart);
       // console.log($scope.EquipmentHealthMetricsData);
        if (!$scope.EquipmentHealthMetricsData || $scope.EquipmentHealthMetricsData.length === 0) {
            var label = chart.createChild(am4core.Label);
            label.text = "No Data Available";
            label.exportable = false;
            label.fill = "grey";
            label.fontSize = 15;
            label.align = "center";
            label.isMeasured = false;
            label.x = 140;
            label.y = 80;
        }
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        let title = chart.titles.create();
        title.text = "Latest Equipment Health Report";
        title.fontSize = 15;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        title.marginBottom = 10;
        title.marginTop = 10;
        chart.data = $scope.EquipmentHealthMetricsData;
        chart.radius = am4core.percent(70);
        chart.innerRadius = am4core.percent(40);
        chart.startAngle = 180;
        chart.endAngle = 360;
        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "AssetCount";
        series.dataFields.category = "HealthStatus";
        series.slices.template.propertyFields.fill = "HealthColor";

        // for hiding lables
        series.alignLabels = false;
        series._labels.template.hidden = true;
        series._labels.template.disabled = true;


        series.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series.slices.template.cornerRadius = 6;
        series.slices.template.innerCornerRadius = 3;
        series.slices.template.draggable = false;
        series.slices.template.inert = true;
        series.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        series.tooltip.label.events.on("focus", function (event, target) {
            $scope.HealthData = event.target.dataItem.dataContext;
        });

        series.tooltip.label.interactionsEnabled = true;
        series.tooltip.keepTargetHover = true;

        series.slices.template.tooltipHTML = '<b>{category}<div>Count:{value}</div></b><a style="cursor:pointer;" onclick="health(1)">More info</a>';

        series.hiddenState.properties.startAngle = 90;
        series.hiddenState.properties.endAngle = 90;
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        chart.legend.valueLabels.template.disabled = true;
        chart.legend.itemContainers.template.fontSize = 10;
        chart.legend.itemContainers.template.fontWeight = 200;
        chart.legend.itemContainers.template.properties.marginLeft = 4;
        chart.legend.itemContainers.template.properties.marginTop = 4;
        var markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        markerTemplate.stroke = am4core.color("#ccc");
        // customising legend text
        series.legendSettings.labelText = "{category}: {value}";
    };

    $scope.Piechart1 = function () {
        var chart = am4core.create("piechart1", am4charts.XYChart);
        let title = chart.titles.create();
        title.text = "Asset Class-SSK";
        title.fontSize = 15;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        //title.marginTop = 10;
        chart.hiddenState.properties.opacity = 0;
        // Add data
        chart.data = $scope.pie1;

        // Create axes

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "Category";
        categoryAxis.dataFields.value = "Count";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        let label = categoryAxis.renderer.labels.template;
        label.wrap = true;
        label.maxWidth = 120;
        label.fontSize = 10;
        label.fontWeight = 600;
        label.tooltipPosition = "fixed";
        label.wrap = true;
        label.maxWidth = 100;

        //"categoryAxis": {
        //    "autoRotateAngle": 45,
        //        "autoRotateCount": 5
        //}
        // categoryAxis.autoRotateAngle = 45;
        // categoryAxis.autoRotateCount = 5;
        categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "Count";
        series.dataFields.categoryX = "Category";
        series.name = "Count";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;

        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        series.columns.template.events.on("hit", function (ev) {
            var sectorId = ev.target._dataItem._dataContext.SectorId;
            var assetName = ev.target._dataItem._dataContext.Category;
            var healthData = {
                "ConditionId": 86,
                "HealthStatus": "ALERT",
                "AssetCount": 6,
                "HealthColor": "#FF8004"
            };
            var data = {

                "UserId": 0,
                "CountryId": $scope.S_dashboard.CountryId,
                "ClientSiteId": $scope.S_dashboard.ClientSiteId,
                "PlantAreaId": $scope.S_dashboard.PlantAreaId,
                "AssetName": assetName
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'skfFilterPieChartModal1.html',
                controller: 'skfFilterPieChartCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    params: function () {
                        return { "data": data, 'healthData': healthData };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        });
    };

    //$scope.Piechart1 = function () {

    //var chart = am4core.create("piechart1", am4charts.PieChart3D);
    //let title = chart.titles.create();
    // title.text = "Asset Class";
    //title.fontSize = 15;
    // title.fontWeight = 600;
    // title.fill = "#2980b9";
    // title.marginTop = 10;
    // title.paddingTop = 10;
    // chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    // Add data
    // chart.data = $scope.pie1;

    // Add and configure Series
    // var pieSeries = chart.series.push(new am4charts.PieSeries());

    // pieSeries.dataFields.value = "Count";
    //pieSeries.dataFields.category = "Category";
    // pieSeries.slices.template.tooltipHTML = '{Category} ({Count})';
    //pieSeries.labels.template.text = '';
    //pieSeries.legendSettings.labelText = '{Category} ({Count})';
    //pieSeries.slices.template.stroke = am4core.color("#fff");
    //pieSeries.slices.template.strokeWidth = 3;
    // pieSeries.ticks.template.disabled = true;
    // pieSeries.alignLabels = false;
    // chart.legend = new am4charts.Legend();
    // chart.legend.useDefaultMarker = true;
    //chart.legend.valueLabels.template.disabled = true;
    // chart.legend.itemContainers.template.fontSize = 12;
    //chart.legend.itemContainers.template.properties.marginLeft = 4;
    //chart.legend.itemContainers.template.properties.marginTop = 4;
    // var markerTemplate = chart.legend.markers.template;
    //markerTemplate.width = 10;
    // markerTemplate.height = 10;
    //markerTemplate.stroke = am4core.color("#ccc");
    /// pieSeries.slices.template.events.on("hit", function (ev) {
    ///    var sectorId = ev.target._dataItem._dataContext.SectorId;
    //   var healthData = {
    //      "ConditionId": 86,
    //      "HealthStatus": "ALERT",
    //      "AssetCount": 6,
    //      "HealthColor": "#FF8004"
    //  };
    // var data = {
    //      "UserId": 0,
    //      "CountryId": 1,
    //      "ClientSiteId": null,
    //      "PlantAreaId": null,
    //      "ConditionId": 86
    //  };
    // var modalInstance = $uibModal.open({
    //   templateUrl: 'skfFilterPieChartModal1.html',
    //   controller: 'skfFilterPieChartCtrl',
    //  size: 'lg',
    //  backdrop: 'static',
    // keyboard: false,
    // resolve: {
    // params: function () {
    //   return { "data": data, 'healthData': healthData };
    // }
    //}
    // });
    //modalInstance.result.then(function () {
    // }, function () {
    /// });
    //});

    //};
    $scope.Piechart2 = function () {

        var chart = am4core.create("piechart2", am4charts.PieChart3D);
        let title = chart.titles.create();
        title.text = "Customers By Segment";
        title.fontSize = 15;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        title.marginTop = 10;
        title.paddingTop = 10;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        // Add data
        chart.data = $scope.pie2;

        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "Count";
        pieSeries.dataFields.category = "Category";
        var colorSet = new am4core.ColorSet();
        colorSet.list = ["#388E3C", "#FBC02D", "#0288d1", "#ff8004", "#8E24AA", "#2980b9"].map(function (color) {
            return new am4core.color(color);
        });
        pieSeries.colors = colorSet;
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 3;
        pieSeries.dataFields.value = "Count";
        pieSeries.dataFields.category = "Category";
        pieSeries.slices.template.tooltipHTML = '{Category} ({Count})';
        pieSeries.legendSettings.labelText = '{Category} ({Count})';
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 3;
        pieSeries.labels.template.text = '{Category} ({Count})';
        pieSeries.labels.template.fontSize = 10;
        pieSeries.labels.template.fontWeight = 600;
        pieSeries.labels.template.tooltipPosition = "fixed";
        pieSeries.labels.template.wrap = true;
        pieSeries.labels.template.maxWidth = 100;
        //pieSeries.ticks.template.disabled = true;
        //pieSeries.alignLabels = false;
        //chart.legend = new am4charts.Legend();
        // chart.legend.useDefaultMarker = true;
        // chart.legend.valueLabels.template.disabled = true;
        // chart.legend.itemContainers.template.fontSize = 12;
        //chart.legend.itemContainers.template.properties.marginLeft = 4;
        // chart.legend.itemContainers.template.properties.marginTop = 4;
        // var markerTemplate = chart.legend.markers.template;
        // markerTemplate.width = 10;
        // markerTemplate.height = 10;
        // markerTemplate.stroke = am4core.color("#ccc");
        pieSeries.slices.template.events.on("hit", function (ev) {
            var sectorId = ev.target._dataItem._dataContext.SectorId;
            var SectorName = ev.target._dataItem._dataContext.Category;
            var modalInstance = $uibModal.open({
                templateUrl: 'skfFilterPieChartModal2.html',
                controller: 'skfFilterPieChartCtrl1',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    params: function () {
                        return { "SectorId": sectorId, "SectorName": SectorName };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        });

    };


    $scope.Piechart3 = function () {

        var chart = am4core.create("piechart3", am4charts.PieChart3D);
        let title = chart.titles.create();
        title.text = "Failure Cause By Segment";
        title.fontSize = 15;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        title.marginTop = 10;
        title.paddingTop = 10;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        // Add data
        chart.data = $scope.pie3;

        // Add and configure Series
        //var pieSeries = chart.series.push(new am4charts.PieSeries());
        //pieSeries.dataFields.value = "Count";
        //pieSeries.dataFields.category = "Category";
        //pieSeries.slices.template.stroke = am4core.color("#fff");
        //pieSeries.slices.template.strokeWidth = 3;
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "Count";
        pieSeries.dataFields.category = "Category";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 3;
        var colorSet = new am4core.ColorSet();
        colorSet.list = ["#ff8004", "#12b5e6", "#c512e6", "#12e619", "#6df307", "#f3e107"].map(function (color) {
            return new am4core.color(color);
        });
        pieSeries.colors = colorSet;
        pieSeries.dataFields.value = "Count";
        pieSeries.dataFields.category = "Category";
        pieSeries.slices.template.tooltipHTML = '{Category} ({Count})';
        pieSeries.labels.template.text = '{Category} ({Count})';
        pieSeries.legendSettings.labelText = '{Category} ({Count})';
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 3;
        pieSeries.labels.template.fontSize = 10;
        pieSeries.labels.template.fontWeight = 600;
        pieSeries.labels.template.tooltipPosition = "fixed";
        pieSeries.labels.template.wrap = true;
        pieSeries.labels.template.maxWidth = 100;
        //pieSeries.ticks.template.disabled = true;
        //pieSeries.alignLabels = false;
        //chart.legend = new am4charts.Legend();
        //chart.legend.useDefaultMarker = true;
        //chart.legend.valueLabels.template.disabled = true;
        //chart.legend.itemContainers.template.fontSize = 12;
        //chart.legend.itemContainers.template.properties.marginLeft = 4;
        //chart.legend.itemContainers.template.properties.marginTop = 4;
        //var markerTemplate = chart.legend.markers.template;
        //markerTemplate.width = 10;
        //markerTemplate.height = 10;
        //markerTemplate.stroke = am4core.color("#ccc");
        pieSeries.slices.template.events.on("hit", function (ev) {
            var sectorId = ev.target._dataItem._dataContext.SectorId;
            var SectorName = ev.target._dataItem._dataContext.Category;
            var modalInstance = $uibModal.open({
                templateUrl: 'skfFilterPieChartModal3.html',
                controller: 'skfFilterPieChartCtrl2',
                size: 'sm',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    params: function () {
                        return { "SectorId": sectorId, "SectorName": SectorName };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        });

    };

    $scope.FailureCauseStatistics = function () {

        var chart = am4core.create("chartdiv5", am4charts.PieChart3D);
        let title = chart.titles.create();
        title.text = "Top Failure Modes";
        title.fontSize = 15;
        title.fontWeight = 600;
        title.fill = "#2980b9";
        title.marginTop = 10;
        title.paddingTop = 10;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        // Add data
        chart.data = $scope.FailureCauseMetricsData;


        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "FailureCount";
        pieSeries.dataFields.category = "FailureCause";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 3;
        //pieSeries.alignLabels = false;
        // pieSeries.labels.template.hidden = true;
        // pieSeries.labels.template.disabled = true;
        //pieSeries._labels.template.wrap = true;
        //pieSeries._labels.template.height = 50;
        pieSeries.legendSettings.labelText = "{category}: {value}";
        pieSeries.labels.template.fontSize = 8;
        pieSeries.labels.template.fontWeight = 600;
        pieSeries.labels.template.tooltipPosition = "fixed";
        pieSeries.labels.template.wrap = true;
        pieSeries.labels.template.maxWidth = 100;
        //chart.legend = new am4charts.Legend();       
        //pieSeries.dataFields.value = "FailureCount";
        //pieSeries.dataFields.category = "FailureCause";
        //pieSeries.slices.template.tooltipHTML = '{FailureCause} ({FailureCount})';
        //pieSeries.labels.template.text = '';
        //pieSeries.legendSettings.labelText = '{FailureCause} ({FailureCount})';
        //pieSeries.slices.template.stroke = am4core.color("#fff");
        //pieSeries.slices.template.strokeWidth = 3;
        //pieSeries.ticks.template.disabled = true;
        //pieSeries.alignLabels = false;
        //var markerTemplate = chart.legend.markers.template;
        //markerTemplate.width = 10;
        //markerTemplate.height = 10;
        // markerTemplate.stroke = am4core.color("#ccc");
        //chart.legend = new am4charts.Legend();
        //chart.legend.useDefaultMarker = true;
        //chart.legend.valueLabels.template.disabled = true;
        //chart.legend.itemContainers.template.fontSize = 12;
        // chart.legend.itemContainers.template.properties.marginLeft = 4;
        //chart.legend.itemContainers.template.properties.marginTop = 4;
        //var markerTemplate = chart.legend.markers.template;
        //markerTemplate.width = 10;
        //markerTemplate.height = 10;
        //markerTemplate.stroke = am4core.color("#ccc");
        //pieSeries.slices.template.events.on("hit", function (ev) {
        //    var sectorId = ev.target._dataItem._dataContext.SectorId;
        //    var SectorName = ev.target._dataItem._dataContext.Category;
        //    var modalInstance = $uibModal.open({
        //        templateUrl: 'skfFilterPieChartModal3.html',
        //        controller: 'skfFilterPieChartCtrl2',
        //        size: 'sm',
        //        backdrop: 'static',
        //        keyboard: false,
        //        resolve: {
        //            params: function () {
        //                return { "SectorId": sectorId, "SectorName": SectorName };
        //            }
        //        }
        //    });
        //    modalInstance.result.then(function () {
        //    }, function () {
        //    });
        //});

        //pieSeries.events.on("datavalidated", function (ev) {
        //    ev.target.slices.each(function (slice) {
        //        // Create pattern
        //        var pattern = new am4core.Pattern();
        //        pattern.width = 500;
        //        pattern.height = 750;
        //        pattern.x = -250;
        //        pattern.y = -375;

        //        var image = new am4core.Image();
        //        image.href = slice.dataItem.dataContext.fill;
        //        image.width = 500;
        //        image.height = 750;
        //        pattern.addElement(image.element);

        //        slice.fill = pattern;
        //    });
        //});

    };

    $scope.EquipmentPriorityStatistics = function (data) {
        if (data[0].WorkPriority !== null) {
            var Hdata = JSON.parse(data[0].WorkPriority);
        }
        var chart = am4core.create("chartdiv6", am4charts.PieChart);
        if (!Hdata || Hdata.length === 0) {
            var label = chart.createChild(am4core.Label);
            label.text = "No Data Available";
            label.exportable = false;
            label.fill = "grey";
            label.fontSize = 15;
            label.align = "center";
            label.isMeasured = false;
            label.x = 140;
            label.y = 80;
        }
        let title = chart.titles.create();
        title.text = "Equipment Priority";
        title.fontSize = 15;
        title.fill = "#2980b9";
        title.marginBottom = 10;
        title.marginTop = 10;
        title.fontWeight = 600;
        // Add and configure Series
        var pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "PriorityCount";
        pieSeries.dataFields.category = "PriorityName";

        // for hiding lables
        pieSeries.alignLabels = false;
        pieSeries._labels.template.hidden = true;
        pieSeries._labels.template.disabled = true;
        //pieSeries._labels.template.wrap = true;
        //pieSeries._labels.template.height = 50;
        pieSeries.legendSettings.labelText = "{category}: {value}";
        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(40);
        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        pieSeries.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];

        pieSeries.tooltip.label.events.on("focus", function (event, target) {
            $scope.PriorityData = event.target.dataItem.dataContext;
        });

        pieSeries.tooltip.label.interactionsEnabled = true;
        pieSeries.tooltip.keepTargetHover = true;

        pieSeries.slices.template.tooltipHTML = '<b>{category}<div>Count:{value}</div></b><a style="cursor:pointer;" onclick="priority(1)">More info</a>';
        pieSeries.alignLabels = false;
        //pieSeries.labels.template.bent = true;
        //pieSeries.labels.template.radius = 3;
        //pieSeries.labels.template.padding(0, 0, 0, 0);

        pieSeries.ticks.template.disabled = true;

        // Create a base filter effect (as if it's not there) for the hover to return to
        var shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
        shadow.opacity = 0;

        // Create hover state
        var hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
        // Slightly shift the shadow and make it more prominent on hover
        var hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
        hoverShadow.opacity = 0.7;
        hoverShadow.blur = 5;

        // Add a legend
        chart.legend = new am4charts.Legend();
        chart.data = Hdata;
        chart.legend.useDefaultMarker = true;
        var markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        markerTemplate.stroke = am4core.color("#ccc");
        chart.legend.useDefaultMarker = true;
        chart.legend.valueLabels.template.disabled = true;
        chart.legend.itemContainers.template.properties.marginLeft = 4;
        chart.legend.itemContainers.template.properties.marginTop = 4;
        chart.legend.itemContainers.template.fontSize = 12;
    };

    $scope.EquipmentHistoryStatistics = function (data, type) {

        $scope.healthChart = false;
        var HTitle;
        if (data !== null) {
            if (type === 'EQ') {
                var Hdata = JSON.parse(data[0].EQConditionHistory);
                angular.forEach(Hdata, function (val, i) {
                    val.RCount = val.RConditionCode + 1;
                    val.RDate = $filter('date')(val.RConditionDate, "MMM d, yy");
                });
                HTitle = "Equipment Health History";
            }
            if (type === 'AS') {
                Hdata = [];
                Hdata = JSON.parse(data[0].ASConditionHistory);
                angular.forEach(Hdata, function (val, i) {
                    val.RCount = val.RConditionCode + 1;
                    val.RDate = $filter('date')(val.RConditionDate, "MMM d, y");
                });
                HTitle = "Asset Health History";
            }
        }
       // console.log(Hdata);
        // Create chart instance
        var chart = am4core.create("chartdiv7", am4charts.XYChart);
        if (!Hdata || Hdata.length === 0) {
            var label = chart.createChild(am4core.Label);
            label.text = "No Data Available";
            label.exportable = false;
            label.fill = "grey";
            label.fontSize = 15;
            label.align = "center";
            label.isMeasured = false;
            label.x = 140;
            label.y = 80;
        }
        //chart.scrollbarX = new am4core.Scrollbar();
        let title = chart.titles.create();
        title.text = HTitle;
        title.fontSize = 15;
        title.fill = "#2980b9";
        title.marginBottom = 10;
        title.marginTop = 10;
        title.fontWeight = 500;
        chart.data = Hdata;

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "RDate";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.inside = true;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.mouseEnabled = false;

        let labelTemplate = categoryAxis.renderer.labels.template;
        labelTemplate.rotation = -90;
        labelTemplate.horizontalCenter = "left";
        labelTemplate.verticalCenter = "middle";
        labelTemplate.dy = 3; // moves it a bit down;
        labelTemplate.inside = true; // this is done to avoid settings which are not suitable when label is rotated
        labelTemplate.fill = "#151414";
        labelTemplate.fontSize = 11;
        labelTemplate.fontWeight = 600;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        //valueAxis.renderer.minWidth = 50;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "RCount";
        series.dataFields.categoryX = "RDate";
        series.dataFields.Hcolor = "RConditionColor";
        series.dataFields.Status = "RConditionName";
        series.dataFields.ServiceType = "ServiceType";
        series.columns.template.strokeWidth = 0;
        series.columns.template.tooltipText = "{ServiceType}  ({Status})";
        series.columns.template.column.fillOpacity = 0.6;
        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.maxWidth = 60;
        series.columns.template.column.minHeight = 70;
        series.columns.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create("hover");
        //hoverState.properties.cornerRadiusTopLeft = 0;
        //hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function (fill, target) {
            return target.dataItem.Hcolor;
        });
    };
    $scope.loadData();

    var _columns1 = [
        {
            name: 'sno', displayName: '#', width: "2%", minWidth: 50, cellClass: getCellClass, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ObserverDBId', displayName: 'OB Id', cellClass: getCellClass, enableColumnResizing: true, width: "2%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'CL\')">{{row.entity.ObserverDBId}}</a></div>'
        },
        {
            name: 'ClientSiteName', displayName: 'Client', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'CL\')">{{row.entity.ClientSiteName}}</a></div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', cellClass: getCellClass, enableColumnResizing: true, width: "10%", minWidth: 75,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'PL\')">{{row.entity.PlantAreaName}}</a></div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', cellClass: getCellClass, enableColumnResizing: true, width: "28%", minWidth: 135,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'EQ\')">{{row.entity.EquipmentName}}</a></div>'
        },
        {
            name: 'UnitName', displayName: 'Asset Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 155,
            aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'AS\')">{{row.entity.UnitName}}</a></div>'
        },
        { name: 'ObserverNodeName', displayName: 'Observer Node Name', cellClass: getCellClass, enableColumnResizing: true, width: "15%", minWidth: 100 },
        { name: 'ObserverDBId', displayName: 'Observer DB ID', cellClass: getCellClass, enableColumnResizing: true, width: "5%", minWidth: 100 },
        {
            name: 'HealthStatus', displayName: 'Status', cellClass: getCellClass, enableColumnResizing: true, width: "8%", minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="status-dot" style="background:{{row.entity.HealthColor}}"></span> &nbsp;&nbsp;<span>{{row.entity.HealthStatus}}</span></div>'
        },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, cellClass: getCellClass,
            cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.SensorTracking(row.entity)"> <i class="fa fa-area-chart icon-space-before" tooltip-append-to-body="true" uib-tooltip="Trend" tooltip-class="customClass"></i></a>' +
                '</div>',
            width: "6%",
            minWidth: 40
        }
    ];

    $scope.columns1 = angular.copy(_columns1);

    $scope.gridOpts1 = {
        data: [],
        columnDefs: $scope.columns1,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'Equipment History.xlsx',
        exporterExcelSheetName: 'Equipment History.',
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

    $scope.SensorTracking = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfSensorTrackingModal.html',
            controller: 'skfSensorTrackingCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row, "ObserverDBId": $scope.ObserverDBId };
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.notificationEvent = function (row) {
        var modalInstance = $uibModal.open({
            templateUrl: 'observerMessage.html',
            controller: 'observerMessageCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "row": row };
                }
            }
        });
        modalInstance.result.then(function () {
        }, function () {
        });
    };


    $scope.loadReport = function (data) {
        $http.get("/ObserverDashboard/GetEMaintJobReport?cId=" + data)
            .then(function (response) {
                $scope.EMaintReportData = response.data;
            });
    };


    $scope.LoadLiveHealthStatisticsModal = function (a) {
       
        switch (a) {
            case 1:
                $scope.EquipmentLiveHealthStatisticsModal($scope.Series1Data, 'X', $scope.ChartMetrics[0].title1, $scope.ChartMetrics[0].value1color);
                break;
            case 2:
                $scope.EquipmentLiveHealthStatisticsModal($scope.Series2Data, 'N', $scope.ChartMetrics[0].title2, $scope.ChartMetrics[0].value2color);
                break;
            case 3:
                $scope.EquipmentLiveHealthStatisticsModal($scope.Series3Data, 'W', $scope.ChartMetrics[0].title3, $scope.ChartMetrics[0].value3color);
                break;
            case 4:
                $scope.EquipmentLiveHealthStatisticsModal($scope.Series4Data, 'A', $scope.ChartMetrics[0].title4, $scope.ChartMetrics[0].value4color);
                break;
        }
    };

    $scope.EquipmentLiveHealthStatisticsModal = function (d, t, s, c) {
        console.log(d);
        console.log(t);
        switch (t) {
            case 'X':
                var data = d.NoDataMetrics;
                break;
            case 'N':
                data = d.NormalMetrics;
                break;
            case 'W':
                data = d.WarningMetrics;
                break;
            case 'A':
                data = d.AlarmMetrics;
                break;
        }
        var modalInstance = $uibModal.open({
            templateUrl: 'skfEquipmentLiveModal.html',
            controller: 'skfEquipmentLiveHealthCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { "data": data, "title": s, "color": c };
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.S_dashboard.Type = data.Type;
            $scope.S_dashboard.PlantAreaId = data.PlantAreaId;
            $scope.S_dashboard.EquipmentId = data.EquipmentId;
            $scope.S_dashboard.AreaId = data.AreaId;
            $scope.S_dashboard.UnitId = data.UnitId;

            $scope.S_dashboard.UnitType = data.UnitType;
            $scope.loadData();
            if (data.Type === 'PL' || data.Type === 'CL' || data.Type === 'AR' || data.Type === 'EQ1805') {
                $scope.isPlantClientchart = true;
            } else if (data.Type === 'EQ' || data.Type === 'AS' || data.Type === 'AR') {
                $scope.isPlantClientchart = false;
            }
            if (data.Type === "PL") {
                $scope.loadReport($scope.S_dashboard.ClientSiteId);
            }
            $scope.loadData();
            $scope.loadEquipmentPriority();
        }, function () {
        });
    };

    $scope.SectorChart = function () {
        var chart = am4core.create("chartdiv8", am4charts.PieChart3D);
        let title = chart.titles.create();
        title.text = "Customers by Sector";
        title.fontSize = 15;
        title.fill = "#2980b9";
        title.marginTop = 10;
        title.paddingTop = 10;
        //title.marginBottom = 30;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data = $scope.SectorMetricsData;

        chart.legend = new am4charts.Legend();
        var series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "Count";
        series.dataFields.category = "Category";
        //for hiding lables
        series.alignLabels = false;
        series._labels.template.hidden = true;
        series._labels.template.disabled = true;
        series.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];
        // change the cursor on hover to make it apparent the object can be interacted with
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        markerTemplate.stroke = am4core.color("#ccc");
        chart.legend.useDefaultMarker = true;
        chart.legend.valueLabels.template.disabled = true;
        //chart.legend.itemContainers.template.properties.marginLeft = 0;
        //chart.legend.itemContainers.template.properties.marginRight = 0;
        chart.legend.itemContainers.template.properties.marginTop = 0;
        chart.legend.itemContainers.template.properties.paddingTop = 0;
        //chart.legend.itemContainers.template.properties.paddingLeft = 0;
        chart.legend.itemContainers.template.fontSize = 12;
        series.legendSettings.labelText = "{category}: {value}";
        //chart.legend.position = "top";
        //chart.legend.align = "left";
        //chart.legend.contentAlign = "right";
    };

    $scope.SegmentChart = function () {
        var chart = am4core.create("chartdiv9", am4charts.PieChart3D);
        let title = chart.titles.create();
        title.text = "Customers by Segment";
        title.fontSize = 15;
        title.fill = "#2980b9";
        title.marginTop = 10;
        title.paddingTop = 10;
        //title.marginBottom = 30;
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.data = $scope.SegmentMetricsData;
        //chart.contentAlign = "right";

        chart.legend = new am4charts.Legend();
        var series = chart.series.push(new am4charts.PieSeries3D());
        series.dataFields.value = "Count";
        series.dataFields.category = "Category";
        //for hiding lables
        series.alignLabels = false;
        series._labels.template.hidden = true;
        series._labels.template.disabled = true;
        series.slices.template
            // change the cursor on hover to make it apparent the object can be interacted with
            .cursorOverStyle = [
                {
                    "property": "cursor",
                    "value": "pointer"
                }
            ];

        series.legendSettings.labelText = "{category}: {value}";
        // change the cursor on hover to make it apparent the object can be interacted with
        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        var markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
        markerTemplate.stroke = am4core.color("#ccc");
        chart.legend.useDefaultMarker = true;
        chart.legend.valueLabels.template.disabled = true;
        //console.log(chart.legend.itemContainers);
        //chart.legend.itemContainers.template.properties.marginLeft = 0;
        //chart.legend.itemContainers.template.properties.marginRight = 0;
        chart.legend.itemContainers.template.properties.marginTop = 0;
        chart.legend.itemContainers.template.properties.paddingTop = 0;
        //chart.legend.itemContainers.template.properties.paddingLeft = 0;
        chart.legend.itemContainers.template.fontSize = 12;
        //chart.legend.position = "top";
        //chart.legend.align = "left";
        //chart.legend.contentAlign = "right";
    };

    $scope.LoadPriorityStatisticsModal = function (a) {
        if (a === 1) {
            var Title = $scope.PriorityData.PriorityName;
            var data = {
                "UserId": 0,
                "CountryId": $scope.S_dashboard.CountryId,
                "ClientSiteId": $scope.S_dashboard.ClientSiteId,
                "PlantAreaId": $scope.S_dashboard.PlantAreaId,
                "EquipmentId": $scope.S_dashboard.EquipmentId,
                "UnitType": $scope.S_dashboard.UnitType,
                "UnitId": $scope.S_dashboard.UnitId,
                "PriorityId": $scope.PriorityData.PriorityId
            };
            switch ($scope.S_dashboard.Type) {
                case 'EQ':
                    data.UnitType = null;
                    data.UnitId = null;
                    break;
                case 'EQ1805':
                    data.UnitType = null;
                    data.UnitId = null;
                    data.PlantAreaId = null;
                    break;
                case 'AR':
                    data.UnitType = null;
                    data.UnitId = null;
                    data.EquipmentId = null;
                    data.AreaId = null;
                    break;
                case 'PL':
                    data.UnitType = null;
                    data.UnitId = null;
                    data.EquipmentId = null;
                    break;
                case 'CL':
                    data.UnitType = null;
                    data.UnitId = null;
                    data.EquipmentId = null;
                    data.PlantAreaId = null;
                    //data.CountryId = null;
                    break;
            }
            var modalInstance = $uibModal.open({
                templateUrl: 'skfListPriorityModal.html',
                controller: 'skfListPriorityCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    params: function () {
                        return { "data": data, "title": Title };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        };
    };

    $scope.LoadHealthStatisticsModal = function (a) {
        if (a === 1) {
            var healthData = $scope.HealthData;
            var data = {
                "UserId": 0,
               // "Type": $scope.S_dashboard.Type,
                "CountryId": $scope.S_dashboard.CountryId,
                "ClientSiteId": $scope.S_dashboard.ClientSiteId,
                "PlantAreaId": $scope.S_dashboard.PlantAreaId,
                "ConditionId": $scope.HealthData.ConditionId
            };
            var modalInstance = $uibModal.open({
                templateUrl: 'skfListHealthModal.html',
                controller: 'skfListHealthCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    params: function () {
                        return { "data": data, "Type": $scope.S_dashboard.Type, "healthData": healthData };
                    }
                }
            });
            modalInstance.result.then(function () {
            }, function () {
            });
        }
    };
});


app.controller('skfSensorTrackingCtrl', function ($scope, alertFactory, $filter, $http, $uibModalInstance, params, $timeout) {
    $scope.SensorName = params.row.ObserverNodeName;
    $scope.ObserverDBId = params.ObserverDBId;
    $scope.loadObserverSensors = function () {
        $scope.SensorDDL = [];
        var _url = "/Lookup/GetLookupByName?lId=1&lName=Observer_URL_END_POINT";
        $http.get(_url)
            .then(function (response) {
                $scope.Observer_Sensor_URL = response.data[0].LValue;
                if (params.row.ObserverNodeId) {
                    $http({
                        method: "GET",
                        url: $scope.Observer_Sensor_URL + "InvokeObserver/GetTrendMultiple/" + params.row.ObserverDBId + "/" + params.row.ObserverNodeId
                    }).then(function (response) {
                        $scope.rangeData = response.data;
                        $scope.rangeValueDataX = [];
                        $scope.rangeData = $scope.rangeData.filter(function (items) {
                            delete items.Type;
                            return true;
                        });

                        $scope.rangeValueDataX = $filter('orderBy')($scope.rangeData, 'x'); // for sorting data in ascending order
                        $scope.resultArray = $scope.rangeValueDataX.map(function (val) {
                            return [val.x * 1000, val.y];
                        });
                        $scope.rangechart(params, $scope.resultArray);
                    });
                }

            });
    }();


    $scope.rangechart = function (params, data) {
        $scope.max = Math.max.apply(Math, $scope.rangeValueDataX.map(function (item) { return item.y; }));
        Highcharts.chart('container', {

            chart: {
                // type: 'spline',
                zoomType: 'x',
                panning: true,
                style: {
                    cursor: 'pointer'
                }

            },
            plotOptions: {
                line: {
                    zones: [{
                        value: params.row.WarningThreshold,
                        color: 'green'
                    }, {
                        value: params.row.AlarmThreshold,
                        color: 'yellow'
                    }, {
                        color: 'red'
                    }]
                }
            },
            title: {
                text: $scope.SensorName
            },
            rangeSelector: {
                enabled: true,
                buttons: [{
                    type: 'hour',
                    count: 10,
                    text: '10h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'day',
                    count: 5,
                    text: '5d'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                allButtonsEnabled: true
            },
            yAxis: {
                min: params.row.min,
                max: $scope.max + 2,
                tickInterval: 2,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: {
                    text: "Reading in " + "(" + params.row.EUName + ")"
                },
                opposite: false,
                alternateGridColor: null,

                plotLines: [{
                    value: params.row.AlarmThreshold,
                    color: 'red',
                    width: 2,
                    label: {
                        text: 'Alarm'
                    }
                }, {
                    value: params.row.WarningThreshold,
                    color: 'yellow',
                    width: 2,
                    label: {
                        text: 'Warning'
                    }
                },
                {
                    value: 0,
                    color: 'green',

                    width: 2,
                    label: {
                        text: 'Normal'
                    }
                }
                ]

                //plotBands: [{
                //    from: 0,
                //    to: params.row.entity.WarningThreshold,
                //    color: 'rgba(68, 170, 213, 0.1)',
                //    label: {
                //        text: 'Normal',
                //        style: {
                //            color: '#606060'
                //        }
                //    }
                //}, {
                //    from: params.row.entity.WarningThreshold,
                //    to: params.row.entity.AlarmThreshold,
                //    color: '#ffd700',
                //    label: {
                //        text: 'Warning',
                //        style: {
                //            color: '#fff',
                //            fontWeight: 'bold',
                //            fontSize: '15px'
                //        }
                //    }
                //}, {
                //    from: params.row.entity.AlarmThreshold,
                //    to: params.row.entity.max,
                //    color: '#FFA07A',
                //    label: {
                //        text: 'Alarm',
                //        style: {
                //            color: '#fff',
                //            fontWeight: 'bold',
                //            fontSize: '15px'
                //        }
                //    }
                //}]
            },

            xAxis: {
                title: {
                    text: ''
                },
                type: 'datetime'

            },
            series: [{
                cropThreshold: 1500,
                data: data,
                name: $scope.SensorName
            }],
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [
                            'printChart',
                            'downloadPNG',
                            'downloadJPEG',
                            'downloadPDF',
                            'downloadSVG',
                            'separator',
                            'downloadCSV',
                            'downloadXLS',
                        ]
                    }
                }
            }
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };


});

app.controller('observerMessageCtrl', function ($scope, $uibModalInstance, alertFactory, $http) {
    $scope.OCaptcha = null;
    $scope.feedback = {
        AnalystId: null,
        subject: null,
        message: null,

    };
    $http.get("Users/GetAssignToList?type=Analyst&lId=1&csId=1805")
        .then(function (response) {
            if (response.data && response.data.length > 0) {
                $scope.AnalystDDL = response.data;
            }
        });


    $scope.Captcha = function () {
        var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
        var i;
        var code = "";
        for (i = 0; i < 6; i++) {
            code = code + alpha[Math.floor(Math.random() * alpha.length)] + " ";
        }
        //    var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
        $scope.mainCaptcha = code;
    };
    $scope.Captcha();

    $scope.submit = function () {
        //console.log($scope.feedback);
        var bt = document.getElementById('btSubmit');
        if ($scope.feedback.subject !== null && $scope.feedback.AnalystId !== null && $scope.feedback.message !== null && $scope.OCaptcha !== null) {
            bt.disabled = false;
            var string1 = $scope.mainCaptcha.split(" ").join('');
            var string2 = $scope.OCaptcha.split(" ").join('');

            if (string1 === string2) {
                //alertFactory.setMessage({
                //    type: "warning",
                //    msg: "Email needs to be configured"
                //});
                var headerData = {
                    "ToMail": $scope.feedback.AnalystId,
                    "Subject": $scope.feedback.subject,
                    "Body": $scope.feedback.message
                };

                $scope.isProcess = true;
                var postUrl = "/EmailConfiguration/sendMail";
                $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
                    if (response.data) {
                        $scope.etimeout = 4000;
                        alertFactory.setMessage({
                            msg: "Mail Send Successfully."
                        });
                        $scope.feedback.AnalystId = null;
                        $scope.feedback.subject = null;
                        $scope.Feedback.message = null;
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

                $uibModalInstance.dismiss();
            }
            else {
                alertFactory.setMessage({
                    type: "warning",
                    msg: "Please enter the correct captcha"
                });
            }
        } else {
            bt.disabled = true;
            alertFactory.setMessage({
                type: "warning",
                msg: "Please fill mandatory fields"
            });
        }
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfEquipmentLiveHealthCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.title = params.title;
    $scope.titleColor = params.color;

    var _columns2 = [
        {
            name: 'sno', displayName: '#', width: "50", cellClass: 'lock-pinned', enableCellEdit: false, enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'PlantAreaName', displayName: 'Plant Area Name ', enableCellEdit: false, enableFiltering: true,
            minWidth: 240, cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'PL\')">{{row.entity.PlantAreaName}}</a></div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: true, minWidth: 270,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'EQ\')">{{row.entity.EquipmentName}}</a></div>'
        },
        {
            name: 'UnitName', displayName: 'Asset Name', enableColumnResizing: true, enableCellEdit: true, enableFiltering: true, minWidth: 120,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a ng-click="grid.appScope.ShowMappedDetail(row, \'AS\')">{{row.entity.UnitName}}</a></div>'
        },
        {
            name: 'UnitTypeName', displayName: 'Asset Type', enableColumnResizing: true, enableCellEdit: true, enableFiltering: true, minWidth: 120
        }

    ];

    $scope.columns2 = angular.copy(_columns2);

    $scope.gridOpts2 = {
        data: [],
        columnDefs: $scope.columns2,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'EMaintenance_AssetMapping.xlsx',
        exporterExcelSheetName: 'EMaintenance_AssetMapping',
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

    $scope.gridOpts2.data = params.data;

    $scope.ShowMappedDetail = function (a, b) {
        var data = a.entity;
        data.Type = b;
        $uibModalInstance.close(data);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfListPriorityCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.PriorityTitle = params.title;
    $scope.loadList = function () {
        var postUrl = "/ObserverDashboard/GetListEquipmentPriority";
        $http.post(postUrl, JSON.stringify(params.data)).then(function (response) {
            $scope.gridOpts3.data = JSON.parse(response.data[0].PriorityAssetList);
        });
    };

    var _columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ReportDate', displayName: 'Report Date', enableColumnResizing: true, minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a title="{{row.entity.ClientSite}}">{{row.entity.ReportDate}}</a></div>'
        },
        {
            name: 'PlantArea', displayName: 'Plant', enableColumnResizing: true, minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName">{{row.entity.PlantArea}}</div>'
        },
        {
            name: 'JobNumber', displayName: 'Job No', enableColumnResizing: true, minWidth: 30,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName">{{row.entity.JobNumber}}</div>'
        },
        {
            name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, minWidth: 90,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName">{{row.entity.JobName}}</div>'
        },
        {
            name: 'EquipmentName', displayName: 'Equipment', enableColumnResizing: true, minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName">{{row.entity.EquipmentName}}</div>'
        },
        {
            name: 'UnitName', displayName: 'Asset Name', enableColumnResizing: true, minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName">{{row.entity.UnitName}}</div>'
        },

        {
            name: 'Recommendation', displayName: 'Recommendation', enableColumnResizing: true, minWidth: 130, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Count: {{col.getAggregationValue() | number:0 }}</div>',
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a title="{{row.entity.Recommendation}}">{{row.entity.Recommendation}}</a></div>'
        },
        {
            name: 'Comment', displayName: 'Observation', enableColumnResizing: true, minWidth: 100,
            cellTemplate: '<div class="ui-grid-cell-contents grid-EquipmentName"><a title ="{{row.entity.Comment}}">{{row.entity.Recommendation}}</a></div>'
        }
    ];
    $scope.columns3 = angular.copy(_columns3);

    $scope.gridOpts3 = {
        data: [],
        columnDefs: $scope.columns3,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'Equipment Priority.xlsx',
        exporterExcelSheetName: 'Equipment Priority',
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

    $scope.loadList();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfFilterPieChartCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.HealthTitle = params.healthData.HealthStatus;
    $scope.HealthColor = params.healthData.HealthColor;
    $scope.loadList = function () {
        var postUrl = "/ObserverDashboard/GetAssetClassByAssetDetail";
        $http.post(postUrl, JSON.stringify(params.data)).then(function (response) {
            $scope.gridOpts3.data = JSON.parse(response.data[0].OAppDBAssetClassDetailsByAssetID);
        });
    };

    var _columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'SiteName', displayName: 'Client', enableColumnResizing: true, minWidth: 150
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', enableColumnResizing: true, minWidth: 150
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', enableColumnResizing: true, minWidth: 140
        },
        {
            name: 'IdentificationName', displayName: 'Asset Name', enableColumnResizing: true, minWidth: 130
        },

    ];
    $scope.columns3 = angular.copy(_columns3);

    $scope.gridOpts3 = {
        data: [],
        columnDefs: $scope.columns3,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'EquipmentHealth.xlsx',
        exporterExcelSheetName: 'EquipmentHealth',
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

    $scope.loadList();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfFilterPieChartCtrl1', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.SectorName = params.SectorName;
    $scope.loadList = function () {
        var postUrl = "/ObserverDashboard/GetSegmentByCustomerDetail";
        $http.post(postUrl, JSON.stringify({ Sectorid: params.SectorId })).then(function (response) {
            $scope.gridOpts3.data = response.data
        });
    };


    var _columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ClientSiteName', displayName: 'Client SiteName', enableColumnResizing: true, minWidth: 150
        }


    ];
    $scope.columns3 = angular.copy(_columns3);

    $scope.gridOpts3 = {
        data: [],
        columnDefs: $scope.columns3,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'FailureReason.xlsx',
        exporterExcelSheetName: 'FailureReason',
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

    $scope.loadList();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});

app.controller('skfFilterPieChartCtrl2', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.SectorName = params.SectorName;
    $scope.loadList = function () {
        var postUrl = "/ObserverDashboard/GetSegmentIDByFailureCauseDetail";
        $http.post(postUrl, JSON.stringify({ Sectorid: params.SectorId })).then(function (response) {
            $scope.gridOpts3.data = JSON.parse(response.data[0].OAppDBSegmentByFailureCausesDetail);
        });
    };


    var _columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'FailureCause', displayName: 'Failure Cause', enableColumnResizing: true, minWidth: 150
        },
        {
            name: 'TotalNo', displayName: 'Total No.', enableColumnResizing: true, minWidth: 150
        },

    ];
    $scope.columns3 = angular.copy(_columns3);

    $scope.gridOpts3 = {
        data: [],
        columnDefs: $scope.columns3,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'FailureCauses.xlsx',
        exporterExcelSheetName: 'FailureCauses',
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

    $scope.loadList();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});


app.controller('skfListHealthCtrl', function ($scope, $http, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.HealthTitle = params.healthData.HealthStatus;
    $scope.HealthColor = params.healthData.HealthColor;
    $scope.loadList = function () {
     //   console.log(params);
        if (params.Type ==="EQ1805")
        {
            params.data.PlantAreaId = null;
        }
        var postUrl = "/ObserverDashboard/GetListEquipmentHealth";
        $http.post(postUrl, JSON.stringify(params.data)).then(function (response) {
            $scope.gridOpts3.data = JSON.parse(response.data[0].EquipmentListByCondition);
        });
    };

    var _columns3 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'ClientSiteName', displayName: 'Client', enableColumnResizing: true, minWidth: 150
        },
        {
            name: 'PlantAreaName', displayName: 'Plant', enableColumnResizing: true, minWidth: 150
        },
        {
            name: 'JobNumber', displayName: 'Job No', enableColumnResizing: true, minWidth: 30,
            aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Count: {{col.getAggregationValue() | number:0 }}</div>',
        },
        {
            name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, minWidth: 140,
        },
        {
            name: 'ServiceType', displayName: 'ServiceType', enableColumnResizing: true, minWidth: 130,
        },
        {
            name: 'EquipmentName', displayName: 'Equipment Name', enableColumnResizing: true, minWidth: 150,
        }

    ];
    $scope.columns3 = angular.copy(_columns3);

    $scope.gridOpts3 = {
        data: [],
        columnDefs: $scope.columns3,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'EquipmentHealth.xlsx',
        exporterExcelSheetName: 'EquipmentHealth',
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

    $scope.loadList();

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});


app.controller('skfMultiTrendingCtrl', function ($scope, $http, $filter, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.SensorDDL = [];
    $scope.SensorDDL = params.row;
    $scope.multiData = [];
    $scope.AssetName = params.AssetName;
    $scope.TMax = [];
    $scope.loadTrendList = function () {
        var _url = "/Lookup/GetLookupByName?lId=1&lName=Observer_URL_END_POINT";
        $http.get(_url)
            .then(function (response) {
                $scope.Observer_Sensor_URL = response.data[0].LValue;
                for (i = 0; i < $scope.SensorDDL.length; i++) {
                    $http({
                        method: "GET",
                        //   url: $scope.Observer_Sensor_URL + "InvokeObserver/GetTrendMultiple/168/" + $scope.SensorDDL[i].ObserverNodeId
                        url: $scope.Observer_Sensor_URL + "InvokeObserver/GetTrendMultiple/" + $scope.SensorDDL[i].ObserverDBId + "/" + $scope.SensorDDL[i].ObserverNodeId
                    }).then(function (value) {
                        if (value) {
                            $scope.multiData.push(value.data);
                        }
                        if ($scope.multiData.length === $scope.SensorDDL.length) {
                            $scope.createChart($scope.multiData);
                        }
                    });
                }
            });
    }();

    $scope.createChart = function (data) {
        angular.forEach($scope.SensorDDL, function (val, i) {
            val.min = val.min;
            val.max = val.max;
            val.gridLineWidth = 0;
            val.minorGridLineWidth = 0;
            val.title = {
                text: val.ObserverNodeName + "(" + val.EUName + ")"
            };
            val.opposite = false;
            val.alternateGridColor = null;

        });

        for (i = 0; i < data.length; i++) {
            data[i] = data[i].filter(function (items) {
                delete items.Type;
                return true;
            });
        }
        for (i = 0; i < data.length; i++) {
            data[i] = $filter('orderBy')(data[i], 'x');
        }
        for (i = 0; i < data.length; i++) {
            data[i] = data[i].map(function (val) {
                return [val.x * 1000, val.y];
            });
        }


        angular.forEach(data, function (val, i) {
            val.yAxis = i;
            val.cropThreshold = 1500;
            val.name = "Object" + i;
            val.data = data[i];
            val.zoneAxis = 'y';
            val.zones = [
                {
                    value: $scope.SensorDDL[i].WarningThreshold,
                    color: 'green'
                },
                {
                    value: $scope.SensorDDL[i].AlarmThreshold,
                    color: 'yellow'
                },
                {
                    color: 'red'
                }];
        });

        for (i = 0; i < data.length; i++) {
            data[i].name = $scope.SensorDDL[i].ObserverNodeName;
        }
        $scope.SensorDDL.forEach((ele, ind) => {
            ele.title.text = '';
            ele['labels'] = {
                enabled: false
            };
        });
        Highcharts.chart({
            chart: {
                zoomType: 'x',
                panning: true,
                renderTo: 'Object', // corresponding container name
                style: {
                    cursor: 'pointer'
                },
            },

            title: {
                text: $scope.AssetName
            },
            xAxis: {
                type: 'datetime'
            },
            rangeSelector: {
                enabled: true,
                buttons: [{
                    type: 'hour',
                    count: 10,
                    text: '10h'
                }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                }, {
                    type: 'day',
                    count: 5,
                    text: '5d'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                allButtonsEnabled: true
            },
            yAxis: $scope.SensorDDL,
            legend: {
                layout: 'vertical',
                align: 'bottom',
                verticalAlign: 'middle'
            },

            series: data,
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                valueDecimals: 2,
                split: true
            }
        });

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});

app.controller('skfEMaintReportCtrl', function ($scope, $http, $filter, $uibModalInstance, params, uiGridConstants, alertFactory, $timeout) {
    $scope.PlantTitle = params.title;
    $scope.ClientSiteId = params.ClientSiteId;
    var _columns2 = [
        {
            name: 'sno', displayName: '#', width: "4%", minWidth: 50, enableFiltering: false, enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>'
        },
        {
            name: 'JobNumber', displayName: 'Job Number', enableColumnResizing: true, enableCellEdit: false, minWidth: 150, aggregationHideLabel: false, aggregationType: uiGridConstants.aggregationTypes.count,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Count: {{col.getAggregationValue() | number:0 }}</div>'
        },
        { name: 'JobName', displayName: 'Job Name', enableColumnResizing: true, enableCellEdit: false, minWidth: 170 },
        { name: 'DataCollectionDate', displayName: 'Data Collection Date', enableColumnResizing: true, enableCellEdit: false, minWidth: 165, cellFilter: 'date:\'dd/MM/yyyy\'' },
        { name: 'ReportDate', displayName: 'ReportDate', enableColumnResizing: true, enableCellEdit: false, minWidth: 165, cellFilter: 'date:\'dd/MM/yyyy\'' },
        {
            name: 'Action', enableFiltering: false, enableSorting: false, enableCellEdit: false,
            cellTemplate:
                '<div class="ui-grid-cell-contents">' +
                '<a ng-click="grid.appScope.downloadExcel(row.entity)"><i class="fa fa-file-excel-o icon-space-before" tooltip-append-to-body="true" uib-tooltip="Emaintenance Reports" tooltip-class="customClass"></i></a>' +
                '<a ng-click="grid.appScope.Report(row)" <i class="fa fa-print icon-space-before" tooltip-append-to-body="true" uib-tooltip="Summary Report" tooltip-class="customClass"></i></a>' +
                '</div>',
            minWidth: 50
        }
    ];
    $scope.columns2 = angular.copy(_columns2);

    $scope.gridOpts2 = {
        data: [],
        columnDefs: $scope.columns2,
        enableFiltering: true,
        enablePinning: true,
        enableColumnResizing: true,
        showColumnFooter: true,
        enableRowSelection: true,
        enableCellEdit: false,
        enableSorting: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.refresh();
            var col = $scope.columns;
            $scope.gridApi.grid.clearAllFilters = function () {
                $scope.gridOpts1.columnDefs = [];
                $timeout(function () {
                    $scope.gridOpts1.columnDefs = angular.copy(_columns);
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
        exporterExcelFilename: 'EMaintenance_AssetMapping.xlsx',
        exporterExcelSheetName: 'EMaintenance_AssetMapping',
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

    $scope.gridOpts2.data = params.data;

    $scope.downloadExcel = function (row) {
        var postUrl = "SummaryReport/GetSummaryReportToDownload?jId=" + row.JobId + "&lId=" + 1;
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

    $scope.Report = function (row) {

        var mapForm = document.createElement("form");
        mapForm.target = "Map";
        mapForm.method = "POST"; // or "post" if appropriate
        mapForm.action = "/report";
        mapForm.setAttribute("class", "report-append-view");

        var Language = document.createElement("input");
        Language.type = "text";
        Language.name = "LanguageId";
        Language.value = 1;
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
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };


});

function set(a) {
    angular.element(document.getElementById('mainController')).scope().LoadLiveHealthStatisticsModal(a);
}

function priority(a) {
    angular.element(document.getElementById('mainController')).scope().LoadPriorityStatisticsModal(a);
}

function health(a) {
    angular.element(document.getElementById('mainController')).scope().LoadHealthStatisticsModal(a);
}
app.controller('skfViewContentCtrl', function ($scope, $uibModalInstance, params, uiGridConstants) {
    $scope.PlantTitle = params.title;

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
});