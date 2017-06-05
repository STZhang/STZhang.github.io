$('input[name=total]').change(function() {
	var total = current_index[6]*BASE[2]*BASE[2] + current_index[7]*BASE[2] + current_index[8]
	if (total.toString() !== $(this).val()){
		$(this).css("border-color", "red");
	} else {
		$(this).css("border-color", "#2EC186");
	}
});

$('input[name=subtotal1]').change(function() {
	var total = current_index[6]*BASE[2]*BASE[2];
	if (total.toString() !== $(this).val()){
		$(this).css("border-color", "red");
	} else {
		$(this).css("border-color", "#2EC186");
	}
});

$('input[name=subtotal2]').change(function() {
	var total = current_index[7]*BASE[2];
	if (total.toString() !== $(this).val()){
		$(this).css("border-color", "red");
	} else {
		$(this).css("border-color", "#2EC186");
	}
});

$('input[name=subtotal3]').change(function() {
	var total = current_index[8];
	if (total.toString() !== $(this).val()){
		$(this).css("border-color", "red");
	} else {
		$(this).css("border-color", "#2EC186");
	}
});