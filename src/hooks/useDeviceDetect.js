// src/hooks/useDeviceDetect.js
import { useState, useEffect } from 'react';

export default function useDeviceDetect() {
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(userAgent));
  }, []);

  return { isAndroid };
}