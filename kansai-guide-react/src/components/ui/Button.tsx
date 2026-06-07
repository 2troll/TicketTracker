"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps {
  variant?: "primary" | "ghost";
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  target?: string;
}

const SPRING = { damping: 20, stiffness: 300 };

export function Button({
  variant = "primary",
  children,
  href,
  onClick,
  className,
  type = "button",
  target,
}: ButtonProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.28);
    my.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const cls = cn(
    "inline-flex items-center gap-2 px-7 py-3.5 rounded-full",
    "text-[0.68rem] font-semibold tracking-[0.1em] uppercase whitespace-nowrap cursor-pointer select-none",
    variant === "primary" &&
      "bg-gradient-to-br from-[#E53030] to-[#FF6B35] text-white",
    variant === "ghost" &&
      "bg-transparent text-white/60 border border-white/[0.12] hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition-colors",
    className
  );

  const motionProps = {
    style: { x: sx, y: sy },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileHover: {
      scale: 1.04,
      ...(variant === "primary" && {
        boxShadow: "0 8px 28px rgba(229,48,48,0.38)",
      }),
    },
    whileTap: { scale: 0.96 },
  };

  if (href) {
    return (
      <motion.a href={href} target={target} className={cls} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={cls} {...motionProps}>
      {children}
    </motion.button>
  );
}
