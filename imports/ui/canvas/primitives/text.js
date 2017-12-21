export default class Text {
	constructor ({
		content = '',
		colour = '#333333',
		x = .5,
		y = .5,
		align = 'center',
		size = 5,
		opacity = 1,
		rotation = 0
	}) {
		this.content = content;
		this.colour = colour;
		this.x = x;
		this.y = y;
		this.align = align;
		this.size = size;
		this.opacity = opacity;
		this.rotation = rotation;
	}

	draw (ctx) {
		ctx.globalAlpha = this.opacity;
		ctx.translate(this.x, ctx.canvas.height - this.y);
		ctx.rotate(this.rotation);

		ctx.fillStyle = this.colour;
		ctx.font = this.size + 'px Open Sans, sans-serif';
		ctx.textAlign = this.align;
		ctx.fillText(this.content, 0, 0);

		ctx.rotate(-this.rotation);
		ctx.translate(-this.x, -(ctx.canvas.height - this.y));
		ctx.globalAlpha = 1;
	}
}