/*
 * Util: render object
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/
app.todo.push(function (env) {
	// bullet 对象的属性、方法。注意属性中不要有数组、对象等
	// 引用属性，否则多个实例的相关属性会发生冲突
	var bullet = {
		frame: -10,
		_init: function (cfg) {
			cfg = cfg || {};

			this.speed = cfg.speed;
			this.damage = cfg.damage;
			this.target = cfg.target;
			this.cx = cfg.x;
			this.cy = cfg.y;
			this.r = cfg.r || Math.max(Math.log(this.damage), 2);
			if (this.r < 1) this.r = 1;
			if (this.r > 6) this.r = 6;

			this.tank = cfg.tank || null;
			this.map = cfg.map || this.tank.map;
			this.type = cfg.type || 1;
			this.color = cfg.color || "#000";

			this.map.bullets.push(this);
			this.addToScene(this.map.scene, 1, 6);

			if (this.type == 1) {
				this.calculate();
			}
		},

		/**
		 * 计算子弹的一些数值
		 */
		calculate: function () {
			if (!this.target || !this.target.valid)
				return;
			var sx, sy, c,
				tx = this.target.cx,
				ty = this.target.cy,
				speed;
			sx = tx - this.cx;
			sy = ty - this.cy;
			c = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2)),
				speed = 20 * this.speed * env.global_speed,
				this.vx = sx * speed / c,
				this.vy = sy * speed / c;
		},

		/**
		 * 检查当前子弹是否已超出地图范围
		 */
		checkOutOfMap: function () {
			this.valid = !(
				this.cx < this.map.x ||
					this.cx > this.map.x2 ||
					this.cy < this.map.y ||
					this.cy > this.map.y2
				);

			return !this.valid;
		},

		/**
		 * 检查当前子弹是否击中了怪物
		 */
		checkHit: function () {
			var cx = this.cx,
				cy = this.cy,
				r = this.r,
				monster = this.map.anyMonster(function (obj) {
					return Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= Math.pow(obj.r + r, 2) * 2;
				});

			if (monster) {
				// 击中的怪物
				monster.beHit(this.tank, this.damage);
				this.valid = false;

				if (this.tank.type == 'HMG') {
					obj = env.create_explode(this.id + "-explode", {
						cx: monster.cx,
						cy: monster.cy,
						r: this.r,
						step_level: this.step_level,
						render_level: this.render_level,
						color: this.color,
						scene: this.map.scene,
						time: 0.2
					});
					var range2 = 800 * Math.pow(1.3, this.tank.level), cx = this.cx, cy = this.cy, damage = this.damage;
					if (range2 > 2000)
						range2 = 2000;
					that = this.tank;
					this.tank.map.anyMonster(function (obj) {
						if (Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= range2) {
							obj.beHit(that, damage*0.7);
						}
					});
					obj.wait = 10;
					obj.type = 'explode';
				} else
				if (this.tank.type == 'frozen') {
					obj = env.create_explode(this.id + "-explode", {
						cx: monster.cx - 10,
						cy: monster.cy - 10,
						r: this.r,
						step_level: this.step_level,
						render_level: this.render_level,
						color: this.color,
						scene: this.map.scene,
						time: 0.2
					});
					obj.wait = 14;
					obj.type = 'frozen';					
					var range2 = 800 * Math.pow(1.3, this.tank.level), cx = this.cx, cy = this.cy, damage = this.damage;
					if (range2 > 2000)
						range2 = 2000;
					that = this.tank;
					this.tank.map.anyMonster(function (obj) {
						if (Math.pow(obj.cx - cx, 2) + Math.pow(obj.cy - cy, 2) <= range2) {
							obj.beHit(that, damage*0.2);
							if (that.type == 'frozen' && Math.random() < that.fchance) {
								obj.ftime += that.ftime;
							}
						}
					});
				}
				return true;
			}
			return false;
		},

		step: function () {
			if (this.checkOutOfMap() || this.checkHit()) return;
			this.calculate();
			this.cx += this.vx;
			this.cy += this.vy;
		},

		render: function () {
			var ctx = env.ctx;
			if (this.tank.type == 'HMG') {
				angle = Math.atan2(this.vy, this.vx);
				ctx.translate(this.cx, this.cy+5);
				ctx.rotate(angle);
				ctx.drawImage(document.getElementById("bullet2"),0,0);
				ctx.rotate(-angle);
				ctx.translate(-this.cx, -this.cy-5);
			} else {
				this.frame = this.frame++;
				if (this.frame == 11)
					this.frame = -10;
				var i = 1;
				if (this.frame > 0)
					i = 2;
				ctx.drawImage(document.getElementById("bullet1_"+i),this.cx-32,this.cy-32);
			}
		}
	};

	/**
	 * @param cfg <object> 配置对象
	 *		 至少需要包含以下项：
	 *		 {
	 *			 x: 子弹发出的位置
	 *			 y: 子弹发出的位置
	 *			 speed:
	 *			 damage:
	 *			 target: 目标，一个 monster 对象
	 *			 tank: 所属的建筑
	 *		 }
	 * 子弹类型，可以有以下类型：
	 *		 1：普通子弹
	 *		 2：激光类，发射后马上命中
	 *		 3：导弹类，击中后会爆炸，带来面攻击
	 */
	env.create_bullet = function (id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, bullet);
		obj._init(cfg);

		return obj;
	};
});
