
var myDuration = 300;
var firstTime = true;
var flag = true,
width = 150,
height = 250,
margin = 30,
border = 2,
radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory20);
var pie = d3.pie()
.value(function(d) { return d.count; })
.sort(null);
 
var current_index = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var index_key = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
var lastKeyUpAt = 0;
var current_clock = 2;
var locked = true;

var arc = d3.arc()
.innerRadius(0)
.outerRadius(radius);

var BASE = [60.0, 10.0, 3.0, 3.0];
var input = [];
input[0] = generateInput(BASE[0]);

graph(input[0], input[0][0], "0", BASE[0], false);
graph(input[0], input[0][0], "1", BASE[0], false);
graph(input[0], input[0][0], "2", BASE[0], false);
setText("#clock-1-0", "1-0-total", 0, ["0 hours", "0 minutes", "0 seconds"]);
setText("#clock-1-1", "1-1-total", 0, ["0 hours", "0 minutes", "0 seconds"], ["0 × 60\u00B2 seconds", "0 × 60\u00B9 seconds", "0 × 60\u2070 seconds"]);
setBackground(current_clock);

input[1] = generateInput(BASE[1]);
graph(input[1], input[1][0], "3", BASE[1], true);
graph(input[1], input[1][0], "4", BASE[1], true);
graph(input[1], input[1][0], "5", BASE[1], true);
setText("#clock-1-2", "1-2-total", 3, ["0 hundreds", "0 tens", "0 ones"], ["0 × 10\u00B2", "0 × 10\u00B9", "0 × 10\u2070"]);

input[2] = generateInput(BASE[2]);
graph(input[2], input[2][0], "6", BASE[2], true);
graph(input[2], input[2][0], "7", BASE[2], true);
graph(input[2], input[2][0], "8", BASE[2], true);
current_base = Math.floor(BASE[2]).toString();
setText("#clock-2-0", "2-0-total", 6, ["0 × " + current_base + "\u00B2", "0 × " + current_base + "\u00B9", "0 × " + current_base + "\u2070"]);
setText("#clock-3-0", "", 6, ["_ × " + current_base + "\u00B2", "_ × " + current_base + "\u00B9", "_ × " + current_base + "\u2070"]);

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

array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
jQuery.each(array, function(index) {
  var id = "#clock"+index;
  $(id).hover(function() {
    current_clock = index;
    setBackground(index);
  });
});

d3.select("body").on('keyup', function() {
    if (d3.event.keyCode === 40) { 
      lastKeyUpAt = new Date();
      flag = true; 
    }
});

function uparrowFunc() {
  var current_set = Math.floor(current_clock / 3);
  var base = BASE[current_set];
  if (current_index[current_set*3] === base-1 && current_clock === current_set*3) {
    return;
  } else if (current_index[current_set*3] === base-1 && current_index[current_set*3+1] == base-1 && current_clock === current_set*3+1) {
    return;
  } else if (current_index[current_set*3] === base-1 && current_index[current_set*3+1] == base-1 && current_index[current_set*3+2] == base-1 && current_clock === current_set*3+2) {
    return;
  }
  var selected = "#clock" + current_clock.toString();
  var svg = d3.selectAll(selected).selectAll("svg");
  incrementByOne(svg, input[current_set][0], current_clock);
  setTimeout(function(){            
    if (current_index[current_clock] === 0) {
      if (current_clock !== current_set*3) {
        selected = "#clock" + (current_clock-1).toString();
        svg = d3.select(selected).selectAll("svg");
        incrementByOne(svg, input[current_set][0], current_clock-1);
        setTimeout(function(){                      
          if (current_index[current_clock-1] === 0 && current_clock !== current_set*3+1) {
            selected = "#clock" + (current_clock-2).toString();
            svg = d3.select(selected).selectAll("svg");
            incrementByOne(svg, input[current_set][0], current_clock-2);
          }
        }, myDuration*2 + 25);
      }
    }
    setText("#clock-1-0", "1-0-total", 0, [
      current_index[0].toString() + " hours  ",
      current_index[1].toString() + " minutes",
      current_index[2].toString() + " seconds",
    ]);
    setText("#clock-1-1", "1-1-total", 0, [
      current_index[0].toString() + " hours  ",
      current_index[1].toString() + " minutes",
      current_index[2].toString() + " seconds",
    ], [
      current_index[0].toString() + " × 60\u00B2 seconds",
      current_index[1].toString() + " × 60\u00B9 seconds",
      current_index[2].toString() + " × 60\u2070 seconds",
    ]);
    setText("#clock-1-2", "1-2-total", 3, [
      current_index[3].toString() + " hundreds  ",
      current_index[4].toString() + " tens",
      current_index[5].toString() + " ones",
    ], [
      current_index[3].toString() + " × 10\u00B2",
      current_index[4].toString() + " × 10\u00B9",
      current_index[5].toString() + " × 10\u2070",
    ]);
    current_base = Math.floor(BASE[2]).toString();
    setText("#clock-2-0", "2-0-total", 6, [
      current_index[6].toString() + " × " + current_base + "\u00B2",
      current_index[7].toString() + " × " + current_base + "\u00B9",
      current_index[8].toString() + " × " + current_base + "\u2070",
    ]);
    setText("#clock-4-0", "4-0-total", 9, [
      current_index[9], current_index[10], current_index[11]
    ], undefined, 10);
    var total = document.getElementById("4-0-notation");
    if (total) {
      total.innerHTML = "<b>" + current_index[9].toString()
        + current_index[10].toString() + current_index[11].toString()
        + "<sub>" + BASE[3] + "</sub>"
    }
    checkCorrectness();
  }, myDuration*2 + 25);  
}

