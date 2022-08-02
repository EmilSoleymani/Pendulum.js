// Array of pendulum Objects
let pendulums = []
// Selected pendulum
let selectedPendulum = undefined
// Size of "circle" at pendulum origin
const ORIGIN_SIZE = 15

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
}

function mousePressed(){
  m = {x: mouseX, y: mouseY}

  if(selectedPendulum){
    selectedPendulum.followMouse = false 
    selectedPendulum.baseFollowMouse = false
    selectedPendulum = undefined
    return
  }

  for(let p of pendulums){
    if(p.contains(m)){
      selectedPendulum = p
      p.followMouse = true
      return // Don't check rest
    }else if(distance(p.origin, m) < ORIGIN_SIZE/2){
      selectedPendulum = p
      p.baseFollowMouse = true
      // p.angle = 0
      return // Don't check rest
    }
  }
}


function keyPressed(){
  if(key === "d" && selectedPendulum){
    console.log("Deleting pendulum ", selectedPendulum)
    pendulums = pendulums.filter(x => x != selectedPendulum)
    selectedPendulum = undefined
  }
}