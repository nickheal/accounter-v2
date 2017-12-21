import { TweenMax } from 'gsap';

import util from '/imports/util.js';

import Axis from '../components/axis.js';
import Rect from '../primitives/rect.js';
import Text from '../primitives/text.js';

export default class BarChart {
    constructor({
        canv,
        colours = ['#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777','#888888','#999999'],
        data,
        xMin = 0,
        xMax = data.length,
        yMin = 0,
        yMax = 1
    }) {
        this.canv = canv;
        this.colours = colours;
        this.data = data;

        this.xAxis = new Axis({
            canv,
            direction: 'horizontal',
            scale: .95,
            positionX: .025,
            positionY: .05,
            rangeMin: xMin,
            rangeMax: xMax
        });
        this.yAxis = new Axis({
            canv,
            direction: 'vertical',
            scale: .9,
            positionX: .025,
            positionY: .05,
            rangeMin: yMin,
            rangeMax: yMax,
            labels: 10,
            labelFunction: val => {
                return `£${Math.round(val)}`;
            }
        });

        this.bars = [];
        this.keyBoxes = [];
        this.keyTexts = [];
        this.draw();

        $(window).on('delimitedResize', () => {
            this.draw();
        });
    }

    draw() {
        this.drawData();
        this.drawKey();
    }

    drawData() {
        const { canv, colours, data, xAxis, yAxis } = this;
        
        const coloursIds = {};
        let coloursUsed = 0;
        let xPos = 0;
        let barNumber = 0;
        for (let i = 0; i < data.length; i++) {
            const width = xAxis.getPosition(1) - xAxis.getPosition(0);
            let yPos = 0;
            let stages = 0;
            for (let cat in data[i].data) {
                const val = data[i].data[cat];
                const height = yAxis.getPosition(val) - yAxis.getPosition(0);
                if (!coloursIds[cat]) {
                    coloursIds[cat] = coloursUsed;
                    coloursUsed++;
                }

                if (!this.bars[barNumber]) {
                    const rect = new Rect({
                        colour: colours[coloursIds[cat]],
                        x: xAxis.getPosition(xPos),
                        y: yAxis.getPosition(yPos),
                        width,
                        height: 0
                    });
                    canv.add(rect);
                    TweenMax.to(rect, .5, {
                        y: yAxis.getPosition(yPos + val),
                        height,
                        delay: i * .1 + stages * .5
                    });
                    this.bars.push(rect);
                } else {
                    TweenMax.to(this.bars[barNumber], .5, {
                        x: xAxis.getPosition(xPos),
                        y: yAxis.getPosition(yPos + val),
                        width,
                        height
                    });
                }

                yPos += val;
                stages++;
                barNumber++;
            }
            xPos += 1;
        }
        this.coloursIds = coloursIds;
    }

    drawKey() {
        const { canv, colours, coloursIds, yAxis, keyBoxes, keyTexts } = this;

        const yPos = yAxis.getPosition(-20);
        const boxDimension = canv.width() * .0275;
        let progress = 0;
        let x = 0;
        for (let cat in coloursIds) {
            if (!keyBoxes[progress]) {
                const box = new Rect({
                    colour: colours[coloursIds[cat]],
                    x,
                    y: yPos,
                    width: boxDimension,
                    height: boxDimension
                });
                canv.add(box);
                this.keyBoxes[progress] = box;
            } else {
                const box = keyBoxes[progress];
                TweenMax.to(box, .5, {
                    x,
                    y: yPos,
                    width: boxDimension,
                    height: boxDimension
                });
            }
            x += boxDimension * 1.5;

            if (!keyTexts[progress]) {
                const text = new Text({
                    content: util.capitaliseFirstLetter(cat),
                    x,
                    y: yPos - boxDimension,
                    align: 'left',
                    size: boxDimension
                });
                canv.add(text);
                this.keyTexts[progress] = text;
            } else {
                const text = keyTexts[progress];
                text.content = util.capitaliseFirstLetter(cat);
                TweenMax.to(text, .5, {
                    x,
                    y: yPos - boxDimension,
                    size: boxDimension
                });
            }
            canv.ctx.font = boxDimension + 'px Open Sans, sans-serif';
            x += canv.ctx.measureText(util.capitaliseFirstLetter(cat)).width + boxDimension;

            progress++;
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
        const { canv, bars, keyBoxes, keyTexts } = this;

        this.data = data;

        for (let i = 0; i < bars.length; i++) {
            canv.remove(bars[i]);
        }
        bars.splice(0, bars.length);

        for (let i = 0; i < keyBoxes.length; i++) {
            canv.remove(keyBoxes[i]);
        }
        keyBoxes.splice(0, keyBoxes.length);

        for (let i = 0; i < keyTexts.length; i++) {
            canv.remove(keyTexts[i]);
        }
        keyTexts.splice(0, keyTexts.length);

        this.draw();
    }
}