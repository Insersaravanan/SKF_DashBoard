app.filter("trustAsHtml", function ($sce) {
    return function (html) {
        return $sce.trustAsHtml(html);
    };
});

app.controller("skfFooterController", function ($scope, $uibModal) {
    $scope.showContent = function (code) {
        var modalInstance = $uibModal.open({
            templateUrl: 'skfCMSModal.html',
            controller: 'skfCMSModalCtrl',
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                params: { 'code': code }
            }
        });
        modalInstance.result.then(function (data) {
        }, function () {
        });
    };

   
});

app.controller('skfCMSModalCtrl', function ($scope, $http, $uibModalInstance, params) {
    $scope.cmsContent = null;
    $http.get("/PageSetup/GetContentByTypeCode?typeCode=" + params.code).then(function (response) {
        if (response.data) {
            $scope.cmsContent = response.data;
        }
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

app.controller('skfFeedbackModalCtrl', function ($scope, $http, $timeout, $uibModalInstance, params, apiFactory, alertFactory) {

    $('.menu-modal.ng-scope').each(function () {
        try {
            $(this).scope().$dismiss();
        }
        catch (ex) { //log
        }
    });

    $scope.task = {};

    $scope.resetForm = function () {
        setTimeout(function () {
            var elements = document.getElementsByName("userForm")[0].querySelectorAll(".has-error");
            for (var i = 0; i < elements.length; i++) {
                elements[i].className = elements[i].className.replace(/\has-error\b/g, "");
            }
        }, 500);
    };

    $scope.clearModal = function () {
        $scope.task = {
            Id: null,
            Project: "",
            Priority: "",
            Tags: "",
            Type: "",
            Title: "",
            Description: "",
            Comment: "",
            ScreenShot: null,
            DeviceInfo: ""
        };
        $scope.resetForm();
        $scope.readOnlyPage = false;
    };

    $scope.loadSelectData = function (name) {
        var _url = "/Lookup/GetLookupByName?lId=0&lName=" + name;
        $http.get(_url)
            .then(function (response) {
                if (response.data) {
                    if (name === 'DevOps_WorkItemType') {
                        $scope.DevOps_WorkItemType = response.data;
                    }
                    else if (name === 'DevOps_Tags') {
                        $scope.DevOps_Tags = response.data;
                    }
                    else if (name === 'DevOps_Priority') {
                        $scope.DevOps_Priority = response.data;
                    }
                }
                //console.log(response.data);
            });
    };

    $scope.loadSelectData('DevOps_Priority');
    $scope.loadSelectData('DevOps_Tags');
    $scope.loadSelectData('DevOps_WorkItemType');


    $scope.captureScreenShot = function () {
        $(".feedback-modal-wrapper").hide();
        html2canvas(document.body).then(function (canvas) {
            $timeout(function () {
                $scope.task.ScreenShot = canvas.toDataURL('imge/jpeg');
            }, 1);
            $(".feedback-modal-wrapper").show();
        });
        $scope.uploadDocument(2209);
    };

    $scope.clearModal();

    $scope.loadWorkItem = function () {
        if ($scope.task.Id) {
            $http.get("/Feedback/GetWorkItem/" + $scope.task.Id).then(function (response) {
                if (response.data) {
                    var _d = response.data;
                    $scope.task.Project = _d.fields['System.TeamProject'];
                    $scope.task.Tags = _d.fields['System.Tags'];
                    $scope.task.Priority = _d.fields['Microsoft.VSTS.Common.Priority'] ? _d.fields['Microsoft.VSTS.Common.Priority'].toString() : "";
                    $scope.task.Type = _d.fields['System.WorkItemType'];
                    $scope.task.Title = _d.fields['System.Title'];
                    $scope.task.Description = _d.fields['System.WorkItemType'] == 'Bug' ? _d.fields['Microsoft.VSTS.TCM.ReproSteps'] : _d.fields['System.Description'];

                    console.log(response.data);

                    $scope.readOnlyPage = true;
                    $scope.loadComments();
                }
            });
        }
    };

    if (params.taskId) {
        $scope.task.Id = params.taskId;
        $scope.loadWorkItem();
    }

    $scope.save = function () {
        if ($scope.userForm.$valid && !($scope.isProcess) && !($scope.readOnlyPage)) {
            $scope.isProcess = true;
            var postUrl = "/Feedback/CreateWorkItem";
            try {
                $scope.task.DeviceInfo = getDeviceInfo();
            } catch (e) {
                //
            }

            $http.post(postUrl, JSON.stringify($scope.task)).then(function (response) {
                if (response.data && apiFactory.Validate(response.data)) {
                    $scope.task.Id = response.data.id;
                    $scope.task.ScreenShot = null;
                    $scope.task.Comment = null;
                    $scope.uploadDocument();
                    //console.log(response.data);
                    alertFactory.setMessage({
                        msg: "Task Created Successfully."
                    });
                    $scope.readOnlyPage = true;
                    $scope.loadWorkItem();
                    $scope.loadComments();
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

    $scope.update = function () {
        if (!($scope.isProcess)) {
            $scope.isProcess = true;
            var postUrl = "/Feedback/UpdateWorkItem";

            $http.post(postUrl, JSON.stringify($scope.task)).then(function (response) {
                if (response.data && apiFactory.Validate(response.data)) {
                    $scope.task.Id = response.data.id;
                    $scope.task.ScreenShot = null;
                    $scope.task.Comment = null;
                    $scope.uploadDocument();
                    //console.log(response.data);
                    alertFactory.setMessage({
                        msg: "Comment Updated Successfully."
                    });
                    $scope.readOnlyPage = true;
                    $scope.loadComments();
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

    $scope.uploadDocument = function () {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        var data = new FormData();
        if (files.length > 0 && $scope.task.Id) {
            alertFactory.setMessage({
                msg: "Please wait upload in progress..."
            });
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Feedback/UploadFilesAjax",
                contentType: false,
                processData: false,
                headers: { 'taskId': $scope.task.Id },
                data: data,
                success: function (message) {
                    alertFactory.setMessage({
                        msg: "Document uploaded successfully."
                    });
                    $('#files').val("");
                },
                error: function () {
                    alertFactory.setMessage({
                        msg: "Error upload document please upload attachment again."
                    });
                }
            });
        }
    };

    $scope.loadComments = function () {
        if ($scope.task.Id) {
            $http.get("/Feedback/GetWorkItemComments/" + $scope.task.Id).then(function (response) {
                if (response.data) {
                    $scope.commentsData = response.data;
                    //console.log($scope.commentsData);
                }
            });
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

$(document).ready(function () {
    $('.lazy-load').removeClass('lazy-load');
});

function getDeviceInfo() {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera 15+, the true version is after "OPR/" 
    if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
        (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
        fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
        fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return '<p>Device Info:</p>' +
        'Total width/height = ' + screen.width + '*' + screen.height + '<br>' +
        'Available width/height = ' + screen.availWidth + '*' + screen.availHeight + '<br>' +
        'Color depth = ' + screen.colorDepth + '<br>' +
        'Color resolution = ' + screen.pixelDepth + '<br>' +
        'Browser name  = ' + browserName + '<br>' +
        'Full version  = ' + fullVersion + '<br>' +
        'Major version = ' + majorVersion + '<br>' +
        'navigator.appName = ' + navigator.appName + '<br>' +
        'navigator.userAgent = ' + navigator.userAgent + '<br>';
}