d3.select("body")
.on("keydown", function() {
  if (!locked)
    return;
  var current_set = Math.floor(current_clock / 3);
  var base = BASE[current_set];
  if (current_index[current_set*3] >= base 
    || current_index[current_set*3+1] >= base
    || current_index[current_set*3+2] >= base){
    return;
  }
  if (d3.event.keyCode === 37) {
    // left arrow
    d3.event.preventDefault();
    current_clock = current_set * 3 + (current_clock + 3 - 1) % 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 38) {
    // up arrow
    d3.event.preventDefault();
    uparrowFunc();
  } else if (d3.event.keyCode === 39) {
    // right arrow
    d3.event.preventDefault();
    current_clock = (current_clock + 1) % 3 + current_set * 3;
    setBackground(current_clock);
  } else if (d3.event.keyCode === 40) {
    // down arrow   

    if (current_index[current_set*3] === 0 && current_clock === current_set*3) {
      return;
    } else if (current_index[current_set*3] === 0 && current_index[current_set*3+1] === 0 && current_clock === current_set*3+1) {
      return;
    } else if (current_index[current_set*3] === 0 && current_index[current_set*3+1] === 0 && current_index[current_set*3+2] === 0 && current_clock === current_set*3+2) {
      return;
    }
    var selected = "#clock" + current_clock.toString();
    var svg = d3.selectAll(selected).selectAll("svg");
    goBackByOne(svg, input[current_set][0], current_clock);
    setTimeout(function(){
      if (current_index[current_clock] == BASE[current_set]-1){
        if (current_clock !== current_set*3) {
          selected = "#clock" + (current_clock-1).toString();
          svg = d3.select(selected).selectAll("svg");
          goBackByOne(svg, input[current_set][0], current_clock-1);
          setTimeout(function(){                      
            if (current_index[current_clock-1] === BASE[current_set]-1 && current_clock !== current_set*3+1) {
              selected = "#clock" + (current_clock-2).toString();
              svg = d3.select(selected).selectAll("svg");
              goBackByOne(svg, input[current_set][0], current_clock-2);
            }
          }, myDuration*2 + 25);
        }
      } 
      setText("#clock-1-0", "1-0-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ]);
      setText("#clock-1-1", "1-1-total", 0, [
        current_index[0].toString() + " hours  ",
        current_index[1].toString() + " minutes",
        current_index[2].toString() + " seconds",
      ], [
        current_index[0].toString() + " × 60\u00B2 seconds",
        current_index[1].toString() + " × 60\u00B9 seconds",
        current_index[2].toString() + " × 60\u2070 seconds",
      ]);
      setText("#clock-1-2", "1-2-total", 3, [
        current_index[3].toString() + " hundreds  ",
        current_index[4].toString() + " tens",
        current_index[5].toString() + " ones",
      ], [
        current_index[3].toString() + " × 10\u00B2",
        current_index[4].toString() + " × 10\u00B9",
        current_index[5].toString() + " × 10\u2070",
      ]);
      current_base = Math.floor(BASE[2]).toString();
      setText("#clock-2-0", "2-0-total", 6, [
        current_index[6].toString() + " × " + current_base + "\u00B2",
        current_index[7].toString() + " × " + current_base + "\u00B9",
        current_index[8].toString() + " × " + current_base + "\u2070",
      ]);
      setText("#clock-4-0", "4-0-total", 9, [
        current_index[9], current_index[10], current_index[11]
      ], undefined, 10);
      var total = document.getElementById("4-0-notation");
      if (total) {
        total.innerHTML = "<b>" + current_index[9].toString()
          + current_index[10].toString() + current_index[11].toString()
          + "<sub>" + BASE[3] + "</sub>"
      }
      checkCorrectness();
    }, myDuration*2 + 25);
  }
});

function setText(id, total_id, start_index, texts, second_texts, subscript) {
  var current_set = Math.floor(current_clock / 3);
  for (i = start_index; i < start_index+3; i++){
    selected = "#clock" + i.toString();
    d3.select(id).selectAll(selected).selectAll("tspan").remove();
    textElements = d3.select(id).selectAll(selected).selectAll("text");
    if (textElements) {
      d3.select(id).selectAll(selected).selectAll("g").append("text");
      textElements = d3.select(id).selectAll(selected).selectAll("g").selectAll("text");
    }
    textElements.selectAll("tspan").remove();
    textElements
      .append("tspan")
        .attr("class", ".current")
        .attr("x", 0)
        .attr("y", height/2+5)
        .attr("font-size", "15px")
        .attr("font-family", "Open-Sans, Arial, Sans-serif")
        .text(texts[i - start_index])
        .style("text-anchor", "middle");
    if (second_texts) {
      textElements
        .append("tspan")
          .attr("class", ".current")
          .attr('x', 0)
          .attr("y", height/2+5)
          .attr("dy", 20)
          .attr("font-size", "15px")
          .attr("font-family", "Open-Sans, Arial, Sans-serif")
          .text(second_texts[i - start_index])
          .style("text-anchor", "middle");
    }
  }
  var total = document.getElementById(total_id);
  if (total) {
    total.innerHTML = current_index[start_index]*BASE[current_set]*BASE[current_set] + current_index[start_index+1]*BASE[current_set] + current_index[start_index+2]
  }
  if (total && subscript) {
    total.innerHTML += "<sub>" + subscript + "</sub>"
  }
}

function graph(input, data, index, BASE, flag) {
  var selected = "#clock" + index;
  d3.selectAll(selected).selectAll("svg").remove();
  var svg = d3.selectAll(selected).selectAll("svg")
    .data(input)
    .enter().append("svg")
    .attr("width", width + margin * 2)
    .attr("height", height + margin * 2)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin) + "," + (height / 2 + margin) + ")");

  var circle = svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", radius+2);

  if (flag) {
    addTicks(BASE, svg);
  }

  var drag = setdrag();
  svg.call(drag);
  switchToIndex(0, svg, data);

  function addTicks(base, svg) {
    var radians = 0.0174532925;  
    svg.selectAll('.hour-label').remove();
    svg.selectAll('.hour-label')
    .data(generateLabel(base))
      .enter()
      .append('text')
      .attr('class', 'hour-label')
      .attr('text-anchor','middle')
      .attr('x',function(d){                
        var x = (radius+10) * Math.sin(d * 360.0 / base * radians);
        return x;
      })
      .attr('y',function(d){
        var y = -(radius+10) * Math.cos(d * 360.0 / base * radians);
        return y+5;
      })
      .text(function(d){
        return d;
      });
    }

  function setdrag() {
    var drag = d3.drag()
      .subject(function(d) { return d; })
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    var center = {};
    center.x = (width+margin) / 2;
    center.y = (height + margin * 2) / 2;

    var start = {};
    start.x = center.x;
    start.y = 0;

    // point1: start point, point2: center, point3: end point
    function getAngle(point1, point2, point3) {
        var bb = (point2.y - point1.y)*(point2.y - point1.y) + (point2.x - point1.x)*(point2.x - point1.x);
        var aa = (point3.y - point1.y)*(point3.y - point1.y) + (point3.x - point1.x)*(point3.x - point1.x);
        var cc = (point3.y - point2.y)*(point3.y - point2.y) + (point3.x - point2.x)*(point3.x - point2.x);
        var cosa = (bb + cc - aa)/(2*Math.sqrt(bb)*Math.sqrt(cc));
        return Math.acos(cosa);
    }

    // point1: center, point2: start, point3: center
    function duration(point1, point2, point3) {
        var sp = (point1.x-point3.x)*(point2.y-point3.y)-(point1.y-point3.y)*(point2.x-point3.x);
        if(sp > 0) { // clockwise
            return 1;
        } else if(sp < 0) {// counter clockwise
            return -1;
        } else {
            return 0;
        }
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
    }

    function dragged(d) {
      function toDegrees (angle) {
        return angle * (180 / Math.PI);
      }

      var angle = getAngle(start, center, d3.event);
      degree = toDegrees(angle);
      if (d3.event.x < center.x) {
        degree = 360 - degree;
      } 
      var current_set = Math.floor(current_clock / 3);
      var index = degree * 1.0 / (360.0 / BASE[current_set]);
      switchToIndex(Math.round(index), svg, data);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }

    return drag;  
  }
}

