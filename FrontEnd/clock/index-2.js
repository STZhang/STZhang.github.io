array = [3, 4, 5, 6, 7, 8, 9]
jQuery.each(array, function(index) {
  var id = "#selector-"+array[index];
  $(id).click(function() {
  	current_index[6] = 0;
  	current_index[7] = 0;
  	current_index[8] = 0;
  	BASE[2] = array[index];
  	input[2] = generateInput(BASE[2]);
	graph(input[2], input[2][0], "6", BASE[2], true);
	graph(input[2], input[2][0], "7", BASE[2], true);
	graph(input[2], input[2][0], "8", BASE[2], true);
	current_base = Math.floor(BASE[2]).toString();
	setText("#clock-2-0", "2-0-total", 6, ["0 × " + current_base + "\u00B2", "0 × " + current_base + "\u00B9", "0 × " + current_base + "\u2070"]);
	setText("#clock-3-0", "", 6, ["_ × " + current_base + "\u00B2", "_ × " + current_base + "\u00B9", "_ × " + current_base + "\u2070"]);
	setBackground(current_clock);
	for (i = 3; i <= 9; i++) {
		current = "#selector-"+i;
		$(current).removeClass("selected");
	}
	$(id).addClass("selected");
  });
});
