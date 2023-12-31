import { useRef } from "react";
import { transform } from "./fft.js";

class ConsoleAudio {
  constructor(Hz) {
    this.context = new AudioContext();

    this.osc = this.context.createOscillator();
    this.osc.frequency.setValueAtTime(Hz, this.context.currentTime);
    this.osc.setPeriodicWave(this.context.createPeriodicWave([0, 0], [0, 0]));
    this.osc.start();

    this.currentVol = .25;
    this.vol = this.context.createGain();
    this.vol.gain.setValueAtTime(this.currentVol, this.context.currentTime);

    this.osc.connect(this.vol);
    this.vol.connect(this.context.destination);
  }

  setVol(vol) {
    this.currentVol = Math.min(Math.max(vol, 0), 1);
    this.vol.gain.exponentialRampToValueAtTime(this.currentVol, this.context.currentTime + .25);
    
    // setValueAtTime(this.currentVol, this.context.currentTime);;
  }

  muteToggle() {
    if (this.vol.gain.value > 0) {
      this.vol.gain.setValueAtTime(0, this.context.currentTime);
    }
    else {
      this.vol.gain.setValueAtTime(this.currentVol, this.context.currentTime);
    }
  }

  setHz(Hz) {
    this.osc.frequency.setValueAtTime(Hz, this.context.currentTime);
  }

  setWave(pcm) {
    const real = pcm.slice();
    const imag = pcm.slice().fill(0);

    // Use FFT to fill real and imag with frequency domain.
    transform(real, imag);

    // Create a PeriodicWave object with the spectrum.
    const period = this.context.createPeriodicWave(
      real.slice(0, real.length / 2), // Divide by 2 to get up to Nyquist .
      imag.slice(0, imag.length / 2)
    );
    this.osc.setPeriodicWave(period);
    this.context.resume();
  }
}

export function useAudio(Hz) {
  const audioRef = useRef();
  if (!audioRef.current) {
    audioRef.current = new ConsoleAudio(Hz);
  }
  return audioRef.current;
}
