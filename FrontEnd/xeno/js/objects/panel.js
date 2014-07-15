/*
 * Class: panel
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	// panel 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var panel = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.x = cfg.x;
			this.y = cfg.y;
			this.scene = cfg.scene;
			this.map = cfg.main_map;

			// make panel map
			var panel_map = new env.create_map("panel-map", env.util.mix({
					x: this.x + cfg.map.x,
					y: this.y + cfg.map.y,
					scene: this.scene,
					step_level: this.step_level,
					render_level: this.render_level
				}, cfg.map, false));

			this.addToScene(this.scene, 1, 7);
			panel_map.addToScene(this.scene, 1, 7, panel_map.grids);
			this.scene.panel_map = panel_map;
			this.gameover = new env.create_gameover("panel-gameover", {
				panel: this,
				scene: this.scene,
				step_level: this.step_level,
				visiable: false,
				x: 0,
				y: 0,
				width: this.scene.stage.width,
				height: this.scene.stage.height,
				render_level: 9
			});

			this.tip = new env.create_tip("panel-balloon-tip", {
				scene: this.scene,
				step_level: this.step_level,
				render_level: 9
			});
			this.tip.addToScene(this.scene, 1, 9);

			// make buttons
			// 暂停按钮
			this.btn_pause = new env.create_button("panel-btn-pause", {
				scene: this.scene,
				x: this.x,
				y: this.y + 260,
				text: env._t("button_pause_text"),
				//desc: env._t("button_pause_desc_0"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					if (this.scene.state == 1) {
						this.scene.pause();
						this.text = env._t("button_continue_text");
						this.scene.panel.btn_upgrade.hide();
						this.scene.panel.btn_sell.hide();
						this.scene.panel.btn_restart.show();
						//this.desc = env._t("button_pause_desc_1");
					} else if (this.scene.state == 2) {
						this.scene.start();
						this.text = env._t("button_pause_text");
						this.scene.panel.btn_restart.hide();
						if (this.scene.map.selected_tank) {
							this.scene.panel.btn_upgrade.show();
							this.scene.panel.btn_sell.show();
						}
						//this.desc = env._t("button_pause_desc_0");
					}
				}
			});
			// 重新开始按钮
			this.btn_restart = new env.create_button("panel-btn-restart", {
				scene: this.scene,
				x: this.x,
				y: this.y + 300,
				visiable: false,
				text: env._t("button_restart_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					setTimeout(function () {
						env.stage.clear();
						env.is_paused = true;
						env.start();
						env.mouseHand(false);
					}, 0);
				}
			});
			// 建筑升级按钮
			this.btn_upgrade = new env.create_button("panel-btn-upgrade", {
				scene: this.scene,
				x: this.x,
				y: this.y + 300,
				visiable: false,
				text: env._t("button_upgrade_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					this.scene.map.selected_tank.tryToUpgrade(this);
				}
			});
			// 建筑出售按钮
			this.btn_sell = new env.create_button("panel-btn-sell", {
				scene: this.scene,
				x: this.x,
				y: this.y + 340,
				visiable: false,
				text: env._t("button_sell_text"),
				step_level: this.step_level,
				render_level: this.render_level + 1,
				onClick: function () {
					this.scene.map.selected_tank.tryToSell(this);
				}
			});
		},
		step: function () {
			if (env.life_recover) {
				this._life_recover = this._life_recover2 = env.life_recover;
				this._life_recover_wait = this._life_recover_wait2 = env.exp_fps * 3;
				env.life_recover = 0;
			}

			if (this._life_recover && (env.iframe % env.exp_fps_eighth == 0)) {
				env.life ++;
				this._life_recover --;
			}

		},
		render: function () {
			// 画状态文字
			var ctx = env.ctx;

			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillStyle = "#000";
			ctx.font = "normal 12px 'Courier New'";
			ctx.beginPath();
			ctx.fillText(env._t("panel_money_title") + env.money, this.x, this.y);
			ctx.fillText(env._t("panel_score_title") + env.score, this.x, this.y + 20);
			ctx.fillText(env._t("panel_life_title") + env.life, this.x, this.y + 40);
			ctx.fillText(env._t("panel_tank_title") + this.map.tanks.length,
				this.x, this.y + 60);
			ctx.fillText(env._t("panel_monster_title") + this.map.monsters.length,
				this.x, this.y + 80);
			ctx.fillText(env._t("wave_info", [this.scene.wave]), this.x, this.y + 210);
			ctx.closePath();

			if (this._life_recover_wait) {
				// 画生命恢复提示
				var a = this._life_recover_wait / this._life_recover_wait2;
				ctx.fillStyle = "rgba(255, 0, 0, " + a + ")";
				ctx.font = "bold 12px 'Verdana'";
				ctx.beginPath();
				ctx.fillText("+" + this._life_recover2, this.x + 60, this.y + 40);
				ctx.closePath();
				this._life_recover_wait --;
			}

			// 在右下角画版本信息
			ctx.textAlign = "right";
			ctx.fillStyle = "#666";
			ctx.font = "normal 12px 'Courier New'";
			ctx.beginPath();
			ctx.fillText("version: " + env.version + " | oldj.net", env.stage.width - env.padding,
				env.stage.height - env.padding * 2);
			ctx.closePath();

			// 在左下角画FPS信息
			ctx.textAlign = "left";
			ctx.fillStyle = "#666";
			ctx.font = "normal 12px 'Courier New'";
			ctx.beginPath();
			ctx.fillText("FPS: " + env.fps, env.padding, env.stage.height - env.padding * 2);
			ctx.closePath();
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 life: 怪物的生命值
	 *			 shield: 怪物的防御值
	 *			 speed: 怪物的速度
	 *		 }
	 */
	env.create_panel = function (id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, panel);
		obj._init(cfg);

		return obj;
	};

	/**
	 * 恢复 n 点生命值
	 * @param n
	 */
	env.recover = function (n) {
//		env.life += n;
		env.life_recover = n;
		env.log("life recover: " + n);
	};

}); // app.todo.push end

