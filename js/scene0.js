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
        title: "Great Depression Begins (October 1929)",
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
      },
      {
        type: "label",
        year: 1914,
        country: "United States",
        dx: 0,
        dy: 25,
        wrap: 150,
        title: "WWI Begins (July 1914)",
        text: "The global conflict causes an uptick in CO₂ emissions due to massive industrialization efforts to support the war in the United States, Germany, and the United Kingdom."
      }
    ],
    title: "WWI and Depression Era (1900-1938)"
  });
}