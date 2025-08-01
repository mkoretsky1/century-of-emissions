function scene0() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1900, yearEnd:1938
  });
}