function drawStackedAreaLong({
  container,
  csvPath,
  metric   = "co2",
  width    = 720,
  height   = 400,
  margin   = {top: 40, right: 20, bottom: 35, left: 60},
  colors   = d3.schemeTableau10
}) {

  d3.csv(csvPath, d3.autoType).then(data => {
    /* Figure out which countries are present (top-10 file) */
    const countries = Array.from(
      new Set(data.map(d => d.country))
    );


    /* Pivot from “long” to the wide format stack() wants */
    const roll = d3.rollup(
      data,
      v => d3.sum(v, d => d[metric]),
      d => d.year,
      d => d.country
    );

    const years = Array.from(roll.keys()).sort((a, b) => a - b);

    const wideRows = years.map(year => {
      const obj = { Year: year };
      const byCountry = roll.get(year);
      countries.forEach(c => obj[c] = (byCountry?.get(c)) ?? 0);
      return obj;
    });

    /* Stack & scales */
    const stacked = d3.stack()
      .keys(countries)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)(wideRows);

    const x = d3.scaleBand()
      .domain(years)
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(stacked[stacked.length - 1], d => d[1])]).nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3.scaleOrdinal(countries, colors);

    /* Draw */
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
        .attr("fill", d => color(d.key))
        .attr("d", area);

    /* Axes */
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d,i) => !(i%5)))); // every 5 yrs

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6, "s"));

    /* Simple legend */
    const legend = svg.append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(countries)
      .join("g")
        .attr("transform", (d, i) => `translate(${margin.left},${i * 12})`);

    legend.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color);

    legend.append("text")
        .attr("x", 14)
        .attr("y", 9)
        .text(d => d);
  });
}