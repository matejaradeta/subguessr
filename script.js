const map = document.getElementById("map");
const container = map.parentElement; // container div to position dots
let selectedLayer = null;

// World dimensions
const worldWidth = 4000;  // X-axis: -2000 → 2000
const worldHeight = 4000; // Z-axis: -2000 → 2000

// Example target (in world coordinates)
const target = { x: 800, z: -600 };

// Layer selection
document.querySelectorAll("#layers button").forEach(btn => {
  btn.onclick = () => {
    selectedLayer = btn.dataset.layer;
    console.log("Layer selected:", selectedLayer);

    // Optional: Change map image based on layer
    if (selectedLayer === "surface") map.src = "maps/surface.png";
    else if (selectedLayer === "jellyshroom") map.src = "maps/jellyshroom.png";
    else if (selectedLayer === "lost_river") map.src = "maps/lost_river.png";
  };
});

// Click on map
map.addEventListener("click", e => {
  if (!selectedLayer) {
    alert("Choose a layer first!");
    return;
  }

  // Click relative to image
  const mx = e.offsetX;
  const my = e.offsetY;

  // Convert to world coordinates
  const worldX = (mx / map.width) * worldWidth - worldWidth / 2;
  const worldZ = (my / map.height) * worldHeight - worldHeight / 2;

  console.log("World coords:", worldX.toFixed(0), worldZ.toFixed(0));

  // Distance to target
  const dx = worldX - target.x;
  const dz = worldZ - target.z;
  const distance = Math.sqrt(dx*dx + dz*dz);
  console.log("Distance to target:", distance.toFixed(0), "units");

  // Remove old dots
  container.querySelectorAll(".dot").forEach(dot => dot.remove());

  // Draw guess dot (shifted down by 1000px)
  const guessDot = document.createElement("div");
  guessDot.className = "dot";
  guessDot.style.position = "absolute";
  guessDot.style.width = "10px";
  guessDot.style.height = "10px";
  guessDot.style.backgroundColor = "red";
  guessDot.style.borderRadius = "50%";
  guessDot.style.left = `${mx - 5}px`;
  guessDot.style.top = `${my - 5 + 500}px`; // <-- 1000px downward shift
  container.appendChild(guessDot);

  // Draw target dot (shifted down by 1000px)
  const targetX = ((target.x + worldWidth/2) / worldWidth) * map.width;
  const targetZ = ((target.z + worldHeight/2) / worldHeight) * map.height;

  const targetDot = document.createElement("div");
  targetDot.className = "dot";
  targetDot.style.position = "absolute";
  targetDot.style.width = "10px";
  targetDot.style.height = "10px";
  targetDot.style.backgroundColor = "green";
  targetDot.style.borderRadius = "50%";
  targetDot.style.left = `${targetX - 5}px`;
  targetDot.style.top = `${targetZ - 5 + 500}px`; // <-- 1000px downward shift
  container.appendChild(targetDot);
});
