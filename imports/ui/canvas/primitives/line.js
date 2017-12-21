export default class Line {
	constructor ({
		colour = '#333333',
		x1 = 0,
		y1 = 0,
		x2 = 1,
		y2 = 1,
		width = 1,
		opacity = 1
	}) {
		this.colour = colour;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.width = width;
		this.opacity = opacity;
	}

	draw (ctx) {
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = this.width;

		ctx.beginPath();

	    ctx.moveTo(this.x1, ctx.canvas.height - this.y1);
		ctx.lineTo(this.x2, ctx.canvas.height - this.y2);

	    ctx.stroke();
	}
}