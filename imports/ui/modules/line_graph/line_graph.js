import { Template } from 'meteor/templating';

import './line_graph.html';

import Canvas from '../../canvas/canvas.js';
import LineGraph from '../../canvas/graphics/line-graph.js';

const line_graph = {};

Template.line_graph.onRendered(function () {
    this.autorun(() => {
        const inputData = Template.currentData().graphdata;
        if (inputData) {
            if (inputData.length) {
                const data = inputData.reduce((acc, d) => {
                    acc.push({
                        x: + new Date(d.year, d.month - 1, d.day, d.hour, d.minute),
                        y: acc[acc.length - 1] ? acc[acc.length - 1].y + d.amount : d.amount
                    });
                    return acc;
                }, []);
                const year = inputData[0].year;
                const month = inputData[0].month - 1;

                if (!line_graph.lineGraph) {
                    const canv = new Canvas({
                        $element: this.$('.js-line-graph-container')
                    });
                    const lineGraph = new LineGraph({
                        canv,
                        data,
                        xMin: + new Date(year, month, 1, 0, 0, 0, 0),
                        xMax: + new Date(year, month + 1, 0, 0, 0, 0, 0),
                        yMin: 0
                    });

                    line_graph.lineGraph = lineGraph;
                } else {
                    line_graph.lineGraph.updateRange({
                        xMin: + new Date(year, month, 1, 0, 0, 0, 0),
                        xMax: + new Date(year, month + 1, 0, 0, 0, 0, 0),
                        yMax: data[data.length - 1].y
                    });
                    line_graph.lineGraph.updateData(data);
                }
            } else {
                line_graph.lineGraph.updateData([]);
            }
        }
    });
});

Template.line_graph.onDestroyed(() => {
    line_graph.lineGraph = null;
});