import React, { useEffect, useRef } from 'react';
import p5 from "p5";



export function Screen( {pcm, handleChange} ) {
  const canvasRef = useRef();

  

  // p5.js sketch function
  function sketch(p) {

    p.setup = () => {
      p.createCanvas(512, 512, canvasRef.current);
    };

    p.draw = () => {
      p.background(0);
      p.ellipse(56, 46, 55, 55);
      // Your p5.js drawing code here
      // Use pcm and overtones
    };

    //p.mouseDragged = () => {
    //     changing pcm and overtones
    // }
  };

  useEffect(() => {
    // Create a new p5.js instance with the sketch function
    new p5(sketch);
  }, []); // The empty array means this effect runs once after the component mounts

  console.log(p5)
  return <canvas id="screen" ref={canvasRef} />;

}




// mapToScreen() {

// }

// normalize() {
//   screenWave = real.map(
//     (x) => (x / ((3 / 2) * maxHeight)) * (-HEIGHT / 2) + HEIGHT / 2
//   );
// }

// drawTime(params) {
//   for (let i = 0; i < this.numSamp - 1; i++) {
//     line(i, screenWave[i], i + 1, screenWave[i + 1]);

//     stroke(NEON_BLUE);
//     strokeWeight(2);
//   }
// }

// drawFreq() {

// }
