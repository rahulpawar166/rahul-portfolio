import { useEffect, useRef } from "react";
import { liquidGlass } from "./liquidGlass";
import "./OpticalGlass.css";

export default function OpticalGlass({sourceSelector}) {
  const ref=useRef(null);
  useEffect(()=> {
    const glass=liquidGlass(ref.current,{sourceSelector});
    return ()=>glass.destroy();
  },[sourceSelector]);
  return <><span ref={ref} className="optical-glass-layer" aria-hidden="true" inert/><span className="optical-glass-finish" aria-hidden="true"/></>;
}
