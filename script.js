const WIDTH = 500
const HEIGHT = 500


let isClicked = false
let wave = new Array(WIDTH).fill(250)

function setup() {
  console.log("hello!")

  createCanvas(500, 500)
  background(0, 0, 0)
}

function draw() {
  console.log("test!")
  

  for(let i = 0; i < wave.length-2; i++){
    line(i, wave[i], i+1, wave[i+1])

    stroke(255,255,255)
  }
}



function mouseDragged(){
  wave[mouseX] = mouseY
  console.log({mouseX})
}