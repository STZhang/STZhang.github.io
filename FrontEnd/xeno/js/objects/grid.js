/*
 * Class: grid
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	// grid 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var grid = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.map = cfg.map;
			this.scene = this.map.scene;
			this.mx = cfg.mx; // 在 map 中的格子坐标
			this.my = cfg.my;
			this.width = env.grid_size;
			this.height = env.grid_size;
			this.is_entrance = this.is_exit = false;
			this.passable_flag = 1; // 0: 不可通过; 1: 可通过
			this.build_flag = 1;// 0: 不可修建; 1: 可修建; 2: 已修建
			this.tank = null;
			this.calculatePos();
		},

		/**
		 * 根据 map 位置及本 grid 的 (mx, my) ，计算格子的位置
		 */
		calculatePos: function () {
			this.x = this.map.x + this.mx * env.grid_size;
			this.y = this.map.y + this.my * env.grid_size;
			this.x2 = this.x + env.grid_size;
			this.y2 = this.y + env.grid_size;
			this.cx = Math.floor(this.x + env.grid_size / 2);
			this.cy = Math.floor(this.y + env.grid_size / 2);
		},

		/**
		 * 检查如果在当前格子建东西，是否会导致起点与终点被阻塞
		 */
		checkBlock: function () {
			if (this.is_entrance || this.is_exit) {
				this._block_msg = env._t("entrance_or_exit_be_blocked");
				return true;
			}

			var is_blocked,
				that = this,
				fw = new env.FindWay(
					this.map.grid_x, this.map.grid_y,
					this.map.entrance.mx, this.map.entrance.my,
					this.map.exit.mx, this.map.exit.my,
					function (x, y) {
						return !(x == that.mx && y == that.my) && that.map.checkPassable(x, y);
					}
				);

			is_blocked = fw.is_blocked;

			if (!is_blocked) {
				is_blocked = !!this.map.anyMonster(function (obj) {
					return obj.chkIfBlocked(that.mx, that.my);
				});
				if (is_blocked)
					this._block_msg = env._t("monster_be_blocked");
			} else {
				this._block_msg = env._t("blocked");
			}

			return is_blocked;
		},

		/**
		 * 购买建筑
		 * @param tank_type {String}
		 */
		buyTank: function (tank_type) {
			var cost = env.getDefaultTankAttributes(tank_type).cost || 0;
			if (env.money >= cost) {
				env.money -= cost;
				var obj = this.addTank(tank_type);
				obj.combinePic(1);
			} else {
				env.log(env._t("not_enough_money", [cost]));
				this.scene.panel.tip.msg(env._t("not_enough_money", [cost]), this);
			}
		},

		/**
		 * 在当前格子添加指定类型的建筑
		 * @param tank_type {String}
		 */
		addTank: function (tank_type) {
			if (this.tank) {
				// 如果当前格子已经有建筑，先将其移除
				this.removeTank();
			}

			var tank = new env.create_tank("tank-" + tank_type + "-" + env.util.rndStr(), {
				type: tank_type,
				step_level: this.step_level,
				render_level: this.render_level
			});
			tank.locate(this);

			this.scene.addElement(tank, this.step_level, this.render_level + 1);
			this.map.tanks.push(tank);
			this.tank = tank;
			this.build_flag = 2;
			this.map.checkHasWeapon();
			if (this.map.pre_tank)
				this.map.pre_tank.hide();
			return tank;
		},

		/**
		 * 移除当前格子的建筑
		 */
		removeTank: function () {
			if (this.build_flag == 2)
				this.build_flag = 1;
			if (this.tank)
				this.tank.remove();
			this.tank = null;
		},

		/**
		 * 在当前建筑添加一个怪物
		 * @param monster
		 */
		addMonster: function (monster) {
			monster.beAddToGrid(this);
			this.map.monsters.push(monster);
			monster.start();
		},

		/**
		 * 高亮当前格子
		 * @param show {Boolean}
		 */
		hightLight: function (show) {
			this.map.select_hl[show ? "show" : "hide"](this);
		},

		render: function () {
			var ctx = env.ctx,
				px = this.x + 0.5,
				py = this.y + 0.5;

			if (this.map.is_main_map) {
				ctx.drawImage(document.getElementById("map_img"),
					this.x-10, this.y-10, 32, 32, this.x, this.y, 32, 32
				);
			}

			if (this.is_hover) {
				ctx.fillStyle = "rgba(255, 255, 200, 0.2)";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			if (this.passable_flag == 0) {
				// 不可通过
				ctx.fillStyle = "#fcc";
				ctx.beginPath();
				ctx.fillRect(px, py, this.width, this.height);
				ctx.closePath();
				ctx.fill();
			}

			/**
			 * 画入口及出口
			 */
			if (this.is_entrance || this.is_exit) {
				ctx.strokeStyle = "#666";
				ctx.fillStyle = this.is_entrance ? "#fff" : "#666";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, env.grid_size * 0.325, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}

		},

		/**
		 * 鼠标进入当前格子事件
		 */
		onEnter: function () {
			if (this.map.is_main_map && env.mode == "build") {
				if (this.build_flag == 1) {
					this.map.pre_tank.show();
					this.map.pre_tank.locate(this);
				} else {
					this.map.pre_tank.hide();
				}
			} else if (this.map.is_main_map) {
				var msg = "";
				if (this.is_entrance) {
					msg = env._t("entrance");
				} else if (this.is_exit) {
					msg = env._t("exit");
				} else if (this.passable_flag == 0) {
					msg = env._t("_cant_pass");
				} else if (this.build_flag == 0) {
					msg = env._t("_cant_build");
				}

				if (msg) {
					this.scene.panel.tip.msg(msg, this);
				}
			}
		},

		/**
		 * 鼠标移出当前格子事件
		 */
		onOut: function () {
			// 如果当前气球提示指向本格子，将其隐藏
			if (this.scene.panel.tip.el == this) {
				this.scene.panel.tip.hide();
			}
		},

		/**
		 * 鼠标点击了当前格子事件
		 */
		onClick: function () {
			if (this.scene.state != 1) return;

			if (env.mode == "build" && this.map.is_main_map && !this.tank) {
				// 如果处于建设模式下，并且点击在主地图的空格子上，则尝试建设指定建筑
				if (this.checkBlock()) {
					// 起点与终点之间被阻塞，不能修建
					this.scene.panel.tip.msg(this._block_msg, this);
				} else {
					// 购买建筑
					this.buyTank(this.map.pre_tank.type);
				}
			} else if (!this.tank && this.map.selected_tank) {
				// 取消选中建筑
				this.map.selected_tank.toggleSelected();
				this.map.selected_tank = null;
			}
		}
	};

	/**
	 * @param id {String}
	 * @param cfg {object} 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 mx: 在 map 格子中的横向坐标,
	 *			 my: 在 map 格子中的纵向坐标,
	 *			 map: 属于哪个 map,
	 *		 }
	 */
	env.create_grid = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];

		var obj = new env.Object(id, cfg);
		env.util.mix(obj, grid);
		obj._init(cfg);

		return obj;
	};

}); // app.todo.push end
