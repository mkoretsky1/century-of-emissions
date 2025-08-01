function scene1() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/all_years_all_vars.csv",
    yearStart:1939, yearEnd:1991
  });
}