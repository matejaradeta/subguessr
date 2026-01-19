const map = document.getElementById("map");
const container = map.parentElement; // parent div to position dots
let selectedLayer = null;

// World dimensions
const worldWidth = 4000;  // -2000 → 2000
const worldHeight = 4000;

// Example target in world coordinates
const target = { x: 800, z: -600 };

// Layer buttons
document.querySelectorAll("#layers button").forEach(btn => {
  btn.onclick = () => {
    selectedLayer = btn.dataset.layer;
    console.log("Layer selected:", selectedLayer);
  };
});

// Click on map
map.addEventListener("click", e => {
  if (!selectedLayer) {
    alert("Choose a layer first!");
    return;
  }

  // mx, my = click coordinates relative to the image itself
  const mx = e.offsetX;
  const my = e.offsetY;

  console.log("Click in image:", mx, my);

  // Convert to world coordinates
  const worldX = (mx / map.width) * worldWidth - worldWidth / 2;
  const worldZ = (my / map.height) * worldHeight - worldHeight / 2;

  console.log("World coords:", worldX.toFixed(0), worldZ.toFixed(0));

  // Remove old dots
  container.querySelectorAll(".dot").forEach(dot => dot.remove());

  // Draw guess dot
  const guessDot = document.createElement("div");
  guessDot.className = "dot";
  guessDot.style.position = "absolute";
  guessDot.style.width = "10px";
  guessDot.style.height = "10px";
  guessDot.style.backgroundColor = "red";
  guessDot.style.borderRadius = "50%";
  guessDot.style.left = `${mx - 5}px`;
  guessDot.style.top = `${my - 5}px`;
  container.appendChild(guessDot);

  // Draw target dot
  const targetX = ((target.x + worldWidth/2) / worldWidth) * map.width;
  const targetZ = ((target.z + worldHeight/2) / worldHeight) * map.height-1000px;

  const targetDot = document.createElement("div");
  targetDot.className = "dot";
  targetDot.style.position = "absolute";
  targetDot.style.width = "10px";
  targetDot.style.height = "10px";
  targetDot.style.backgroundColor = "green";
  targetDot.style.borderRadius = "50%";
  targetDot.style.left = `${targetX - 5}px`;
  targetDot.style.top = `${targetZ - 5}px`;
  container.appendChild(targetDot);
});
