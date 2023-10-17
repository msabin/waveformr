import { useP5 } from './useP5';



export function Screen( {width, height, wave, displayPCM} ) {
  const NEON_PINK = [255, 16, 240];
  const NEON_BLUE = [4, 217, 255];
  const SCREEN_OVERTONE_WIDTH = 8; // Power over 2 to divide width by
  const myP5 = useP5(p5Setup, p5Draw, p5MouseDragged);

  function p5Setup() {
    myP5.createCanvas(width, height, document.getElementById("screen"));
  };

  function p5Draw() {
    myP5.background(0);
    myP5.strokeWeight(2);
    
    if (displayPCM) {
      const screenWave = fitScreenPCM();

      myP5.stroke(NEON_BLUE);
      for (let i = 0; i < screenWave.length - 1; i++) {
        myP5.line(i, screenWave[i], i + 1, screenWave[i + 1]);
      }
    }
    else {
      const screenOvertones = fitScreenOvertones();

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
  };

  function p5MouseDragged() {

  }


  function fitScreenPCM() {
    let maxHeight = Math.max(...wave.pcm);
    maxHeight = (maxHeight === 0) ? 1 : maxHeight;

    // Scale the maximum height of the wave to be reach screenScale 
    // fraction of full screen length.
    const screenScale = 2/3

    // Normalize the wave by its maximum height, scale it to the screen, 
    // flip the y-axis to a normal Cartesian system, and shift the wave
    // to the center of the screen.
    return wave.pcm.map(
      (x) => screenScale * (x / maxHeight) * (-height / 2) + height / 2
    );
  }

  function fitScreenOvertones() {
    // Just take the amplitude of the frequency domain to display
    let overtones = wave.realFreq.slice(1, wave.realFreq.length / SCREEN_OVERTONE_WIDTH + 1);
    overtones = overtones.map((x, i) => Math.sqrt(x ** 2 + wave.imagFreq[i + 1] ** 2));

    let maxOvertone = Math.max(...overtones);
    maxOvertone = (maxOvertone === 0) ? 1 : maxOvertone;

    // Scale the maximum height of the wave to be reach screenScale 
    // fraction of full screen length.
    const screenScale = 2/3

    // Normalize the overtones by its maximum height, scale it to the screen, 
    // flip the y-axis to a normal Cartesian system, and shift the wave
    // to the bottom of the screen.
    return overtones.map(
      (x) => height - (x / maxOvertone) * height * screenScale
    );
  }


  return <canvas id="screen" />;

}

