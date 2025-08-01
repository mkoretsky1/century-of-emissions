function scene0() { 
  drawStackedAreaSubset({
    container: "#viz-container",
    csvPath: "data/overall.csv",
    yearStart:1900, yearEnd:1938,
    annoations:[
      {
        year: 1927,
        value:  GLOBAL.colour.has("USA")
                ? (() => {
                     const idx = GLOBAL.countries.indexOf("USA");
                     const h   = stacked[idx][years.indexOf(1927)][1];
                     return h;
                   })()
                : 0,
        dx: -150, dy: -20,
        subject: { radius: 4 },
        note: {
          title: "USA triples output",
          label: "Rapid industrial growth after WWI pushed\nUSA CO₂ to ~350 Mt."
        },
        connector: { end: "dot" }
      },

      {
        type: d3.annotationBracketY,
        x: margin.left - 30,
        y: y(0),
        y1: y(0),
        y2: y(d3.max(stacked[stacked.length - 1], d => d[1])),
        note: {
          title: "Emissions explode",
          label: `Total top-10 output grows\n${y.domain()[1] /  y.domain()[0]}× in 40 years`,
          align: "left"
        },
        dy: -20,
        dx: 0
      }
    ]
  });
}