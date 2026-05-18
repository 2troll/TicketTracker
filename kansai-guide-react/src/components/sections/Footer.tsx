"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const LINKS = [
  { label: "Hiking Tours",    href: "../kansai-guide/hiking.html"     },
  { label: "Our Guides",      href: "../kansai-guide/companions.html" },
  { label: "Practical Info",  href: "../kansai-guide/practical.html"  },
  { label: "Privacy",         href: "../kansai-guide/privacy.html"    },
  { label: "Updates",         href: "../kansai-guide/versions.html"   },
];

const WA_FLOAT = "https://wa.me/34634193106";

export function Footer() {
  return (
    <>
      <footer className="bg-[#070810] border-t border-white/[0.06] py-10 px-7">
        <div className="max-w-[1160px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <span className="font-serif italic text-[1.05rem] text-white/80">Tony Hanma</span>
          <nav className="flex flex-wrap gap-5">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.62rem] tracking-[0.1em] uppercase text-white/30 no-underline transition-colors duration-200 hover:text-red"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="max-w-[1160px] mx-auto mt-5 pt-5 border-t border-white/[0.05] text-center text-[0.6rem] tracking-[0.08em] text-white/25">
          © 2026 Tony Hanma · Private Kansai Guide ·{" "}
          <a href={WA_FLOAT} className="text-white/30 hover:text-red transition-colors" target="_blank" rel="noopener noreferrer">
            +34 634 19 31 06
          </a>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <motion.a
        href={WA_FLOAT}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[800] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center no-underline shadow-[0_4px_20px_rgba(37,211,102,0.38)]"
        whileHover={{ scale: 1.08, boxShadow: "0 6px 28px rgba(37,211,102,0.55)" }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse ring */}
        <span className="absolute inset-[-6px] rounded-full border-2 border-[rgba(37,211,102,0.32)] animate-wa-ring pointer-events-none" />
        <MessageCircle size={26} className="text-white fill-white stroke-none" />

        {/* Online dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#22C87A] border-[2.5px] border-[#070810]" />

        {/* Tooltip */}
        <span className="absolute right-[66px] bg-[rgba(6,7,16,0.96)] text-white text-[0.65rem] font-semibold whitespace-nowrap px-3 py-1.5 rounded-lg border border-[rgba(37,211,102,0.2)] opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">
          Chat with Tony
        </span>
      </motion.a>
    </>
  );
}
