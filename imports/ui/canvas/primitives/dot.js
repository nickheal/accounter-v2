export default class Dot {
	constructor ({
		colour = '#333333',
		r = 1,
		x = .5,
		y = .5
	}) {
		this.colour = colour;
		this.r = r;
		this.x = x;
		this.y = y;
	}

	draw (ctx) {
		ctx.beginPath();

	    ctx.fillStyle = this.colour;
	    ctx.arc(this.x, ctx.canvas.height - this.y, this.r, 0, 360);

	    ctx.fill();
	}
}