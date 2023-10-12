export function HzDisplay () {

  const [newHz, setNewHz] = useState(Hz);

  function handleUpClick() {
    Hz *= 2 ** (1 / 12);
    osc.frequency.setValueAtTime(Hz, context.currentTime);
    setNewHz(Hz.toFixed(2));
  }

  function handleDownClick() {
    Hz /= 2 ** (1 / 12);
    osc.frequency.setValueAtTime(Hz, context.currentTime);
    setNewHz(Hz.toFixed(2));
  }

  return (
    <div>
      <button className="up-arrow" onClick={handleUpClick}></button>

      <p className="digital-display"> {newHz} </p>

      <button className="down-arrow" onClick={handleDownClick}></button>
    </div>
  )

}