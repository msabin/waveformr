const WIDTH = 512
const HEIGHT = 512
const NEON_PINK = [255, 16, 240]
const NEON_BLUE = [4,217,255]


let isClicked = false

let screenWave = new Array(WIDTH).fill(HEIGHT/2)
let pcm = new Float32Array(screenWave.length)
let real = pcm.slice()
let imag = new Float32Array(pcm.length)


let lastX = HEIGHT/2
let lastY = HEIGHT/2

let context
let osc
let period


function setup() {

  createCanvas(WIDTH, HEIGHT)
  background(0, 0, 0)

  context = new AudioContext()

  osc = context.createOscillator()
  osc.connect(context.destination)

  osc.frequency.setValueAtTime(220, context.currentTime)
  
  osc.start()

  // Hz = 1
  // cycles = 1
  // print(context.sampleRate)
  // let pcm = new Float32Array(context.sampleRate/Hz)    //(cycles*context.sampleRate)

  // for(let i = 0; i < pcm.length; i++){
  //   pcm[i] = Math.cos(2*Hz * 2 * Math.PI * i * (cycles/pcm.length))

  //   pcm[i] += Math.cos(3*Hz * 2 * Math.PI * i * (cycles/pcm.length))
  // }

  // let real = pcm.slice()
  // let imag = new Float32Array(pcm.length)

  // transform(real, imag)

  // print(real, imag)

  // let period = context.createPeriodicWave(real, imag)

  // let osc = context.createOscillator()

  // osc.setPeriodicWave(period)

  // osc.frequency.setValueAtTime(220, context.currentTime)

  // osc.connect(context.destination)

  // osc.start()


  // const buffer = context.createBuffer(
  //   1, 
  //   cycles * context.sampleRate, 
  //   context.sampleRate
  //   )

  // buffer.copyToChannel(pcm, 0)

  // const bufferNode = context.createBufferSource()

  // bufferNode.buffer = buffer


  // const analyser = context.createAnalyser()
  // bufferNode.connect(analyser)
  
  // const spectrum = new Float32Array(buffer.length)
  // analyser.getFloatFrequencyData(spectrum)
  


  // bufferNode.connect(context.destination)

  // bufferNode.start()

  // osc = new OscillatorNode(context)
  // osc.connect(context.destination)

  // const real = new Float32Array(7);
  // const imag = new Float32Array(7);
  
  
  // const sine = context.createPeriodicWave(real, imag);
  
  // osc.setPeriodicWave(sine);
  
  

  
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

  console.log(mouseX, lastX)

  if(Math.floor(length) === 0){
    return
  }


  for(let i = 0; i < length; i++){
    t = i/length // Interpolate t fraction between points

    screenWave[lastX + sign*i] = lastY * (1 - t) + mouseY * t
    console.log(screenWave[lastX + sign*i])

    pcm[lastX + sign*i] = -(screenWave[lastX + sign*i]-HEIGHT/2)/(HEIGHT/2)
    console.log(pcm[lastX + sign*i])
  }

  lastX = mouseX
  lastY = mouseY

  real = pcm.slice()
  imag = imag.fill(0)

  console.log(real, imag)
  transform(real, imag)

  console.log(real, imag)
  period = context.createPeriodicWave(real, imag)

  osc.setPeriodicWave(period)
}