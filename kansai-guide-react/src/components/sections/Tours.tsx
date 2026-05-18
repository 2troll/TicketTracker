"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagicCard } from "../ui/MagicCard";
import { Button } from "../ui/Button";

const TOURS = [
  {
    tag: "City Experience",
    title: "Osaka & Kyoto",
    description: "Temples, street food, sake bars and hidden alleys — two iconic cities in one utterly private day.",
    img: "../kansai-guide/img/kyoto-fushimi.jpg",
    href: "../kansai-guide/osaka.html",
  },
  {
    tag: "Mountain & Nature",
    title: "Trails & Peaks",
    description: "Seasonal hiking routes in Kansai's mountains, guided at your pace for any fitness level.",
    img: "../kansai-guide/img/japan-nature.jpg",
    href: "../kansai-guide/hiking.html",
  },
  {
    tag: "Multi-Language",
    title: "Meet the Team",
    description: "Five languages, five personalities, one team. Your guide speaks your native tongue.",
    img: "../kansai-guide/tony-garden.jpg",
    href: "../kansai-guide/companions.html",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden:   { opacity: 0, y: 44 },
  visible:  { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 250, damping: 26 } },
};

export function Tours() {
  return (
    <section id="tours" className="py-28 bg-bg">
      <div className="max-w-[1160px] mx-auto px-7">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          What We Offer
        </motion.span>

        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, type: "spring", stiffness: 270, damping: 26 }}
        >
          Choose Your{" "}
          <em className="italic text-grad">Journey</em>
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-5 mt-14"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {TOURS.map((tour) => (
            <motion.div key={tour.title} variants={card} className="h-full">
              <MagicCard className="h-full flex flex-col">
                {/* Card image */}
                <div
                  className="relative h-60 flex-shrink-0 bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url('${tour.img}')` }}
                >
                  {/* Top gradient accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E53030] to-[#FF6B35] z-10" />
                  {/* Bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,13,22,0.88)] via-[rgba(12,13,22,0.15)] to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col gap-2.5 flex-1">
                  <span className="text-[0.57rem] font-bold tracking-[0.25em] uppercase text-red">
                    {tour.tag}
                  </span>
                  <h3 className="font-serif text-[1.7rem] font-light leading-[1.1] text-white">
                    {tour.title}
                  </h3>
                  <p className="text-[0.88rem] font-light text-white/58 leading-[1.85] flex-1">
                    {tour.description}
                  </p>
                  <Button href={tour.href} variant="ghost" className="self-start mt-3">
                    Explore <ArrowRight size={13} />
                  </Button>
                </div>
              </MagicCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
