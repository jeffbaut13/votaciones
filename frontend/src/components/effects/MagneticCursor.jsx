import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { getCursorSize, resolveCursorState } from "@/utils/cursorRegistry";

function getScaleForSpeed(speed) {
  if (speed > 32) {
    return 0.88;
  }

  if (speed > 20) {
    return 0.94;
  }

  return 1;
}

export function MagneticCursor({ disabled = false, reducedMotion = false, baseSize = "md" }) {
  const [cursorState, setCursorState] = useState({ key: "default", label: "", icon: "spark", size: baseSize });
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.28 });
  const springY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.28 });
  const springScale = useSpring(scale, { stiffness: 220, damping: 22, mass: 0.4 });
  const rotateSpring = useSpring(rotate, { stiffness: 180, damping: 26, mass: 0.5 });
  const opacity = useTransform(springScale, [0.86, 1.1], [0.82, 1]);
  const pointerRef = useRef({ x: -100, y: -100, lastX: -100, lastY: -100, lastTime: 0 });

  useEffect(() => {
    

    const updateCursorState = (target) => {
      setCursorState(resolveCursorState(target));
    };

    const handlePointerMove = (event) => {
      const now = performance.now();
      const pointer = pointerRef.current;
      const deltaTime = Math.max(now - (pointer.lastTime || now), 16);
      const deltaX = event.clientX - pointer.lastX;
      const deltaY = event.clientY - pointer.lastY;
      const speed = Math.hypot(deltaX, deltaY) / deltaTime * 16;

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.lastTime = now;

      x.set(event.clientX);
      y.set(event.clientY);
      scale.set(reducedMotion ? 1 : getScaleForSpeed(speed));
      rotate.set(clampAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI)));
      setVisible(true);
      updateCursorState(event.target);
    };

    const handlePointerDown = () => scale.set(0.92);
    const handlePointerUp = () => scale.set(1);
    const handlePointerLeave = () => {
      setVisible(false);
      scale.set(0.94);
      setCursorState({ key: "default", label: "", icon: "spark", size: baseSize });
    };

    const handleMouseOver = (event) => {
      updateCursorState(event.target);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
       
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [baseSize, disabled, reducedMotion, rotate, scale, x, y]);

  if (disabled) {
    return null;
  }

  const size = getCursorSize(cursorState.size || baseSize);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-70 mix-blend-difference"
      style={{
        translateX: springX,
        translateY: springY,
        x: "-50%",
        y: "-50%",
        scale: springScale,
        rotate: rotateSpring,
        opacity: visible ? opacity : 0,
      }}
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 260, damping: 25, mass: 0.35 }}
        className="relative flex items-center justify-center rounded-full border border-white/70 bg-white/5 shadow-[0_0_40px_rgba(255,255,255,0.08)] backdrop-blur-[2px]"
      >
        <motion.div
          animate={{
            opacity: cursorState.label ? 0.12 : 0.22,
            scale: cursorState.key === "play" ? 1.08 : 1,
          }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="absolute inset-[10%] rounded-full border border-white/15"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={`${cursorState.icon}-${cursorState.label}-${cursorState.key}`}
            initial={{ opacity: 0, scale: 0.72, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center gap-1 text-white"
          >
            {cursorState.label ? (
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
                {cursorState.label}
              </span>
            ) : (
              renderCursorGlyph(cursorState.icon)
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function clampAngle(angle) {
  if (!Number.isFinite(angle)) {
    return 0;
  }

  return Math.max(-18, Math.min(18, angle));
}

function renderCursorGlyph(iconKey) {
  switch (iconKey) {
    case "play":
      return <span className="inline-flex"><svg viewBox="0 0 24 24" className="size-4 fill-current"><path d="M8 6.5v11l9-5.5-9-5.5Z" /></svg></span>;
    case "grab":
      return <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">DRAG</span>;
    case "eye":
      return (
        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.6]">
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.6]">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "dot":
      return <span className="size-1.5 rounded-full bg-white" />;
    case "spark":
    default:
      return (
        <></>
      );
  }
}
