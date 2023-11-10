import { useEffect } from "react";
import styles from "./index.module.css";


export function BootOverlay({ onReducedMotion }) {
  
  useEffect(() => {
    function handleKeyDown(e) {
      
      switch (e.key) {
        case 'y': 
          onReducedMotion(true);
          break;
        case 'n':
          onReducedMotion(false);
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  },[onReducedMotion])

  return (
    <div id={styles.boot_overlay}>
      <h1>
        Warning:
      </h1>

      <p> 
        This console has random, glitchy movements which may trigger 
        epilepsy for those with photo-sensitive epilepsy.
      </p>

      <p> 
        Would you like a reduced-motion version of this app?
      </p>

      <div id={styles.boot_options}>
        <button onClick={() => onReducedMotion(true)}> 
          Y 
        </button>

        <span>/</span>

        <button onClick={() => onReducedMotion(false)}> 
          N
        </button>
      </div>
    </div>
  )
}