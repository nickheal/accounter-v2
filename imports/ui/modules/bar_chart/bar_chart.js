import { Template } from 'meteor/templating';

import './bar_chart.html';

import Canvas from '../../canvas/canvas.js';
import BarChart from '../../canvas/graphics/bar-chart.js';

const bar_chart = {};

Template.bar_chart.onRendered(function () {
    this.autorun(() => {
        const inputData = Template.currentData().graphdata;
        if (inputData) {
            if (inputData.length) {
                const data = inputData.reduce((acc, d) => {
                    const year = parseInt(d.year);
                    const month = parseInt(d.month);
                    const cat = d.category;

                    acc[year] = acc[year] || {};
                    acc[year][month] = acc[year][month] || {};
                    acc[year][month][cat] = acc[year][month][cat] || 0;

                    acc[year][month][cat] += d.amount;

                    return acc;
                }, {});

                const years = Object.keys(data).sort();

                const firstYear = parseInt(years[0]);
                const firstMonth = parseInt(Object.keys(data[firstYear]).sort()[0]);
                const lastYear = parseInt(years[years.length - 1]);
                const lastMonth = parseInt(Object.keys(data[lastYear]).sort()[Object.keys(data[lastYear]).length - 1]);

                const numberOfBars = (lastYear * 12 + lastMonth) - (firstYear * 12 + firstMonth) + 1;

                const formattedData = [];
                for (let i = 0; i < numberOfBars; i++) {
                    const year = Math.floor(firstYear + (i - 1 + firstMonth) / 12);
                    const month = ((i - 1 + firstMonth) % 12) + 1;

                    formattedData.push({
                        label: `${month}-${year}`,
                        data: data[year][month]
                    });
                }

                const highestValue = formattedData.reduce((acc, d) => {
                    let total = 0;
                    for (let cat in d.data) {
                        total += d.data[cat];
                    }
                    return total > acc ? total : acc;
                }, 0);

                if (!bar_chart.barChart) {
                    const canv = new Canvas({
                        $element: this.$('.js-bar-chart-container')
                    });
                    const barChart = new BarChart({
                        canv,
                        colours: ['#335577','#aabbcc','#ffa500','#557799','#8899aa','#cc7200'],
                        data: formattedData,
                        yMax: highestValue
                    });

                    bar_chart.barChart = barChart;
                } else {
                    bar_chart.barChart.updateRange({
                        yMax: highestValue
                    });
                    bar_chart.barChart.updateData(formattedData);
                }
            }
        }
    });
});

Template.bar_chart.onDestroyed(() => {
    bar_chart.barChart = null;
});