const GRAVITY = 0.981

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

    // Is it being dragged by a mouse
    this.followMouse = false
    this.baseFollowMouse = false

    // True when in "adding" phase
    this.ghost = false
  }
  
  update(){
    // Update angle if not in ghost mode
    if(!this.ghost){
      if(!this.followMouse){
        // angular accelration = -g*sin(theta)/R
        let force = GRAVITY * sin(this.angle)/this.length
        this.angleA = -force
        this.angleV += this.angleA
        this.angle += this.angleV
        
        // Damping
        this.angleV *= 0.99
      }else{
        let dx = mouseX - this.origin.x
        let dy = mouseY - this.origin.y

        this.angle = Math.atan(dx/dy)      
      }
    }
    
    // If user clicks on origin, follow mouse
    if(this.baseFollowMouse){
      this.origin = {x: mouseX, y: mouseY}
    }

    // Calculate position of "ball" based on angle
    this.ball.x = this.length * sin(this.angle) + this.origin.x
    this.ball.y = this.length * cos(this.angle) + this.origin.y
  }
  
  // Render pendulum
  render(){
    // Draw origin point
    noStroke()
    if(this.ghost){
      fill(30,30,30,30)
    }else{
      fill(30)
    }
    ellipse(this.origin.x, this.origin.y, ORIGIN_SIZE)

    // Draw string
    if(this.ghost){
      stroke(this.r, this.g, this.b, 100)
    }else{
      stroke(this.r, this.g, this.b)
    }
    strokeWeight(5)
    line(this.origin.x, this.origin.y, this.ball.x, this.ball.y)

    // Draw ball
    if(this.ghost){
      fill(this.r, this.g, this.b, 100)
    }else{
      fill(this.r, this.g, this.b)
    }
    noStroke()
    ellipse(this.ball.x, this.ball.y, this.mass)
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

  contains(point){
    return (distance(point, this.ball) < this.mass/2)
  }
}