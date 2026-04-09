 
import { useEffect, useState } from "react";

export default function useDevice() {
  const getDevice = () => {
    return window.innerWidth < 768 ? "mobile" : "desktop";
  };

  const [device, setDevice] = useState(getDevice());

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDevice());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}