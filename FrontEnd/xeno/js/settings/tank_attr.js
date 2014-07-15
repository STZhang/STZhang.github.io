/*
 * Util: tank attributes
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/
app.todo.push(function (env) {

	/**
	 * 默认的升级规则
	 * @param old_level {Number}
	 * @param old_value {Number}
	 * @return new_value {Number}
	 */
	env.default_upgrade_rule = function (old_level, old_value) {
		return old_value * 1.2;
	};

	/**
	 * 取得建筑的默认属性
	 * @param tank_type {String} 建筑类型
	 */
	env.getDefaultTankAttributes = function (tank_type) {

		var tank_attributes = {
			// 路障
			"wall": {
				damage: 0,
				range: 0,
				speed: 0,
				bullet_speed: 0,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				life: 100,
				shield: 500,
				cost: 5
			},

			// 炮台
			"cannon": {
				damage: 12,
				range: 4,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				max_range: 8,
				speed: 3,
				bullet_speed: 6,
				life: 100,
				shield: 100,
				cost: 100,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.4;
				}
			},

			// 轻机枪
			"LMG": {
				damage: 10,
				range: 5,
				max_range: 10,
				speed: 2,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				bullet_speed: 6,
				life: 100,
				shield: 50,
				cost: 25,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.2;
				}
			},

			// 重机枪
			"HMG": {
				damage: 30,
				range: 5,
				max_range: 10,
				speed: 1,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				bullet_speed: 2,
				life: 100,
				shield: 200,
				cost: 80,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.3;
				}
			},

			"ball": {
				damage: 15,
				range: 1.5,
				max_range: 1.6,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				speed: 0.9,
				bullet_speed: 0,
				life: 100,
				shield: 200,
				cost: 120,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.3;
				}
			},

			"frozen": {
				damage: 10,
				range: 2.2,
				max_range: 3.0,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 1.0,
				speed: 0.9,
				bullet_speed: 2,
				life: 100,
				shield: 200,
				cost: 1000,
				_upgrade_rule_damage: function (old_level, old_value) {
					return old_value * 1.3;
				}
			},

			// 激光枪
			"laser_gun": {
				damage: 25,
				range: 6,
				max_range: 10,
				speed: 20,
				max_ftime: 2000,
				max_fchance: 0.8,
				max_dtime: 200,
				max_dchance: 0.8,
				life: 100,
				shield: 100,
				cost: 1500
			}
		};

		return tank_attributes[tank_type] || {};
	};

}); // app.todo.push end
