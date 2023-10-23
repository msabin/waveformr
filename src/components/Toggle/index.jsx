import sineSVG from "../../assets/sineDisp.svg";
import histSVG from "../../assets/histDisp.svg";
import styles from "./index.module.css";

export function Toggle({ isPressed, onToggle }) {
  return (
    <>
      <img className="digital-display" src={sineSVG} />

      <button
        className={styles.toggle}
        type="button"
        aria-pressed={isPressed}
        onClick={onToggle}
      ></button>

      <img className="digital-display" src={histSVG} />
    </>
  );
}
