function scene1() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1939, yearEnd:1991
  });
}