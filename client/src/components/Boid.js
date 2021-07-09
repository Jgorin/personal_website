import Triangle from "./shapes/Triangle"

const defaultBoid = {
  x: 500,
  y: 500,
  radius: 10,
  rot: 90,
  color: "#000000"
}

const SPEED = 5

const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

class Boid{
  constructor(ctx, attributes = defaultBoid, speed = SPEED) {
    this.ctx = ctx
    this.triangle = new Triangle(attributes)
    this.triangle.draw(ctx)
    this.speed = speed
    this.viewRadius = 90
    this.viewAngle = 200
    this.doDrawVectors = false
  }

  requestAnimation(boids){
    const neighbors = this.boidsInFOV(boids)
    if(neighbors.length > 0){
      const alignmentVector = this.align(neighbors)
      const separationVector = this.separate(neighbors)
      const cohesionVector = this.cohere(neighbors)
      const combinedVector = { x: (alignmentVector.x * 6 + separationVector.x * 20 + cohesionVector.x * 3 ) / 3, y: (alignmentVector.y * 6+ separationVector.y * 20 + cohesionVector.y * 3) / 3 }
      const combinedRot = calcAngleDegrees(combinedVector.x, combinedVector.y)
      const diffRot = combinedRot - this.triangle.rotation
      debugger
      this.triangle.rotate(diffRot / 70)
      if(this.doDrawVectors){
        this.drawVectors(alignmentVector, separationVector, cohesionVector)
      }
    }
    this.move({x: this.triangle.forward.x * this.speed, y: this.triangle.forward.y * this.speed})
    this.checkOutOfBounds()
  }

  move(direction){
    this.triangle.setPosition({ x: this.triangle.position.x + direction.x, y: this.triangle.position.y + direction.y})
    this.triangle.draw(this.ctx)
  }

  separate(neighbors) {
    let separationVector = { x: 0, y: 0 }
    for(let i = 0; i < neighbors.length; i++){
      const b = neighbors[i]
      let distVector = { x: b.triangle.position.x - this.triangle.position.x, y: b.triangle.position.y - this.triangle.position.y }
      let distance = signedDist(b.triangle.position, this.triangle.position)
      const normDistVec = normalize(distVector)
      const vec = { x: (normDistVec.x / distance) * 10 , y: (normDistVec.y / distance) * 10}
      separationVector.x -= vec.x
      separationVector.y -= vec.y
    }
    return { x: separationVector.x / neighbors.length, y: separationVector.y / neighbors.length }
  }

  align(neighbors){
    let alignmentVector = { x: 0, y: 0 }
    for(let i = 0; i < neighbors.length; i++){
      alignmentVector.x += neighbors[i].triangle.forward.x
      alignmentVector.y += neighbors[i].triangle.forward.y
    }
    return { x: alignmentVector.x / neighbors.length, y: alignmentVector.y / neighbors.length }
  }

  cohere(neighbors) {
    let centerPoint = { x: 0, y: 0 }
    for(let i = 0; i < neighbors.length; i++){
      centerPoint.x += neighbors[i].triangle.position.x
      centerPoint.y += neighbors[i].triangle.position.y
    }
    centerPoint.x = centerPoint.x / neighbors.length
    centerPoint.y = centerPoint.y / neighbors.length
    return normalize({x: centerPoint.x - this.triangle.position.x, y: centerPoint.y - this.triangle.position.y})
  }
  

  boidsInFOV(boids){
    let ans = []
    for(let i = 0; i < boids.length; i++){
      if(boids[i] !== this){
        let distance = dist(boids[i].triangle.position, this.triangle.position)
        if(distance <= this.viewRadius && this.inViewAngle(boids[i])){
          ans.push(boids[i])
        }
      }
    }
    return ans
  }
  
  checkOutOfBounds(){
    let numOuts = [0, 0, 0, 0]
    for(let i = 0; i < 3; i++){
      if(this.triangle.position.x < 0){
        numOuts[0] += 1
      }
      if(this.triangle.position.y < 0){
        numOuts[1] += 1
      }
      if(this.triangle.position.x > this.ctx.canvas.width){
        numOuts[2] += 1
      }
      if(this.triangle.position.y > this.ctx.canvas.height){
        numOuts[3] += 1
      }
    }
    if(numOuts[0] > 2){
      this.triangle.setPosition({ x: this.ctx.canvas.width, y: this.triangle.position.y })
      this.triangle.rotate(random(-10, 10))
    }
    if(numOuts[1] > 2){
      this.triangle.setPosition({ x: this.triangle.position.x, y: this.ctx.canvas.height })
      this.triangle.rotate(random(-10, 10))
    }
    if(numOuts[2] > 2){
      this.triangle.setPosition({ x: 0, y: this.triangle.position.y })
      this.triangle.rotate(random(-10, 10))
    }
    if(numOuts[3] > 2){
      this.triangle.setPosition({ x: this.triangle.position.x, y: 0 })
      this.triangle.rotate(random(-10, 10))
    }
  }

  inViewAngle(boid){
    const deltaX = boid.triangle.position.x - this.triangle.position.x
    const deltaY = boid.triangle.position.y - this.triangle.position.y
    const degreesToBoid = calcAngleDegrees(deltaX, deltaY)
    const deltaDegrees = this.triangle.rotation - degreesToBoid
    if(deltaDegrees <= this.viewAngle){
      return true
    }
    return false
  }

  drawVectors(v1, v2, v3){
    const pos = {x: this.triangle.position.x, y: this.triangle.position.y}

    // //alignmentVector (orange)
    // this.ctx.beginPath()
    // this.ctx.moveTo(pos.x, pos.y)
    // this.ctx.lineTo(pos.x + v1.x * 100, pos.y + v1.y * 100)
    // this.ctx.strokeStyle = "#fcba03"
    // this.ctx.stroke()
    // this.ctx.closePath()

    // //separationVector (Red)
    // this.ctx.beginPath()
    // this.ctx.moveTo(pos.x, pos.y)
    // this.ctx.lineTo(pos.x + v2.x * 1000, pos.y + v2.y * 1000)
    // this.ctx.strokeStyle = "#ff2e2e"
    // this.ctx.stroke()
    // this.ctx.closePath()

    // //cohesionVector (Green)
    this.ctx.beginPath()
    this.ctx.moveTo(pos.x, pos.y)
    this.ctx.lineTo(pos.x + v3.x * 100, pos.y + v3.y * 100)
    this.ctx.strokeStyle = "#11f220"
    this.ctx.stroke()
    this.ctx.closePath()
  }
}

const dist = (p1, p2) => {
  return Math.abs(Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)))
}

const signedDist = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const calcAngleDegrees = (x, y) => {
  return Math.atan2(y, x) * 180 / Math.PI;
}

const normalize = (vector) => {
  const magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))
  return { x: vector.x / magnitude, y: vector.y / magnitude }
}

export default Boid