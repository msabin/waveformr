export function HzDisplay ( { Hz, onIncrement, onDecrement } ) {

  return (
    <div>
      <button className="up-arrow" onClick={onIncrement}></button>

      <p className="digital-display"> {Hz.toFixed(2)} </p>

      <button className="down-arrow" onClick={onDecrement}></button>
    </div>
  )
}