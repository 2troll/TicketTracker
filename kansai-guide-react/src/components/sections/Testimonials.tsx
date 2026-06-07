"use client";
import { motion } from "framer-motion";

interface Review {
  stars: number;
  quote: string;
  name: string;
  location: string;
  flag: string;
}

const REVIEWS: Review[] = [
  {
    stars: 5,
    quote: "Tony took us to a tiny ramen shop hidden in an alley we'd never have found alone — the owner knew him by name. That moment defined our whole trip.",
    name: "Carlos & María",
    location: "Madrid, Spain",
    flag: "🇪🇸",
  },
  {
    stars: 5,
    quote: "We were travelling with a toddler and Tony adjusted every single plan on the fly without missing a beat. Patience, humour and real knowledge.",
    name: "The Harrison Family",
    location: "London, UK",
    flag: "🇬🇧",
  },
  {
    stars: 5,
    quote: "Тони говорил по-русски без акцента и знал Киото лучше, чем любой путеводитель. Незабываемое путешествие.",
    name: "Aleksei M.",
    location: "Moscow, Russia",
    flag: "🇷🇺",
  },
  {
    stars: 5,
    quote: "Kōyasan overnight was spiritual in the truest sense. Tony translated the monk's chanting, explained every ritual. We were in tears by morning.",
    name: "Sophie & David",
    location: "Melbourne, Australia",
    flag: "🇦🇺",
  },
  {
    stars: 5,
    quote: "Pro soukromou skupinu 6 lidí z Prahy to byl absolutní zážitek. Tony mluvil česky — nikdo nám nevěřil.",
    name: "Jan K.",
    location: "Prague, Czech Republic",
    flag: "🇨🇿",
  },
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex-shrink-0 w-[340px] bg-card border border-white/[0.06] rounded-2xl p-7 flex flex-col gap-4">
      <div className="text-[#F5C518] tracking-wider text-sm">
        {"★".repeat(review.stars)}
      </div>
      <blockquote className="font-serif text-[1.05rem] font-light italic leading-[1.78] text-white/82 flex-1">
        "{review.quote}"
      </blockquote>
      <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
        <span className="text-xl">{review.flag}</span>
        <div>
          <p className="text-[0.82rem] font-semibold text-white/90">{review.name}</p>
          <p className="text-[0.68rem] text-white/35 mt-0.5">{review.location}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  // Duplicate for seamless infinite loop
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <section className="py-28 bg-bg overflow-hidden">
      <div className="max-w-[1160px] mx-auto px-7 mb-12">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          Guest Stories
        </motion.span>
        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, type: "spring", stiffness: 270, damping: 26 }}
        >
          What Guests{" "}
          <em className="italic text-grad">Say</em>
        </motion.h2>
      </div>

      {/* Marquee — fades at edges via mask */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="marquee-track">
          {doubled.map((r, i) => (
            <ReviewCard key={i} review={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
