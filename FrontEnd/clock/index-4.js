array = [3, 4, 5, 6, 7, 8, 9]
jQuery.each(array, function(index) {
  var id = "#selector-1-"+array[index];
  $(id).click(function() {
  	current_index[9] = 0;
  	current_index[10] = 0;
  	current_index[11] = 0;
  	BASE[3] = array[index];
  	input[3] = generateInput(BASE[3]);
	graph(input[3], input[3][0], "9", BASE[3], true);
	graph(input[3], input[3][0], "10", BASE[3], true);
	graph(input[3], input[3][0], "11", BASE[3], true);
	setText("#clock-4-0", "4-0-total", 9, [0, 0, 0], undefined, 10);
	var total = document.getElementById("4-0-notation");
	if (total) {
	  total.innerHTML = "<b>" + current_index[9]*BASE[3]*BASE[3] 
	    + current_index[10]*BASE[3] + current_index[11]
	    + "<sub>" + BASE[3] + "</sub>"
	}
	setBackground(current_clock);
	for (i = 3; i <= 9; i++) {
		current = "#selector-1-"+i;
		$(current).removeClass("selected");
	}
	$(id).addClass("selected");
  });
});