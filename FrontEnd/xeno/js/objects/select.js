/*
 * Class: select highlighting
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/

app.todo.push(function (env) {
	/**
	 * 地图选中元素高亮边框对象
	 */
	var map_selecthl = {
		_init: function (cfg) {
			this.map = cfg.map;
			this.width = env.grid_size + 2;
			this.height = env.grid_size + 2;
			this.visiable = false;
		},
		show: function (grid) {
			this.x = grid.x;
			this.y = grid.y;
			this.visiable = true;
		},
		render: function () {
			var ctx = env.ctx;
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#f93";
			ctx.beginPath();
			ctx.strokeRect(this.x, this.y, this.width - 1, this.height - 1);
			ctx.closePath();
			ctx.stroke();
		}
	};

	/**
	 * 地图选中的高亮框
	 * @param cfg <object> 至少需要包含
	 *		 {
	 *			 map: map 对象
	 *		 }
	 */
	env.create_mapSelectHighLight = function (id, cfg) {
		var obj = new env.Object(id, cfg);
		env.util.mix(obj, map_selecthl);
		obj._init(cfg);

		return obj;
	};
});
