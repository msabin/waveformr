export function HzDisplay ( { Hz, onChangeHz } ) {
  const SEMITONE_FACTOR = 2 ** (1 / 12);
  console.log(Hz)

  function handleBlur (newHz) {
    // If the entered value is empty or not a number, keep old Hz
    if (!newHz.trim() || isNaN(newHz)) {
      newHz = Hz;
    }
    onChangeHz(parseFloat(newHz))
  };

  function handleItemKeyDown (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };


  return (
    <>
      <button className="up-arrow" onClick={() => onChangeHz(Hz * SEMITONE_FACTOR)}></button>

      <p 
        className="digital-display"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleBlur(e.currentTarget.textContent || '')}
        onKeyDown={(e) => handleItemKeyDown(e)}
      > 
        {Hz.toFixed(2)} 
      </p>

      <button className="down-arrow" onClick={() => onChangeHz(Hz / SEMITONE_FACTOR)}></button>
    </>
  )
}