function key(d) {
  return d.data.region;
}

function type(d) {
  d.count = +d.count;
  return d;
}

function findNeighborArc(i, data0, data1, key) {
  var d;
  if(d = findFollowing(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.endAngle = d.startAngle;
    return obj;

  } else if(d = findPreceding(i, data0, data1, key)) {

    var obj = cloneObj(d)
    obj.startAngle = d.endAngle;
    return obj;

  }

  return null


}

// Find the element in data0 that joins the highest preceding element in data1.
function findPreceding(i, data0, data1, key) {
  var m = data0.length;
  while (--i >= 0) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

// Find the element in data0 that joins the lowest following element in data1.
function findFollowing(i, data0, data1, key) {
  var n = data1.length, m = data0.length;
  while (++i < n) {
    var k = key(data1[i]);
    for (var j = 0; j < m; ++j) {
      if (key(data0[j]) === k) return data0[j];
    }
  }
}

function arcTween(d) {

  var i = d3.interpolate(this._current, d);

  this._current = i(0);

  return function(t) {
    return arc(i(t))
  }

}


function cloneObj(obj) {
  var o = {};
  for(var i in obj) {
    o[i] = obj[i];
  }
  return o;
}

function changebase() {
  BASE = parseInt(document.getElementById('base').value);

  input = generateInput(BASE);
  
  graph(input[0], "0");
  graph(input[0], "1");
  graph(input[0], "2");

  current_clock = 2;
  current_index = [0, 0, 0];
}

function setBackground(index) {
  for (var i = 0; i < 12; i++) {
    var selected = "#clock" + i;
    var svg = d3.selectAll(selected).selectAll("svg");
    if (i === parseInt(index)) {
      svg.attr("style", "background: #ebfcf6;");
    } else {
      svg.attr("style", "background: white;");
    }
  } 
}

function goBackByOne(svg, data, clock_index) {
  var current_set = Math.floor(current_clock / 3);
  var obj = {};
  if (current_index[clock_index] === 0) { 
    var g = svg.selectAll("g");
    g.selectAll("path").remove();
    switchToIndex(BASE[current_set], g, input[current_set][0]);
    current_index[clock_index] = 0;  
    temp = current_index[clock_index]
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg, myDuration, "West");
    setTimeout(function() {       
      current_index[clock_index] = BASE[current_set];
      temp = current_index[clock_index];
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg, 0, "East");
      setTimeout(function(){            
        current_index[clock_index] = (current_index[clock_index] + BASE[current_set] - 1) % BASE[current_set];
        temp = current_index[clock_index];
        obj["key"] = index_key[temp];
        obj["values"] = [data[temp*2], data[temp*2+1]];
        change(obj, svg, myDuration, "East");
      }, myDuration + 10);
    }, myDuration+10);
  } else {          
    current_index[clock_index] = (current_index[clock_index] + BASE[current_set] - 1) % BASE[current_set];
    temp = current_index[clock_index];
    obj["key"] = index_key[temp];
    obj["values"] = [data[temp*2], data[temp*2+1]];
    change(obj, svg, myDuration, "East");
  }      
}

