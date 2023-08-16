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



  Hz = 220
  cycles = 3
  let pcm = new Float32Array(cycles*context.sampleRate)

  for(let i = 0; i < pcm.length; i++){
    pcm[i] = Math.sin(Hz * 2 * Math.PI * i * (cycles/pcm.length))
  }

  

  const buffer = context.createBuffer(
    1, 
    cycles * context.sampleRate, 
    context.sampleRate
    )

  buffer.copyToChannel(pcm, 0)

  const bufferNode = context.createBufferSource()

  bufferNode.buffer = buffer

  bufferNode.connect(context.destination)

  bufferNode.start()

  // osc = new OscillatorNode(context)
  // osc.connect(context.destination)

  // const real = new Float32Array(7);
  // const imag = new Float32Array(7);
  
  
  // const sine = context.createPeriodicWave(real, imag);
  
  // osc.setPeriodicWave(sine);
  // osc.frequency.setValueAtTime(220, context.currentTime)
  
  

  
  // osc.type = "sawtooth"
  // osc.start()
  // osc.stop(2)
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