/*
 * Util: translator
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {

	env.translation_table = {
		"_cant_build": "不能在这儿修建",
		"_cant_pass": "怪物不能通过这儿",
		"entrance": "起点",
		"exit": "终点",
		"not_enough_money": "金钱不足，需要 $${0}！",
		"wave_info": "第 ${0} 波",
		"panel_money_title": "金钱: ",
		"panel_score_title": "积分: ",
		"panel_life_title": "生命: ",
		"panel_tank_title": "建筑: ",
		"panel_monster_title": "怪物: ",
		"tank_name_wall": "路障",
		"tank_name_cannon": "炮台",
		"tank_name_LMG": "轻机枪",
		"tank_name_HMG": "重机枪",
		"tank_name_frozen": "冰冻枪",
		"tank_name_ball": "晕眩球",
		"tank_name_laser_gun": "激光炮",
		"tank_info": "${0}: 等级 ${1}，攻击 #{2}，速度 #{3}，射程 #{4}，战绩 ${5}",
		"tank_info_wall": "${0}",
		"tank_intro_wall": "路障 可以阻止怪物通过 ($${0})",
		"tank_intro_cannon": "炮台 射程、杀伤力较为平衡 ($${0})",
		"tank_intro_LMG": "轻机枪 射程较远，杀伤力一般 ($${0})",
		"tank_intro_HMG": "重机枪 快速射击，威力较大，射程一般 ($${0})",
		"tank_intro_ball": "晕眩球 快速射击，威力较大，射程一般 ($${0})",
		"tank_intro_frozen": "冷冻器 快速射击，威力较大，射程一般 ($${0})",
		"tank_intro_laser_gun": "激光枪 伤害较大，命中率 100% ($${0})",
		"click_to_build": "左键点击建造 ${0} ($${1})",
		"upgrade": "升级 ${0} 到 ${1} 级，需花费 $${2}。",
		"sell": "出售 ${0}，可获得 $${1}",
		"upgrade_success": "升级成功，${0} 已升级到 ${1} 级！下次升级需要 $${2}。",
		"monster_info": "怪物: 生命 ${0}，防御 ${1}，速度 ${2}，伤害 ${3}",
		"button_upgrade_text": "升级",
		"button_sell_text": "出售",
		"button_start_text": "开始",
		"button_restart_text": "重新开始",
		"button_pause_text": "暂停",
		"button_continue_text": "继续",
		"button_pause_desc_0": "游戏暂停",
		"button_pause_desc_1": "游戏继续",
		"blocked": "不能在这儿修建建筑，起点与终点之间至少要有一条路可到达！",
		"monster_be_blocked": "不能在这儿修建建筑，有怪物被围起来了！",
		"entrance_or_exit_be_blocked": "不能在起点或终点处修建建筑！",
		"_": "ERROR"
	};

	env._t = env.translate = function (k, args) {
		args = (typeof args == "object" && args.constructor == Array) ? args : [];
		var msg = this.translation_table[k] || this.translation_table["_"],
			i,
			l = args.length;
		for (i = 0; i < l; i ++) {
			msg = msg.replace("#{" + i + "}", Math.floor(args[i]));
			msg = msg.replace("${" + i + "}", args[i]);
		}

		return msg;
	};


}); // app.todo.push end
