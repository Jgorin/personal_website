import React, {useEffect} from "react"
import Boid from "./Boid"

var PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

const random = (min, max) => {
  return Math.random() * (max - min) + min;
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
  try {
      var rHex = parseInt(r).toString(16).padStart(2, '0');
      var gHex = parseInt(g).toString(16).padStart(2, '0');
      var bHex = parseInt(b).toString(16).padStart(2, '0');
  } catch (e) {
      return false;
  }
  if (rHex.length > 2 || gHex.length > 2 || bHex.length > 2) return false;
  return '#' + rHex + gHex + bHex;
}

const BOID_COUNT = 400

const Main = (props) => {

  useEffect(() => {
    const { c, ctx } = setupCanvas()

    let boids = []
    for(let i = 0; i < BOID_COUNT; i++){
      const x = random(0, c.width)
      const y = random(0, c.height)
      const radius = random(8, 16)
      const rot = random(0, 360)
      const speed = random(3,5)
      const color =  "#21A6A6"
      const boid = new Boid(ctx, { x: x, y: y, radius: radius, rot: rot, color: color }, speed, )
      boids.push(boid)
    }

    const animate = () => {
      requestAnimationFrame(animate)
      ctx.clearRect(0, 0, window.innerWidth * PIXEL_RATIO, window.innerHeight * PIXEL_RATIO)
      for(let i = 0; i < boids.length; i++){
        boids[i].requestAnimation(boids)
      }
    }

    animate(ctx)  
  })

  const setupCanvas = () => {
    const c = document.getElementById("canvas")
    const ctx = c.getContext("2d")
    c.width = window.innerWidth * PIXEL_RATIO
    c.height = window.innerHeight * PIXEL_RATIO
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    return {c: c, ctx: ctx}
  }

  const coordToIndex = (coord, width) => {
    return (coord.y * width + coord.x) * 4
  }

  return(
    <section className="main1">
      <canvas id="canvas"></canvas>
      <h1>test3</h1>
      <h1>test4</h1>
    </section>
  )
}

export default Main