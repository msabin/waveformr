import React, { useEffect, useRef, useState } from 'react';
import { transform, inverseTransform } from '../audio/fft';

export function Screen({ width, height, pcm, onPCMChange, displayPCM }) {
  const NEON_PINK = 'rgb(255 16 240)';
  const NEON_BLUE = 'rgb(4 217 255)';
  const SCREEN_OVERTONE_WIDTH = 8;

  const canvasRef = useRef(null);

  const [screenWave, setScreenWave] = useState(fitScreenPCM(pcm));
  const [screenOvertones, setScreenOvertones] = useState(
    fitScreenOvertones(computeOvertones(pcm, width / SCREEN_OVERTONE_WIDTH))
  );

  const [currentPCM, setCurrentPCM] = useState(pcm);

  // pcm can be changed in this component by drawing on the Screen (in which 
  // case we are in sync with currentPCM and our screenWave and screenOvertones
  // are holding state for what they should look like) or pcm is changed in some
  // other component and passed in as a prop here and will be out of sync with
  // currentPCM and we should thus update our state to match the new pcm
  if (pcm != currentPCM) {
    setScreenWave(fitScreenPCM(pcm));
    setScreenOvertones(fitScreenOvertones(
      computeOvertones(pcm, width / SCREEN_OVERTONE_WIDTH)
    ));
    setCurrentPCM(pcm);
  }

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState([0, screenWave[0]]);


  function handleMouseDown({nativeEvent}) {
    setIsDrawing(true);
    setLastPoint([nativeEvent.offsetX, nativeEvent.offsetY]);
  }

  function handleMouseUp() {
    setIsDrawing(false);
  }

  function handleMouseMove({nativeEvent}) {
    if (!isDrawing) return;

    const newX = nativeEvent.offsetX;
    const newY = nativeEvent.offsetY;

    const [lastX, lastY] = lastPoint;

    if (newX < 0 || newX > width || newY < 0 || newY > height) {
      isDrawing = false;
      return;
    }

    const offsetX = newX - lastX;
    const length = Math.abs(offsetX);
    const sign = Math.sign(offsetX);

    if (Math.floor(length) === 0) {
      return;
    }

    let newPCM = currentPCM.slice();

    if (displayPCM) {
      const newScreenWave = screenWave.slice();

      for (let i = 0; i < length; i++) {
        let t = i / length;
        newScreenWave[lastX + sign * i] = lastY * (1 - t) + newY * t;
      }

      newPCM = normalizeWave(newScreenWave);

      setScreenOvertones(
        fitScreenOvertones(computeOvertones(newPCM, width / SCREEN_OVERTONE_WIDTH))
      );
      setScreenWave(newScreenWave);
    } else {
      const newScreenOvertones = screenOvertones.slice();

      for (let i = 0; i < length; i += SCREEN_OVERTONE_WIDTH) {
        let t = i / length;
        let index = Math.floor((lastX + sign * i) / SCREEN_OVERTONE_WIDTH);
        newScreenOvertones[index] = lastY * (1 - t) + newY * t;
      }

      const overtones = normalizeOvertones(newScreenOvertones);
      newPCM = computePCM(overtones);

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
      ctx.strokeStyle = NEON_BLUE;
      ctx.beginPath();
      ctx.moveTo(0, screenWave[0]);
      for (let i = 0; i < screenWave.length - 1; i++) {
        ctx.lineTo(i + 1, screenWave[i + 1]);
      }
      ctx.stroke();

    } else {
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


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context)


  }, [currentPCM]);


  function computeOvertones(pcm, numOvertones) {
    const real = pcm.slice();
    const imag = real.slice().fill(0);
    transform(real, imag);

    let overtones = real.slice(1, numOvertones + 1);
    overtones = overtones.map(function (x, i) {
      return Math.sqrt(x ** 2 + imag[i + 1] ** 2);
    });

    return overtones;
  }

  function computePCM(overtones) {
    const real = new Float32Array(width).fill(0);
    const imag = real.slice();

    for (let i = 0; i < overtones.length; i++) {
      imag[i + 1] = overtones[i];
    }

    inverseTransform(real, imag);

    return real;
  }

  function normalizeWave(screenWave) {
    return screenWave.map(function (x) {
      return -(x - height / 2) / (height / 2);
    });
  }

  function normalizeOvertones(screenOvertones) {
    return screenOvertones.map(function (x) {
      return (height - x) / height;
    });
  }

  function fitScreenPCM(pcmWave) {
    let maxHeight = Math.max(...pcmWave);
    maxHeight = maxHeight === 0 ? 1 : maxHeight;

    const screenScale = 2 / 3;

    return pcmWave.map(function (x) {
      return screenScale * (x / maxHeight) * (-height / 2) + height / 2;
    });
  }

  function fitScreenOvertones(overtones) {
    let maxOvertone = Math.max(...overtones);
    maxOvertone = maxOvertone === 0 ? 1 : maxOvertone;

    const screenScale = 2 / 3;

    return overtones.map(function (x) {
      return height - (x / maxOvertone) * height * screenScale;
    });
  }

  return (
    <canvas 
      id="screen" 
      ref={canvasRef} 
      width={width} 
      height={height}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}
