import { Template } from 'meteor/templating';

import './pie_chart.html';

import Canvas from '../../canvas/canvas.js';
import PieChart from '../../canvas/graphics/pie-chart.js';

const pie_chart = {};

Template.pie_chart.onRendered(function () {
    this.autorun(() => {
        const inputData = Template.currentData().graphdata;
        if (inputData) {
            if (inputData.length) {
                const data = inputData.reduce((acc, d) => {
                    if (!acc[d.category]) { acc[d.category] = 0 }
                    acc[d.category] += d.amount;
                    return acc;
                }, {});

                if (!pie_chart.pieChart) {
                    const canv = new Canvas({
                        $element: this.$('.js-pie-chart-container')
                    });
                    const pieChart = new PieChart({
                        canv,
                        colours: ['#335577','#aabbcc','#ffa500','#557799','#8899aa','#cc7200'],
                        data,
                        radius: .5,
                        positionX: .5,
                        positionY: .5
                    });

                    pie_chart.pieChart = pieChart;
                } else {
                    pie_chart.pieChart.updateData(data);
                }
            } else {
                pie_chart.pieChart.updateData([]);
            }
        }
    });
});

Template.pie_chart.onDestroyed(() => {
    pie_chart.pieChart = null;
});