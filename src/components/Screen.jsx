// pass in waveform prop
// import p5

function setup () {
  createCanvas(WIDTH, HEIGHT, document.getElementById("screen"));
  background(0, 0, 0);  
}


export function Screen( {waveForm} ) {
  return <canvas id="screen"></canvas>;
}



