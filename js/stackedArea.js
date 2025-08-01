function drawStackedAreaSubset({
  container,
  csvPath,
  yearStart   = 1900,
  yearEnd     = 2022,
  metric      = "co2",
  width       = 1000,
  height      = 500,
  margin      = { top: 50, right: 180, bottom: 45, left: 80 },
  annotations = []
}) {
  /* wait until masterData has loaded */
  GLOBAL.ready.then(() => {
    d3.csv(csvPath, d3.autoType).then(raw => {
      /* filter to top-10 & year range */
      const data = raw.filter(d =>
        GLOBAL.countries.includes(d.country) &&
        d.year >= yearStart && d.year <= yearEnd
      );

      /* pivot to wide form for d3.stack */
      const roll = d3.rollup(
        data,
        v => d3.sum(v, d => d[metric]),
        d => d.year,
        d => d.country
      );

      const years = Array.from(roll.keys()).sort((a, b) => a - b);
      const wide  = years.map(year => {
        const row = { Year: year };
        const byC = roll.get(year);
        GLOBAL.countries.forEach(c => row[c] = byC?.get(c) ?? 0);
        return row;
      });

      /* build stacked series (fixed key order) */
      const stacked = d3.stack().keys(GLOBAL.countries)(wide);

      /* scales & SVG */
      const x = d3.scaleBand(years, [margin.left, width - margin.right]);
      const y = d3.scaleLinear(
        [0, d3.max(stacked[stacked.length - 1], d => d[1])],
        [height - margin.bottom, margin.top]
      );

      const area = d3.area()
        .x(d => x(d.data.Year) + x.bandwidth() / 2)
        .y0(d => y(d[0]))
        .y1(d => y(d[1]));

      const areaZero = d3.area()
        .x(d => x(d.data.Year) + x.bandwidth() / 2)
        .y0(() => y(0))
        .y1(() => y(0));

      const t = d3.transition()
                  .duration(1200)
                  .ease(d3.easeCubicOut);

      const svg = d3.select(container).append("svg")
        .attr("width",  width)
        .attr("height", height);

      svg.append("g")
        .selectAll("path")
        .data(stacked)
        .join("path")
          .attr("fill", d => GLOBAL.colour.get(d.key))
          .attr("d", areaZero)
        .transition(t)
          .attr("d", area); 

      // const area = d3.area()
      //   .x(d => x(d.data.Year) + x.bandwidth() / 2)
      //   .y0(d => y(d[0]))
      //   .y1(d => y(d[1]));

      // const svg = d3.select(container).append("svg")
      //   .attr("width",  width)
      //   .attr("height", height);

      // svg.append("g")
      //   .selectAll("path")
      //   .data(stacked)
      //   .join("path")
      //     .attr("fill", d => GLOBAL.colour.get(d.key))
      //     .attr("d", area);

      /* axes */
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(
          x.domain().filter((_, i) => !(i % 5))
        ));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(6, "s"));

      svg.append("text")
        .attr("x", (width - margin.right + margin.left) / 2)
        .attr("y", height - margin.bottom + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .text("Year");

      svg.append("text")
          .attr("transform", `rotate(-90)`)
          .attr("x", - (height - margin.top - margin.bottom) / 2)
          .attr("y", margin.left - 50)
          .attr("text-anchor", "middle")
          .attr("font-size", 14)
          .text("CO₂ emissions (Billion Metric Tons)");

      /* legend */
      const legendPadding = 20; // distance from plot area
      const legendX = width - margin.right + legendPadding;
      const legendY = margin.top;   // start below top margin

      const legend = svg.append("g")
        .attr("transform", `translate(${legendX},${legendY})`)
        .attr("font-size", 12)
        .attr("text-anchor", "start");

      legend.selectAll("g")
        .data(GLOBAL.countries)
        .join("g")
          .attr("transform", (d, i) => `translate(0,${i * 20})`)
        .call(g => {
          g.append("rect")
             .attr("width", 14)
             .attr("height", 14)
             .attr("fill", d => GLOBAL.colour.get(d));

          g.append("text")
             .attr("x", 20)
             .attr("y", 11)
             .text(d => d);
        });

      /* ---------- annotations ---------------------------------- */
      if (annotations.length) {
        const sceneAnn = annotations.map(a => {
          if (a.type === "label") {
            /* look up the stacked height for the chosen country & year */
            const yearIdx = years.indexOf(a.year);
            const countryIdx = GLOBAL.countries.indexOf(a.country);
            const yVal = stacked[countryIdx][yearIdx][1];   // top of that layer

            return {
              type: d3.annotationLabel,
              x: x(a.year) + x.bandwidth() / 2,
              y: y(yVal),
              dx: a.dx ?? 0,
              dy: a.dy ?? 0,
              subject: { radius: 4 },
              note: { title: a.title, label: a.text },
              connector: { end: "dot" }
            };
          }

          if (a.type === "bracketY") {
            const domainTop = d3.max(stacked[stacked.length - 1], d => d[1]);
            const fromVal   = a.from === "max" ? domainTop : a.from;
            const toVal     = a.to   === "max" ? domainTop : a.to;

            return {
              type: d3.annotationBracketY,
              x: margin.left - 30,

              dx: a.dx ?? 0,
              dy: a.dy ?? 0,

              note: {
                title: a.title,
                label: a.text,
                align: "left"
              },
              subject: {
                y1: y(toVal),
                y2: y(fromVal)
              }
            };
          }

          return null;   // unknown type – skip
        }).filter(Boolean);

        svg.append("g")
          .attr("class", "annotations")
          .call(
            d3.annotation()
              .type(d3.annotationLabel)   // default; overridden per item
              .annotations(sceneAnn)
          );
      }
    });
  });
}