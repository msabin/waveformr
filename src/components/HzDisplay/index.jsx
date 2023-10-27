import styles from "./index.module.css";

export function HzDisplay({ Hz, onChangeHz }) {
  const SEMITONE_FACTOR = 2 ** (1 / 12);
  const MAX_CHARACTER_LIMIT = 8;

  function handleBlur(e) {
    let newHz = e.currentTarget.textContent || "";

    // If the entered value is empty or not a number, keep old Hz
    if (!newHz.trim() || isNaN(newHz)) {
      e.target.textContent = Hz.toFixed(2);
    } else if (newHz > 24000) {
      newHz = 24000;
    } else if (newHz < -24000) {
      newHz = -24000;
    }

    onChangeHz(parseFloat(newHz));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  const handleInput = (e) => {
    const text = e.target.textContent || "";

    if (text.length > MAX_CHARACTER_LIMIT) {
      // Prevent entering more characters than the limit
      e.preventDefault();
      const truncatedText = text.slice(0, MAX_CHARACTER_LIMIT);

      // Restore cursor position after a small delay
      setTimeout(() => {
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
          range.setStart(e.target.childNodes[0], truncatedText.length);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }, 0);

      e.target.textContent = truncatedText;
    }
  };

  return (
    <>
      <button
        className={styles.up_arrow}
        onClick={() => onChangeHz(Hz * SEMITONE_FACTOR)}
      ></button>

      <p
        id="hz-display"
        className="digital-display"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleBlur(e)}
        onKeyDown={(e) => handleKeyDown(e)}
        onInput={(e) => handleInput(e)}
        style={{ width: "7em" }}
      >
        {Hz.toFixed(2)}
      </p>

      <button
        className={styles.down_arrow}
        onClick={() => onChangeHz(Hz / SEMITONE_FACTOR)}
      ></button>
    </>
  );
}
