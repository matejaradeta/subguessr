const map = document.getElementById("map")
const scoretxt = document.getElementById("scoretxt")
const roundtxt= document.getElementById("roundtxt")
const lockin = document.getElementById("lockin")
const scene = document.getElementById("scene")
const startScreen = document.getElementById("startScreen")
const gameUI= document.getElementById("gameui")
const startbtn= document.getElementById("startbtn")
const finish= document.getElementById("finish")
const finishscore = document.getElementById("finishscore")
const container = document.getElementById("mapWrapper");

let selectedLayer = "surface";
let locations = [];
let img= null;

//Setup game
let GameStarted = false;
let LastRound = false;


// Setup rounds
let LockedIn = false;
let round = 1;
let target =null;
let score=0;
let lastDistance = 0; 


// Setup json
fetch("data/locations.json")
  .then(response => response.json())
  .then(data => {
    locations = data;
    console.log("Locations loaded:", locations);
    
  })
  .catch(err => console.error("Failed to load locations:", err));

// World dimensions
const worldWidth = 4000;  // X-axis: -2000 → 2000
const worldHeight = 4000; // Z-axis: -2000 → 2000



function showGameUI()
{
  gameUI.classList.remove("hidden");
  startScreen.classList.add("hidden");
}

//Game Start
function GameStart()
{
  GameStarted= true;
  setupRound();
  showGameUI();
  
}
function FinishGame()
{
  gameUI.classList.add("hidden");
  startScreen.classList.add("hidden");
  finishscore.classList.remove("hidden");
  finishscore.innerText = "Final score is: "+ score;
  finish.classList.add("hidden");
  container.querySelectorAll(".dot").forEach(dot => dot.remove());



}
startbtn.onclick=()=>{
  GameStart();

}
finish.onclick=()=>{
  FinishGame();
}


// Layer selection
document.querySelectorAll("#layers button").forEach(btn => {
  btn.onclick = () => {
    if(!LockedIn){
      selectedLayer = btn.dataset.layer;
      console.log("Layer selected:", selectedLayer);

      
      if (selectedLayer === "surface") map.src = "maps/surface.png";
      else if (selectedLayer === "jellyshroom") map.src = "maps/jellyshroom.png";
      else if (selectedLayer === "lost_river") map.src = "maps/lost_river.png";
      else if (selectedLayer === "lava_lakes") map.src = "maps/lava_lakes.png";
      else if (selectedLayer === "lava_zone") map.src = "maps/lava_zone.png";
    };
    
  };
});
function mapClick(e)
{
  if (LockedIn) return;

  if (!target) {
    alert("Locations are still loading. Please wait...");
    return;
  }
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
    const distance = Math.sqrt(dx * dx + dz * dz);
    lastDistance=distance;
    console.log("Distance to target:", distance.toFixed(0), "units");

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
    guessDot.style.top  = `${my - 5}px`;

    container.appendChild(guessDot);
}

// Map click
map.addEventListener("click", e => {
  if (!LockedIn) {
    mapClick(e);
  }
});

// Function to draw target dot (outside the click listener)
function DrawTarget() {
  const targetX = ((target.x + worldWidth / 2) / worldWidth) * map.width;
  const targetZ = ((target.z + worldHeight / 2) / worldHeight) * map.height;

  const targetDot = document.createElement("div");
  targetDot.className = "dot";
  targetDot.style.position = "absolute";
  targetDot.style.width = "10px";
  targetDot.style.height = "10px";
  targetDot.style.backgroundColor = "green";
  targetDot.style.borderRadius = "50%";
  targetDot.style.left = `${targetX - 5}px`;
  targetDot.style.top  = `${targetZ - 5}px`;

  container.appendChild(targetDot);
}
function setupRound()
{
  LockedIn=false;
  container.querySelectorAll(".dot").forEach(dot => dot.remove());
  lockin.innerText = "Lock In"; // reset button text
  
  const randomIndex = Math.floor(Math.random() * locations.length);
  target = locations.splice(randomIndex, 1)[0];
  
  selectedLayer = target.layer;
  map.src = `maps/${selectedLayer}.png`;
  img = target.ss;
  scene.src = `images/${img}.jpg`;
  console.log("New target for this round:", target);
  
}
function goNext() {
  round += 1;
  if (round > 5) {
    FinishGame(); // after the last round
  } else {
    roundtxt.innerText = "Round: " + round + "/5";
    setupRound();
  }
}

function LockIn() {
  LockedIn = true;
  DrawTarget();
  score += Math.max(Math.floor(5000 - 5*(Math.max(125,lastDistance)-125)), 0);
  scoretxt.innerText = "Score: " + score;

  if (round === 5) {
    finish.classList.remove("hidden");
    lockin.disabled = true; // optional: disable lock-in button
  } else {
    lockin.innerText = "Go Next";
  }
}



// Lock in button
lockin.onclick = () => {
  if(!LockedIn)
  {
     LockIn();
  }
  else{
    goNext();

  };
 

};
