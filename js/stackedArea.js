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

      const dataByCountry = d3.group(data, d => d.country);

      const sparkWidth  = 100;
      const sparkHeight =  40;
      const sparkMargin = { top: 2, right: 2, bottom: 2, left: 2 };

      // a simple line generator for sparklines:
      const sparkLine = d3.line()
        .x(d => sparkX(d.year))
        .y(d => sparkY(d.value));

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

      let tip = d3.select(container).select(".tooltip");
      if (tip.empty()) {
        tip = d3.select(container)
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "#fff")
          .style("border", "1px solid #999")
          .style("border-radius", "4px")
          .style("padding", "6px 8px")
          .style("pointer-events", "none")
          .style("font-size", "12px")
          .style("box-shadow", "0 2px 6px rgba(0,0,0,0.3)")
          .style("opacity", 0);
      }

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
      
      /* 1 ▸ draw the areas once and keep the paths in `layer` */
      /* 1 ▸ draw the areas once and keep the paths in `layer` */
      const layer = svg.append("g")
        .selectAll("path")
        .data(stacked)
        .join("path")
          .attr("fill", d => GLOBAL.colour.get(d.key))
          .attr("d", areaZero)
          .attr("pointer-events", "all");   // enable hover

      /* 2 ▸ animate them in, then call renderAnnotations */
      layer.transition(t)
          .attr("d", area)
          .end()
          .then(renderAnnotations);

      /* 3 ▸ attach tooltip + highlight listeners (same as before) */
      const HIGHLIGHT_STROKE   = "#000";
      const HIGHLIGHT_STROKE_W = 1.2;
      const DIM_OPACITY        = 0.75;

      layer.on("mouseover", function (event, series) {
              layer.attr("fill-opacity", DIM_OPACITY);

              d3.select(this)
                .raise()
                .attr("fill-opacity", 1)
                .attr("stroke", HIGHLIGHT_STROKE)
                .attr("stroke-width", HIGHLIGHT_STROKE_W);

              tip.style("opacity", 1);
              handleMove(event, series);           // `series` is already bound data
            })
          .on("mousemove", function (event, series) {
              handleMove(event, series);
            })
          .on("mouseout", function () {
              layer.attr("fill-opacity", 1).attr("stroke", null);
              tip.style("opacity", 0);
            });

      /* helper (place once, e.g. after you build `years`) */
      const bisectYear = d3.bisector(d => d).left;

      function handleEnter(event, series) {
        tip.style("opacity", 1);
        d3.select(this).attr("stroke", "#000").attr("stroke-width", 1.2);
        handleMove(event, series);
      }

      function handleMove(event, series) {
        // 1️⃣ get the full time-series for this country
        const countryData = dataByCountry.get(series.key);
        if (!countryData) return;

        // 2️⃣ compute total temperature change
        const endTemp   = countryData[countryData.length - 1].temperature_change_from_co2;
        const totalCO2 = d3.sum(countryData, d => d.co2);

        // 3️⃣ build two small datasets for the sparklines
        const gdpSeries = countryData
          .map(d => ({ year: d.year, value: d.gdp_per_capita }))
          .filter(d => d.value != null);

        const co2Series = countryData
          .map(d => ({ year: d.year, value: d.co2_per_capita }))
          .filter(d => d.value != null);

        // 4️⃣ clear existing tooltip content
        tip.html("")  
          .style("left",  (event.pageX + 12) + "px")
          .style("top",   (event.pageY - 28) + "px");

        tip.append("div")
          .html(`
            <strong>${series.key}</strong><br/>
            CO₂ Emitted (Billion Metric Tons): ${d3.format(".2f")(totalCO2)}<br/>
            Cumulative Temperature Change from CO₂: ${
              isNaN(endTemp)
                ? "N/A"
                : d3.format("+.2f")(endTemp)
            } °C
          `)
          .style("margin-bottom", "6px");

        function maybeSpark(container, data, color, label) {
          // ① wrapper DIV for centering
          const wrap = container.append("div")
            .style("text-align", "center")
            .style("margin", "8px 0");

          // ② label
          wrap.append("div")
              .style("font-size", "11px")
              .text(label);

          if (data.length < 2) {
            wrap.append("div")
                .style("font-size", "10px")
                .style("font-style", "italic")
                .style("color", "#666")
                .text("Data unavailable");
            return;
          }

          // ③ SVG
          const svgSpark = wrap.append("svg")
            .attr("width",  sparkWidth)
            .attr("height", sparkHeight)
            .style("display", "inline-block");  // so centering works

          // ④ scales
          const sparkX = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([sparkMargin.left, sparkWidth  - sparkMargin.right]);

          const sparkY = d3.scaleLinear()
            .domain(d3.extent(data, d => d.value))
            .range([sparkHeight - sparkMargin.bottom, sparkMargin.top]);

          // ⑤ line
          const line = d3.line()
            .x(d => sparkX(d.year))
            .y(d => sparkY(d.value));

          svgSpark.append("path")
            .datum(data)
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5);
        }
        const sparkWrapper = tip.append("div")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("gap", "12px")        // space between the two
            .style("margin-top", "6px");

        maybeSpark(sparkWrapper, gdpSeries, "#1f77b4", "GDP Per Capita");
        maybeSpark(sparkWrapper, co2Series, "#ff7f0e", "CO₂ Per Capita");
      }

      function handleLeave() {
        tip.style("opacity", 0);
        d3.select(this).attr("stroke", null);
      }

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
          .attr("y", margin.top * 0.4)
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
          .attr("x", - (margin.top + innerHeight / 2))
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