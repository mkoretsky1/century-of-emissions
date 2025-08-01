function scene0() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1900, yearEnd:1938,
    annotations: [
      {
        type: "label",
        year: 1929,
        country: "Ukraine",
        dx: -220,
        dy: 0,
        title: "Great Depression begins October 1929",
        text:  "US Stock Market crash impacts economies globally, causing CO₂ emissions to decrease."
      }
    ]
  });
}