/*
 * Class: monster
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/
app.todo.push(function (env) {

	// monster 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var monster = {
		_init: function (cfg) {
			cfg = cfg || {};
			this.ftime = 0;
			this.dtime = 0;
			this.stop_time = 0;
			this.frame = 1;
			this.vec = 1;
			this.angle = 0;
			this.is_monster = true;
			this.idx = cfg.idx || 1;
			this.difficulty = cfg.difficulty || 1.0;
			var attr = env.getDefaultMonsterAttributes(this.idx);
			this.pic = attr.pic;

			this.speed = Math.floor(
				(attr.speed + this.difficulty / 2) * (Math.random() * 0.5 + 0.75)
			);
			if (this.speed < 1) this.speed = 1;
			if (this.speed > cfg.max_speed) this.speed = cfg.max_speed;

			this.life = this.life0 = Math.floor(
				attr.life * (this.difficulty + 1) * (Math.random() + 0.5) * 0.5
			);
			if (this.life < 1) this.life = this.life0 = 1;

			this.shield = Math.floor(attr.shield + this.difficulty / 2);
			if (this.shield < 0) this.shield = 0;

			this.damage = Math.floor(
				(attr.damage || 1) * (Math.random() * 0.5 + 0.75)
			);
			if (this.damage < 1) this.damage = 1;

			this.money = attr.money || Math.floor(
				Math.sqrt((this.speed + this.life) * (this.shield + 1) * this.damage)
			);
			if (this.money < 1) this.money = 1;

			this.color = attr.color || env.util.rndRGB();
			this.r = Math.floor(this.damage * 1.2);
			if (this.r < 4) this.r = 4;
			if (this.r > env.grid_size / 2 - 4) this.r = env.grid_size / 2 - 4;

			this.grid = null; // 当前格子
			this.map = null;
			this.next_grid = null;
			this.way = [];
			this.toward = 2; // 默认面朝下方
			this._dx = 0;
			this._dy = 0;

			this.is_blocked = false; // 前进的道路是否被阻塞了
		},
		calculatePos: function () {
//		if (!this.map) return;
			var r = this.r;
			this.x = this.cx - r;
			this.y = this.cy - r;
			this.x2 = this.cx + r;
			this.y2 = this.cy + r;
		},

		/**
		 * 怪物被击中
		 * @param tank {Element} 对应的建筑（武器）
		 * @param damage {Number} 本次攻击的原始伤害值
		 */
		beHit: function (tank, damage) {
			if (!this.valid) return;
			var min_damage = Math.ceil(damage * 0.1);
			damage -= this.shield;
			if (damage <= min_damage) damage = min_damage;

			this.life -= damage;
			env.score += Math.floor(Math.sqrt(damage));
			if (this.life <= 0) {
				this.beKilled(tank);
			}

			var tip = this.scene.panel.tip;
			if (tip.el == this) {
				tip.text = env._t("monster_info", [this.life, this.shield, this.speed, this.damage]);
			}

		},

		/**
		 * 怪物被杀死
		 * @param tank {Element} 对应的建筑（武器）
		 */
		beKilled: function (tank) {

			switch(this.pic)
			{
			case 1:				
				var audio = document.getElementById("monster1"); 
				audio.pause();
				break;
			case 2:				
				var audio = document.getElementById("monster2"); 
				audio.pause();
				break;
			case 3:				
				var audio = document.getElementById("monster3"); 
				audio.pause();
				break;	
			case 4:				
				var audio = document.getElementById("monster4"); 
				audio.pause();
				break;	
			case 5:				
				var audio = document.getElementById("monster5"); 
				audio.pause();
				break;	
			case 6:				
				var audio = document.getElementById("monster6"); 
				audio.pause();
				break;	
			case 7:				
				var audio = document.getElementById("monster7"); 
				audio.pause();
				break;	
			case 8:				
				var audio = document.getElementById("monster8"); 
				audio.pause();
				break;
			case 9:				
				var audio = document.getElementById("monster9"); 
				audio.pause();
				break;
			case 10:				
				var audio = document.getElementById("monster10"); 
				audio.pause();
				break;	
			case 11:				
				var audio = document.getElementById("monster11"); 
				audio.pause();
				break;	
			case 12:				
				var audio = document.getElementById("monster12"); 
				audio.pause();
				break;	
			case 13:				
				var audio = document.getElementById("monster13"); 
				audio.pause();
				break;	
			case 14:				
				var audio = document.getElementById("monster14"); 
				audio.pause();
				break;	
			}			
			if (!this.valid) return;
			this.life = 0;
			this.valid = false;

			env.money += this.money;
			tank.killed ++;

			obj = env.create_explode(this.id + "-explode", {
				cx: this.cx,
				cy: this.cy,
				color: this.color,
				r: this.r,
				step_level: this.step_level,
				render_level: this.render_level,
				scene: this.grid.scene
			});
			obj.wait = 12,
			obj.type = 'dead';
		},
		arrive: function () {
			this.grid = this.next_grid;
			this.next_grid = null;
			this.checkFinish();
		},
		findWay: function () {
			var that = this;
			var fw = new env.FindWay(
				this.map.grid_x, this.map.grid_y,
				this.grid.mx, this.grid.my,
				this.map.exit.mx, this.map.exit.my,
				function (x, y) {
					return that.map.checkPassable(x, y);
				}
				);
			this.way = fw.way;
			delete fw;
		},

		/**
		 * 检查是否已到达终点
		 */
		checkFinish: function () {
			if (this.grid && this.map && this.grid == this.map.exit) {
				env.life -= this.damage;
				env.wave_damage += this.damage;
				if (env.life <= 0) {
					env.life = 0;
					env.stage.gameover();
					var audio = document.getElementById("lose"); 
					audio.play();
				} else {	
					var audio = document.getElementById("Crash"); 
					audio.play();					
					switch(this.pic)
					{
					case 1:				
						var audio = document.getElementById("monster1"); 
						audio.pause();
						break;
					case 2:				
						var audio = document.getElementById("monster2"); 
						audio.pause();
						break;
					case 3:				
						var audio = document.getElementById("monster3"); 
						audio.pause();
						break;	
					case 4:				
						var audio = document.getElementById("monster4"); 
						audio.pause();
						break;	
					case 5:				
						var audio = document.getElementById("monster5"); 
						audio.pause();
						break;	
					case 6:				
						var audio = document.getElementById("monster6"); 
						audio.pause();
						break;	
					case 7:				
						var audio = document.getElementById("monster7"); 
						audio.pause();
						break;	
					case 8:				
						var audio = document.getElementById("monster8"); 
						audio.pause();
						break;
					case 9:				
						var audio = document.getElementById("monster9"); 
						audio.pause();
						break;
					case 10:				
						var audio = document.getElementById("monster10"); 
						audio.pause();
						break;	
					case 11:				
						var audio = document.getElementById("monster11"); 
						audio.pause();
						break;	
					case 12:				
						var audio = document.getElementById("monster12"); 
						audio.pause();
						break;	
					case 13:				
						var audio = document.getElementById("monster13"); 
						audio.pause();
						break;	
					case 14:				
						var audio = document.getElementById("monster14"); 
						audio.pause();
						break;	
					}										
					this.pause();
					this.del();
				}
			}
		},
		beAddToGrid: function (grid) {
			this.grid = grid;
			this.map = grid.map;
			this.cx = grid.cx;
			this.cy = grid.cy;

			this.grid.scene.addElement(this);
			
		},

		/**
		 * 取得朝向
		 * 即下一个格子在当前格子的哪边
		 *	 0：上；1：右；2：下；3：左
		 */
		getToward: function () {
			if (!this.grid || !this.next_grid) return;
			if (this.grid.my < this.next_grid.my) {
				this.toward = 0;
			} else if (this.grid.mx < this.next_grid.mx) {
				this.toward = 1;
			} else if (this.grid.my > this.next_grid.my) {
				this.toward = 2;
			} else if (this.grid.mx > this.next_grid.mx) {
				this.toward = 3;
			}
		},

		/**
		 * 取得要去的下一个格子
		 */
		getNextGrid: function () {
			this.findWay();

			var next_grid = this.way.shift();
			if (next_grid && !this.map.checkPassable(next_grid[0], next_grid[1])) {
				this.findWay();
				next_grid = this.way.shift();
			}

			if (!next_grid) {
				return;
			}

			this.next_grid = this.map.getGrid(next_grid[0], next_grid[1]);
//			this.getToward(); // 在这个版本中暂时没有用
		},

		/**
		 * 检查假如在地图 (x, y) 的位置修建建筑，是否会阻塞当前怪物
		 * @param mx {Number} 地图的 x 坐标
		 * @param my {Number} 地图的 y 坐标
		 * @return {Boolean}
		 */
		chkIfBlocked: function (mx, my) {

			var that = this,
				fw = new env.FindWay(
					this.map.grid_x, this.map.grid_y,
					this.grid.mx, this.grid.my,
					this.map.exit.mx, this.map.exit.my,
					function (x, y) {
						return !(x == mx && y == my) &&
							that.map.checkPassable(x, y);
					}
				);

			return fw.is_blocked;

		},

		render: function() {
			var up = 20;
			if (this.pic <= 3)
				up = 15;
			if (this.frame + this.vec > up || this.frame + this.vec < 1)
				this.vec = -this.vec;
			this.frame += this.vec;
			var ctx = env.ctx;
			ctx.translate(this.cx, this.cy);
			ctx.rotate(this.angle * Math.PI);
			ctx.drawImage(document.getElementById('monster_img'), 32*(this.pic-1),32*(Math.floor((this.frame-1)/5)),32,32,-16,-16,32,32);
			ctx.rotate(-this.angle * Math.PI);
			ctx.translate(-this.cx, -this.cy);
			if (env.show_monster_life) {
				var s = Math.floor(env.grid_size / 4),
				l = s * 2 - 2;
				ctx.fillStyle = "#000";
				ctx.beginPath();
				ctx.fillRect(this.cx - s, this.cy - this.r - 6, s * 2, 4);
				ctx.closePath();
				ctx.fillStyle = "#f00";
				ctx.beginPath();
				ctx.fillRect(this.cx - s + 1, this.cy - this.r - 5, this.life * l / this.life0, 2);
				ctx.closePath();
			}
		},

		/**
		 * 怪物前进的道路被阻塞（被建筑包围了）
		 */
		beBlocked: function () {
			if (this.is_blocked) return;

			this.is_blocked = true;
			env.log("monster be blocked!");
		},

		step: function () {
			if (!this.valid || this.is_paused || !this.grid) return;
			if (this.dtime > 0)
				this.dtime--;
			if (this.ftime > 0)
				this.ftime--;
			if (this.dtime) {
				return;
			}
			if (!this.next_grid) {
				this.getNextGrid();
				/**
				 * 如果依旧找不着下一步可去的格子，说明当前怪物被阻塞了
				 */
				if (!this.next_grid) {
					this.beBlocked();
					return;
				}
			}

			if (this.cx == this.next_grid.cx && this.cy == this.next_grid.cy) {
				this.arrive();
			} else {
				// 移动到 next grid

				switch(this.pic)
				{
				case 1:				
					var audio = document.getElementById("monster1"); 
					audio.play();
					break;
				case 2:				
					var audio = document.getElementById("monster2"); 
					audio.play();
					break;
				case 3:				
					var audio = document.getElementById("monster3"); 
					audio.play();
					break;	
				case 4:				
					var audio = document.getElementById("monster4"); 
					audio.play();
					break;	
				case 5:				
					var audio = document.getElementById("monster5"); 
					audio.play();
					break;	
				case 6:				
					var audio = document.getElementById("monster6"); 
					audio.play();
					break;	
				case 7:				
					var audio = document.getElementById("monster7"); 
					audio.play();
					break;	
				case 8:				
					var audio = document.getElementById("monster8"); 
					audio.play();
					break;
				case 9:				
					var audio = document.getElementById("monster9"); 
					audio.play();
					break;
				case 10:				
					var audio = document.getElementById("monster10"); 
					audio.play();
					break;	
				case 11:				
					var audio = document.getElementById("monster11"); 
					audio.play();
					break;	
				case 12:				
					var audio = document.getElementById("monster12"); 
					audio.play();
					break;	
				case 13:				
					var audio = document.getElementById("monster13"); 
					audio.play();
					break;	
				case 14:				
					var audio = document.getElementById("monster14"); 
					audio.play();
					break;	
				}
				var dpx = this.next_grid.cx - this.cx,
					dpy = this.next_grid.cy - this.cy,
					sx = dpx < 0 ? -1 : 1,
					sy = dpy < 0 ? -1 : 1,
					speed = this.speed * env.global_speed;
				if (this.ftime)
					speed = speed * 0.8;

				if (Math.abs(dpx) < speed && Math.abs(dpy) < speed) {
					this.cx = this.next_grid.cx;
					this.cy = this.next_grid.cy;
					this._dx = speed - Math.abs(dpx);
					this._dy = speed - Math.abs(dpy);
				} else {
					var vx = dpx == 0 ? 0 : sx * (speed + this._dx);
					var vy = dpy == 0 ? 0 : sy * (speed + this._dy);
					this.cx += vx * (speed + this._dx);
					this.cy += vy * (speed + this._dy);
					this._dx = 0;
					this._dy = 0;
					this.angle = Math.atan2(-vy, vx);
				}
			}

			this.calculatePos();
		},

		onEnter: function () {
			var msg,
				tip = this.scene.panel.tip;

			if (tip.el == this) {
				tip.hide();
				tip.el = null;
			} else {
				msg = env._t("monster_info",
					[this.life, this.shield, this.speed, this.damage]);
				tip.msg(msg, this);
			}
		},

		onOut: function () {
//			if (this.scene.panel.tip.el == this) {
//				this.scene.panel.tip.hide();
//			}
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
	env.create_monster = function (id, cfg) {
		cfg.on_events = ["enter", "out"];
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, monster);
		obj._init(cfg);

		return obj;
	};


}); // app.todo.push end


