document.addEventListener("DOMContentLoaded", function() {
  d3.tsv("data.tsv", function(d) {
    d.refugees = +d.refugees;
    d.population = +d.population;
    return d;
  }, main);
});

function main(error, data) {
  if (error) throw error;


  // sort alphabetically
  data.sort(function(a, b) {
    if (a.name < b.name) {
      return -1;
    }

    if (a.name > b.name) {
      return 1;
    }

    return 0;
  });

  data.forEach(function(elem) {
    elem.proportion = elem.refugees/elem.population;
  });

  console.log(data);

  var svg = d3.select("svg"),
      margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data.map(function(d) { return d.name; }));
      y.domain([0, d3.max(data, function(d) { return d.refugees; })]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(10, "s"));

      g.append("text")
          .attr("fill", "black")
          .attr("font-size", "18px")
          .attr("y", -6)
          .attr("x", 0)
          .attr("text-anchor", "left")
          .text("Number of Syrian Refugees Living in Country");

      var bars = g.selectAll(".bar")
          .data(data)
        .enter().append("g")

      bars.append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.name); })
          .attr("y", function(d) { return y(d.refugees); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d.refugees); })

      var f = d3.format(".2s");

      bars.append("text")
          .attr("fill", "black")
          .attr("x", function(d) { return x(d.name) + (x.bandwidth()/2); })
          .attr("y", function(d) { return y(d.refugees) - 3; })
          .attr("text-anchor", "middle")
          .text(function(d) { return f(d.refugees); });

}
