function scene1() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1939, yearEnd:1991,
    annotations: [
      {
        type: "label",
        year: 1990,
        country: "Ukraine",
        dx: -100,
        dy: -10,
        wrap: 250,
        title: "Emissions Explode",
        text: "The total CO₂ output from the top 10 emitting countries increases around 3.5x in just over 50 years."
      },
      {
        type: "label",
        year: 1945,
        country: "Ukraine",
        dx: 50,
        dy: -150,
        wrap: 250,
        title: "World War II Ends (September 1945)",
        text:  "The end of history's deadliest war starts an era of unprecedented economic growth. In turn, CO₂ emissions begin to increase rapidly."
      }
    ]
  });
}