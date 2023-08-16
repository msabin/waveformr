const WIDTH = 500
const HEIGHT = 500
const NEON_PINK = [255, 16, 240]
const NEON_BLUE = [4,217,255]


let isClicked = false
let screenWave = new Array(WIDTH).fill(HEIGHT/2)

let lastX = HEIGHT/2
let lastY = HEIGHT/2

let context


function setup() {

  createCanvas(500, 500)
  background(0, 0, 0)

  context = new AudioContext()

  osc = new OscillatorNode(context)
  osc.connect(context.destination)


  const real = new Float32Array(7);
  const imag = new Float32Array(7);
  
  real[0] = 0;
  imag[0] = 0;
  real[1] = 0;
  imag[1] = 0;
  real[2] = 0;
  imag[2] = 0;
  real[3] = 0;
  imag[3] = 0;
  real[4] = 1;
  imag[4] = 0;
  real[5] = 0;
  imag[5] = 0;
  real[6] = 1;
  imag[6] = 0;
  
  const sine = context.createPeriodicWave(real, imag);
  
  osc.setPeriodicWave(sine);
  osc.frequency.setValueAtTime(220, context.currentTime)
  
  

  
  // osc.type = "sawtooth"
  osc.start()
  osc.stop(2)
}

function draw() {
  
  background(0, 0, 0)

  for(let i = 0; i < screenWave.length-2; i++){
    line(i, screenWave[i], i+1, screenWave[i+1])

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

    screenWave[lastX + sign*i] = lastY * (1 - t) + mouseY * t
  }

  lastX = mouseX
  lastY = mouseY
}