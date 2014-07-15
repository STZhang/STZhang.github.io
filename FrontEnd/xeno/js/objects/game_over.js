/*
 * Class: GameOver
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {
	// gameover 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var gameover = {
		_init: function (cfg) {
			this.panel = cfg.panel;
			this.scene = cfg.scene;

			this.addToScene(this.scene, 1, 9);
		},
		render: function () {

			this.panel.btn_pause.hide();
			this.panel.btn_upgrade.hide();
			this.panel.btn_sell.hide();
			this.panel.btn_restart.show();

			var ctx = env.ctx;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = "#ccc";
			ctx.font = "bold 62px 'Verdana'";
			ctx.beginPath();
			ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
			ctx.closePath();
			ctx.fillStyle = "#f00";
			ctx.font = "bold 60px 'Verdana'";
			ctx.beginPath();
			ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
			ctx.closePath();

		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 panel:
	 *			 scene:
	 *		 }
	 */
	env.create_gameover = function (id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, gameover);
		obj._init(cfg);

		return obj;
	};

});
