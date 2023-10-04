function setup() {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  createCanvas(WIDTH, HEIGHT, document.getElementById("screen"));
  background(0, 0, 0);

  let waveform = new WaveForm(Hz, WIDTH);

  context = new AudioContext();

  osc = context.createOscillator();
  osc.connect(context.destination);

  osc.frequency.setValueAtTime(waveform.Hz, context.currentTime);

  osc.start();
}

function draw() {
  background(0, 0, 0);
  if (timeDraw) {
    for (let i = 0; i < screenWave.length - 1; i++) {
      line(i, screenWave[i], i + 1, screenWave[i + 1]);

      stroke(NEON_BLUE);
      strokeWeight(2);
    }
  } else {
    stroke(NEON_PINK);
    strokeWeight(2);
    fill((0, 0, 0));
    for (let i = 0; i < screenOvertones.length; i++) {
      rect(
        RECT_WIDTH * i,
        screenOvertones[i],
        RECT_WIDTH,
        HEIGHT - screenOvertones[i]
      );
    }
  }
}

function keyPressed() {
  // Shift pitch by semitone with the arrows

  if (keyCode === LEFT_ARROW) {
    Hz /= 2 ** (1 / 12);
    console.log("left");
    osc.frequency.setValueAtTime(Hz, context.currentTime);
  }
  if (keyCode === RIGHT_ARROW) {
    Hz *= 2 ** (1 / 12);
    console.log("right");
    osc.frequency.setValueAtTime(Hz, context.currentTime);
  }
}

function keyTyped() {
  if (key === "r") {
    screenWave.fill(HEIGHT / 2);
    pcm.fill(0);

    screenOvertones.fill(HEIGHT);

    period = context.createPeriodicWave(pcm, pcm);
    osc.setPeriodicWave(period);
  } else if (key === "f") {
    timeDraw = !timeDraw;
  }
}

function mouseDragged() {
  context.resume(); // Keep the sound playing

  newX = Math.max(Math.min(mouseX, WIDTH), 0);
  newY = Math.max(Math.min(mouseY, HEIGHT), 0);

  offsetX = newX - lastX;

  // Fill sound wave array by interpolating between current mouse
  // position and previous mouse position.
  length = Math.abs(offsetX);
  sign = Math.sign(offsetX);

  if (Math.floor(length) === 0) {
    return; // Don't want to divide by zero.
  }

  if (timeDraw) {
    for (let i = 0; i < length; i++) {
      t = i / length; // Interpolate t fraction between points.

      screenWave[lastX + sign * i] = lastY * (1 - t) + newY * t;

      // Normalize the screen's wave to be PCM samples in [-1, 1].
      pcm[lastX + sign * i] =
        -(screenWave[lastX + sign * i] - HEIGHT / 2) / (HEIGHT / 2);
    }

    // Time domain real and imag.
    real = pcm.slice();
    imag.fill(0);
    console.log({ imag });

    // Use FFT to fill real and imag with frequency domain.
    transform(real, imag);
    console.log({ real }, { imag });

    // Create a PeriodicWave object with the spectrum.
    period = context.createPeriodicWave(
      real.slice(1, real.length / 2), // Divide by 2 to get up to Nyquist freq.
      imag.slice(1, imag.length / 2)
    );
    osc.setPeriodicWave(period);

    // Sync up the overtone view.
    overtones = real.slice(1, real.length / RECT_WIDTH);
    overtones = overtones.map((x, i) => Math.sqrt(x ** 2 + imag[i + 1] ** 2));

    maxOvertone = Math.max(...overtones);
    screenOvertones = overtones.map(
      (x) => HEIGHT - (x / ((3 / 2) * maxOvertone)) * HEIGHT
    );
  } else {
    for (let i = 0; i < length; i += RECT_WIDTH) {
      t = i / length; // Interpolate t fraction between points.

      index = Math.floor((lastX + sign * i) / RECT_WIDTH);

      screenOvertones[index] = lastY * (1 - t) + newY * t;

      overtones[index] = (HEIGHT - screenOvertones[index]) / HEIGHT;
    }

    // Create a PeriodicWave object with the spectrum.
    period = context.createPeriodicWave(
      [0, ...overtones],
      Array(WIDTH / RECT_WIDTH).fill(0)
    );
    osc.setPeriodicWave(period);

    real.fill(0);
    console.log(real, "should be clear", real[0], real[1], real["0"]);
    imag.fill(0);
    console.log({ overtones });
    for (let i = 0; i < overtones.length; i++) {
      imag[i + 1] = overtones[i];
      console.log(imag[i + 1], overtones[i], { i });
      // imag[(imag.length - 1) - i] = -overtones[i];
    }
    console.log(JSON.stringify(real));
    console.log(JSON.stringify(imag));

    // Sync up the waveform view.
    inverseTransform(real, imag);

    let maxHeight = Math.max(...real);
    screenWave = real.map(
      (x) => (x / ((3 / 2) * maxHeight)) * (-HEIGHT / 2) + HEIGHT / 2
    );
  }

  lastX = newX;
  lastY = newY;
}