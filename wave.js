

class WaveForm {
  constructor(Hz, numSamp, sampRate) {
    this.Hz = Hz;
    this.numSamp = numSamp;
    this.sampRate = sampRate;


    this.pcm = new Float32Array(numSamp);
    this.real = pcm.slice();
    this.imag = pcm.slice();

    this.overtones = real.slice(1, WIDTH / RECT_WIDTH);


  }

  mapToScreen() {

  }

  normalize() {
    screenWave = real.map(
      (x) => (x / ((3 / 2) * maxHeight)) * (-HEIGHT / 2) + HEIGHT / 2
    );
  }

  drawTime(params) {
    for (let i = 0; i < this.numSamp - 1; i++) {
      line(i, screenWave[i], i + 1, screenWave[i + 1]);

      stroke(NEON_BLUE);
      strokeWeight(2);
    }
  }
  
  drawFreq() {

  }
}