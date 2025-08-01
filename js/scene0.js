function scene0() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/all_years_all_vars.csv",
    yearStart:1900, yearEnd:1938
  });
}