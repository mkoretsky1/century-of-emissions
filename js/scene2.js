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
        dx: 0,
        dy: -200,
        wrap: 250,
        title: "The Rise of China",
        text:  "China undergoes rapid industrialization in the 21st century. As is turns into a manufacturing powerhouse it's emissions surpass that of the United States and Europe."
      },
      {
        type: "label",
        year: 2022,
        country: "United States",
        dx: 50,
        dy: 10,
        wrap: 150,
        title: "Renewable Energy and Climate Change",
        text: "Increased investment in renewable energy sources and concern over climate change causes United States emissions to stay fairly constant in the modern era."
      }
    ]
  });
}