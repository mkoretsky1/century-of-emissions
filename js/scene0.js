function scene0() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1900, yearEnd:1938,
    annotations: [
      {
        type: "callout",
        year: 1927,
        country: "United States",
        dx: -160,
        dy: -25,
        title: "USA triples output",
        text:  "Post-WWI industrial boom\npushes US CO₂ to ≈350 Mt"
      }
    ]
  });
}