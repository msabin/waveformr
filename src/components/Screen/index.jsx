import React, { useEffect, useRef, useState } from "react";
import { transform, inverseTransform } from "../../audio/fft";
import styles from "./index.module.css";

export function Screen({ width, height, pcm, onPCMChange, displayPCM, Hz }) {
  const NEON_PINK = "rgb(255 16 240)";
  const NEON_BLUE = "rgb(4 217 255)";
  const SCREEN_OVERTONE_WIDTH = 8;
  const JITTER_FRAMES = 14

  const canvasRef = useRef(null);

  const [screenWave, setScreenWave] = useState(fitScreenPCM(pcm));
  const [screenOvertones, setScreenOvertones] = useState(
    fitScreenOvertones(...computeSpectrum(pcm), width / SCREEN_OVERTONE_WIDTH)
  );
  const [pitchWaves, setPitchWaves] = useState(new Array(JITTER_FRAMES).fill(0));
  const [jitters, setJitters] = useState(new Array(JITTER_FRAMES).fill(0));

  const [currentPCM, setCurrentPCM] = useState(pcm);

  // pcm can be changed in this component by drawing on the Screen (in which
  // case we are in sync with currentPCM and our screenWave and screenOvertones
  // are holding state for what they should look like) or pcm is changed in some
  // other component and passed in as a prop here and will be out of sync with
  // currentPCM and we should thus update our state to match the new pcm
  if (pcm != currentPCM) {
    setScreenWave(fitScreenPCM(pcm));

    const [real, imag] = computeSpectrum(pcm);
    setScreenOvertones(fitScreenOvertones(real, imag, width / SCREEN_OVERTONE_WIDTH));
    setPitchWaves(createPitchWaves(real, imag));

    setCurrentPCM(pcm);
  }

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState([0, screenWave[0]]);

  function handleMouseDown({ nativeEvent }) {
    setLastPoint([nativeEvent.offsetX, nativeEvent.offsetY]);
    setIsDrawing(true);
  }

  function handleMouseUp() {
    setIsDrawing(false);

    const [real, imag] = computeSpectrum(currentPCM);
    setPitchWaves(createPitchWaves(real, imag));
  }

  function handleMouseOver({ nativeEvent }) {
    if (nativeEvent.buttons === 1) {
      handleMouseDown({ nativeEvent });
    }
  }

  function handleMouseMove({ nativeEvent }) {
    if (!isDrawing) return;

    const newX = Math.min(Math.max(0, nativeEvent.offsetX), width);
    const newY = Math.min(Math.max(0, nativeEvent.offsetY), height);

    const [lastX, lastY] = lastPoint;

    const deltaX = newX - lastX;
    const length = Math.abs(deltaX);
    const sign = Math.sign(deltaX);

    let newPCM = currentPCM.slice();

    if (displayPCM) {
      const newScreenWave = screenWave.slice();

      for (let i = 0; i <= length; i++) {
        let t;
        if (length === 0) {
          t = 1;
        } else {
          t = i / length;
        }
        newScreenWave[lastX + sign * i] = lastY * (1 - t) + newY * t;
      }

      newPCM = normalizeWave(newScreenWave);

      const [real, imag] = computeSpectrum(newPCM);
      
      setScreenOvertones(fitScreenOvertones(real, imag, width / SCREEN_OVERTONE_WIDTH));
      setScreenWave(newScreenWave);

    } else {
      const newScreenOvertones = screenOvertones.slice();

      for (let i = 0; i <= length; i += SCREEN_OVERTONE_WIDTH) {
        let t;
        if (length === 0) {
          t = 1;
        } else {
          t = i / length;
        }
        let index = Math.floor((lastX + sign * i) / SCREEN_OVERTONE_WIDTH);
        newScreenOvertones[index] = lastY * (1 - t) + newY * t;
      }

      const overtones = normalizeOvertones(newScreenOvertones);

      const real = new Float32Array(width).fill(0);
      const imag = real.slice();
      for (let i = 0; i < overtones.length; i++) {
        imag[i + 1] = overtones[i];
      }

      // computePCM calls the FFT transform which modifies real/imag in place
      // so this call needs to come after setPitchWaves
      newPCM = computePCM(real, imag);

      setScreenWave(fitScreenPCM(newPCM));
      setScreenOvertones(newScreenOvertones);
    }

    setLastPoint([newX, newY]);
    setCurrentPCM(newPCM);
    onPCMChange(newPCM);
  }

  function draw(ctx) {
    
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;

    if (displayPCM) {
      let frame = Math.floor(Math.random() * JITTER_FRAMES);
      const pitchWave = pitchWaves[frame];

      if (!isDrawing){
        // Draw pitchWave (underneath screenWave)
        ctx.strokeStyle = NEON_PINK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, pitchWave[0]);
        for (let i = 0; i < pitchWave.length - 1; i++) {
          ctx.lineTo(i + 1, pitchWave[i + 1]);
        }
        ctx.stroke();
      }
      else {
        const flatJitter = jitters[frame]

        ctx.strokeStyle = NEON_PINK;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, flatJitter[0] + height/2);
        for (let i = 0; i < flatJitter.length - 1; i++) {
          ctx.lineTo(i + 1, flatJitter[i + 1] + height/2);
        }
        ctx.stroke();
      }

      // Draw screenWave
      ctx.strokeStyle = NEON_BLUE;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, screenWave[0]);
      for (let i = 0; i < screenWave.length - 1; i++) {
        ctx.lineTo(i + 1, screenWave[i + 1]);
      }
      ctx.stroke();

    } else {
      // Draw screenOvertones
      ctx.strokeStyle = NEON_PINK;
      for (let i = 0; i < screenOvertones.length; i++) {
        ctx.strokeRect(
          SCREEN_OVERTONE_WIDTH * i,
          screenOvertones[i],
          SCREEN_OVERTONE_WIDTH,
          height - screenOvertones[i]
        );
      }
    }
  }

  const drawRef = useRef();
  drawRef.current = draw;


  useEffect(() => {
    const jitters = new Array(JITTER_FRAMES);
    for(let i = 0; i < jitters.length; i++){

      let jitterScale = Math.random() * 2//(i+1)/jitters.length

      let highFreq1 = 10
      let amp1 = (1 - 2 * Math.random()) * 10 * jitterScale;
      let offset1 = (1 - 2 * Math.random()) * Math.PI

      let highFreq2 = 20
      let amp2 = (1 - 2 * Math.random()) * 5 * jitterScale;
      let offset2 = (1 - 2 * Math.random()) * Math.PI

      let highFreq3 = 40
      let amp3 = (1 - 2 * Math.random()) * 5 * jitterScale;
      let offset3 = (1 - 2 * Math.random()) * Math.PI

      let highFreq4 = 80
      let amp4 = (1 - 2 * Math.random()) * 4 * jitterScale;
      let offset4 = (1 - 2 * Math.random()) * Math.PI

      let highFreq5 = 100
      let amp5 = (1 - 2 * Math.random()) * 2 * jitterScale;
      let offset5 = (1 - 2 * Math.random()) * Math.PI

      jitters[i] = new Float32Array(width)
        .fill()
        .map((_, i) => 
          amp1* Math.sin(highFreq1 * (2 * Math.PI * i / width + offset1)) +
          amp2* Math.sin(highFreq2 * (2 * Math.PI * i / width + offset2)) +
          amp3* Math.sin(highFreq3 * (2 * Math.PI * i / width + offset3)) +
          amp4* Math.sin(highFreq4 * (2 * Math.PI * i / width + offset4)) +
          amp5* Math.sin(highFreq5 * (2 * Math.PI * i / width + offset5))
        );
    }
    setJitters(jitters);


    const frameRate = 14; // 14 frames per second
    const frameInterval = 1000 / frameRate;

    let lastFrameTime = 0;

    function jitterAnimate(timestamp) {
      if (timestamp - lastFrameTime >= frameInterval) {
        draw = drawRef.current;
        // Draw your content
        draw(canvasRef.current.getContext("2d"))

        lastFrameTime = timestamp;
      }

      // Call requestAnimationFrame for the next frame
      requestAnimationFrame(jitterAnimate);
    }

    requestAnimationFrame(jitterAnimate);

  }, []);

  useEffect(() => {
    setPitchWaves(createPitchWaves(...computeSpectrum(pcm)));
  },[Hz]);

  function computeSpectrum(pcm) {
    const real = pcm.slice();
    const imag = real.slice().fill(0);
    transform(real, imag);

    return [real, imag];
  }
  

  function createPitchWaves(real, imag) {
    const sampRate = 22050;
    console.log("here")
    let realPitch = new Float32Array(sampRate).fill(0);
    let imagPitch = realPitch.slice();

    const startingOctave = 2;
    const scale = startingOctave  * (Hz / 110) * (sampRate/width);//baseHz;
    for (let i = 0; i < real.length; i++) {
      let index = Math.floor(scale * i);

      if (index <= realPitch.length / 2) {
        realPitch[index] = real[i];
        imagPitch[index] = imag[i];
      }
    }

    inverseTransform(realPitch, imagPitch)

    let pitchWave = realPitch.slice(0, width);

    let maxHeight = Math.max(...pitchWave.map((x) => Math.abs(x)));
    maxHeight = maxHeight === 0 ? 1 : maxHeight;

    const screenScale = 2/3;
    pitchWave = pitchWave.map(
      (x) => screenScale * (x / maxHeight) * (-height / 2) + height / 2
    );

    const pitchWaves = new Array(JITTER_FRAMES);
    for (let i = 0; i < pitchWaves.length; i++) {
      let jitterWave = jitters[i];

      pitchWaves[i] = pitchWave.map((x, j) => x + jitterWave[j]);
    }


    return pitchWaves;
  }


  function computePCM(real, imag) {

    inverseTransform(real, imag);

    return real.map((x) => -x);
  }

  function normalizeWave(screenWave) {
    return screenWave.map((x) => -(x - height / 2) / (height / 2));
  }

  function normalizeOvertones(screenOvertones) {
    return screenOvertones.map((x) => (height - x) / height);
  }

  function fitScreenPCM(pcmWave) {
    let maxHeight = Math.max(...pcmWave);
    maxHeight = maxHeight === 0 ? 1 : maxHeight;

    const screenScale = 2 / 3;

    return pcmWave.map(
      (x) => screenScale * (x / maxHeight) * (-height / 2) + height / 2
    );
  }

  function fitScreenOvertones(real, imag, numOvertones) {
    let overtones = real.slice(1, numOvertones + 1);
    overtones = overtones.map((x, i) => Math.sqrt(x ** 2 + imag[i + 1] ** 2));

    let maxOvertone = Math.max(...overtones);
    maxOvertone = maxOvertone === 0 ? 1 : maxOvertone;

    const screenScale = 2 / 3;

    return overtones.map(
      (x) => height - (x / maxOvertone) * height * screenScale
    );
  }

  return (
    <canvas
      id={styles.screen}
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onMouseOver={handleMouseOver}
    />
  );
}
