

class Triangle{
  constructor (triangleShape) {
    const { x, y, radius, rot, color } = triangleShape
    this.position = {
      x: x,
      y: y
    }
    this.radius = radius
    this.rotation = rot
    this.color = color
    this.forward = { x: Math.cos(degToRadians(rot)), y: Math.sin(degToRadians(rot)) }
    this.getPoints()
  }

  setPosition(pos){
    this.position = pos
    this.getPoints()
  }

  setRotation(rot){
    this.rotation = rot
    this.forward = { x: Math.cos(degToRadians(rot)), y: Math.sin(degToRadians(rot)) }
    this.getPoints()
  }

  rotate(rotation){
    this.rotation += rotation
    this.forward = { x: Math.cos(degToRadians(this.rotation)), y: Math.sin(degToRadians(this.rotation)) }
  }

  getPoints(){
    let points = []
    let angle = this.rotation
    let angleRad = degToRadians(angle)
    for(let i = 0; i < 3; i++){
      let x = this.position.x + (this.radius * Math.cos(angleRad))
      let y = this.position.y + (this.radius * Math.sin(angleRad))
      points.push({x: x, y: y})
      angle += 120
      angleRad = degToRadians(angle)
    }
    this.points = points
  }

  draw(ctx){
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    ctx.lineTo(this.points[1].x, this.points[1].y)
    ctx.lineTo(this.points[2].x, this.points[2].y)
    ctx.lineTo(this.points[0].x, this.points[0].y)
    ctx.stroke()
    ctx.fill()
    ctx.closePath()
  }
}

const degToRadians = (deg) => {
  return deg * (Math.PI / 180)
}

const dist = (p1, p2) => {
  return Math.abs(Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)))
}

export default Triangle