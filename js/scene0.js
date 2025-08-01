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
        dy: -10,
        wrap: 250,
        title: "Great Depression begins (October 1929)",
        text:  "United States Stock Market crash sets of the Great Depression. Economies around the globe are affected, causing industrial output to decrease and CO₂ emissions to drop."
      },
      {
        type: "label",
        year: 1932,
        country: "United States",
        dx: 200,
        dy: 10,
        wrap: 150,
        title: "Franklin D. Roosevelt is Elected",
        text: "New Deal programs stabilize the economy and increase industrial output, causing emissions in the United States to increase."
      }
    ]
  });
}