import { useState } from "react";
import { transform } from "./fft.js";

function wave(pcm) {

  const realFreq = pcm.slice();
  const imagFreq = pcm.slice().fill(0);

  // Use FFT to fill real and imag with frequency domain.
  transform(realFreq, imagFreq);


  return { pcm, realFreq, imagFreq }
}

export function useWave(initialPCM) {
  const [pcm, setPCM] = useState(initialPCM);
  
  function setOvertones() {
    //does stuff and then
    setPCM(pcm);
  }

  return [wave(pcm), setPCM, setOvertones];
}