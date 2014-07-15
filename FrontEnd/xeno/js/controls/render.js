/*
 * Util: render object
 *
 * Author: Jingwei
 * 
 * Date: 06/24/2014
*/
app.todo.push(function (env) {

	function lineTo2(ctx, x0, y0, x1, y1, len) {
		var x2, y2, a, b, p, xt,
			a2, b2, c2;

		if (x0 == x1) {
			x2 = x0;
			y2 = y1 > y0 ? y0 + len : y0 - len;
		} else if (y0 == y1) {
			y2 = y0;
			x2 = x1 > x0 ? x0 + len : x0 - len;
		} else {
			// 解一元二次方程
			a = (y0 - y1) / (x0 - x1);
			b = y0 - x0 * a;
			a2 = a * a + 1;
			b2 = 2 * (a * (b - y0) - x0);
			c2 = Math.pow(b - y0, 2) + x0 * x0 - Math.pow(len, 2);
			p = Math.pow(b2, 2) - 4 * a2 * c2;
			if (p < 0) {
//				env.log("ERROR: [a, b, len] = [" + ([a, b, len]).join(", ") + "]");
				return [0, 0];
			}
			p = Math.sqrt(p);
			xt = (-b2 + p) / (2 * a2);
			if ((x1 - x0 > 0 && xt - x0 > 0) ||
				(x1 - x0 < 0 && xt - x0 < 0)) {
				x2 = xt;
				y2 = a * x2 + b;
			} else {
				x2 = (-b2 - p) / (2 * a2);
				y2 = a * x2 + b;
			}
		}

		ctx.lineCap = "round";
		ctx.moveTo(x0, y0);
		ctx.lineTo(x2, y2);

		return [x2, y2];
	}

	var renderFunctions = {
		"cannon": function (b, ctx, map, gs, gs2) {
			var target_position = b.getTargetPosition();
			var angle = 0;
			if (b.map.is_main_map) {
				angle = Math.PI / 2 + Math.atan2(target_position[1] - b.cy, target_position[0] - b.cx)
			}
			ctx.translate(b.cx, b.cy);
			ctx.rotate(angle);
			ctx.drawImage(document.getElementById(b.pic), -env.grid_size/2, -env.grid_size/2);
			ctx.rotate(-angle);
			ctx.translate(-b.cx, -b.cy);
		},
		"LMG": function (b, ctx, map, gs, gs2) {
			var target_position = b.getTargetPosition();
			var angle = 0;
			if (b.map.is_main_map) {
				angle = Math.PI / 2 + Math.atan2(target_position[1] - b.cy, target_position[0] - b.cx)
			}
			ctx.translate(b.cx, b.cy);
			ctx.rotate(angle);
			i = b.onfire / 2;
			if (b.onfire == 1 || b.onfire == 3)
				ctx.drawImage(document.getElementById('fire_img'), -env.grid_size/2-6, -env.grid_size/2-28);
			if (b.onfire == 2 || b.onfire == 4)
				ctx.drawImage(document.getElementById('fire_img'), -env.grid_size/2+16, -env.grid_size/2-28);
			if (b.onfire < 9)
				b.onfire++;
			ctx.drawImage(document.getElementById(b.pic), -env.grid_size/2, -env.grid_size/2);
			ctx.rotate(-angle);
			ctx.translate(-b.cx, -b.cy);
		},
		"frozen": function(b, ctx, map, gs, gs2){
			var target_position = b.getTargetPosition();
			var angle = 0;
			if (b.map.is_main_map) {
				angle = Math.PI / 2 + Math.atan2(target_position[1] - b.cy, target_position[0] - b.cx)
			}
			ctx.translate(b.cx, b.cy);
			ctx.rotate(angle);
			ctx.drawImage(document.getElementById(b.pic), -env.grid_size/2, -env.grid_size/2);
			ctx.rotate(-angle);
			ctx.translate(-b.cx, -b.cy);

		},
		"ball": function(b, ctx, map, gs, gs2) {
			ctx.drawImage(document.getElementById(b.pic), b.x, b.y);

		},
		"HMG": function (b, ctx, map, gs, gs2) {
			var target_position = b.getTargetPosition();
			var angle = 0;
			if (b.map.is_main_map) {
				angle = Math.PI / 2 + Math.atan2(target_position[1] - b.cy, target_position[0] - b.cx)
			}
			ctx.translate(b.cx, b.cy);
			ctx.rotate(angle);
			ctx.drawImage(document.getElementById(b.pic), -env.grid_size/2, -env.grid_size/2);
			ctx.rotate(-angle);
			ctx.translate(-b.cx, -b.cy);

		},
		"wall": function (b, ctx, map, gs, gs2) {
			ctx.drawImage(document.getElementById(b.pic), b.x, b.y);
		},
		"laser_gun": function (b, ctx/*, map, gs, gs2*/) {
//			var target_position = b.getTargetPosition();
			if (!b.map.is_main_map){
				ctx.drawImage(document.getElementById(b.pic), b.x, b.y);
				return;
			}

			ctx.fillStyle = "#f00";
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			ctx.lineWidth = 1;
//			ctx.arc(b.cx, b.cy, gs2 - 5, 0, Math.PI * 2, true);
			ctx.moveTo(b.cx, b.cy - 10);
			ctx.lineTo(b.cx - 8.66, b.cy + 5);
			ctx.lineTo(b.cx + 8.66, b.cy + 5);
			ctx.lineTo(b.cx, b.cy - 10);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#60f";
			ctx.beginPath();
			ctx.arc(b.cx, b.cy, 7, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(b.cx, b.cy, 3, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = "#666";
			ctx.beginPath();
			ctx.arc(b.cx + 1, b.cy - 1, 1, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();

			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(b.cx, b.cy);
//			b.muzzle = lineTo2(ctx, b.cx, b.cy, target_position[0], target_position[1], gs2);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}
	};

	env.renderTank = function (tank) {
		var ctx = env.ctx,
			map = tank.map,
			gs = env.grid_size,
			gs2 = env.grid_size / 2;

		(renderFunctions[tank.type] || renderFunctions["wall"])(
			tank, ctx, map, gs, gs2
			);
	}

}); // app.todo.push end
