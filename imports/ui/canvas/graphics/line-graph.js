import { TweenMax } from 'gsap';

import Axis from '../components/axis.js';
import Dot from '../primitives/dot.js';
import Line from '../primitives/line.js';

export default class LineGraph {
    constructor({
        canv,
        data,
        xMin = data[0].x,
        xMax = data[data.length - 1].x,
        yMin = data[0].y,
        yMax = data[data.length - 1].y
    }) {
        this.canv = canv;
        this.data = data;
        this.xMin = xMin;
        this.xMax = xMax;
        this.yMin = yMin;
        this.yMax = yMax;

        this.xAxis = new Axis({
            canv,
            direction: 'horizontal',
            scale: .95,
            positionX: .025,
            positionY: .025,
            rangeMin: xMin,
            rangeMax: xMax,
            labels: 10,
            labelFunction: val => {
                const date = new Date(val);
                return `${date.getDate()}`;
            }
        });
        this.yAxis = new Axis({
            canv,
            direction: 'vertical',
            scale: .95,
            positionX: .025,
            positionY: .025,
            rangeMin: yMin,
            rangeMax: yMax,
            labels: 10,
            labelFunction: val => {
                return `£${Math.round(val)}`;
            }
        });

        this.dots = [];
        this.lines = [];
        this.drawData();

        $(window).on('delimitedResize', () => this.drawData());
    }

    drawData() {
        const { canv, xAxis, yAxis, dots, lines, data, xMin, xMax, yMin, yMax } = this;

        for (let i = 0; i < data.length; i++) {
            const dat = data[i];

            const dotX = xAxis.getPosition(dat.x);
            const dotY = yAxis.getPosition(dat.y);

            if (!dots[i]) {
                const dot = new Dot({
                    colour: '#ffa500',
                    r: 0,
                    x: dotX,
                    y: dotY
                });
                dots.push(dot);
                canv.add(dot);
                TweenMax.to(dot, .5, {
                    r: 5,
                    delay: i / 10
                });
            } else {
                TweenMax.to(dots[i], .5, {
                    x: dotX,
                    y: dotY
                })
            }

            if (i > 0) {
                const x1 = xAxis.getPosition(data[i - 1].x),
                    y1 = yAxis.getPosition(data[i - 1].y),
                    x2 = xAxis.getPosition(dat.x),
                    y2 = yAxis.getPosition(dat.y);

                if (!lines[i - 1]) {
                    const line = new Line({
                        colour: '#ffa500',
                        r: 0,
                        x1,
                        y1,
                        x2: x1,
                        y2: y1
                    });
                    lines.push(line);
                    canv.add(line);
                    TweenMax.to(line, .5, {
                        x2,
                        y2,
                        delay: i / 10
                    });
                } else {
                    TweenMax.to(lines[i - 1], .5, {
                        x1,
                        y1,
                        x2,
                        y2
                    });
                }
            }
        }
    }

    updateRange({ xMin, xMax, yMin, yMax }) {
        this.xAxis.updateRange({
            min: xMin,
            max: xMax
        });
        this.yAxis.updateRange({
            min: yMin,
            max: yMax
        });
    }

    updateData(data) {
        const { canv, dots, lines } = this;

        this.data = data;

        for (let i = 0; i < dots.length; i++) {
            canv.remove(dots[i]);
        }
        dots.splice(0, dots.length);

        for (let i = 0; i < lines.length; i++) {
            canv.remove(lines[i]);
        }
        lines.splice(0, lines.length);

        this.drawData();
    }
}