/*
 * Class: tank
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	// tank 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var tank = {
		_init: function (cfg) {
			this.is_selected = false;
			this.level = 0;
			this.killed = 0; // 当前建筑杀死了多少怪物
			this.target = null;
			this.onfire = 9;
			cfg = cfg || {};
			this.map = cfg.map || null;
			this.grid = cfg.grid || null;
			this.dtime = 0;
			this.dchance = 0;
			this.ftime = 0;
			this.fchance = 0;
			/**
			 * 子弹类型，可以有以下类型：
			 *		 1：普通子弹
			 *		 2：激光类，发射后马上命中，暂未实现
			 *		 3：导弹类，击中后会爆炸，带来面攻击，暂未实现
			 */
			this.bullet_type = cfg.bullet_type || 1;

			/**
			 * type 可能的值有：
			 *		 "wall": 墙壁，没有攻击性
			 *		 "cannon": 炮台
			 *		 "LMG": 轻机枪
			 *		 "HMG": 重机枪
			 *		 "laser_gun": 激光枪
			 *
			 */
			this.type = cfg.type;
			if (this.type == 'frozen') {
				this.ftime = 200;
				this.fchance = 0.3;
			}
			if (this.type == 'ball') {
				this.dtime = 100;
				this.dchance = 0.3;
			}
			this.speed = cfg.speed;
			this.bullet_speed = cfg.bullet_speed;
			this.is_pre_tank = !!cfg.is_pre_tank;
			this.blink = this.is_pre_tank;
			this.wait_blink = this._default_wait_blink = 20;
			this.is_weapon = (this.type != "wall"); // 墙等不可攻击的建筑此项为 false ，其余武器此项为 true

			var o = env.getDefaultTankAttributes(this.type);
			env.util.mix(this, o);
			this.range_px = this.range * env.grid_size;
			this.money = this.cost; // 购买、升级本建筑已花费的钱

			this.calculatePos();
		},

		/**
		 * 升级本建筑需要的花费
		 */
		getUpgradeCost: function () {
			return Math.floor(this.money * 0.75);
		},

		/**
		 * 出售本建筑能得到多少钱
		 */
		getSellMoney: function () {
			return Math.floor(this.money * 0.5) || 1;
		},

		combinePic: function(is_main) {
			if (is_main==null || is_main)
				this.pic = "tanks_";
			else
				this.pic = "types_";
			if (this.type == "cannon")
				this.pic += '2';
			else if (this.type == "LMG")
				this.pic += '1';
			else if (this.type == 'frozen')
				this.pic += '3';
			else if (this.type == 'HMG')
				this.pic += '4'
			else if (this.type == 'ball')
				this.pic += '5'
			else if (this.type != 'wall')
				this.pic += '6';
			else this.pic += '7';
		},

		/**
		 * 切换选中 / 未选中状态
		 */
		toggleSelected: function () {
			this.is_selected = !this.is_selected;
			this.grid.hightLight(this.is_selected); // 高亮
			var that = this;

			if (this.is_selected) {
				// 如果当前建筑被选中

				this.map.eachTank(function (obj) {
					obj.is_selected = obj == that;
				});
				// 取消另一个地图中选中建筑的选中状态
				(
					this.map.is_main_map ? this.scene.panel_map : this.scene.map
					).eachTank(function (obj) {
						obj.is_selected = false;
						obj.grid.hightLight(false);
				});
				this.map.selected_tank = this;

				if (!this.map.is_main_map) {
					// 在面版地图中选中了建筑，进入建筑模式
					this.scene.map.preBuild(this.type);
				} else {
					// 取消建筑模式
					this.scene.map.cancelPreBuild();
				}

			} else {
				// 如果当前建筑切换为未选中状态

				if (this.map.selected_tank == this)
					this.map.selected_tank = null;

				if (!this.map.is_main_map) {
					// 取消建筑模式
					this.scene.map.cancelPreBuild();
				}
			}

			// 如果是选中 / 取消选中主地图上的建筑，显示 / 隐藏对应的操作按钮
			if (this.map.is_main_map) {
				if (this.map.selected_tank) {
					this.scene.panel.btn_upgrade.show();
					this.scene.panel.btn_sell.show();
					this.updateBtnDesc();
				} else {
					this.scene.panel.btn_upgrade.hide();
					this.scene.panel.btn_sell.hide();
				}
			}
		},

		/**
		 * 生成、更新升级按钮的说明文字
		 */
		updateBtnDesc: function () {
			this.scene.panel.btn_upgrade.desc = env._t(
				"upgrade", [
				env._t("tank_name_" + this.type),
				this.level + 1,
				this.getUpgradeCost()
			]);
			this.scene.panel.btn_sell.desc = env._t(
				"sell", [
				env._t("tank_name_" + this.type),
				this.getSellMoney()
			]);
		},

		/**
		 * 将本建筑放置到一个格子中
		 * @param grid {Element} 指定格子
		 */
		locate: function (grid) {
			this.grid = grid;
			this.map = grid.map;
			this.cx = this.grid.cx;
			this.cy = this.grid.cy;
			this.x = this.grid.x;
			this.y = this.grid.y;
			this.x2 = this.grid.x2;
			this.y2 = this.grid.y2;
			this.width = this.grid.width;
			this.height = this.grid.height;

			this.px = this.x + 0.5;
			this.py = this.y + 0.5;

			this.wait_blink = this._default_wait_blink;
			this._fire_wait = Math.floor(Math.max(2 / (this.speed * env.global_speed), 1));
			this._fire_wait2 = this._fire_wait;

		},

		/**
		 * 将本建筑彻底删除
		 */
		remove: function () {
//			env.log("remove tank #" + this.id + ".");
			if (this.grid && this.grid.tank && this.grid.tank == this)
				this.grid.tank = null;
			this.hide();
			this.del();
		},

		/**
		 * 寻找一个目标（怪物）
		 */
		findTaget: function () {
			if (!this.is_weapon || this.is_pre_tank || !this.grid) return;

			var cx = this.cx, cy = this.cy,
				range2 = Math.pow(this.range_px, 2);

			// 如果当前建筑有目标，并且目标还是有效的，并且目标仍在射程内
			if (this.target && this.target.valid &&
				Math.pow(this.target.cx - cx, 2) + Math.pow(this.target.cy - cy, 2) <= range2)
				return;

			// 在进入射程的怪物中寻找新的目标
			this.target = env.util.any(
				env.util.rndSort(this.map.monsters), // 将怪物随机排序
				function (obj) {
					return Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= range2;
			});
		},

		/**
		 * 取得目标的坐标（相对于地图左上角）
		 */
		getTargetPosition: function () {
			if (!this.target) {
				// 以 entrance 为目标
				var grid = this.map.is_main_map ? this.map.entrance : this.grid;
				return [grid.cx, grid.cy];
			}
			return [this.target.cx, this.target.cy];
		},

		/**
		 * 向自己的目标开火
		 */
		fire: function () {
			if (!this.target || !this.target.valid) return;
			switch(this.type)
			{
			case "cannon":				
				var audio = document.getElementById("cannon"); 
				audio.play();
				break;
			case "LMG":				
				var audio = document.getElementById("LMG"); 
				audio.play();
				break;
			case "HMG":				
				var audio = document.getElementById("HMG"); 
				audio.play();
				break;	
			case "ball":				
				var audio = document.getElementById("ball"); 
				audio.play();
				break;	
			case "frozen":				
				var audio = document.getElementById("frozen"); 
				audio.play();
				break;	
			case "laser_gun":				
				var audio = document.getElementById("laser_gun"); 
				audio.play();
				break;					
			}
			if (this.type == "laser_gun" || this.type == 'LMG') {
				// 如果是激光枪，目标立刻被击中
				this.target.beHit(this, this.damage);
				if (this.type == 'LMG')
					this.onfire = 1;
				return;
			} else
			if (this.type == 'ball')
			{
				var range2 = Math.pow(this.range_px, 2), cx = this.cx, cy = this.cy,
				that = this;
				this.map.anyMonster(function (obj) {
					if (Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= range2) {
						if (Math.random() < that.dchance) {
							obj.dtime += that.dtime;
						}
						obj.beHit(that, that.damage);
					}
				});
   				return;
			}

			var muzzle = this.muzzle || [this.cx, this.cy], // 炮口的位置
				cx = muzzle[0],
				cy = muzzle[1];

			new env.create_bullet(null, {
				tank: this,
				damage: this.damage,
				target: this.target,
				speed: this.bullet_speed,
				x: cx,
				y: cy
			});
		},

		tryToFire: function () {
			if (!this.is_weapon || !this.target)
				return;

			this._fire_wait --;
			if (this._fire_wait > 0) {
//			return;
			} else if (this._fire_wait < 0) {
				this._fire_wait = this._fire_wait2;
			} else {
				this.fire();
			}
		},

		_upgrade2: function (k) {
			if (!this._upgrade_records[k])
				this._upgrade_records[k] = this[k];
			var v = this._upgrade_records[k],
				mk = "max_" + k,
				uk = "_upgrade_rule_" + k,
				uf = this[uk] || env.default_upgrade_rule;
			if (!v || isNaN(v)) return;

			v = uf(this.level, v);
			if (this[mk] && !isNaN(this[mk]) && this[mk] < v)
				v = this[mk];
			this._upgrade_records[k] = v;
			this[k] = v;
		},

		/**
		 * 升级建筑
		 */
		upgrade: function () {
			if (!this._upgrade_records)
				this._upgrade_records = {};

			var attrs = [
				// 可升级的变量
				"damage", "range", "speed", "life", "shield", "ftime", "fchance", "dtime", "dchance"
			], i, l = attrs.length;
			for (i = 0; i < l; i ++)
				this._upgrade2(attrs[i]);
			this.level ++;
			this.range_px = this.range * env.grid_size;
			this.damage = this._upgrade_records['damage'];
			this.range = this._upgrade_records['range'];
			this.speed = this._upgrade_records['speed'];
			this.life = this._upgrade_records['life'];
			this.shield = this._upgrade_records['shield'];
		},

		tryToUpgrade: function (btn) {
			var cost = this.getUpgradeCost(),
				msg = "";
			if (cost > env.money) {
				msg = env._t("not_enough_money", [cost]);
			} else {
				env.money -= cost;
				this.money += cost;
				this.upgrade();
				msg = env._t("upgrade_success", [
					env._t("tank_name_" + this.type), this.level,
					this.getUpgradeCost()
				]);
			}

			this.updateBtnDesc();
			this.scene.panel.tip.msg(msg, btn);
		},

		tryToSell: function () {
			if (!this.valid) return;

			env.money += this.getSellMoney();
			this.grid.removeTank();
			this.valid = false;
			this.map.selected_tank = null;
			this.map.select_hl.hide();
			this.map.checkHasWeapon();
			this.scene.panel.btn_upgrade.hide();
			this.scene.panel.btn_sell.hide();
			this.scene.panel.tip.hide();
		},

		step: function () {
			if (this.blink) {
				this.wait_blink --;
				if (this.wait_blink < -this._default_wait_blink)
					this.wait_blink = this._default_wait_blink;
			}

			this.findTaget();
			this.tryToFire();
		},

		render: function () {
			if (!this.visiable || this.wait_blink < 0) return;

			var ctx = env.ctx;

			env.renderTank(this);

			if (
				this.map.is_main_map &&
				(
					this.is_selected || (this.is_pre_tank) ||
					this.map.show_all_ranges
				) &&
				this.is_weapon && this.range > 0 && this.grid
				) {
				// 画射程
				ctx.lineWidth = 1;
				ctx.fillStyle = "rgba(187, 141, 32, 0.15)";
				ctx.strokeStyle = "#bb8d20";
				ctx.beginPath();
				ctx.arc(this.cx, this.cy, this.range_px, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}

			if (this.type == "laser_gun" && this.target && this.target.valid) {
				// 画激光
				ctx.lineWidth = 3;
				ctx.strokeStyle = "rgba(200, 50, 100, 0.5)";
				ctx.beginPath();
				ctx.moveTo(this.cx, this.cy);
				ctx.lineTo(this.target.cx, this.target.cy);
				ctx.closePath();
				ctx.stroke();
				ctx.lineWidth = 1;
				ctx.strokeStyle = "rgba(150, 150, 255, 0.5)";
				ctx.beginPath();
				ctx.lineTo(this.cx, this.cy);
				ctx.closePath();
				ctx.stroke();
			} else 
			if (this.type == 'ball' && this.target && this.target.valid) {
				if (!this.explode || this.explode.valid == false) {
					obj = env.create_explode(this.id + "-explode", {
						cx: this.cx-24,
						cy: this.cy-24,
						r: this.r,
						step_level: this.step_level,
						render_level: this.render_level - 1,
						color: this.color,
						scene: this.map.scene,
						time: 0.2
					});
					obj.wait = 24;
					obj.type = 'ball';	
					this.explode = obj;				
				}
			}
		},

		onEnter: function () {
			if (this.is_pre_tank) return;

			var msg = "建筑工事";
			if (this.map.is_main_map) {
				msg = env._t("tank_info" + (this.type == "wall" ? "_wall" : ""), [env._t("tank_name_" + this.type), this.level, this.damage, this.speed, this.range, this.killed]);
			} else {
				msg = env._t("tank_intro_" + this.type, [env.getDefaultTankAttributes(this.type).cost]);
			}

			this.scene.panel.tip.msg(msg, this.grid);
		},

		onOut: function () {
			if (this.scene.panel.tip.el == this.grid) {
				this.scene.panel.tip.hide();
			}
		},

		onClick: function () {
			if (this.is_pre_tank || this.scene.state != 1) return;
			this.toggleSelected();
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 type: 建筑类型，可选的值有
	 *				 "wall"
	 *				 "cannon"
	 *				 "LMG"
	 *				 "HMG"
	 *				 "laser_gun"
	 *		 }
	 */
	env.create_tank = function (id, cfg) {
		cfg.on_events = ["enter", "out", "click"];
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, tank);
		obj._init(cfg);

		return obj;
	};

}); // app.todo.push end