function incrementByOne(svg, data, clock_index) {
  var current_set = Math.floor(current_clock / 3);
  var obj = {};
  current_index[clock_index] = (current_index[clock_index] + 1);
  temp = current_index[clock_index];
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg, myDuration, "East");
  if (temp == BASE[current_set]) {
    setTimeout(function(){ 
      var g = svg.selectAll("g");
      g.selectAll("path").remove();
      current_index[clock_index] = 0;    
      switchToIndex(0, g, input[current_set][0]);
      current_index[clock_index] = BASE[current_set];  
      temp = current_index[clock_index]
      obj["key"] = index_key[temp];
      obj["values"] = [data[temp*2], data[temp*2+1]];
      change(obj, svg, myDuration, "West"); 
      setTimeout(function(){
        current_index[clock_index] = 0;
        temp = current_index[clock_index]
        obj["key"] = index_key[temp];
        obj["values"] = [data[temp*2], data[temp*2+1]];
        change(obj, svg, 0, "East");
      }, myDuration + 10);
    }, myDuration + 10);
  }
}


function switchToIndex(index, svg, data) {
  var obj = {};
  current_index[current_clock] = index;
  temp = current_index[current_clock]
  obj["key"] = index_key[temp];
  obj["values"] = [data[temp*2], data[temp*2+1]];
  change(obj, svg, myDuration, "East");
}

