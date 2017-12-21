import globalTiming from './globalTiming';
import delimitedEvents from './delimitedEvents';

export default class Canvas {
    constructor({
        $element
    }) {
        this.$canvas = $('<canvas></canvas>');
        $element.append(this.$canvas);
        this.ctx = this.$canvas.get(0).getContext('2d');
        this.stack = [];

        this.init();
    }

    init() {
        $(window).on('delimitedResize', () => this.resizeCanvas());
        this.resizeCanvas();
        globalTiming.addCallback(this);
    }

    resizeCanvas() {
        const $container = this.$canvas.parent();
        const conWidth = $container.width();
        const conHeight = $container.height();
        const dpr = window.devicePixelRatio;

        this.$canvas.attr('width', conWidth * dpr);
        this.$canvas.attr('height', conHeight * dpr);
        this.$canvas.css({
            width: '100%',
            height: '100%'
        });
    }

    add(newItem) {
        this.stack.push(newItem);
    }

    remove(item) {
        this.stack.splice(this.stack.indexOf(item), 1);
    }

    height() {
        return this.ctx.canvas.height;
    }

    width() {
        return this.ctx.canvas.width;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (let i = 0; i < this.stack.length; i++) {
            this.stack[i].draw(this.ctx);
        }
    }
}