app.requires.push('commonMethods', 'ngTouch', 'ui.grid', 'ui.grid.selection', 'angucomplete-alt', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning', 'ui.grid.exporter');

app.controller('skfCtrl', function ($scope, $filter, uiGridConstants, $http, $uibModal, $window, languageFactory, alertFactory, $timeout, clientFactory) {
    $scope.startIndex = 1;
    $scope.formatters = {};
    $scope.language = null;
    $scope.isDetail = false;
    $scope.isExpand = false;

    $scope.loadData = function () {
        var _url = "/AssetSensorMapping/GetAssetHierarchy?lId=" + $scope.language.LanguageId + "&cId=" + $scope.ClientSiteId;
        $http.get(_url)
            .then(function (response) {
                $scope.data = JSON.parse(response.data[0].ClientSite);
            });
    };

    $scope.expandTree = function () {
        if ($scope.isExpand) {
            $scope.isExpand = false;
            $scope.loadData();
        } else {
            $scope.isExpand = true;
            for (i = 0; i < $scope.data[0].PlantArea.length; i++) {
                $scope.data[0].PlantArea[i].Toggle = !$scope.data[0].PlantArea[i].Toggle;
                if ($scope.data[0].PlantArea[i].Equipments) {
                    for (j = 0; j < $scope.data[0].PlantArea[i].Equipments.length; j++) {
                        $scope.data[0].PlantArea[i].Equipments[j].Toggle = !$scope.data[0].PlantArea[i].Equipments[j].Toggle;
                        for (k = 0; k < $scope.data[0].PlantArea[i].Equipments[j].Units.length; k++) {
                            $scope.data[0].PlantArea[i].Equipments[j].Units[k].Toggle = !$scope.data[0].PlantArea[i].Equipments[j].Units[k].Toggle;
                            if ($scope.data[0].PlantArea[i].Equipments[j].Units[k].UnitType === 'DR' && $scope.data[0].PlantArea[i].Equipments[j].Units[k].DriveUnit) {
                                for (l = 0; l < $scope.data[0].PlantArea[i].Equipments[j].Units[k].DriveUnit.length; l++) {
                                    $scope.data[0].PlantArea[i].Equipments[j].Units[k].DriveUnit[l].Toggle = !$scope.data[0].PlantArea[i].Equipments[j].Units[k].DriveUnit[l].Toggle;
                                }
                            }
                            if ($scope.data[0].PlantArea[i].Equipments[j].Units[k].UnitType === 'IN' && $scope.data[0].PlantArea[i].Equipments[j].Units[k].IntermediateUnit) {
                                for (l = 0; l < $scope.data[0].PlantArea[i].Equipments[j].Units[k].IntermediateUnit.length; l++) {
                                    $scope.data[0].PlantArea[i].Equipments[j].Units[k].IntermediateUnit[l].Toggle = !$scope.data[0].PlantArea[i].Equipments[j].Units[k].IntermediateUnit[l].Toggle;
                                }
                            }
                            if ($scope.data[0].PlantArea[i].Equipments[j].Units[k].UnitType === 'DN' && $scope.data[0].PlantArea[i].Equipments[j].Units[k].DrivenUnit) {
                                for (l = 0; l < $scope.data[0].PlantArea[i].Equipments[j].Units[k].DrivenUnit.length; l++) {
                                    $scope.data[0].PlantArea[i].Equipments[j].Units[k].DrivenUnit[l].Toggle = !$scope.data[0].PlantArea[i].Equipments[j].Units[k].DrivenUnit[l].Toggle;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    $scope.selectClient = function () {
        var clientInfo = sessionStorage.getItem("clientInfo");
        clientFactory.setClient(clientInfo);
        if (clientInfo === null) {
            sessionStorage.setItem("isClientSite", "yes");
        } else if (clientInfo && (clientInfo !== 'undefined')) {
            var _client = JSON.parse(clientInfo);
            $scope.ClientSiteId = _client.ClientSiteId;
        }
    };

    $scope.ToggleFilter = function (item) {
        item.Toggle = !item.Toggle;
    };

    //Watch expressions to get Language value. 
    $scope.$watch(function () {
        return languageFactory.getLanguage();
    }, function (newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
            $scope.language = newValue;
            $scope.selectClient();
            $scope.loadData();
        }
    });

    $scope.drawCoordinates = function (x, y, _t) {
        $scope.ctx.beginPath();
        $scope.ctx.fillStyle = "blue";
        $scope.ctx.arc(x, y, $scope.pointSize, 0, Math.PI * 2, true);
        $scope.ctx.fill();
        $scope.PlotPopup(y, x, _t);
    };

    $scope.pointSize = 7;
    $scope.getPosition = function (event) {
        if ($scope.loadtable) {
            if ($scope.loadtable.length === $scope.mappedCount) {
                switch ($scope.tdetail.NodeType) {
                    case 'PL':
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "All the equipments are plotted for this plant."
                        });
                        return;

                    case 'EQ':
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "All the assets are plotted for this equipment."
                        });
                        return;
                    case 'AS':
                        alertFactory.setMessage({
                            type: "warning",
                            msg: "All the sensor points are plotted for this asset."
                        });
                        return;
                }
            }
        }
        else {
            alertFactory.setMessage({
                type: "warning",
                msg: "No units available for this" + " " + $scope.selectedUnitType
            });
            return;
        }
        $scope.canvas = document.getElementById("canvas");
        $scope.ctx = $scope.canvas.getContext("2d");
        var _curleft = _curtop = 0;
        _curleft += event.offsetX;
        _curtop += event.offsetY;
        $scope.drawCoordinates(_curleft, _curtop);
    };
    //$scope.imageSizeChange = function (_s) {
    //    var imageSrc = document
    //        .getElementById('canvas')
    //        .style
    //        .backgroundImage
    //        .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
    //        .split(',')[0];
    //    var image = new Image();
    //    image.src = imageSrc;
    //    var height = image.height;
    //    var width = image.width;
    //    if (height > 300) {
    //        for (let i = height; i > 300; i++) {
    //            i = i / 2;
    //            $scope.imgheight = Math.round(i);
    //            $scope.orginalheight = Math.round(i);

    //        }
    //    } else {
    //        $scope.imgheight = Math.round(height);
    //        $scope.orginalheight = Math.round(height);
    //    }

    //    if (width > 600) {
    //        for (let i = width; i > 600; i++) {
    //            i = i / 2;
    //            $scope.imgWidth = Math.round(i);
    //            $scope.orginalwidth = Math.round(i);
    //        }
    //    } else {
    //        $scope.imgWidth = Math.round(width);
    //        $scope.orginalwidth = Math.round(width);
    //    }

    //    switch (_s) {
    //        case 'SM':
    //            var h = $scope.orginalheight - 200;
    //            var w = $scope.orginalwidth - 200;
    //            if (h < 100 && w < 100) {
    //                h = $scope.orginalheight + 50;
    //                w = $scope.orginalwidth + 50;
    //            } else if (h < 100) {
    //                h = $scope.orginalheight + 50;
    //            } else if (w < 100) {
    //                w = $scope.orginalwidth + 50;
    //            }
    //            $scope.imgWidth = Math.round(w);
    //            $scope.imgheight = Math.round(h);
    //            console.log($scope.imgWidth);
    //            console.log($scope.imgheight);
    //            break;
    //        case 'MD':
    //            h = $scope.orginalheight - 100;
    //            w = $scope.orginalwidth - 100;
    //            if (h < 200 && w < 200) {
    //                h = $scope.orginalheight + 100;
    //                w = $scope.orginalwidth + 100;
    //            } else if (h < 100) {
    //                h = $scope.orginalheight + 75;
    //            } else if (w < 100) {
    //                w = $scope.orginalwidth + 75;
    //            }
    //            $scope.imgWidth = Math.round(w);
    //            $scope.imgheight = Math.round(h);
    //            console.log($scope.imgWidth);
    //            console.log($scope.imgheight);
    //            break;
    //        case 'LG':
    //            h = $scope.orginalheight + 100;
    //            w = $scope.orginalwidth + 100;
    //            if (h < 300 && w < 600) {
    //                h = $scope.orginalheight + 150;
    //                w = $scope.orginalwidth + 150;
    //            } else if (h < 300) {
    //                h = $scope.orginalheight + 100;
    //            } else if (w < 600) {
    //                w = $scope.orginalwidth + 100;
    //            }

    //            $scope.imgWidth = Math.round(w);
    //            $scope.imgheight = Math.round(h);
    //            console.log($scope.imgWidth);
    //            console.log($scope.imgheight);
    //            break;
    //        case 'LR':
    //            h = $scope.orginalheight + 200;
    //            w = $scope.orginalwidth + 200;
    //            if (h < 300 && w < 600) {
    //                h = $scope.orginalheight + 250;
    //                w = $scope.orginalwidth + 250;
    //            } else if (h < 300) {
    //                h = $scope.orginalheight + 200;
    //            } else if (w < 600) {
    //                w = $scope.orginalwidth + 200;
    //            }
    //            $scope.imgWidth = Math.round(w);
    //            $scope.imgheight = Math.round(h);
    //            console.log($scope.imgWidth);
    //            console.log($scope.imgheight);
    //            break;
    //        case 'AU':
    //            h = $scope.orginalheight;
    //            w = $scope.orginalwidth;
    //            $scope.imgWidth = Math.round(w);
    //            $scope.imgheight = Math.round(h);
    //            console.log($scope.imgWidth);
    //            console.log($scope.imgheight);
    //            break;
    //        case 'RE':
    //            $scope.imgWidth = width;
    //            $scope.imgheight = height;
    //            break;
    //    }

    //    $scope.myObj = {
    //        "background-size": Math.round($scope.imgWidth) + 'px ' + Math.round($scope.imgheight) + 'px'
    //    };
    //};

    $scope.loadImage = function () {
        //$scope.rangeValue = 500;
        //$scope.max = 1000;
        //$scope.min = 100;
        var imageSrc = document
            .getElementById('canvas')
            .style
            .backgroundImage
            .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
            .split(',')[0];
        //var image = new Image();
        //image.src = imageSrc;
        //var height = image.height;
        //var width = image.width;
        //if (height > 300) {
        //    for (let i = height; i > 300; i++) {
        //        i = i / 2;
        //        $scope.imgheight = Math.round(i);
        //        $scope.orginalheight = Math.round(i);
        //    }
        //} else {
        //    $scope.imgheight = Math.round(height);
        //    $scope.orginalheight = Math.round(height);
        //}

        //if (width > 600) {
        //    for (let i = width; i > 600; i++) {
        //        i = i / 2;
        //        $scope.imgWidth = Math.round(i);
        //        $scope.orginalwidth = Math.round(i);
        //    }
        //} else {
        //    $scope.imgWidth = Math.round(width);
        //    $scope.orginalwidth = Math.round(width);
        //}
        $scope.imgWidth = 598;
        $scope.imgheight = 292;
        $scope.myObj = {
            "background-size": Math.round($scope.imgWidth) + 'px ' + Math.round($scope.imgheight) + 'px'
        };
        $scope.size = 'AU';
    };

    $scope.arcMove = function () {
        var deegres = 0;
        var acrInterval = setInterval(function () {
            deegres += 1;
            c.clearRect(0, 0, can.width, can.height);
            procent = deegres / oneProcent;

            spanProcent.innerHTML = procent.toFixed();

            c.beginPath();
            c.arc(posX, posY, 70, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + 360));
            c.strokeStyle = '#b1b1b1';
            c.lineWidth = '10';
            c.stroke();

            c.beginPath();
            c.strokeStyle = '#3949AB';
            c.lineWidth = '10';
            c.arc(posX, posY, 70, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + deegres));
            c.stroke();
            if (deegres >= result) clearInterval(acrInterval);
        }, fps);

    }

    $scope.showmapped = function () {
        var can = document.getElementById('mapcount'),
            spanProcent = document.getElementById('procent'),
            c = can.getContext('2d');

        var posX = can.width / 2,
            posY = can.height / 2,
            fps = 1000 / 200,
            procent = 0,
            oneProcent = 360 / ($scope.mappedCount + $scope.unMappedCount),
            result = oneProcent * $scope.mappedCount;

        c.lineCap = 'round';
        var deegres = 0;
        var acrInterval = setInterval(function () {
            deegres += 1;
            c.clearRect(0, 0, can.width, can.height);
            procent = deegres / oneProcent;

            spanProcent.innerHTML = procent.toFixed();

            c.beginPath();
            c.arc(posX, posY, 70, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + 360));
            c.strokeStyle = '#f36f79';
            c.lineWidth = '10';
            c.stroke();

            c.beginPath();
            c.strokeStyle = '#3498db';
            c.lineWidth = '10';
            c.arc(posX, posY, 70, (Math.PI / 180) * 270, (Math.PI / 180) * (270 + deegres));
            c.stroke();
            if (deegres >= result) clearInterval(acrInterval);
        }, fps);
    };

    $scope.Showdata = function (t, d, j) {
        $scope.tdetail = t;
        $scope.dDetail = d;
        $scope.indexele = j;
        switch ($scope.tdetail.NodeType) {
            case 'PL':
                $scope.selectedPlotId = d;
                $scope.selectedUnitType = "Plant";
                $scope.latitude = t.Latitude;
                $scope.longitude = t.Longitude;
                break;
            case 'EQ':
                $scope.selectedPlotId = d;
                $scope.selectedUnitType = "Equipment";
                break;
            case 'AS':
                switch ($scope.tdetail.UnitType) {
                    case 'DR':
                        $scope.selectedPlotId = d;
                        $scope.selectedUnitType = "Drive Unit";
                        break;
                    case 'IN':
                        $scope.selectedPlotId = d;
                        $scope.selectedUnitType = "Intermediate Unit";
                        break;
                    case 'DN':
                        $scope.selectedPlotId = d;
                        $scope.selectedUnitType = "Driven Unit";
                        break;
                }
                break;
        }
        $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
    };
    $scope.ShowImage = function (t, d, i) {
        $scope.PhysicalPath = "";
        $scope.imgWidth = 0;
        $scope.imgheight = 0;
        $scope.loadtable = [];
        if (t.NodeType === 'AS') {
            $scope.displayName = t.IdentificationName;
        } else if (t.NodeType === 'EQ') {
            $scope.displayName = t.EquipmentName;
        } else {
            $scope.displayName = t.PlantAreaName;
        }

        $scope.isSelectedRow = null;
        $scope.isDetail = true;
        $scope.getImg = {
            "PlotType": t.NodeType,
            "PlantAreaId": t.PlantAreaId,
            "EquipmentId": t.EquipmentId,
            "UnitType": t.UnitType,
            "UnitId": d
        };
        var postUrl = "/ImagePlotting/LoadPlottingDetail/";
        $http.post(postUrl, JSON.stringify($scope.getImg)).then(function (response) {
            if (response.data) {
                $scope.ImagePlot = JSON.parse(response.data[0].Plotting);
                switch (t.NodeType) {
                    case 'PL':
                        $scope.loadtable = $scope.ImagePlot[0].PlottingPoints;
                        $scope.mappedCount = $scope.ImagePlot[0].MappedCount;
                        $scope.unMappedCount = $scope.ImagePlot[0].UnMappedCount;
                        $scope.showmapped();
                        break;
                    case 'EQ':
                        $scope.loadtable = $scope.ImagePlot[0].PlottingPoints;
                        $scope.mappedCount = $scope.ImagePlot[0].MappedCount;
                        $scope.unMappedCount = $scope.ImagePlot[0].UnMappedCount;
                        $scope.showmapped();
                        break;
                    case 'AS':
                        $scope.loadtable = $scope.ImagePlot[0].PlottingPoints;
                        $scope.mappedCount = $scope.ImagePlot[0].MappedCount;
                        $scope.unMappedCount = $scope.ImagePlot[0].UnMappedCount;
                        $scope.showmapped();
                        break;
                }
                if ($scope.ImagePlot[0].PhysicalPath === null) {
                    $scope.isNoimg = true;
                    $scope.PhysicalPath = $scope.ImagePlot[0].PhysicalPath;
                } else {
                    $scope.isNoimg = false;
                    $scope.plotAttachId = $scope.ImagePlot[0].PlottingAttachId;
                    $scope.PhysicalPath = $scope.ImagePlot[0].PhysicalPath;
                }

                if ($scope.ImagePlot[0].ImageWidth !== null && $scope.ImagePlot[0].ImageHeight !== null) {
                    $scope.imgWidth = $scope.ImagePlot[0].ImageWidth;
                    $scope.imgheight = $scope.ImagePlot[0].ImageHeight;
                } else {
                    $timeout(function () {
                        $scope.loadImage();
                    }, 200);
                }
            }
        });
    };


    $scope.PlotPopup = function (x, y) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfPlotModal.html',
            controller: 'skfPlotModalCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return {
                        'row': $scope.getImg, 'xPos': x, 'yPos': y, 'width': $scope.imgWidth, 'height': $scope.imgheight, 'data': $scope.loadtable, 'Name': $scope.displayName,
                        'UnitType': $scope.selectedUnitType
                    };
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
        }, function () {
            $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
        });
    };

    $scope.highlightPoint = function (i) {
        $scope.isSelectedRow = i;
        angular.forEach($scope.loadtable, function (val, j) {
            if (i === j) {
                $scope.loadtable[j].highlight = true;
            } else {
                $scope.loadtable[j].highlight = false;
            }
        });
    };

    $scope.removeAttachment = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfRemoveAttachmentModal.html',
            controller: 'skfRemoveAttachmentCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'Name': $scope.displayName, 'UnitType': $scope.selectedUnitType };
                }
            }
        });

        modalInstance.result.then(function (data) {
            if (data) {
                var headerdata = {
                    'AttachmentId': $scope.plotAttachId,
                    'PlottingId': 0
                };
                var _url = "/ImagePlotting/RemoveMapping";
                $http.post(_url, JSON.stringify(headerdata)).then(function (response) {
                    $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
                });
            }
        }, function () {
        });
    };

    $scope.removePoint = function (PId, node) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfRemovePointModal.html',
            controller: 'skfRemovePointCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'Name': $scope.displayName, 'NodeName': node, 'UnitType': $scope.selectedUnitType };
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                var headerdata = {
                    'AttachmentId': 0,
                    'PlottingId': PId
                };
                var _url = "/ImagePlotting/RemoveMapping";
                $http.post(_url, JSON.stringify(headerdata)).then(function (response) {
                    $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
                });
            }

        }, function () {
        });
    };

    $scope.viewImage = function (data, index) {
        $scope.imgIndex = index;
        $scope.FileName = data.name;
        $scope.attImage = data.source;
    };

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
    };

    $scope.uploadDocument = function () {
        switch ($scope.getImg.PlotType) {
            case 'PL':
                $scope.aid = $scope.getImg.PlantAreaId;
                break;
            case 'EQ':
                $scope.aid = $scope.getImg.EquipmentId;
                break;
            case 'AS':
                $scope.aid = $scope.getImg.UnitId;
                break;
        }

        $scope.Type = 'ImagePlot';
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if ($scope.aid) {
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/ImagePlotting/UploadFiles",
                contentType: false,
                processData: false,
                headers: {
                    'aId': $scope.aid, 'type': $scope.Type, 'plantAreaId': $scope.getImg.PlantAreaId, 'equipmentId': $scope.getImg.EquipmentId, 'unitType': $scope.getImg.UnitType, 'unitId': $scope.getImg.UnitId, 'plotType': $scope.getImg.PlotType,
                    'LatPos': $scope.latitude, 'LongPos': $scope.longitude
                },
                data: data,
                success: function (message) {
                    $timeout(function () {
                        alertFactory.setMessage({
                            msg: "Document uploaded successfully."
                        });
                        $scope.ShowImage($scope.tdetail, $scope.dDetail, $scope.indexele);
                    }, 50);
                    $('#files').val("");
                    var _files = $.map($('#files').prop("files"), function (val) { return val.name; });
                    $scope.fileLength = _files.length;
                    //  $timeout(function () {
                    //    $scope.loadImage();
                    //}, 200);
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
    $scope.savePlantGeo = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfPlantGeoLocModal.html',
            controller: 'skfPlantGeoLocCtrl',
            size: 'md',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: function () {
                    return { 'PlantAreaId': $scope.tdetail.PlantAreaId, 'PlantName': $scope.tdetail.PlantAreaName, 'latitude': $scope.latitude, 'longitude': $scope.longitude };
                }
            }
        });
        modalInstance.result.then(function (data) {
            $scope.latitude = data.LatPos;
            $scope.longitude = data.LongPos;
        }, function () {
        });
    };

});

