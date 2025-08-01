document.addEventListener("DOMContentLoaded", () => {
  const scenes = [scene0, scene1, scene2];
  let sceneIndex = 0;

  function renderScene() {
    d3.select("#viz-container").html("");
    scenes[sceneIndex]();
    updateButtons();
  }

  function updateButtons() {
    document.getElementById("prev-btn").disabled = sceneIndex === 0;
    document.getElementById("next-btn").disabled = sceneIndex === scenes.length - 1;
  }

  document.getElementById("prev-btn").addEventListener("click", () => {
    if (sceneIndex > 0) { sceneIndex--; renderScene(); }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (sceneIndex < scenes.length - 1) { sceneIndex++; renderScene(); }
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key || e.code;
    if (key === "ArrowLeft" || key === "Left") {
      if (sceneIndex > 0) { sceneIndex--; renderScene(); }
      e.preventDefault();
    } else if (key === "ArrowRight" || key === "Right") {
      if (sceneIndex < scenes.length - 1) { sceneIndex++; renderScene(); }
      e.preventDefault();
    }
  });

  renderScene();
});