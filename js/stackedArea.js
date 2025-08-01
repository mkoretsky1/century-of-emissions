function drawStackedAreaSubset({
  container,
  csvPath,
  yearStart = 1900,
  yearEnd   = 2022,
  metric    = "co2",
  width     = 720,
  height    = 400,
  margin    = {top: 40, right: 20, bottom: 35, left: 60}
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

      const svg = d3.select(container).append("svg")
        .attr("width",  width)
        .attr("height", height);

      svg.append("g")
        .selectAll("path")
        .data(stacked)
        .join("path")
          .attr("fill", d => GLOBAL.colour.get(d.key))
          .attr("d", area);

      /* axes */
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(
          x.domain().filter((_, i) => !(i % 5))
        ));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(6, "s"));

      /* legend */
      const legend = svg.append("g")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(GLOBAL.countries)
        .join("g")
          .attr("transform", (d, i) => `translate(${margin.left},${i * 12})`);

      legend.append("rect")
          .attr("width", 10).attr("height", 10)
          .attr("fill", d => GLOBAL.colour.get(d));

      legend.append("text")
          .attr("x", 14).attr("y", 9)
          .text(d => d);
    });
  });
}