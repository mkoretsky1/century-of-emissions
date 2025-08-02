function scene2() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1992, yearEnd:2022,
    annotations: [
      {
        type: "label",
        year: 2000,
        country: "China",
        dx: -0,
        dy: -195,
        wrap: 210,
        title: "Industrialization in China",
        text:  "China undergoes rapid industrialization in the early 21st century, turning it into a manufacturing powerhouse. Their emissions soon surpass that of the United States and Europe."
      },
      {
        type: "label",
        year: 2022,
        country: "United States",
        dx: 40,
        dy: 0,
        wrap: 150,
        title: "Renewable Energy and Climate Change",
        text: "Increased investment in renewable energy sources and concern over climate change causes emissions in the US and other countries to stop growing."
      }
    ],
    title: "Digital and Global Era (1991-2022)"
  });
}