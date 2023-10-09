import React, { useEffect, useRef } from 'react';
import p5 from "p5";



export function Screen( {waveForm} ) {
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
    };
  };

  useEffect(() => {
    // Create a new p5.js instance with the sketch function
    const myP5 = new p5(sketch);
  }, []); // The empty array means this effect runs once after the component mounts

  console.log(p5)
  return <canvas id="screen" ref={canvasRef} />;

}




