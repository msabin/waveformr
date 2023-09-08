const WIDTH = 512; // Power of 2 will make everything much nicer.
const HEIGHT = 512;
const NEON_PINK = [255, 16, 240];
const NEON_BLUE = [4, 217, 255];

const A4 = 440;
const SEMITONE_FACTOR = 2 ** (1 / 12);

const RECT_WIDTH = 8; // Power over 2 to divide WIDTH by
const NUM_OVERTONES = WIDTH / RECT_WIDTH;

const MIDI_PRESS = parseInt("90", 16);
const MIDI_RELEASE = parseInt("80", 16);
const MIDI_A4 = parseInt("45", 16);

let isClicked = false;

let screenWave = new Array(WIDTH).fill(HEIGHT / 2);
let pcm = new Float32Array(screenWave.length);
let real = pcm.slice();
let imag = new Float32Array(pcm.length);

let overtones = real.slice(1, real.length / RECT_WIDTH);
let screenOvertones = new Array(WIDTH / RECT_WIDTH).fill(HEIGHT);
let maxOvertone;

let timeDraw = true;

let lastX = HEIGHT / 2;
let lastY = HEIGHT / 2;

let context;
let osc;
let period;

let Hz = A4 / 4;

let midi = null; // global MIDIAccess object

function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midi);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
  }
}

function onMIDIMessage(event) {
  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  console.log(str);
  console.log(event.data[1]);

  if (event.data[0] === MIDI_PRESS) {
    distFromA4 = event.data[1] - MIDI_A4;
    Hz = 2 ** ((1 / 12) * distFromA4) * A4;
    osc.frequency.setValueAtTime(Hz, context.currentTime);
  }
}

function startLoggingMIDIInput(midiAccess) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function setup() {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

  createCanvas(WIDTH, HEIGHT);
  background(0, 0, 0);

  context = new AudioContext();

  osc = context.createOscillator();
  osc.connect(context.destination);

  osc.frequency.setValueAtTime(Hz, context.currentTime);

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
    strokeWeight(1);
    fill((0,0,0));
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
    imag = imag.fill(0);

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
    screenOvertones = overtones.map((x) => HEIGHT - (x / maxOvertone) * HEIGHT);
  } else {
    for (let i = 0; i < length; i += RECT_WIDTH) {
      t = i / length; // Interpolate t fraction between points.

      index = Math.floor((lastX + sign * i) / RECT_WIDTH);
      console.log(index);
      screenOvertones[index] = lastY * (1 - t) + newY * t;

      overtones[index] = (HEIGHT - screenOvertones[index]) / HEIGHT;
      print(overtones);
    }

    // Create a PeriodicWave object with the spectrum.
    period = context.createPeriodicWave(
      [0, ...overtones],
      Array(WIDTH / RECT_WIDTH).fill(0)
    );
    osc.setPeriodicWave(period);

    real.fill(0);
    imag.fill(0);
    for(let i = 0; i < overtones.length; i++){
      real[i+1] = overtones[i]
    }

    // Sync up the waveform view.
    inverseTransform(real, imag);

    screenWave = real.map((x) => x * (-HEIGHT/2) + HEIGHT/2);
  }

  lastX = newX;
  lastY = newY;
}
