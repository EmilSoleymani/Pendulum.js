const GRAVITY = 0.981

/*
    Returns the distance between points a and b
*/
function distance(a, b){
  let x = b.x - a.x
  let y = b.y - a.y
  return Math.sqrt((x*x + y*y))
}

class Pendulum {
  constructor(x, y, length, mass, initial_angle){
    // Origin Point
    this.origin = {x: x, y: y}
    
    // Length and mass of pendulum
    this.length = length
    this.mass = mass
    
    // Angle, angular velocity and angular acceleration
    this.angle = initial_angle
    this.angleV = 0
    this.angleA = 0
    
    // Position of "ball" attached to string of pendulum
    this.ball = {x: 0, y: 0}
    
    // Randomly color each pendulum
    this.r = Math.random() * 255
    this.g = Math.random() * 255
    this.b = Math.random() * 255
  }
  
  update(){
    // angular accelration = -g*sin(theta)/R
    let force = GRAVITY * sin(this.angle)/this.length
    this.angleA = -force
    this.angleV += this.angleA
    this.angle += this.angleV
    
    // Damping
    this.angleV *= 0.99

    // Calculate position of "ball" based on angle
    this.ball.x = this.length * sin(this.angle) + this.origin.x
    this.ball.y = this.length * cos(this.angle) + this.origin.y
  }
  
  // Render pendulum
  render(){
    fill(this.r, this.g, this.b)
    noStroke()
    ellipse(this.ball.x, this.ball.y, this.mass)

    stroke(this.r, this.g, this.b)
    strokeWeight(5)
    line(this.origin.x, this.origin.y, this.ball.x, this.ball.y)
  }
  
  collides(){
    // Check collision with all other pendulums
    for(let other of pendulums){
      if(distance(other.ball, this.ball) < this.mass/2+other.mass/2){
        // Equations from https://en.wikipedia.org/wiki/Elastic_collision
        let m1 = this.mass
        let u1 = this.angleV
        let m2 = other.mass
        let u2 = other.angleV
        
        let v1 = (u1 * (m1 - m2) / (m1 + m2)) + ((2 * u2 * m2) / (m1 + m2))
        let v2 = ((2 * m1  * u1) / (m1 + m2)) + (u2 * (m2 - m1) / (m1 + m2))
        
        if(this.ball.x < other.ball.x){
          this.ball.x = other.ball.x - other.ball.mass/2 - this.ball.mass/2
          other.ball.x = this.ball.x + this.ball.mass/2 + other.ball.mass/2
        }
        
        this.angleV = v1 * 0.99  // Inelastic collisions
        other.angleV = v2 * 0.99
      }
    }
  }
}