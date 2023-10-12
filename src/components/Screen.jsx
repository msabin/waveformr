import React, { useEffect, useRef } from 'react';
import p5 from "p5";



export function Screen( {width, height, wave, displayPCM} ) {
  const canvasRef = useRef();

  

  // p5.js sketch function
  function sketch(p) {

    p.setup = () => {
      p.createCanvas(width, height, canvasRef.current);
    };

    p.draw = () => {
      p.background(0);
      
      if (displayPCM) {
        for (let i = 0; i < screenWave.length - 1; i++) {
          p.stroke(NEON_BLUE);
          p.strokeWeight(2);
    
          p.line(i, screenWave[i], i + 1, screenWave[i + 1]);
        }
      }
      else {
        p.stroke(NEON_PINK);
        p.strokeWeight(2);

        for (let i = 0; i < screenOvertones.length; i++) {
          p.rect(
            RECT_WIDTH * i,
            screenOvertones[i],
            RECT_WIDTH,
            HEIGHT - screenOvertones[i]
          );
        }
      }
    };

    //p.mouseDragged = () => {
    //     changing pcm and overtones
    // }
  };

  useEffect(() => {
    // Create a new p5.js instance with the sketch function
    new p5(sketch);
  }, []); // The empty array means this effect runs once after the component mounts

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
