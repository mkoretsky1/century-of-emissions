function scene1() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1939, yearEnd:1991,
    annotations: [
      {
        type: "label",
        year: 1945,
        country: "Ukraine",
        dx: 0,
        dy: -20,
        title: "World War II Ends (September 1945)",
        text:  "The end of history's deadliest war starts an era of massive economic growth and with is a boom in CO₂ emissions"
      },
      {
        type: "label",
        year: 1990,
        country: "Ukraine",
        dx: -200,
        dy: -10,
        title: "Emissions Explode",
        text: "Total CO₂ output from the top 10 emitting countries increases ~3.5x in just over 50 years."
      }
    ]
  });
}