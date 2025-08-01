let sceneIndex = 0;
const scenes = [scene0, scene1, scene2];

function changeScene(delta) {
  sceneIndex = (sceneIndex + delta + scenes.length) % scenes.length;
  d3.select("#viz-container").html(""); // clear
  scenes[sceneIndex](); // draw
}

// Auto-start with scene 0
window.onload = () => {
  scenes[0]();
};