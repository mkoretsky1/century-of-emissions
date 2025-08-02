function drawStackedAreaSubset({
  container,
  csvPath,
  yearStart   = 1900,
  yearEnd     = 2022,
  metric      = "co2",
  width       = 1000,
  height      = 550,
  margin      = { top: 80, right: 180, bottom: 45, left: 80 },
  annotations = [],
  title       = 'Chart'
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

      const grid = d3.axisLeft(y)
        .tickSize(-(width - margin.left - margin.right))
        .tickFormat("")
        .ticks(6, "s")
        .tickSizeOuter(0);

      svg.append("g")
        .attr("class", "y-grid")
        .attr("transform", `translate(${margin.left},0)`)
        .call(grid)
        .selectAll("line")
          .attr("stroke", "#ccc")
          .attr("stroke-opacity", 0.6);
      

      svg.append("g")
        .selectAll("path")
        .data(stacked)
        .join("path")
          .attr("fill", d => GLOBAL.colour.get(d.key))
          .attr("d", areaZero)
        .transition(t)
          .attr("d", area)
        .end()
        .then(renderAnnotations); 

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
          .attr("class", "chart-title")
          .attr("x", (width - margin.right + margin.left) / 2)
          .attr("y", margin.top / 2)
          .attr("text-anchor", "middle")
          .attr("font-size", 22)
          .attr("font-weight", "600")
          .text(title);

      svg.append("text")
        .attr("x", (width - margin.right + margin.left) / 2)
        .attr("y", height - margin.bottom + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", 14)
        .text("Year");
      
      const innerHeight = height - margin.top - margin.bottom;

      svg.append("text")
          .attr("transform", `rotate(-90)`)
          .attr("x", - innerHeight / 2)
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
      function renderAnnotations () {

        if (!annotations.length) return;

        const sceneAnn = annotations.map(a => {
          const yearIdx    = years.indexOf(+a.year);
          const countryIdx = GLOBAL.countries.indexOf(a.country);
          if (yearIdx === -1 || countryIdx === -1) return null;

          const yVal = stacked[countryIdx][yearIdx][1];
          return {
            type : d3.annotationCallout,      // any callout style you like
            x    : x(a.year) + x.bandwidth() / 2,
            y    : y(yVal),
            dx   : a.dx ?? 0,
            dy   : a.dy ?? 0,
            subject   : { radius: 2 },
            note      : { title: a.title, label: a.text, wrap: a.wrap },
            connector : { end: "dot", lineType: "horizontal" }
          };
        }).filter(Boolean);

        /* draw & animate */
        const annGroup = svg.append("g")
          .attr("class", "annotations")
          .attr("opacity", 0)                    // fade in later
          .call(d3.annotation().annotations(sceneAnn));

        const baseline = y(0);                   // pixel y of the x-axis

        const t2 = d3.transition()          // new transition
               .duration(1200)
               .ease(d3.easeCubicOut);

        annGroup.selectAll(".annotation")
          .attr("transform", d => `translate(${d.x},${baseline})`)
          .transition(t2)
            .attr("transform", d => `translate(${d.x},${d.y})`);

        annGroup.transition(t2)
          .style("opacity", 1);
      }
    });
  });
}