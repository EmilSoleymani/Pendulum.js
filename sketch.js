// Array of pendulum Objects
let pendulums = []
// Selected pendulum
let selectedPendulum = undefined
// Size of "circle" at pendulum origin
const ORIGIN_SIZE = 15
// Boolean storing wether we are in add or normal mode
let addPendulum = false
let newPendulum = undefined

// Sliders
let lengthSlider, massSlider, initialAngleSlider, gravitySlider, dampingSlider
let GRAVITY
let DAMPING

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

function initSliders(){
  // Constants Sliders
  gravitySlider = createSlider(0, 10, 0.98, 0.01)
  gravitySlider.position(width/4 - gravitySlider.width/2, height - gravitySlider.height - 50)
  dampingSlider = createSlider(0, 20, 1, 0.05)
  dampingSlider.position(width/4 - dampingSlider.width/2, height - dampingSlider.height - 20)
  // New Pendulum Variables Slider
  lengthSlider = createSlider(50, 400, 100)
  lengthSlider.position(3*width/4 - lengthSlider.width/2, height - lengthSlider.height - 20)
  massSlider = createSlider(25, 65, 45, 0.5)
  massSlider.position(3*width/4 - massSlider.width/2, height - massSlider.height - 50)
  initialAngleSlider = createSlider(0, PI/2, PI/4, 0.0174533/2)  // 0.0174533rad = 1 degree
  initialAngleSlider.position(3*width/4 - initialAngleSlider.width/2, height - initialAngleSlider.height - 80)
}

function setup() {
  createCanvas(800, 700);
  
  initSliders()
}

function drawSliderLabels(){
  // Draw Constants Labels
  fill(255)
  noStroke()
  textSize(20)
  text("Gravity: ", gravitySlider.x - 75, gravitySlider.y + 16)
  text("Damping: ", dampingSlider.x - 90, dampingSlider.y + 16)
  text(gravitySlider.value().toFixed(2), gravitySlider.x + gravitySlider.width + 10, gravitySlider.y + 16)
  text((dampingSlider.value()/100).toFixed(2), dampingSlider.x + dampingSlider.width + 10, dampingSlider.y + 16)

  // Draw Variables Labels
  text("Angle: ", initialAngleSlider.x - 65, initialAngleSlider.y + 16)
  text("Mass: ", massSlider.x - 60, massSlider.y + 16)
  text("Length: ", lengthSlider.x - 74, lengthSlider.y + 16)
  text(degrees(initialAngleSlider.value()).toFixed(1), initialAngleSlider.x + initialAngleSlider.width + 10, initialAngleSlider.y + 16)
  text(massSlider.value().toFixed(1), massSlider.x + massSlider.width + 10, massSlider.y + 16)
  text(lengthSlider.value().toFixed(0), lengthSlider.x + lengthSlider.width + 10, lengthSlider.y + 16)
}

function draw() {
  background(50);
  
  GRAVITY = gravitySlider.value()
  DAMPING = dampingSlider.value()/100

  drawSliderLabels()

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
      // Create new pendulum based on slider values
      newPendulum = new Pendulum(mouseX, mouseY, lengthSlider.value(), massSlider.value(), initialAngleSlider.value())
      // Make pendulum origin follow mouse
      newPendulum.baseFollowMouse = true
      // Make pendulum render as ghost
      newPendulum.ghost = true
    }

    addPendulum = !addPendulum  // Toggle add mode
  }
}