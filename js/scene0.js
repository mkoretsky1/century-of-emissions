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
        dx: -100,
        dy: 0,
        wrap: 350,
        title: "Great Depression begins (October 1929)",
        text:  "Wall Street crash marks the start of the Great Depression. Economies around the globe are affected, causing industrial output and CO₂ emissions to decrease rapidly."
      },
      {
        type: "label",
        year: 1932,
        country: "United States",
        dx: 135,
        dy: 0,
        wrap: 150,
        title: "FDR Elected (November 1932)",
        text: "His New Deal programs stabilize the economy and increase industrial output in the United States, causing emissions to increase."
      }
    ],
    title: "WWI and Depression Era (1900-1938)"
  });
}