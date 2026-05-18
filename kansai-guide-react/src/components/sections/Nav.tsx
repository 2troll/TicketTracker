"use client";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const NAV_LINKS = [
  { href: "#about",   label: "About"   },
  { href: "#tours",   label: "Tours"   },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq",     label: "FAQ"     },
];

const LANG_LABELS = ["EN", "ES", "РУ", "CS", "AR"];

const springFast = { type: "spring" as const, stiffness: 400, damping: 30 };

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setScrolled(v > 0.015));
  }, [scrollYProgress]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        style={{ width: progressWidth }}
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#E53030] to-[#FF6B35] z-[9999] origin-left"
      />

      {/* Nav bar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[900] h-16 border-b"
        animate={{
          backgroundColor: scrolled ? "rgba(12,13,22,0.95)" : "rgba(12,13,22,0)",
          borderColor:     scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0)",
          backdropFilter:  scrolled ? "blur(20px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[1160px] mx-auto px-7 h-full flex items-center gap-6">
          {/* Logo */}
          <motion.a
            href="#"
            className="font-serif text-[1.18rem] italic font-light text-white no-underline mr-auto"
            whileHover={{ opacity: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            Tony Hanma
          </motion.a>

          {/* Desktop links */}
          <ul className="hidden md:flex list-none gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  className="relative text-[0.67rem] font-semibold tracking-[0.13em] uppercase text-white/55 no-underline"
                  whileHover={{ color: "rgba(255,255,255,1)" }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-[#E53030] to-[#FF6B35] origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={springFast}
                  />
                </motion.a>
              </li>
            ))}
          </ul>

          {/* Book Now pill */}
          <motion.a
            href="booking.html"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-br from-[#E53030] to-[#FF6B35] text-white text-[0.67rem] font-semibold tracking-[0.1em] uppercase no-underline"
            whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(229,48,48,0.38)" }}
            whileTap={{ scale: 0.97 }}
          >
            Book Now
          </motion.a>

          {/* Language pills */}
          <div className="hidden md:flex gap-1">
            {LANG_LABELS.map((l, i) => (
              <motion.button
                key={l}
                className={`text-[0.58rem] font-semibold tracking-wide px-2.5 py-1 rounded-full border transition-all duration-200 cursor-pointer
                  ${i === 0
                    ? "bg-gradient-to-br from-[#E53030] to-[#FF6B35] border-transparent text-white"
                    : "border-white/[0.15] text-white/35 hover:border-transparent hover:text-white bg-transparent"
                  }`}
                whileTap={{ scale: 0.94 }}
              >
                {l}
              </motion.button>
            ))}
          </div>

          {/* Hamburger */}
          <motion.button
            className="flex md:hidden flex-col gap-[5px] p-1.5 bg-transparent border-none cursor-pointer"
            onClick={() => setOpen(!open)}
            animate={open ? "open" : "closed"}
            aria-label="Menu"
          >
            {[
              { open: { rotate: 45, y: 7 }, closed: { rotate: 0, y: 0 } },
              { open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } },
              { open: { rotate: -45, y: -7 }, closed: { rotate: 0, y: 0 } },
            ].map((variants, i) => (
              <motion.span
                key={i}
                className="block w-[22px] h-[2px] bg-white rounded-sm origin-center"
                variants={variants}
                transition={springFast}
              />
            ))}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <motion.div
        className="fixed inset-0 z-[850] bg-[rgba(8,9,18,0.97)] flex flex-col items-center justify-center gap-8"
        initial={false}
        animate={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        transition={{ duration: 0.28 }}
      >
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-serif text-4xl italic font-light text-white no-underline"
            animate={{
              opacity: open ? 1 : 0,
              y:       open ? 0 : 20,
            }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 28 }}
            whileHover={{ color: "#E53030" }}
          >
            {link.label}
          </motion.a>
        ))}
        <motion.a
          href="booking.html"
          onClick={() => setOpen(false)}
          className="px-8 py-3.5 rounded-full bg-gradient-to-br from-[#E53030] to-[#FF6B35] text-white text-[0.7rem] font-semibold tracking-[0.1em] uppercase no-underline"
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : 20 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 28 }}
        >
          Book Now
        </motion.a>
      </motion.div>
    </>
  );
}
