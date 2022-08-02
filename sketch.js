let pendulums = []

function addRandomPendulums(){
    for(let i = 0; i < 10; i++)
        pendulums.push(new Pendulum(100 + i * 45, 0, 150 + 15*i, 34 + Math.random()*15, PI/4))
}

function setup() {
  createCanvas(450, 450);
  
  pendulums.push(new Pendulum(100, 0, 200, 55, -PI/4))
  pendulums.push(new Pendulum(200, 0, 200, 55, PI/4))
}

function draw() {
  background(50);
  
  for(let p of pendulums){
    p.update()
    p.render()
    p.collides()
  }
  
}