app.controller('skfRemoveAttachmentCtrl', function ($scope, $uibModalInstance, params) {
    $scope.displayName = params.Name;
    $scope.unitType = params.UnitType;
    $scope.deleteImage = function () {
        $uibModalInstance.close('Success');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});

app.controller('skfRemovePointCtrl', function ($scope, $uibModalInstance, params) {
    $scope.NodeName = params.NodeName;
    $scope.displayName = params.Name;
    $scope.unitType = params.UnitType;
    $scope.deleteImage = function () {
        $uibModalInstance.close('Success');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

});

app.controller('skfPlotModalCtrl', function ($scope, $http, $uibModalInstance, params, alertFactory) {
    $scope.PlotType = params.row.PlotType;
    $scope.unitType = params.UnitType;
    var d = angular.copy(params.data);
    $scope.data = d.filter(o => o.IsMapped === 'N');
    $scope.displayName = params.Name;
    $scope.plot = {
        'EquipmentId': null,
        'AssetId': null,
        'UnitSensorId': null,
        'UnitType': null
    };

    $scope.onAssetchange = function (i) {
        $scope.Asset = i.UnitType;
        $scope.plot.AssetId = i.UnitId;
    };

    $scope.save = function () {
        switch ($scope.PlotType) {
            case 'PL':
                if (!$scope.plot.EquipmentId) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Please select the Equipment and save."
                    });
                    return;
                }
                break;
            case 'EQ':
                if (!$scope.plot.AssetId) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Please select the asset and save."
                    });
                    return;
                }
                break;
            case 'AS':
                if (!$scope.plot.UnitSensorId) {
                    alertFactory.setMessage({
                        type: "warning",
                        msg: "Please select the sensor and save."
                    });
                    return;
                }
                break;
        }

        var headerData = {
            "SensorPlotId": 0,
            "PlantAreaId": params.row.PlantAreaId,
            "EquipmentId": $scope.plot.EquipmentId ? $scope.plot.EquipmentId : params.row.EquipmentId,
            "UnitType": $scope.Asset ? $scope.Asset : params.row.UnitType,
            "UnitId": $scope.plot.AssetId ? $scope.plot.AssetId : params.row.UnitId,
            "UnitSensorId": $scope.plot.UnitSensorId | null,
            "PlotType": $scope.PlotType,
            "XPos": params.xPos,
            "yPos": params.yPos,
            "Active": 'Y',
            "UserId": 0,
            "ImageWidth": params.width,
            "ImageHeight": params.height
        };

        var postUrl = "/ImagePlotting/Create";
        $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
            if (response.data) {
                alertFactory.setMessage({
                    msg: "Image plotted Successfully."
                });
                $uibModalInstance.close();
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
        $uibModalInstance.close();
    };

});

