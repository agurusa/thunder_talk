var someStuff = [
  {
  "name": "Top Level",
  "parent": "null",
  "children": [
    {
      "name": "Level 2: A",
      "parent": "Top Level",
      "children": [
        {
          "name": "Son of A",
          "parent": "Level 2: A"
        },
        {
          "name": "Daughter of A",
          "parent": "Level 2: A"
        }
      ]
    },
    {
      "name": "Level 2: B",
      "parent": "Top Level"
    }
  ]
}
]

var width = 960,
    height = 600;

var rateById = d3.map();

var quantize = d3.scale.quantize()
    .domain([0, .15])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
// var url = "http://bl.ocks.org/mbostock/raw/4090846/us.json"

// var req = d3.json("http://bl.ocks.org/mbostock/raw/4090846/us.json")
// var req=  d3.header("Access-Control-Allow-Origin").json("http://bl.ocks.org/mbostock/raw/4090846/us.json")
  // .header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  // .header()

var req = d3.json("https://bl.ocks.org/mbostock/raw/4090846/us.json")
  .header("Access-Control-Allow-Origin", true)
  .header("X-Requested-With", "XMLHttpRequest")
  .header("Content-Type", "application/x-www-form-urlencoded")
// var req = d3.json(someStuff)
// var req = d3.json(someStuff).on("beforesend", function(request) { request.withCredentials = true }).header("Access-Control-Allow-Origin", "*")

// var req = d3.json(someStuff);
console.log(req)

queue()
    .defer(req.get(function(error,data){console.log("callback")}))
    // .defer(req)
    .defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
    .await(ready);

function ready(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) { return quantize(rateById.get(d.id)); })
      .attr("d", path);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");
