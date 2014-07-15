/*
 * Class: Tip
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {
	// balloon tip对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var tip = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.scene = cfg.scene;
		},
		calculatePos: function () {
			var el = this.el;

			this.x = el.cx + 0.5;
			this.y = el.cy + 0.5;

			if (this.x + this.width > this.scene.stage.width - env.padding) {
				this.x = this.x - this.width;
			}

			this.px = this.x + 5;
			this.py = this.y + 4;
		},
		msg: function (txt, el) {
			this.text = txt;
			var ctx = env.ctx;
			ctx.font = "normal 12px 'Courier New'";
			this.width = Math.max(
				ctx.measureText(txt).width + 10,
				env.util.strLen2(txt) * 6 + 10
				);
			this.height = 24;

			if (el && el.cx && el.cy) {
				this.el = el;
				this.calculatePos();

				this.show();
			}
		},
		step: function () {
			if (!this.el || !this.el.valid) {
				this.hide();
				return;
			}

			if (this.el.is_monster) {
				// monster 会移动，所以需要重新计算 tip 的位置
				this.calculatePos();
			}
		},
		render: function () {
			if (!this.el) return;
			var ctx = env.ctx;

			ctx.lineWidth = 1;
			ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
			ctx.strokeStyle = "rgba(222, 222, 0, 0.9)";
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000";
			ctx.font = "normal 12px 'Courier New'";
			ctx.beginPath();
			ctx.fillText(this.text, this.px, this.py);
			ctx.closePath();

		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 scene: scene
	 *		 }
	 */
	env.create_tip = function (id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, tip);
		obj._init(cfg);

		return obj;
	};
});
