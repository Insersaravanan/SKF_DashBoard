app.controller('skfCtrl', function ($scope, $filter, $timeout, $http) {
    $scope.loadPivot = function () {
        var derivers = $.pivotUtilities.derivers;

        var renderers = $.extend(
            $.pivotUtilities.renderers,
            $.pivotUtilities.c3_renderers,
            $.pivotUtilities.d3_renderers,
            $.pivotUtilities.export_renderers
        );

        var mps =
            [
                { "Reported Fault Codes": "Additive Breakdown", "Events": 5, "Events(%)": 6, "Consequence":3004, "Consequence(%)": 10.1},
                { "Reported Fault Codes": "Bearing Fault", "Events": 5, "Events(%)": 6, "Consequence": 1504, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Bearing Fault",  "Events": 5, "Events(%)": 2, "Consequence":2004, "Consequence(%)": 10.1},
                { "Reported Fault Codes": "Bearing Fault, Rolling Element Wear", "Events": 5, "Events(%)": 6, "Consequence": 3004, "Consequence(%)": 10.1 },            
                { "Reported Fault Codes": "Bent Shaft", "Events": 5, "Events(%)": 4, "Consequence": 4521, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Cavitation", "Events": 2, "Events(%)": 4, "Consequence": 1536, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Coupling Faults", "Events": 5, "Events(%)": 12, "Consequence": 1251, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Dirt Ingress", "Events": 3, "Events": 5, "Events(%)": 6, "Consequence": 1300, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Electrical Fault", "Events": 5, "Events(%)": 6, "Consequence": 1452, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Electrical Fault, Cable Defect", "Events": 7, "Events(%)": 6, "Consequence": 1985, "Consequence(%)": 10.1 },
                { "Reported Fault Codes": "Electrical Fault, Harmonic Distortion", "Events": 3, "Events(%)": 6, "Consequence": 3304, "Consequence(%)": 10.1 }];

        $("#output").pivotUI(mps, {
            renderers: renderers,
            aggregatorName: "Sum",
            vals: ["Events"],
            derivedAttributes: {
                "Events Bin": derivers.bin("Events", 10),
            },
            cols: [], rows: ["Reported Fault Codes","Events"],
            rendererName: "Table Barchart"
        });
    }
    $scope.loadPivot();
});
