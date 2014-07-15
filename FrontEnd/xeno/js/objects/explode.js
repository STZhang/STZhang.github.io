/*
 * Class: explode
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	/**
	 * 怪物死亡时的爆炸效果对象
	 */
	var explode = {
		type: null,
		wait: 0,
		_init: function (cfg) {
			cfg = cfg || {};
			this.cx = cfg.cx;
			this.cy = cfg.cy;
			this.step_level = cfg.step_level;
			this.render_level = cfg.render_level;
			cfg.scene.addElement(this);
		},
		step: function () {
			if (this.type == null)
				return;
			if (!this.valid) return;
			this.wait --;
			this.valid = this.wait > 0;
		},
		render: function () {
			if (this.type == null)
				return;
			var ctx = env.ctx;
			img = document.getElementById(this.type + '_'+this.wait);
			ctx.drawImage(img, this.cx-16, this.cy-16);
		}
	};

	/**
	 * @param cfg {Object} 配置对象
	 *		 {
	 *			// 至少需要包含以下项：
	 * 			 cx: 中心 x 坐标
	 * 			 cy: 中心 y 坐标
	 * 			 r: 半径
	 * 			 color: RGB色彩，形如“#f98723”
	 * 			 scene: Scene 对象
	 * 			 step_level:
	 * 			 render_level:
	 *
	 * 			// 以下项可选：
	 * 			time: 持续时间，默认为 1，单位大致为秒（根据渲染情况而定，不是很精确）
	 *		 }
	 */
	env.create_explode = function (id, cfg) {
//		cfg.on_events = ["enter", "out"];
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, explode);
		obj._init(cfg);

		return obj;
	};

});
