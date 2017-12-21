class GlobalTiming {
    constructor() {
        this.callbacks = [];
        window.requestAnimationFrame(() => this.loop());
    }

    loop() {
        for (let cb = 0, cbl = this.callbacks.length; cb < cbl; cb++) {
            this.callbacks[cb].draw();
        }
        window.requestAnimationFrame(() => this.loop());
    }

    addCallback(callback) {
        this.callbacks.push(callback);
    }
}

export default new GlobalTiming();