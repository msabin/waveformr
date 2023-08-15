const WIDTH = 500
const HEIGHT = 500


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
  osc.start()
}

function draw() {
  
  background(0, 0, 0)

  for(let i = 0; i < wave.length-2; i++){
    line(i, wave[i], i+1, wave[i+1])

    stroke(255,255,255)
    strokeWeight(2)
  }
}



function mouseDragged(){

  context.resume()

  offsetX = mouseX - lastX
  // offsetY = mouseY - lastY

  length = Math.abs(offsetX)
  sign = Math.sign(offsetX)

  // if(Math.abs(wave[mouseX] - wave[lastX]) > 20){

  //   console.log([mouseX, lastX])
  // }

  for(let i = 0; i < length; i++){
    wave[lastX + sign*i] = lastY*(length - i)/length + mouseY*i/length
  }

  lastX = mouseX
  lastY = mouseY
}