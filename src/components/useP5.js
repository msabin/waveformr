import { useRef } from "react";
import p5 from "p5";

export function useP5 (setup, draw, mouseDragged) {
  const p5Ref = useRef();
  
  if (!p5Ref.current) {
      function sketch(p) {
        p.setup = setup;
        p.draw = draw;
        p.mouseDragged = mouseDragged;
      }

      p5Ref.current = new p5(sketch);
  }
  else {
    p5Ref.current.draw = draw;
    p5Ref.current.mouseDragged = mouseDragged;
  }
  
  return p5Ref.current;
}