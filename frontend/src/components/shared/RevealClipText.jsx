import { motion } from "framer-motion";

export function RevealClipText({
  as: Component = "h1",
  lines = [],
  className = "",
  lineClassName = "",
  initial = "hidden",
  animate = "visible",
  yFrom = 88,
  clipDuration = 1.35,
  moveDuration = 0.72,
  baseDelay = 0.08,
  stagger = 0.14,
}) {
  return (
    <Component className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block overflow-hidden">
          <motion.span
            initial={initial}
            animate={animate}
            variants={{
              hidden: {
                y: yFrom,
                clipPath: "inset(0% 0% 100% 0%)",
              },
              visible: {
                y: 0,
                clipPath: "inset(0% 0% 0% 0%)",
              },
            }}
            transition={{
              y: {
                duration: moveDuration,
                delay: baseDelay + 0.16 + index * stagger,
                ease: [0.22, 1, 0.36, 1],
              },
              clipPath: {
                duration: clipDuration,
                delay: baseDelay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            className={`block will-change-transform ${lineClassName}`.trim()}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
