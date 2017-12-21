import Line from '../primitives/line.js';
import Text from '../primitives/text.js';
import delimitedEvents from '../delimitedEvents';

export default class Axis {
    constructor({
        canv,
        direction = 'horizontal',
        scale = 1,
        positionX = 0,
        positionY = 0,
        rangeMin = 0,
        rangeMax = 1,
        labels = 0,
        labelFunction = val => val
    }) {
        this.canv = canv;
        this.direction = direction;
        this.scale = scale;
        this.positionX = positionX;
        this.positionY = positionY;
        this.rangeMin = rangeMin;
        this.rangeMax = rangeMax;
        this.numberOfLabels = labels;
        this.labelFunction = labelFunction;

        this.labels = [];
        this.draw();

        $(window).on('delimitedResize', () => this.draw());
    }

    draw() {
        const { canv, direction, scale, numberOfLabels, labels, labelFunction, positionX, positionY } = this;

        const x1 = direction === 'horizontal' ? this.getPosition(this.rangeMin) : canv.width() * positionX;
        const y1 = direction === 'horizontal' ? canv.height() * positionY : this.getPosition(this.rangeMin);
        const x2 = direction === 'horizontal' ? this.getPosition(this.rangeMax) : canv.width() * positionX;
        const y2 = direction === 'horizontal' ? canv.height() * positionY : this.getPosition(this.rangeMax);

        if (!this.line) {
            const line = new Line({ x1, y1, x2, y2 });
            canv.add(line);
            this.line = line;
        } else {
            this.line.x1 = x1;
            this.line.y1 = y1;
            this.line.x2 = x2;
            this.line.y2 = y2;
        }

        for (let i = 0; i < numberOfLabels; i++) {
            const labelDivider = numberOfLabels - 1;
            const size = canv.width() * 0.025;
            const x = direction === 'horizontal' ? ((x2 - x1) / labelDivider) * i + x1 : canv.width() * positionX;
            const y = direction === 'horizontal' ? canv.height() * positionY : ((y2 - y1) / labelDivider) * i + y1 - size / 3;

            if (!this.labels[i]) {
                const label = new Text({
                    content: labelFunction(((this.rangeMax - this.rangeMin) / labelDivider) * i + this.rangeMin),
                    x,
                    y,
                    align: direction === 'horizontal' ? 'center' : 'left',
                    size
                });
                canv.add(label);
                this.labels.push(label);
            } else {
                this.labels[i].content = labelFunction(((this.rangeMax - this.rangeMin) / labelDivider) * i + this.rangeMin);
                this.labels[i].x = x;
                this.labels[i].y = y;
                this.labels[i].size = size;
            }
        }
    }

    getPosition(value) {
        const { canv, direction, scale, rangeMin, rangeMax, positionX, positionY } = this;
        const percentage = (value - rangeMin) / (rangeMax - rangeMin);
        if (direction === 'horizontal') {
            const indent = canv.width() * positionX;
            return canv.width() * scale * percentage + indent;
        } else {
            const indent = canv.height() * this.positionY;
            return canv.height() * scale * percentage + indent;
        }
    }

    updateRange({ min, max }) {
        if (min) { this.rangeMin = min }
        if (max) { this.rangeMax = max }
        this.draw();
    }
}