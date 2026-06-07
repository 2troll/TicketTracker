"use client";
import { motion } from "framer-motion";
import { AnimatedCounter } from "../ui/AnimatedCounter";

const STATS = [
  { value: 3,   suffix: "",  label: "Prefectures" },
  { value: 200, suffix: "+", label: "Tours Completed" },
  { value: 5,   suffix: "",  label: "Languages" },
  { value: 100, suffix: "%", label: "Private" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 28 } },
};

export function Stats() {
  return (
    <div className="border-t border-b border-white/[0.06] bg-bg">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 max-w-[1160px] mx-auto"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            variants={item}
            className="py-10 px-6 text-center border-r border-white/[0.06] last:border-r-0"
          >
            <span className="block font-serif text-[clamp(2.8rem,5vw,4.4rem)] font-light leading-none text-grad">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </span>
            <span className="block text-[0.58rem] font-bold tracking-[0.22em] uppercase text-white/30 mt-2.5">
              {s.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
