var width = 960,
    height = 500,
    centered;

var projection = d3.geoAlbersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

d3.json("us.json", function(us) {
  d3.tsv("us-state-names.tsv", function(tsv){
      // extract just the code and Ids
      var names = [];
      tsv.forEach(function(d,i){
        names[d.id]=d.code;
      });

        g.append("g")
          .attr("id", "states")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
          .enter().append("path").attr("id",function(d){return names[d.id];})
          .attr("d", path)
          .on("click", clicked);

        g.append("path")
            .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
            .attr("id", "state-borders")
            .attr("d", path);

        // add state names
        g.append("g")
        .attr("class", "states-names")
        .selectAll("text")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("svg:text")
        .text(function(d){
          return names[d.id];
        })
        .attr("x", function(d){
            return path.centroid(d)[0];
        })
        .attr("y", function(d){
            return  path.centroid(d)[1];
        })
        .attr("text-anchor","middle")
        .attr('fill', 'white');
    });
});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