function change(region, svg, duration, clockwise) {
  var path = svg.selectAll('path')
  var data0 = path.data(),
  data1 = pie(region.values);
  path = path.data(data1, key);

  path
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#ff0080";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .transition()
  .duration(duration)
  .attrTween("d", arcTween)

  path
  .enter()
  .append("path")
  .each(function(d, i) {
    var narc = findNeighborArc(i, data0, data1, key) ;
    if(narc) {          
      this._current = narc;
      this._previous = narc;
    } else {          
      this._current = d;
    }
  }) 
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#ff0080";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .transition()
  .duration(duration)
  .attrTween("d", arcTween)

  path
  .attr("fill", function(d,i) { 
    if (d.data.region === clockwise) {
      return "#9AB3AC";
    } else {
      return "#ffffff";
    }
   return color(d.data.region)
  })
  .exit()
  .transition()
  .duration(duration)
  .attrTween("d", function(d, index) {

    var currentIndex = this._previous.data.region;
    var i = d3.interpolateObject(d,this._previous);
    return function(t) {
      return arc(i(t))
    }

  })
  .remove()


  firstTime = false;
}

function isElementOutViewport (el) {
    var rect = el.getBoundingClientRect();
    return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
}

try{
  document.getElementById("subsection1.1").onscroll = function() {
    try {
      var clock_set_0 = document.getElementById("clock-1-0");
      var clock_set_1 = document.getElementById("clock-1-1");
      var clock_set_2 = document.getElementById("clock-1-2");
      if (!isElementOutViewport(clock_set_0) || !isElementOutViewport(clock_set_1)) {
        current_clock = 2;
        setBackground(2); 
      } else if (!isElementOutViewport(clock_set_2)) {
        current_clock = 5; 
        setBackground(5);
      }
    } catch(err){}
  };  
} catch(err){}

window.onload = function() {
  try {
    var clock_set_0 = document.getElementById("clock-1-0");
    var clock_set_1 = document.getElementById("clock-1-1");
    var clock_set_2 = document.getElementById("clock-1-2");
    if (!isElementOutViewport(clock_set_0) || !isElementOutViewport(clock_set_1)) {
      current_clock = 2;
      setBackground(2); 
    } else if (!isElementOutViewport(clock_set_2)) {
      current_clock = 5; 
      setBackground(5);
    }
  } catch(err){}
  try {
    var clock_set_3 = document.getElementById("clock-2-0");
    if (!isElementOutViewport(clock_set_3)) {
      current_clock = 8; 
      setBackground(8);
    }
  } catch(err){}
  try {
    var clock_set_4 = document.getElementById("clock-3-0");
    if (!isElementOutViewport(clock_set_4)) {
      current_clock = 8; 
      setBackground(8);
    }
  } catch(err){}
  try {
    var clock_set_5 = document.getElementById("clock-4-0");
    if (!isElementOutViewport(clock_set_5)) {
      current_clock = 11; 
      setBackground(11);
    }
  } catch(err){}
};

function checkCorrectness() {
  var total = current_index[6]*BASE[2]*BASE[2] + current_index[7]*BASE[2] + current_index[8]
  if (total.toString() !== $('input[name=total]').val()){
    $('input[name=total]').css("border-color", "red");
  } else {
    $('input[name=total]').css("border-color", "#2EC186");
  } 
  total = current_index[6]*BASE[2]*BASE[2];
  if (total.toString() !== $('input[name=subtotal1]').val()){
    $('input[name=subtotal1]').css("border-color", "red");
  } else {
    $('input[name=subtotal1]').css("border-color", "#2EC186");
  } 
  total = current_index[7]*BASE[2];
  if (total.toString() !== $('input[name=subtotal2]').val()){
    $('input[name=subtotal2]').css("border-color", "red");
  } else {
    $('input[name=subtotal2]').css("border-color", "#2EC186");
  } 
  total = current_index[8];
  if (total.toString() !== $('input[name=subtotal3]').val()){
    $('input[name=subtotal3]').css("border-color", "red");
  } else {
    $('input[name=subtotal3]').css("border-color", "#2EC186");
  }
}