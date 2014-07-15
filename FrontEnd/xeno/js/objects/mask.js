/*
 * Class: mask
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	var mmm = {
		_init: function (cfg) {
			this.map = cfg.map;

			this.x1 = this.map.x;
			this.y1 = this.map.y;
			this.x2 = this.map.x2 + 1;
			this.y2 = this.map.y2 + 1;
			this.w = this.map.scene.stage.width;
			this.h = this.map.scene.stage.height;
			this.w2 = this.w - this.x2;
			this.h2 = this.h - this.y2;
		},
		render: function () {
			var ctx = env.ctx;
			/*ctx.clearRect(0, 0, this.x1, this.h);
			 ctx.clearRect(0, 0, this.w, this.y1);
			 ctx.clearRect(0, this.y2, this.w, this.h2);
			 ctx.clearRect(this.x2, 0, this.w2, this.h2);*/

			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.fillRect(0, 0, this.x1, this.h);
			ctx.fillRect(0, 0, this.w, this.y1);
			ctx.fillRect(0, this.y2, this.w, this.h2);
			ctx.fillRect(this.x2, 0, this.w2, this.h);
			ctx.closePath();
			ctx.fill();

		}
	};

	/**
	 * 主地图外边的遮罩，用于遮住超出地图的射程等
	 */
	env.MainMapMask = function(id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, mmm);
		obj._init(cfg);

		return obj;
	}
});