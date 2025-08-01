function scene2() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1992, yearEnd:2022
  });
}