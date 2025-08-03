window.GLOBAL = {};

GLOBAL.ready = d3.csv("data/overall.csv", d3.autoType).then(all => {
  /* rank by TOTAL co2 across every year */
  const totals = d3.rollups(
    all,
    v => d3.sum(v, d => d.co2),
    d => d.country
  ).sort((a, b) => d3.descending(a[1], b[1]));

  GLOBAL.countries = totals.slice(0, 10).map(([c]) => c);
  const PALETTE = [
    "#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F",
    "#EDC948", "#B07AA1", "#FF9DA7", "#9C755F", "#BAB0AC"
  ];

  const LIGHT_PALETTE = PALETTE.map(c =>
    c === "#BAB0AC"
      ? c
      : d3.interpolateRgb(c, "#ffffff")(0.25)
  );

  // const PALETTE = d3.schemeTableau10;
  GLOBAL.colour = new Map(GLOBAL.countries.map((c, i) => [c, LIGHT_PALETTE[i]]));

  return GLOBAL;
});