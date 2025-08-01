function scene2() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/all_years_all_vars.csv",
    yearStart:1992, yearEnd:2022
  });
}