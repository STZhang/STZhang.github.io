/*
 * Class: button
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {
	// button 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var button = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.text = cfg.text;
			this.onClick = cfg.onClick || env.util.nullFunc;
			this.x = cfg.x;
			this.y = cfg.y;
			this.width = cfg.width || 80;
			this.height = cfg.height || 30;
			this.font_x = this.x + 8;
			this.font_y = this.y + 7;
			this.scene = cfg.scene;
			this.desc = cfg.desc || "";

			this.addToScene(this.scene, this.step_level, this.render_level);
			this.calculatePos();
		},
		onEnter: function () {
			env.mouseHand(true);
			if (this.desc) {
				this.scene.panel.tip.msg(this.desc, this);
			}
		},
		onOut: function () {
			env.mouseHand(false);
			if (this.scene.panel.tip.el == this) {
				this.scene.panel.tip.hide();
			}
		},
		render: function () {
			var ctx = env.ctx;

			ctx.lineWidth = 2;
			ctx.fillStyle = this.is_hover ? "#eee" : "#ccc";
			ctx.strokeStyle = "#999";
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
			ctx.fillText(this.text, this.font_x, this.font_y);
			ctx.closePath();
			ctx.fill();
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 x:
	 *			 y:
	 *			 text:
	 *			 onClick: function
	 *			 sence:
	 *		 }
	 */
	env.create_button = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, button);
		obj._init(cfg);

		return obj;
	};

});