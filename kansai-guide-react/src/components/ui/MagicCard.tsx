"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

// Vercel-style card: radial gradient glow follows the cursor position.
// Only GPU properties (transform, opacity) are animated for 60 fps.
export function MagicCard({
  children,
  className,
  glowColor = "rgba(229,48,48,0.14)",
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card border transition-[border-color] duration-300",
        hovered ? "border-[rgba(229,48,48,0.32)]" : "border-white/[0.06]",
        className
      )}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 24 } }}
    >
      {/* Cursor-tracking glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