app.controller('skfPlantGeoLocCtrl', function ($scope, $http, $uibModalInstance, params, alertFactory) {
    $scope.PlantName = params.PlantName;
    $scope.latitude = params.latitude;
    $scope.longitude = params.longitude;

    $scope.save = function () {
        var headerData = {
            "PlantAreaId": params.PlantAreaId,
            "LatPos": $scope.latitude,
            "LongPos": $scope.longitude
        };
        var postUrl = "/ImagePlotting/SavePlantGeoLocation";
        $http.post(postUrl, JSON.stringify(headerData)).then(function (response) {
            if (response.data) {
                alertFactory.setMessage({
                    msg: "Data saved Successfully."
                });
                $uibModalInstance.close(headerData);
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
        $uibModalInstance.dismiss();
    };

});

//app.controller('skfAttachmentCtrl', function ($scope, $uibModalInstance, params, $timeout, $http, alertFactory) {
//    $scope.iframe = false;
//    $scope.noAttachment = false;
//    $scope.previewImg = true;
//    $scope.uploadFile = true;
//    $scope.languageId = params.language.LanguageId;

//    $scope.displayName = params.Name;
//    $scope.rowData = params.row;

//    $scope.attach = function () {
//        $scope.attachments = $scope.rowData.attachment;
//    };

//    $scope.saveDoc = function () {
//        $scope.uploadDocument();
//    };

//    $scope.getAttachment = function () {
//        var _url = "/Equipment/GetEquipmentByStatus?rid=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
//        $http.get(_url)
//            .then(function (response) {
//                $scope.attachment = response.data;

//                if ($scope.attachment.length <= 0) {
//                    $scope.noAttachment = true;
//                }
//                $scope.attImage = "";
//                $scope.previewImg = true;
//                $scope.FileName = "";
//            });
//    };
//    $scope.getAttachment();

//    //$scope.removeAttachment = function (AttachmentId, Type) {
//    //    var _url = "/equipment/DeleteAttachmentById?Type=" + Type + "&AttachmentId=" + AttachmentId;
//    //    $http.post(_url)
//    //        .then(function (response) {
//    //            $timeout(function () {
//    //                $scope.getAttachment();
//    //                $scope.attImage = "";
//    //                $scope.FileName = "";
//    //                $scope.previewImg = true;
//    //            }, 50);
//    //        });
//    //}

//    $scope.readURL = function (input) {
//        $scope.thumb = [];
//        for (var i = 0; i < input.files.length; i++) {
//            if (input.files && input.files[i]) {
//                var reader = new FileReader();
//                reader.onload = function (e) {
//                    $scope.thumb.push(e.target.result);
//                }
//                reader.readAsDataURL(input.files[i]);
//            }
//        }
//    }

//    // Validate the uploaded files
//    $scope.validFormat = false;
//    $scope.uploadImageStart = function () {
//        $scope.validFormat = false;
//        var fileUpload = $("#files").get(0);
//        var files = fileUpload.files;
//        var _files = $.map($('#files').prop("files"), function (val) { return val.name; });
//        angular.forEach(_files, function (filename, i) {
//            var filext = filename.substring(filename.lastIndexOf(".") + 1);
//            filext = filext.toLowerCase();
//        });
//        if (fileUpload) {
//            $timeout(function () {
//                $scope.readURL(fileUpload);
//                $scope.validFormat = true;
//                $scope.uploadDocument();
//            }, 10);

//        } else {
//            $timeout(function () {
//                alertFactory.setMessage({
//                    type: "warning",
//                    msg: "Upload valid Image Format (png,jpg,jpeg and svg)"
//                });
//                $scope.validFormat = false;
//                $('#files').val("");
//            }, 10);
//        }
//    }

//    $scope.showAttach = function (data, index) {
//        $scope.docindex = index;
//        var _url = "/Equipment/GetEquipmentByStatus?rid=" + $scope.aid + "&type=" + $scope.Type + "&at=Attachment&status=Y";
//        $http.get(_url)
//            .then(function (response) {
//                $scope.attach = response.data;
//                angular.forEach($scope.attach, function (val, i) {
//                    if (val.EquipmentAttachId) {
//                        $scope.attachId = val.EquipmentAttachId;
//                    }
//                    if (val.DriveAttachId) {
//                        $scope.attachId = val.DriveAttachId;
//                    }
//                    if (val.IntermediateAttachId) {
//                        $scope.attachId = val.IntermediateAttachId;
//                    }
//                    if (val.DrivenAttachId) {
//                        $scope.attachId = val.DrivenAttachId;
//                    }
//                    if (data == $scope.attachId) {
//                        $scope.FileName = val.FileName;
//                        $scope.attImage = val.PhysicalPath;
//                        $scope.previewImg = false;
//                    }

//                });
//            });
//    }

//    $scope.cancel = function () {
//        $uibModalInstance.close('cancel');
//    };
//});



