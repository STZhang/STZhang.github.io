animation();

function animation() {
  var selected = "#clock0";
  var svg = d3.selectAll(selected).selectAll("svg");
  switchToIndex(0, svg, input[0][0]);
  selected = "#clock1";
  svg = d3.selectAll(selected).selectAll("svg");
  switchToIndex(0, svg, input[0][0]);
  selected = "#clock2";
  svg = d3.selectAll(selected).selectAll("svg");
  switchToIndex(55, svg, input[0][0]);
  var x = 0;
  var intervalID = setInterval(function() {
    if (x === 0) {
      current_index[0] = 0;
      current_index[1] = 0;
      current_index[2] = 55;
      locked = false;
    }
    if (current_index[0] > BASE[0] || current_index[1] > BASE[0] || current_index[0] > BASE[0])
      return;
    uparrowFunc();
    if (++x === 10 ) {
      window.clearInterval(intervalID);
      locked = true;
    }
  }, myDuration*3+20);
}