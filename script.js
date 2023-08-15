const WIDTH = 500
const HEIGHT = 500
const NEON_PINK = [255, 16, 240]
const NEON_BLUE = [4,217,255]


let isClicked = false
let wave = new Array(WIDTH).fill(HEIGHT/2)

let lastX = HEIGHT/2
let lastY = HEIGHT/2

let context


function setup() {

  createCanvas(500, 500)
  background(0, 0, 0)

  context = new AudioContext()

  osc = new OscillatorNode(context)
  osc.connect(context.destination)
  osc.type = "sawtooth"
  osc.start()
}

function draw() {
  
  background(0, 0, 0)

  for(let i = 0; i < wave.length-2; i++){
    line(i, wave[i], i+1, wave[i+1])

    stroke(NEON_BLUE)
    strokeWeight(2)
  }
}



function mouseDragged(){

  context.resume() // Keep the sound playing

  offsetX = mouseX - lastX


  // Fill sound wave array by interpolating between current mouse 
  // position and previous mouse position.
  length = Math.abs(offsetX)
  sign = Math.sign(offsetX)

  for(let i = 0; i < length; i++){
    t = i/length // Interpolate t fraction between points

    wave[lastX + sign*i] = lastY * (1 - t) + mouseY * t
  }

  lastX = mouseX
  lastY = mouseY
}