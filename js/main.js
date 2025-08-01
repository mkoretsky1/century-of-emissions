let sceneIndex = 0;
const scenes = [drawScene0, drawScene1, drawScene2];

function renderScene() {
  d3.select("#viz-container").html("");
  scenes[sceneIndex]();
  updateButtons();
}

function updateButtons() {
  document.getElementById("prev-btn").disabled = sceneIndex === 0;
  document.getElementById("next-btn").disabled = sceneIndex === scenes.length - 1;
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (sceneIndex > 0) { sceneIndex--; renderScene(); }
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    if (sceneIndex < scenes.length - 1) { sceneIndex++; renderScene(); }
  });

  renderScene();
});