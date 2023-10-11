function waveForm(pcm) {
  const pcm = pcm;
  
  return { pcm :[], overtones: [] }
}

function useWave() {
  const [pcm, setPCM] = useState();



  
  function setOvertones() {
    //does stuff and then
    waveForm(pcm);
    setPCM(pcm);
  }

  return { ...waveForm(pcm), setPCM, setOvertones };
}