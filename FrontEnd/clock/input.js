
var input = [[{
    "region": "East",
    "fruit": "Zero",
    "count": "0"
  }, {
    "region": "West",
    "fruit": "Zero",
    "count": "100"
  }, {
    "region": "East",
    "fruit": "One",
    "count": "33"
  }, {
    "region": "West",
    "fruit": "One",
    "count": "66"
  }, {
    "region": "East",
    "fruit": "Two",
    "count": "66"
  }, {
    "region": "West",
    "fruit": "Two",
    "count": "33"
  }, {
    "region": "East",
    "fruit": "Three",
    "count": "100"
  }, {
    "region": "West",
    "fruit": "Three",
    "count": "0"
  }]]

function generateInput(n) {
  new_input_part = []
  for(count = 0; count <= n; count++) {
    new_partial_full = {}
    new_partial_full["region"] = "East"
    new_partial_full["fruit"] = count.toString()
    new_partial_full["count"] = (1200.0 * count / n).toString()
    new_partial_empty = {}
    new_partial_empty["region"] = "West"
    new_partial_empty["fruit"] = count.toString()
    new_partial_empty["count"] = (1200.0 * (n - count) / n).toString()
    new_input_part.push(new_partial_full)
    new_input_part.push(new_partial_empty)
  }

  new_input = []

  new_input.push(new_input_part)

  return new_input
}

function generateLabel(n, base) {
  var label = []
  for (count = 0; count < n; count++) {
    label.push(count);
  }
  return label;
}

var data = [
  [11975,  5871, 8916, 2868],
  [ 1951, 10048, 2060, 6171],
  [ 8010, 16145, 8090, 8045],
  [ 1013,   990,  940, 6907]
];