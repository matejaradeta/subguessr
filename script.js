const map = document.getElementById("map");

let selectedLayer = null;

document.querySelectorAll("#layers button").forEach(btn => {
  btn.onclick = () => {
    selectedLayer = btn.dataset.layer;
    console.log("Layer:", selectedLayer);
  };
});

map.addEventListener("click", e => {
  if (!selectedLayer) {
    alert("Choose a layer first!");
    return;
  }

  const rect = map.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  console.log("Map click:", mx, my);
});
