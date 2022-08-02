// Array of pendulum Objects
let pendulums = []
// Selected pendulum
let selectedPendulum = undefined
// Size of "circle" at pendulum origin
const ORIGIN_SIZE = 15
// Boolean storing wether we are in add or normal mode
let addPendulum = false
let newPendulum = undefined

/*
    Returns the distance between points a and b
*/
function distance(a, b){
  let x = b.x - a.x
  let y = b.y - a.y
  return Math.sqrt((x*x + y*y))
}

function addRandomPendulums(){
    for(let i = 0; i < 10; i++)
        pendulums.push(new Pendulum(100 + i * 45, 0, 150 + 15*i, 34 + Math.random()*15, PI/4))
}

function setup() {
  createCanvas(450, 450);
  
  pendulums.push(new Pendulum(100, 50, 200, 55, -PI/4))
  pendulums.push(new Pendulum(200, 50, 200, 55, PI/4))
}

function draw() {
  background(50);
  
  for(let p of pendulums){
    p.update()
    p.render()
    p.collides()
  }

  if(addPendulum){
    // Update and render "ghost" pendulum
    newPendulum.update()
    newPendulum.render()

    // Draw "add" icon at top
    stroke(100, 220, 100)
    line(width - 40, 30, width - 20, 30)
    line(width - 30, 40, width - 30, 20)
  }
}

function mousePressed(){
  m = {x: mouseX, y: mouseY}

  // If we click in add mode, add this new pendulum to pendulums
  if(addPendulum){
    newPendulum.baseFollowMouse = false
    newPendulum.ghost = false
    pendulums.push(newPendulum)
    newPendulum = undefined
    addPendulum = false
    return
  }

  // If a pendulum is already selected, release it
  if(selectedPendulum){
    selectedPendulum.followMouse = false 
    selectedPendulum.baseFollowMouse = false
    selectedPendulum = undefined
    return  // Don't execute rest of code
  }

  // Check if we are clicking on any pendulums
  for(let p of pendulums){
    if(p.contains(m)){  // Clicking on pendulum ball
      selectedPendulum = p
      p.followMouse = true
      return // Don't check rest
    }else if(distance(p.origin, m) < ORIGIN_SIZE/2){  // Clicking on pendulum origin
      selectedPendulum = p
      p.baseFollowMouse = true
      return // Don't check rest
    }
  }
}


function keyPressed(){
  // If user presses key "d" while a pendulum is selected
  if(key === "d" && selectedPendulum){
    pendulums = pendulums.filter(x => x != selectedPendulum)
    selectedPendulum = undefined
  }else if(key === "a") {
    // If user presses key "a" enter "add" mode
    
    // If a pendulum was selected, deselect it
    if(selectedPendulum){
      selectedPendulum.followMouse = false 
      selectedPendulum.baseFollowMouse = false
      selectedPendulum = undefined
      return
    }

    if(newPendulum){
      // Leave "add" mode and make the newPendulum undefined
      newPendulum = undefined
    }else{
      // Create new pendulum
      newPendulum = new Pendulum(mouseX, mouseY, 100, 45, PI/8)
      // Make pendulum origin follow mouse
      newPendulum.baseFollowMouse = true
      // Make pendulum render as ghost
      newPendulum.ghost = true
    }

    addPendulum = !addPendulum  // Toggle add mode
  }
}