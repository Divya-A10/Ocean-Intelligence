import React, { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

export default function AnimatedNumber({ value, decimals = 0, className = "" }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 600; // ms transition time
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out curve
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        prevValueRef.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span className={className} id={`animated_number_${value.toString().replace(".", "_")}`}>{displayValue.toFixed(decimals)}</span>;
}
