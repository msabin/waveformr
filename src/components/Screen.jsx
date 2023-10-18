import { useP5 } from "./useP5";
import { transform, inverseTransform } from "../audio/fft";
import { useState } from "react";

export function Screen({ width, height, pcm, onPCMChange, displayPCM }) {
  const NEON_PINK = [255, 16, 240];
  const NEON_BLUE = [4, 217, 255];
  const SCREEN_OVERTONE_WIDTH = 8; // Power over 2 to divide width by

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
    setScreenOvertones(computeOvertones(pcm, width / SCREEN_OVERTONE_WIDTH));
    setCurrentPCM(pcm);
  }

  const myP5 = useP5(p5Setup, p5Draw, p5MouseDragged);

  function p5Setup() {
    myP5.createCanvas(width, height, document.getElementById("screen"));
  }

  function p5Draw() {
    myP5.background(0);
    myP5.strokeWeight(2);

    if (displayPCM) {
      myP5.stroke(NEON_BLUE);
      for (let i = 0; i < screenWave.length - 1; i++) {
        myP5.line(i, screenWave[i], i + 1, screenWave[i + 1]);
      }
    } else {
      myP5.stroke(NEON_PINK);
      myP5.fill((0, 0, 0));
      for (let i = 0; i < screenOvertones.length; i++) {
        myP5.rect(
          SCREEN_OVERTONE_WIDTH * i,
          screenOvertones[i],
          SCREEN_OVERTONE_WIDTH,
          height - screenOvertones[i]
        );
      }
    }
  }

  myP5.lastX;
  myP5.lastY;
  function p5MouseDragged() {
    const newX = myP5.mouseX;
    const newY = myP5.mouseY;
    if (newX < 0 || newX > width || newY < 0 || newY > height) {
      return;
    }

    // const newX = Math.max(Math.min(myP5.mouseX, width), 0);
    // const newY = Math.max(Math.min(myP5.mouseY, height), 0);

    const offsetX = newX - myP5.lastX;

    // Fill sound wave array by interpolating between current mouse
    // position and previous mouse position.
    const length = Math.abs(offsetX);
    const sign = Math.sign(offsetX);

    if (Math.floor(length) === 0) {
      return; // Don't want to divide by zero.
    }

    let newPCM = currentPCM.slice();
    if (displayPCM) {
      const newScreenWave = screenWave.slice();

      for (let i = 0; i < length; i++) {
        let t = i / length; // Interpolate t fraction between points.

        newScreenWave[myP5.lastX + sign * i] = myP5.lastY * (1 - t) + newY * t;

        // // Normalize the screen's wave to be PCM samples in [-1, 1].
        // newPCM[myP5.lastX + sign * i] =
        //   -(newScreenWave[myP5.lastX + sign * i] - height / 2) / (height / 2);
      }

      newPCM = normalizeWave(newScreenWave);

      setScreenOvertones(
        computeOvertones(newPCM, width / SCREEN_OVERTONE_WIDTH)
      );
      setScreenWave(newScreenWave);
    } else {
      const newScreenOvertones = screenOvertones.slice();

      for (let i = 0; i < length; i += SCREEN_OVERTONE_WIDTH) {
        let t = i / length; // Interpolate t fraction between points.

        let index = Math.floor((myP5.lastX + sign * i) / SCREEN_OVERTONE_WIDTH);

        newScreenOvertones[index] = myP5.lastY * (1 - t) + newY * t;
      }

      const overtones = newScreenOvertones.map((x) => (height - x) / height);
      newPCM = computePCM(overtones);

      setScreenWave(fitScreenPCM(newPCM));
      setScreenOvertones(newScreenOvertones);
    }

    myP5.lastX = newX;
    myP5.lastY = newY;

    setCurrentPCM(newPCM);
    onPCMChange(newPCM);
  }

  function computeOvertones(pcm, numOvertones) {
    const real = pcm.slice();
    const imag = real.slice().fill(0);

    transform(real, imag);

    let overtones = real.slice(1, numOvertones + 1);
    overtones = overtones.map((x, i) => Math.sqrt(x ** 2 + imag[i + 1] ** 2));

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
    return screenWave.map((x) => -(x - height / 2) / (height / 2));
  }

  function fitScreenPCM(pcmWave) {
    let maxHeight = Math.max(...pcmWave);
    maxHeight = maxHeight === 0 ? 1 : maxHeight;

    // Scale the maximum height of the wave to be reach screenScale
    // fraction of full screen length.
    const screenScale = 2 / 3;

    // Normalize the wave by its maximum height, scale it to the screen,
    // flip the y-axis to a normal Cartesian system, and shift the wave
    // to the center of the screen.
    return pcmWave.map(
      (x) => screenScale * (x / maxHeight) * (-height / 2) + height / 2
    );
  }

  function fitScreenOvertones(overtones) {
    let maxOvertone = Math.max(...overtones);
    maxOvertone = maxOvertone === 0 ? 1 : maxOvertone;

    // Scale the maximum height of the wave to be reach screenScale
    // fraction of full screen length.
    const screenScale = 2 / 3;

    // Normalize the overtones by its maximum height, scale it to the screen,
    // flip the y-axis to a normal Cartesian system, and shift the wave
    // to the bottom of the screen.
    return overtones.map(
      (x) => height - (x / maxOvertone) * height * screenScale
    );
  }

  return <canvas id="screen" />;
}
