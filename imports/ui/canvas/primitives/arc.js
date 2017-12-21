export default class Arc {
	constructor ({
		colour = '#333333',
		x = .5,
		y = .5,
		r = 1,
		sAngle = 0,
		eAngle = 1,
		opacity = 1
	}) {
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.r = r;
		this.sAngle = sAngle;
		this.eAngle = eAngle;
		this.opacity = opacity;
	}

	draw (ctx) {
		ctx.beginPath();

		ctx.fillStyle = this.colour;

		ctx.moveTo(this.x, ctx.canvas.height - this.y);
		ctx.arc(this.x, this.y, this.r, this.sAngle, this.eAngle);
		ctx.lineTo(this.x, ctx.canvas.height - this.y);

	    ctx.fill();
	}
}