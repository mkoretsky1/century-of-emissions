document.addEventListener("DOMContentLoaded", () => {
  const scenes = [ scene0, scene1, scene2 ];
  const sceneLabels = [
    "WWI & Depression Era",
    "WWII & Post-War Era",
    "Digital & Global Era"
  ];
  const sceneDescriptions = [
    'This period begins at the turn of the 20th century and ends with the start of World War II. It is marked by two major historical events: World War I and the Great Depression. The United States was far and away the largest emitter of CO₂ during this time period, accounting for nearly half of the top-10 countries total CO₂ emissions. The next largest emitters were Germany and the United Kingdom.',
    'This period begins with the start of World War II and ends with the fall of the Soviet Union. During this time global emissions increased by about 3.5x due to a period of unprecedented economic growth and increased industrial output. The United States remains the largest CO₂-emitting country during this time period, followed by China and Russia who emerged as new global superpowers.',
    'This period begins with the fall of the Soviet Union and ends in 2022, which is the most recent year that Our World in Data has CO₂ emissions data for. This period is marked by the rise of the internet and digital economies, as well as the increased globalization of manufacturing. China is the largest CO₂ emitter during this time period, followed by the United States. India also emerges as a manufacturing and population hub, causing it to become the worlds third-largest CO₂-emitting country.'
  ]

  let sceneIndex = 0;

  //  ● grab the container
  const sceneButtonsDiv = document.getElementById("scene-buttons");

  //  ● for each scene, make a button
  scenes.forEach((sceneFn, idx) => {
    const btn = document.createElement("button");
    btn.classList.add("scene-btn");
    btn.textContent = sceneLabels[idx];;
    btn.addEventListener("click", () => {
      sceneIndex = idx;
      renderScene();
    });
    sceneButtonsDiv.appendChild(btn);
  });

  function renderScene() {
    d3.select("#viz-container").html("");
    scenes[sceneIndex]();
    updateButtons();
    document.getElementById("scene-text").innerHTML = `<p>${sceneDescriptions[sceneIndex]}</p>`;
  }

  function updateButtons() {
    // disable/enable prev & next as before
    document.getElementById("prev-btn").disabled = sceneIndex === 0;
    document.getElementById("next-btn").disabled = sceneIndex === scenes.length - 1;

    // highlight the active scene button
    document.querySelectorAll(".scene-btn").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === sceneIndex);
    });
  }

  // existing prev/next handlers
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (sceneIndex > 0) { sceneIndex--; renderScene(); }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (sceneIndex < scenes.length - 1) { sceneIndex++; renderScene(); }
  });

  // existing arrow-key handling
  window.addEventListener("keydown", e => {
    if ((e.key === "ArrowLeft" || e.key === "Left") && sceneIndex > 0) {
      sceneIndex--; renderScene(); e.preventDefault();
    }
    if ((e.key === "ArrowRight" || e.key === "Right") && sceneIndex < scenes.length - 1) {
      sceneIndex++; renderScene(); e.preventDefault();
    }
  });

  renderScene();
});