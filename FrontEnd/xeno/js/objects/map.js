/*
 * Class: map
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	var _default_wait_clearInvalidElements = 20;

	// map 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var map = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.grid_x = cfg.grid_x || 10;
			this.grid_y = cfg.grid_y || 10;
			this.x = cfg.x || 0;
			this.y = cfg.y || 0;
			this.width = this.grid_x * env.grid_size;
			this.height = this.grid_y * env.grid_size;
			this.x2 = this.x + this.width;
			this.y2 = this.y + this.width;
			this.grids = [];
			this.entrance = this.exit = null;
			this.tanks = [];
			this.monsters = [];
			this.bullets = [];
			this.scene = cfg.scene;
			this.is_main_map = !!cfg.is_main_map;
			this.select_hl = env.create_mapSelectHighLight(this.id + "-hl", {
				map: this
			});
			this.select_hl.addToScene(this.scene, 1, 9);
			this.selected_tank = null;
			this._wait_clearInvalidElements = _default_wait_clearInvalidElements;
			this._wait_add_monsters = 0;
			this._wait_add_monsters_arr = [];
			if (this.is_main_map) {
				this.mmm = env.MainMapMask(this.id + "-mmm", {
					map: this
				});
				this.mmm.addToScene(this.scene, 1, 7);

			}

			// 下面添加相应的格子
			var i, l = this.grid_x * this.grid_y,
				grid_data = cfg["grid_data"] || [],
				d, grid;

			for (i = 0; i < l; i ++) {
				d = grid_data[i] || {};
				d.mx = i % this.grid_x;
				d.my = Math.floor(i / this.grid_x);
				d.map = this;
				d.step_level = this.step_level;
				d.render_level = this.render_level;
				grid = new env.create_grid(this.id + "-grid-" + d.mx + "-" + d.my, d);
				this.grids.push(grid);
			}

			if (cfg.entrance && cfg.exit && !env.util.arrayEqual(cfg.entrance, cfg.exit)) {
				this.entrance = this.getGrid(cfg.entrance[0], cfg.entrance[1]);
				this.entrance.is_entrance = true;
				this.exit = this.getGrid(cfg.exit[0], cfg.exit[1]);
				this.exit.is_exit = true;
			}

			var that = this;
			if (cfg.grids_cfg) {
				env.util.each(cfg.grids_cfg, function (obj) {
					var grid = that.getGrid(obj.pos[0], obj.pos[1]);
					if (!grid) return;
					if (!isNaN(obj.passable_flag))
						grid.passable_flag = obj.passable_flag;
					if (!isNaN(obj.build_flag))
						grid.build_flag = obj.build_flag;
					if (obj.tank) {
						var new_tank = grid.addTank(obj.tank);
						new_tank.combinePic(that.is_main_map);
					}
				});
			}
		},

		/**
		 * 检查地图中是否有武器（具备攻击性的建筑）
		 * 因为第一波怪物只有在地图上有了第一件武器后才会出现
		 */
		checkHasWeapon: function () {
			this.has_weapon = (this.anyTank(function (obj) {
				return obj.is_weapon;
			}) != null);
		},

		/**
		 * 取得指定位置的格子对象
		 * @param mx {Number} 地图上的坐标 x
		 * @param my {Number} 地图上的坐标 y
		 */
		getGrid: function (mx, my) {
			var p = my * this.grid_x + mx;
			return this.grids[p];
		},

		anyMonster: function (f) {
			return env.util.any(this.monsters, f);
		},
		anyTank: function (f) {
			return env.util.any(this.tanks, f);
		},
		anyBullet: function (f) {
			return env.util.any(this.bullets, f);
		},
		eachTank: function (f) {
			env.util.each(this.tanks, f);
		},
		eachMonster: function (f) {
			env.util.each(this.monsters, f);
		},
		eachBullet: function (f) {
			env.util.each(this.bullets, f);
		},

		/**
		 * 预建设
		 * @param tank_type {String}
		 */
		preBuild: function (tank_type) {
			env.mode = "build";
			if (this.pre_tank) {
				this.pre_tank.remove();
			}

			this.pre_tank = new env.create_tank(this.id + "-" + "pre-tank-" + env.util.rndStr(), {
				type: tank_type,
				map: this,
				is_pre_tank: true
			});
			this.pre_tank.combinePic();
			this.scene.addElement(this.pre_tank, 1, this.render_level + 1);
			//this.show_all_ranges = true;
		},

		/**
		 * 退出预建设状态
		 */
		cancelPreBuild: function () {
			env.mode = "normal";
			if (this.pre_tank) {
				this.pre_tank.remove();
			}
			//this.show_all_ranges = false;
		},

		/**
		 * 清除地图上无效的元素
		 */
		clearInvalidElements: function () {
			if (this._wait_clearInvalidElements > 0) {
				this._wait_clearInvalidElements --;
				return;
			}
			this._wait_clearInvalidElements = _default_wait_clearInvalidElements;

			var a = [];
			env.util.shift(this.tanks, function (obj) {
				if (obj.valid)
					a.push(obj);
			});
			this.tanks = a;

			a = [];
			env.util.shift(this.monsters, function (obj) {
				if (obj.valid)
					a.push(obj);
			});
			this.monsters = a;

			a = [];
			env.util.shift(this.bullets, function (obj) {
				if (obj.valid)
					a.push(obj);
			});
			this.bullets = a;
		},

		/**
		 * 在地图的入口处添加一个怪物
		 * @param monster 可以是数字，也可以是 monster 对象
		 */
		addMonster: function (monster) {
			if (!this.entrance) return;
			if (typeof monster == "number") {
				monster = new env.create_monster(null, {
					idx: monster,
					difficulty: env.difficulty,
					step_level: this.step_level,
					render_level: this.render_level + 2
				});
			}
			this.entrance.addMonster(monster);
		},

		/**
		 * 在地图的入口处添加 n 个怪物
		 * @param n
		 * @param monster
		 */
		addMonsters: function (n, monster) {
			this._wait_add_monsters = n;
			this._wait_add_monstersidx = monster;
		},

		/**
		 * arr 的格式形如：
		 *	 [[1, 0], [2, 5], [3, 6], [10, 4]...]
		 */
		addMonsters2: function (arr) {
			this._wait_add_monsters_arr = arr;
		},

		/**
		 * 检查地图的指定格子是否可通过
		 * @param mx {Number}
		 * @param my {Number}
		 */
		checkPassable: function (mx, my) {
			var grid = this.getGrid(mx, my);
			return (grid != null && grid.passable_flag == 1 && grid.build_flag != 2);
		},

		step: function () {
			this.clearInvalidElements();

			if (this._wait_add_monsters > 0) {
				this.addMonster(this._wait_add_monstersidx);
				this._wait_add_monsters --;
			} else if (this._wait_add_monsters_arr.length > 0) {
				var a = this._wait_add_monsters_arr.shift();
				this.addMonsters(a[0], a[1]);
			}
		},

		render: function () {
			var ctx = env.ctx;
			ctx.strokeStyle = "#99a";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.strokeRect(this.x + 0.5, this.y + 0.5, this.width, this.height);
			ctx.closePath();
			ctx.stroke();
		},

		/**
		 * 鼠标移出地图事件
		 */
		onOut: function () {
			if (this.is_main_map && this.pre_tank)
				this.pre_tank.hide();
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 grid_x: 宽度（格子）,
	 *			 grid_y: 高度（格子）,
	 *			 scene: 属于哪个场景,
	 *		 }
	 */
	env.create_map = function (id, cfg) {
		// map 目前只需要监听 out 事件
		// 虽然只需要监听 out 事件，但同时也需要监听 enter ，因为如果
		// 没有 enter ，out 将永远不会被触发
		cfg.on_events = ["enter", "out"];
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, map);
		obj._init(cfg);

		return obj;
	};



}); // app.todo.push end

