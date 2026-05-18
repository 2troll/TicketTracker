"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ArrowDown } from "lucide-react";

// Stagger container: each child enters with a spring, offset by 0.1 s
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
};

// Floating orb (Vercel-style ambient gradient blob)
function Orb({
  className,
  style,
  animate: anim,
  delay = 0,
}: {
  className: string;
  style?: React.CSSProperties;
  animate: Record<string, number[]>;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={style}
      animate={anim}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-end px-7 pb-20 pt-32 overflow-hidden"
    >
      {/* Background photo (uses the same img folder as the static site) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('../kansai-guide/img/japan-zen-garden2.jpg')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,18,0.96)] via-[rgba(8,8,18,0.5)] to-[rgba(8,8,18,0.22)]" />

      {/* Ambient gradient orbs */}
      <Orb
        className="w-[80vw] max-w-[900px] h-[80vw] max-h-[900px] -top-[20%] -left-[10%] opacity-[0.08]"
        style={{ background: "radial-gradient(circle, #E53030 0%, transparent 70%)" }}
        animate={{ x: [0, 44, 0], y: [0, -32, 0], scale: [1, 1.08, 1] }}
      />
      <Orb
        className="w-[60vw] max-w-[700px] h-[60vw] max-h-[700px] bottom-[10%] -right-[10%] opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #FF6B35 0%, transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, 24, 0], scale: [1, 0.92, 1] }}
        delay={2}
      />

      {/* Hero content */}
      <motion.div
        className="relative z-10 max-w-2xl"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          variants={item}
          className="block text-[0.57rem] font-semibold tracking-[0.42em] uppercase text-white/45 mb-5"
        >
          Private Tours · Kansai, Japan
        </motion.span>

        <motion.h1
          variants={item}
          className="font-serif text-[clamp(3.5rem,8.5vw,7.8rem)] font-light leading-[0.9] text-white mb-6"
        >
          Discover Japan's
          <br />
          <em className="font-serif italic text-grad">True Soul</em>
        </motion.h1>

        {/* Accent bar */}
        <motion.div
          variants={item}
          className="w-[46px] h-[2px] bg-gradient-to-r from-[#E53030] to-[#FF6B35] rounded-sm my-5"
        />

        <motion.p
          variants={item}
          className="text-[0.97rem] font-light text-white/72 leading-[1.85] max-w-[46ch] mb-9"
        >
          100% private tours in Osaka, Kyoto, Nara & Kansai — guided in 5 languages
          by a local who knows the stories behind every stone.
        </motion.p>

        <motion.div variants={item} className="flex gap-3 flex-wrap">
          <Button href="booking.html" variant="primary">
            Book a Private Tour
          </Button>
          <Button href="#about" variant="ghost">
            Meet Tony
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span className="text-[0.52rem] tracking-[0.32em] uppercase text-white/28">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
