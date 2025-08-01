let sceneIndex = 0;
const scenes = [drawScene0, drawScene1, drawScene2];

function changeScene(delta) {
  sceneIndex = Math.max(0, Math.min(sceneIndex + delta, scenes.length - 1));
  d3.select("#viz-container").html(""); // clear previous scene
  scenes[sceneIndex](); // render new scene
  updateButtonStates(); // disable/enable buttons as needed
}

function updateButtonStates() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.disabled = sceneIndex === 0;
  nextBtn.disabled = sceneIndex === scenes.length - 1;
}

window.onload = () => {
  scenes[0]();
  updateButtonStates();
};