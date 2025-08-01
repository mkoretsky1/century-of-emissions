function scene1() {
  const svg = d3.select("#viz-container")
    .append("svg")
    .attr("width", 300)
    .attr("height", 150);

  svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 75)
    .attr("r", 40)
    .attr("fill", "orange");

  svg.append("text")
    .attr("x", 170)
    .attr("y", 80)
    .attr("font-size", 20)
    .text("Scene 1");
}