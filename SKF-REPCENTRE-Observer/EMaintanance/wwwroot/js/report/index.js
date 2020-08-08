app.requires.push('ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.pinning');

app.controller('skfCtrl', function ($scope, $filter, $timeout, $http, uiGridConstants, clientFactory, locationFactory) {
    $scope.loadHighchartScatter = function () {
        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },
            title: {
                text: 'View Analysis of Plant Wide Faults'
            },
            subtitle: {
                text: 'Source: SKF E-Maintanance DB'
            },
            xAxis: {
                title: {
                    enabled: true,
                    text: 'Event'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: 'Consequence'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x}, ${point.y}'
                    }
                }
            },
            series: [{
                name: 'Unbalance',
                color: 'rgba(223, 83, 83, .5)',
                data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]

            }, {
                name: 'Bearing Fault',
                color: 'rgba(119, 152, 191, .5)',
                data: [[174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
                [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
                [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
                [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
                [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
                [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
                [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
                [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
                [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
                [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
                [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
                [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
                [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
                [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
                [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
                [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
                [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
                [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
                [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
                [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
                [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
                [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
                [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
                [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
                [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
                [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
                [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
                [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
                [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
                [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
                [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
                [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                [180.3, 83.2], [180.3, 83.2]]
            },
            {
                name: 'Missalignment',
                color: 'rgba(119, 152, 191, .5)',
                data: [
                    [134.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                    [180.1, 93.0], [115.5, 80.9], [185.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                    [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                    [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [292.0, 102.3],
                    [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                    [184.9, 86.4], [177.3, 73.2], [161.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                    [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                    [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [154.0, 88.6], [175.3, 83.1],
                    [185.4, 66.8], [177.8, 45.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0]]
            }]
        });
    }

    $scope.chartWithTimeLine = function () {
        /**
 * This is an advanced demo of setting up Highcharts with the flags feature borrowed from Highstock.
 * It also shows custom graphics drawn in the chart area on chart load.
 */

        /**
         * Fires on chart load, called from the chart.events.load option.
         */
        function onChartLoad() {

            var centerX = 140,
                centerY = 110,
                path = [],
                angle,
                radius,
                badgeColor = Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.2).get(),
                spike,
                empImage,
                big5,
                label,
                left,
                right,
                years,
                renderer;

            if (this.chartWidth < 530) {
                return;
            }

            // Draw the spiked disc
            for (angle = 0; angle < 2 * Math.PI; angle += Math.PI / 24) {
                radius = spike ? 80 : 70;
                path.push(
                    'L',
                    centerX + radius * Math.cos(angle),
                    centerY + radius * Math.sin(angle)
                );
                spike = !spike;
            }
            path[0] = 'M';
            path.push('z');
            this.renderer.path(path)
                .attr({
                    fill: badgeColor,
                    zIndex: 6
                })
                .add();

            // Employee image overlay
            empImage = this.renderer.path(path)
                .attr({
                    zIndex: 7,
                    opacity: 0,
                    stroke: badgeColor,
                    'stroke-width': 1
                })
                .add();

            // Big 5
            big5 = this.renderer.text('SKF')
                .attr({
                    zIndex: 6
                })
                .css({
                    color: 'white',
                    fontSize: '50px',
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontFamily: '\'Courier New\', sans-serif'
                })
                .add();
            big5.attr({
                x: centerX - big5.getBBox().width / 2,
                y: centerY + 14
            });

            // Draw the label
            label = this.renderer.text('E-Maintanance')
                .attr({
                    zIndex: 6
                })
                .css({
                    color: '#FFFFFF'
                })
                .add();

            left = centerX - label.getBBox().width / 2;
            right = centerX + label.getBBox().width / 2;

            label.attr({
                x: left,
                y: centerY + 44
            });

            // The band
            left = centerX - 90;
            right = centerX + 90;
            this.renderer
                .path([
                    'M', left, centerY + 30,
                    'L', right, centerY + 30,
                    right, centerY + 50,
                    left, centerY + 50,
                    'z',
                    'M', left, centerY + 40,
                    'L', left - 20, centerY + 40,
                    left - 10, centerY + 50,
                    left - 20, centerY + 60,
                    left + 10, centerY + 60,
                    left, centerY + 50,
                    left + 10, centerY + 60,
                    left + 10, centerY + 50,
                    left, centerY + 50,
                    'z',
                    'M', right, centerY + 40,
                    'L', right + 20, centerY + 40,
                    right + 10, centerY + 50,
                    right + 20, centerY + 60,
                    right - 10, centerY + 60,
                    right, centerY + 50,
                    right - 10, centerY + 60,
                    right - 10, centerY + 50,
                    right, centerY + 50,
                    'z'
                ])
                .attr({
                    fill: badgeColor,
                    stroke: '#FFFFFF',
                    'stroke-width': 1,
                    zIndex: 5
                })
                .add();

            // 2009-2014
            years = this.renderer.text('2009-2014')
                .attr({
                    zIndex: 6
                })
                .css({
                    color: '#FFFFFF',
                    fontStyle: 'italic',
                    fontSize: '10px'
                })
                .add();
            years.attr({
                x: centerX - years.getBBox().width / 2,
                y: centerY + 62
            });


            // Prepare mouseover
            renderer = this.renderer;
            if (renderer.defs) { // is SVG
                $.each(this.get('employees').points, function () {
                    var point = this,
                        pattern;
                    if (point.image) {
                        pattern = renderer.createElement('pattern').attr({
                            id: 'pattern-' + point.image,
                            patternUnits: 'userSpaceOnUse',
                            width: 400,
                            height: 400
                        }).add(renderer.defs);
                        renderer.image(
                            'https://www.highcharts.com/images/employees2014/' + point.image + '.jpg',
                            centerX - 80,
                            centerY - 80,
                            160,
                            213
                        ).add(pattern);

                        Highcharts.addEvent(point, 'mouseOver', function () {
                            empImage
                                .attr({
                                    fill: 'url(#pattern-' + point.image + ')'
                                })
                                .animate({ opacity: 1 }, { duration: 500 });
                        });
                        Highcharts.addEvent(point, 'mouseOut', function () {
                            empImage.animate({ opacity: 0 }, { duration: 500 });
                        });
                    }
                });
            }
        }


        var options = {

            chart: {
                events: {
                    load: onChartLoad
                },
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },

            xAxis: {
                type: 'datetime',
                minTickInterval: 365 * 24 * 36e5,
                labels: {
                    align: 'left'
                },
                plotBands: [{
                    from: Date.UTC(2009, 10, 27),
                    to: Date.UTC(2010, 11, 1),
                    color: '#EFFFFF',
                    label: {
                        text: '<em>Machine:</em><br> M121 Installed',
                        style: {
                            color: '#999999'
                        },
                        y: 180
                    }
                }, {
                    from: Date.UTC(2010, 11, 1),
                    to: Date.UTC(2013, 9, 1),
                    color: '#FFFFEF',
                    label: {
                        text: '<em>Machine:</em><br> M221 Installed',
                        style: {
                            color: '#999999'
                        },
                        y: 30
                    }
                }, {
                    from: Date.UTC(2013, 9, 1),
                    to: Date.UTC(2014, 10, 27),
                    color: '#FFEFFF',
                    label: {
                        text: '<em>Machine:</em><br> M321 Installed',
                        style: {
                            color: '#999999'
                        },
                        y: 30
                    }
                }]

            },

            title: {
                text: 'Plant value/savings timeline'
            },

            tooltip: {
                style: {
                    width: '250px'
                }
            },

            yAxis: [{
                max: 100,
                labels: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                gridLineColor: 'rgba(0, 0, 0, 0.07)'
            }, {
                allowDecimals: false,
                max: 15,
                labels: {
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                title: {
                    text: 'Revenu/Savings',
                    style: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                opposite: true,
                gridLineWidth: 0
            }],

            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2
                    },
                    fillOpacity: 0.5
                },
                flags: {
                    tooltip: {
                        xDateFormat: '%B %e, %Y'
                    }
                }
            },

            series: [{
                type: 'spline',
                id: 'google-trends',
                dashStyle: 'dash',
                name: 'Risk avoidance',
                data: [{ x: 1258322400000, /* November 2009 */ y: 0 }, { x: 1260961200000, y: 5 }, { x: 1263639600000, y: 7 }, { x: 1266188400000, y: 5 }, { x: 1268740800000, y: 6 }, { x: 1271368800000, y: 8 }, { x: 1274004000000, y: 11 }, { x: 1276639200000, y: 9 }, { x: 1279274400000, y: 12 }, { x: 1281952800000, y: 13 }, { x: 1284588000000, y: 17 }, { x: 1287223200000, y: 17 }, { x: 1289858400000, y: 18 }, { x: 1292497200000, y: 20 }, { x: 1295175600000, y: 20 }, { x: 1297724400000, y: 27 }, { x: 1300276800000, y: 32 }, { x: 1302904800000, y: 29 }, { x: 1305540000000, y: 34 }, { x: 1308175200000, y: 34 }, { x: 1310810400000, y: 36 }, { x: 1313488800000, y: 43 }, { x: 1316124000000, y: 44 }, { x: 1318759200000, y: 42 }, { x: 1321394400000, y: 47 }, { x: 1324033200000, y: 46 }, { x: 1326711600000, y: 50 }, { x: 1329303600000, y: 57 }, { x: 1331899200000, y: 54 }, { x: 1334527200000, y: 59 }, { x: 1337162400000, y: 62 }, { x: 1339797600000, y: 66 }, { x: 1342432800000, y: 61 }, { x: 1345111200000, y: 68 }, { x: 1347746400000, y: 67 }, { x: 1350381600000, y: 73 }, { x: 1353016800000, y: 63 }, { x: 1355655600000, y: 54 }, { x: 1358334000000, y: 67 }, { x: 1360882800000, y: 74 }, { x: 1363435200000, y: 81 }, { x: 1366063200000, y: 89 }, { x: 1368698400000, y: 83 }, { x: 1371333600000, y: 88 }, { x: 1373968800000, y: 86 }, { x: 1376647200000, y: 81 }, { x: 1379282400000, y: 83 }, { x: 1381917600000, y: 95 }, { x: 1384552800000, y: 86 }, { x: 1387191600000, y: 83 }, { x: 1389870000000, y: 89 }, { x: 1392418800000, y: 90 }, { x: 1394971200000, y: 94 }, { x: 1397599200000, y: 100 }, { x: 1400234400000, y: 100 }, { x: 1402869600000, y: 99 }, { x: 1405504800000, y: 99 }, { x: 1408183200000, y: 93 }, { x: 1410818400000, y: 97 }, { x: 1413453600000, y: 98 }],
                tooltip: {
                    xDateFormat: '%B %Y',
                    valueSuffix: ' % of best month'
                }
            }, {
                name: 'Revenue',
                id: 'revenue',
                type: 'area',
                data: [[1257033600000, 2], [1259625600000, 3], [1262304000000, 2], [1264982400000, 3], [1267401600000, 4], [1270080000000, 4], [1272672000000, 4], [1275350400000, 4], [1277942400000, 5], [1280620800000, 7], [1283299200000, 6], [1285891200000, 9], [1288569600000, 10], [1291161600000, 8], [1293840000000, 10], [1296518400000, 13], [1298937600000, 15], [1301616000000, 14], [1304208000000, 15], [1306886400000, 16], [1309478400000, 22], [1312156800000, 19], [1314835200000, 20], [1317427200000, 32], [1320105600000, 34], [1322697600000, 36], [1325376000000, 34], [1328054400000, 40], [1330560000000, 37], [1333238400000, 35], [1335830400000, 40], [1338508800000, 38], [1341100800000, 39], [1343779200000, 43], [1346457600000, 49], [1349049600000, 43], [1351728000000, 54], [1354320000000, 44], [1356998400000, 43], [1359676800000, 43], [1362096000000, 52], [1364774400000, 52], [1367366400000, 56], [1370044800000, 62], [1372636800000, 66], [1375315200000, 62], [1377993600000, 63], [1380585600000, 60], [1383264000000, 60], [1385856000000, 58], [1388534400000, 65], [1391212800000, 52], [1393632000000, 72], [1396310400000, 57], [1398902400000, 70], [1401580800000, 63], [1404172800000, 65], [1406851200000, 65], [1409529600000, 89], [1412121600000, 100]],
                tooltip: {
                    xDateFormat: '%B %Y',
                    valueSuffix: ' % of best month'
                }

            }, {
                yAxis: 1,
                name: 'Total Savings',
                id: 'employees',
                type: 'area',
                step: 'left',
                tooltip: {
                    headerFormat: '<span style="font-size: 11px;color:#666">{point.x:%B %e, %Y}</span><br>',
                    pointFormat: '{point.name}<br><b>{point.y}</b>',
                    valueSuffix: ' Machine'
                },
                data: [
                    { x: Date.UTC(2009, 10, 1), y: 1, name: 'First Service visit', image: 'Torstein' },
                    { x: Date.UTC(2010, 10, 20), y: 2, name: 'Grethe service visit', image: 'Grethe' },
                    { x: Date.UTC(2011, 3, 1), y: 3, name: 'Erik service visit', image: null },
                    { x: Date.UTC(2011, 7, 1), y: 4, name: 'Gert service visit', image: 'Gert' },
                    { x: Date.UTC(2011, 7, 15), y: 5, name: 'Hilde service visit', image: 'Hilde' },
                    { x: Date.UTC(2012, 5, 1), y: 6, name: 'Guro service visit', image: 'Guro' },
                    { x: Date.UTC(2012, 8, 1), y: 5, name: 'Erik service visit', image: null },
                    { x: Date.UTC(2012, 8, 15), y: 6, name: 'Anne service visit', image: 'AnneJorunn' },
                    { x: Date.UTC(2013, 0, 1), y: 7, name: 'Hilde service visit', image: null },
                    { x: Date.UTC(2013, 7, 1), y: 8, name: 'Jon service visit', image: 'JonArild' },
                    { x: Date.UTC(2013, 7, 20), y: 9, name: 'Øystein service visit', image: 'Oystein' },
                    { x: Date.UTC(2013, 9, 1), y: 10, name: 'Stephane servicevisit', image: 'Stephane' },
                    { x: Date.UTC(2014, 9, 1), y: 11, name: 'Anita service visit', image: 'Anita' },
                    { x: Date.UTC(2014, 10, 27), y: 11, name: ' ', image: null }
                ]

            }]
        };

        // Add flags for important milestones. This requires Highstock.
        if (Highcharts.seriesTypes.flags) {
            options.series.push({
                type: 'flags',
                name: 'Cloud',
                color: '#333333',
                shape: 'squarepin',
                y: -80,
                data: [
                    { x: Date.UTC(2014, 4, 1), text: 'Oli service', title: 'Oil Service', shape: 'squarepin' }
                ],
                showInLegend: false
            }, {
                    type: 'flags',
                    name: 'Highmaps',
                    color: '#333333',
                    shape: 'squarepin',
                    y: -55,
                    data: [
                        { x: Date.UTC(2014, 5, 13), text: 'Vibration Test', title: 'Vibration Test' }
                    ],
                    showInLegend: false
                }, {
                    type: 'flags',
                    name: 'Highcharts',
                    color: '#333333',
                    shape: 'circlepin',
                    data: [
                        { x: Date.UTC(2009, 10, 27), text: 'New setup', title: '1.0' },
                        { x: Date.UTC(2010, 6, 13), text: 'Scheduled maintanance visit', title: '2.0' },
                        { x: Date.UTC(2010, 10, 23), text: 'Scheduled maintanance visit', title: '2.1' },
                        { x: Date.UTC(2011, 9, 18), text: 'Scheduled maintanance visit', title: 'Stock', shape: 'squarepin' },
                        { x: Date.UTC(2012, 7, 24), text: 'Scheduled maintanance visit', title: '2.3' },
                        { x: Date.UTC(2013, 2, 22), text: 'Scheduled maintanance visit', title: '3.0' },
                        { x: Date.UTC(2014, 3, 22), text: 'Scheduled maintanance visit', title: '4.0' }
                    ],
                    showInLegend: false
                }, {
                    type: 'flags',
                    name: 'Events',
                    color: '#333333',
                    fillColor: 'rgba(255,255,255,0.8)',
                    data: [
                        { x: Date.UTC(2012, 10, 1), text: 'Scheduled maintanance visit', title: 'Fault found' },
                        { x: Date.UTC(2012, 11, 25), text: 'Scheduled maintanance visit.', title: 'Replacement test' },
                        { x: Date.UTC(2013, 4, 25), text: 'Scheduled maintanance visit', title: 'Fault found' },
                        { x: Date.UTC(2014, 4, 25), text: 'Scheduled maintanance visit', title: 'Fault found' }
                    ],
                    onSeries: 'revenue',
                    showInLegend: false
                });
        }

        $('#container').highcharts(options);
    }

    $scope.loadDonutChart = function (data) {
        var _cd = data.chart[0];

        $scope.pageData = data.data;

        angular.forEach($scope.pageData, function (val, i) {
            val.sno = i + 1;
        });

        $timeout(function () {
            $scope.gridOpts.data = $scope.pageData;
            $(window).trigger('resize');
        }, 100);

        Highcharts.chart('container', {
            chart: {
                plotBackgroundColor: null,
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: 'Accuracy',
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                innerSize: '50%',
                name: 'Value',
                data: [
                    ['Accurate', _cd.Accurate],
                    ['Inaccurate', _cd.Inaccurate]
                ]
            }]
        });
    }

    $scope.load3DonutChart = function (data) {
        var _cd = data.chart;
        $scope.pageData = data.data;

        angular.forEach($scope.pageData, function (val, i) {
            val.sno = i + 1;
        });

        $timeout(function () {
            $scope.gridOpts.data = $scope.pageData;
            $(window).trigger('resize');
        }, 100);

        var _series = [];
        angular.forEach(_cd, function (val, i) {
            _series.push([val.ClientDescription, val.Count]);
        });

        Highcharts.chart('container', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                },
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
            },
            title: {
                text: ' '
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            fontWeight: 'bold',
                            color: 'black'
                        }
                    },
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                name: 'Condition Value',
                data: _series
            }]
        });
    }

    $scope.loadDrillDownChart = function (data) {
        var _cd = data.chart;
        $scope.pageData = data.data;

        angular.forEach($scope.pageData, function (val, i) {
            val.sno = i + 1;
        });

        $timeout(function () {
            $scope.gridOpts.data = $scope.pageData;
            $(window).trigger('resize');
        }, 100);

        var _series = [];
        angular.forEach(_cd, function (val, i) {
            _series.push([val.fault_type, val.FalutCount]);
        });

        Highcharts.chart('container', {
            chart: {
                type: 'pie',
                backgroundColor: 'rgba(255, 255, 255, 0.0)',
            },
            title: {
                text: ' '
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            fontWeight: 'bold',
                            color: 'black'
                        }
                    },
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                name: 'Faults',
                data: _series
            }]
        });
    }


    $scope.loadBarChart = function (data) {
        $scope.pageData = data.data;

        angular.forEach($scope.pageData, function (val, i) {
            val.sno = i + 1;
        });

        $timeout(function () {
            $scope.gridOpts.data = $scope.pageData;
            $(window).trigger('resize');
        }, 100);
        var _cd = data.chart;
        var _categories = _cd.map(function (value, index, self) {
            return value.JobMonth;
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        var _OR = _cd.filter(function (value, index, self) {
            return value.ReportType == 'OR';
        });

        var _VR = _cd.filter(function (value, index, self) {
            return value.ReportType == 'VR';
        });

        var orCompleteData = [];
        var orPendingData = [];
        angular.forEach(_OR, function (val, i) {
            orCompleteData.push(val.Completed);
            orPendingData.push(val.Pending);
        });

        var vrCompleteData = [];
        var vrPendingData = [];
        angular.forEach(_VR, function (val, i) {
            vrCompleteData.push(val.Completed);
            vrPendingData.push(val.Pending);
        });

        var _series = [
            {
                name: 'Oil analysis completed',
                data: orCompleteData,
                stack: 'OR'
            }, {
                name: 'Oil analysis pending',
                data: orPendingData,
                stack: 'OR'
            }, {
                name: 'Vibration analysis completed',
                data: vrCompleteData,
                stack: 'VR'
            }, {
                name: 'Vibration analysis pending',
                data: vrPendingData,
                stack: 'VR'
            },
        ];

        Highcharts.chart('container', {
            chart: {
                type: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },
            title: {
                text: ' '
            },
            xAxis: {
                categories: _categories
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Count'
                }
                //, stackLabels: {
                //    enabled: true,
                //    style: {
                //        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                //    }
                //}
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                    //,
                    //dataLabels: {
                    //    enabled: true,
                    //    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    //}
                }
            },
            series: _series
        });
    }

    $scope.loadCombinationChart = function (data) {
        $scope.pageData = data.data;
        var _cd = data.chart;

        angular.forEach($scope.pageData, function (val, i) {
            val.sno = i + 1;
        });

        $timeout(function () {
            $scope.gridOpts.data = $scope.pageData;
            $(window).trigger('resize');
        }, 100);

        var _categories = _cd.map(function (value, index, self) {
            return value.JobMonth;
        }).filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });

        var _series = [
            {
                type: 'column',
                name: 'Accurate',
                data: _cd.map(function (value, index) {
                    return value.Accurate;
                })
            }, {
                type: 'column',
                name: 'InAccurate',
                data: _cd.map(function (value, index) {
                    return value.InAccurate;
                })
            }, {
                type: 'column',
                name: 'Cancelled',
                data: _cd.map(function (value, index) {
                    return value.Cancelled;
                })
            }, {
                type: 'pie',
                name: 'Total',
                data: [{
                    name: 'Accurate',
                    y: $scope.getSum(_cd, 'Accurate'),
                    color: Highcharts.getOptions().colors[0]
                }, {
                    name: 'InAccurate',
                    y: $scope.getSum(_cd, 'InAccurate'),
                    color: Highcharts.getOptions().colors[1]
                }, {
                    name: 'Cancelled',
                    y: $scope.getSum(_cd, 'Cancelled'),
                    color: Highcharts.getOptions().colors[2]
                }],
                center: [750, 20],
                size: 100,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
            }
        ];

        Highcharts.chart('container', {
            chart: {
                type: 'column',
                backgroundColor: 'rgba(255, 255, 255, 0.0)'
            },
            title: {
                text: ' '
            },
            xAxis: {
                categories: _categories
            },
            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: 'Count'
                }
            },
            series: _series
        });
    }

    $scope.loadCharts = function (rpt) {
        $scope.pageData = null;
        $scope.gridOpts.data = [];

        if ($('#container').highcharts()) {
            $('#container').highcharts().destroy();
        }

        if ($scope.FromDate && $scope.ToDate && $scope.location) {
            $http.get("/Report/Get?reportName=" + rpt + "&fromDate=" + $filter('date')($scope.FromDate, "yyyy-MM-dd 00:00:00") + "&toDate=" + $filter('date')($scope.ToDate, "yyyy-MM-dd 00:00:00") + "&locationId=" + $scope.location + "&clientId=" + $scope.clientId).then(function (response) {
                if (response.data) {
                    var _d = response.data;
                    switch (rpt) {
                        case 'r1':
                            $scope.gridOpts = {
                                showColumnFooter: true,
                                columnDefs: $scope.columns1,
                                enablePinning: true,
                                enableColumnResizing: true,
                            }
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            $scope.loadBarChart(_d);
                            break;
                        case 'r2':
                            $scope.gridOpts = {
                                showColumnFooter: true,
                                columnDefs: $scope.columns2,
                                enablePinning: true,
                            }
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            $scope.loadCombinationChart(_d);
                            break;
                        case 'r3':
                            $scope.gridOpts = {
                                columnDefs: $scope.columns3,
                                enablePinning: true,
                                showColumnFooter: false,
                            }
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            $scope.loadDonutChart(_d);
                            break;
                        case 'r4':
                            $scope.gridOpts = {
                                showColumnFooter: true,
                                enablePinning: true,
                                columnDefs: $scope.columns4
                            }
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            $scope.load3DonutChart(_d);
                            break;
                        case 'r5':
                            $scope.gridOpts = {
                                showColumnFooter: true,
                                enablePinning: true,
                                columnDefs: $scope.columns5
                            }
                            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                            $scope.loadDrillDownChart(_d);
                            break;
                    }
                }
            });
        }
    }

    $scope.columns1 = [
        { name: 'sno', displayName: 'S No.', enablePinning: true, cellClass: 'lock-pinned', pinnedLeft: true },
        { name: 'plantsection', displayName: 'Plant Area' },
        { name: 'Machineid', displayName: 'Machine Name' },
        { name: 'JobMonth', displayName: 'Survey Month' },
        { name: 'ServiceType', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.ServiceType=="OA"?"Oil Analysis":row.entity.ServiceType=="VA"?"Vibration Analysis":row.entity.ServiceType}}</div>' },
        { name: 'Completed', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true },
        { name: 'Pending', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true }
    ];

    $scope.columns2 = [
        { name: 'sno', displayName: 'S No.', enablePinning: true, cellClass: 'lock-pinned', pinnedLeft: true },
        { name: 'location', displayName: 'Plant Area' },
        { name: 'machineid', displayName: 'Machine Name' },
        { name: 'JobMonth' },
        { name: 'machineconditioncode', displayName: 'Machine Condition Code' },
        { name: 'Completed', displayName: 'Accurate', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true },
        { name: 'InComplete', displayName: 'InAccurate', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true },
        { name: 'Cancelled', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true }
    ];

    $scope.columns3 = [
        { name: 'sno', displayName: 'S No.', enablePinning: true, cellClass: 'lock-pinned', pinnedLeft: true },
        { name: 'location', displayName: 'Plant Area' },
        { name: 'MachineID', displayName: 'Machine Name' },
        { name: 'WorkNotificationNo', displayName: 'Work Notification No.' },
        { name: 'completion_date', displayName: 'Completion Date' },
        { name: 'AnalysisReport' }
    ];

    $scope.columns4 = [
        { name: 'sno', displayName: 'S No.', enablePinning: true, cellClass: 'lock-pinned', pinnedLeft: true },
        { name: 'plantsection', displayName: 'Plant Area' },
        { name: 'MachineName', displayName: 'Machine Name' },
        { name: 'ClientDescription' },
        { name: 'Count', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true }
    ];

    $scope.columns5 = [
        { name: 'sno', displayName: 'S No.', enablePinning: true, cellClass: 'lock-pinned', pinnedLeft: true },
        { name: 'FailureReportNo', displayName: 'Report No.' },
        { name: 'Machineid', displayName: 'Machine Name' },
        { name: 'AssetID', displayName: 'Asset' },
        { name: 'fault_type', displayName: 'Fault' },
        { name: 'avoidancecost', displayName: 'Avoidance Cost' },
        { name: 'actual_outagetime', displayName: 'Actual Outage Time' },
        { name: 'actual_repaircost', displayName: 'Acutal Repair Cost' },
        { name: 'total_outagetime', displayName: 'Total Outage Time' },
        { name: 'costperhour', displayName: 'Cost per hour' }
    ];

    $scope.loadLocationsFilter = function () {
        $scope.Location = [];
        $http.get("/Home/GetClientLocation?clientID=" + $scope.clientId).then(function (response) {
            if (response.data) {
                $scope.Location = response.data;
                $scope.location = 'AllRecords';
                $scope.loadCharts($scope.reportCol);
            }
        });
    }

    //Init and watch global scope changes
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
    $scope.FromDate = new Date(y - 3, m, d);
    $scope.ToDate = new Date();
    $scope.gridOpts = {
        showColumnFooter: true,
        enableColumnResizing: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $(window).on('load resize', function () {
        if ($(window).width() <= 1024) {
            $scope.columns1[0].width = 40;
            $scope.columns1[1].width = 200;
            $scope.columns1[2].width = 200;
            $scope.columns1[3].width = 100;
            $scope.columns1[4].width = 150;
            $scope.columns1[5].width = 200;
            $scope.columns1[6].width = 200;

            $scope.columns2[0].width = 40;
            $scope.columns2[1].width = 200;
            $scope.columns2[2].width = 200;
            $scope.columns2[3].width = 200;
            $scope.columns2[4].width = 200;
            $scope.columns2[5].width = 200;
            $scope.columns2[6].width = 200;
            $scope.columns2[7].width = 200;

            $scope.columns3[0].width = 40;
            $scope.columns3[1].width = 200;
            $scope.columns3[2].width = 200;
            $scope.columns3[3].width = 200;
            $scope.columns3[4].width = 200;
            $scope.columns3[5].width = 200;

            $scope.columns4[0].width = 40;
            $scope.columns4[1].width = 200;
            $scope.columns4[2].width = 200;
            $scope.columns4[3].width = 200;
            $scope.columns4[4].width = 200;

            $scope.columns5[0].width = 40;
        } else {
            $scope.columns1[0].width = "5%";
            $scope.columns1[1].width = "17%";
            $scope.columns1[2].width = "25%";
            $scope.columns1[3].width = "10%";
            $scope.columns1[4].width = "13%";
            $scope.columns1[5].width = "14%";
            $scope.columns1[6].width = "15%";

            $scope.columns2[0].width = "4%";
            $scope.columns2[1].width = "17%";
            $scope.columns2[2].width = "12%";
            $scope.columns2[3].width = "15%";
            $scope.columns2[4].width = "15%";
            $scope.columns2[5].width = "12%";
            $scope.columns2[6].width = "12%";
            $scope.columns2[7].width = "12%";

            $scope.columns3[0].width = "5%";
            $scope.columns3[1].width = "18%";
            $scope.columns3[2].width = "18%";
            $scope.columns3[3].width = "26%";
            $scope.columns3[4].width = "15%";
            $scope.columns3[5].width = "16%";

            $scope.columns4[0].width = "5%";
            $scope.columns4[1].width = "25%";
            $scope.columns4[2].width = "27%";
            $scope.columns4[3].width = "22%";
            $scope.columns4[4].width = "20%";

            $scope.columns5[0].width = "5%";
        }
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    });

    Highcharts.setOptions({
        colors: ['#50B432', '#058DC7', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
    });

    $timeout(function () {
        $scope.reportCol = 'r1';
        var _companyInfo = sessionStorage.getItem("globalInfo");
        $scope.clientId = JSON.parse(_companyInfo).companyname;
        $scope.gridOpts.data = [];
        $scope.loadLocationsFilter();
    }, 1);

    $scope.$watch(function () {
        return clientFactory.getclientId();
    }, function (newValue, oldValue) {
        if (newValue != oldValue && newValue) {
            $scope.clientId = newValue;
            $scope.loadLocationsFilter();
        }
    });

    function toNumber(val) {
        if (isNaN(val)) {
            return 0;
        }
        else {
            return Number(val);
        }
    }

    $scope.getSum = function (items, key) {
        return items
            .map(function (x) { return x[key]; })
            .reduce(function (a, b) { return toNumber(a) + toNumber(b); });
    };
});
