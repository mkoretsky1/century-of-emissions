const PALETTE = d3.schemeTableau10.concat(d3.schemeSet3);

window.countryColour = window.countryColour || new Map();

function colourFor(country) {
  if (!window.countryColour.has(country)) {
    const next = PALETTE[window.countryColour.size % PALETTE.length];
    window.countryColour.set(country, next);
  }
  return window.countryColour.get(country);
}

function drawStackedAreaLong(opts) {
  const {
    container,
    csvPath,
    metric = "co2",
    width  = 720,
    height = 400,
    margin = {top: 40, right: 20, bottom: 35, left: 60},
  } = opts;

  d3.csv(csvPath, d3.autoType).then(data => {
    /* total CO₂ per country in *this* file, biggest first */
    const totals = d3.rollups(
      data,
      v => d3.sum(v, d => d[metric]),
      d => d.country
    ).sort((a, b) => d3.descending(a[1], b[1]));

    const countries = totals.map(([c]) => c);

    /* pivot to wide form {Year, USA:…, China:…} */
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
      countries.forEach(c => row[c] = byC?.get(c) ?? 0);
      return row;
    });

    /* stack */
    const stacked = d3.stack().keys(countries)(wide);

    /* scales */
    const x = d3.scaleBand(years, [margin.left, width - margin.right]);
    const y = d3.scaleLinear(
      [0, d3.max(stacked[stacked.length - 1], d => d[1])], 
      [height - margin.bottom, margin.top]
    );

    /* draw */
    const area = d3.area()
      .x(d => x(d.data.Year) + x.bandwidth() / 2)
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));

    const svg = d3.select(container).append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g")
      .selectAll("path")
      .data(stacked)
      .join("path")
        .attr("fill", d => colourFor(d.key))
        .attr("d", area);

    /* axes & tiny legend (unchanged) */
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((d,i)=>!(i%5))));

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(6, "s"));

    const legend = svg.append("g")
      .attr("font-size", 10)
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(countries)
      .join("g")
        .attr("transform", (d,i)=>`translate(${margin.left},${i*12})`);

    legend.append("rect").attr("width",10).attr("height",10)
      .attr("fill", d => colourFor(d));
    legend.append("text").attr("x",14).attr("y",9).text(d=>d);
  });
}