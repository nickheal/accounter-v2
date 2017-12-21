import { TweenMax } from 'gsap';

import util from '/imports/util.js';

import Arc from '../primitives/arc.js';
import Text from '../primitives/text.js';

export default class PieChart {
    constructor({
        canv,
        colours = ['#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777','#888888','#999999'],
        data,
        radius,
        positionX,
        positionY
    }) {
        this.canv = canv;
        this.colours = colours;
        this.data = data;
        this.radius = radius;
        this.positionX = positionX;
        this.positionY = positionY;

        this.segments = [];
        this.labels = [];
        this.draw();

        $(window).on('delimitedResize', () => this.draw());
    }

    draw() {
        const { canv, colours, data, radius, positionX, positionY, segments, labels } = this;

        let total = 0;
        for (let cat in data) {
            total += data[cat];
        }

        let angle = 0;
        let progress = 0;
        for (let cat in data) {
            const x = canv.width() * positionX;
            const y = canv.height() * positionY;

            const percentage = data[cat] / total;
            const degrees = percentage * 360;
            const radians = degrees * Math.PI / 180;
            const r = canv.width() < canv.height() ? canv.width() * radius : canv.height() * radius;

            if (!segments[progress * 2]) {
                const arc = new Arc({
                    colour: colours[progress],
                    x,
                    y,
                    r,
                    sAngle: angle,
                    eAngle: angle
                });
                canv.add(arc);
                TweenMax.to(arc, .5, {
                    eAngle: angle + radians,
                    delay: progress * .5
                });
                this.segments.push(arc);

                const arc2 = new Arc({
                    colour: '#ffffff',
                    x,
                    y,
                    r: r * .9,
                    sAngle: angle - .01,
                    eAngle: angle
                });
                canv.add(arc2);
                TweenMax.to(arc2, .5, {
                    eAngle: angle + radians + .01,
                    delay: progress * .5
                });
                this.segments.push(arc2);
            } else {
                const arc = segments[progress * 2];
                const arc2 = segments[progress * 2 + 1];
                TweenMax.to(arc, .5, {
                    x,
                    y,
                    r,
                    sAngle: angle,
                    eAngle: angle + radians
                });
                TweenMax.to(arc2, .5, {
                    x,
                    y,
                    r: r * .9,
                    sAngle: angle - .01,
                    eAngle: angle + radians + .01
                });
            }

            const fontSize = r * .075;
            const content = `${util.capitaliseFirstLetter(cat)}: ${Math.round(percentage * 1000) / 10}%`;
            const textRotation = angle + radians / 2 > Math.PI * .5 && angle + radians / 2 < Math.PI * 1.5 ? angle + radians / 2 - Math.PI : angle + radians / 2;
            if (!labels[progress]) {
                const label = new Text({
                    content,
                    colour: '#333333',
                    x: x + (r * .88) * Math.cos(-(angle + radians / 2)),
                    y: y + (r * .88) * Math.sin(-(angle + radians / 2)) - fontSize / 3,
                    size: fontSize,
                    align: angle + radians / 2 > Math.PI * .5 && angle + radians / 2 < Math.PI * 1.5 ? 'left' : 'right',
                    opacity: 0,
                    rotation: textRotation
                });
                canv.add(label);
                TweenMax.to(label, .5, {
                    opacity: 1,
                    delay: progress * .5
                });
                this.labels.push(label);
            } else {
                const label = labels[progress];
                label.content = content;
                TweenMax.to(label, .5, {
                    x: x + (r * .88) * Math.cos(-(angle + radians / 2)),
                    y: y + (r * .88) * Math.sin(-(angle + radians / 2)) - fontSize / 3,
                    size: fontSize,
                    opacity: 1,
                    rotation: textRotation
                });
            }

            angle += radians;
            progress++;
        }
    }

    updateData(data) {
        const { canv, segments, labels } = this;

        this.data = data;

        for (let i = 0; i < segments.length; i++) {
            canv.remove(segments[i]);
        }
        segments.splice(0, segments.length);

        for (let i = 0; i < labels.length; i++) {
            canv.remove(labels[i]);
        }
        labels.splice(0, labels.length);

        this.draw();
    }
}