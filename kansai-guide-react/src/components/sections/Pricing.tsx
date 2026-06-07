"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface Plan {
  tier: string;
  name: string;
  price: string;
  per: string;
  hot: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    tier: "Essential",
    name: "Half Day",
    price: "¥55,000",
    per: "per person · up to 5",
    hot: false,
    features: [
      "4–5 hour private tour",
      "One city or neighbourhood",
      "Tony's local picks & hidden spots",
      "5 languages available",
      "WhatsApp support",
    ],
  },
  {
    tier: "Signature",
    name: "Full Day",
    price: "¥68,000",
    per: "per person · up to 5",
    hot: true,
    features: [
      "8–10 hour full-day experience",
      "Multiple cities or destinations",
      "Train fares & entry fees included",
      "Private tea ceremony (select routes)",
      "Priority booking · WhatsApp 24 h",
    ],
  },
  {
    tier: "Premium",
    name: "Multi-Day",
    price: "¥120,000",
    per: "per person · Kōyasan 2-day",
    hot: false,
    features: [
      "2-day Kōyasan pilgrimage",
      "Shukubo temple lodge included",
      "All transport & entry fees",
      "Vegetarian temple dinner + breakfast",
      "Okunoin lantern cemetery walk",
    ],
  },
];

// Spinning conic-gradient border for the featured card
function ShimmerCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl p-px overflow-hidden" style={{ isolation: "isolate" }}>
      <div className="shimmer-border-inner" />
      <div className="relative rounded-[calc(1rem-1px)] bg-[rgba(10,6,16,0.97)] h-full">
        {children}
      </div>
    </div>
  );
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden:   { opacity: 0, y: 40 },
  visible:  { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
};

function PricingCardBody({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "p-8 flex flex-col gap-4 h-full",
        plan.hot && "relative"
      )}
    >
      {plan.hot && (
        <motion.div
          className="absolute top-0 right-6 bg-gradient-to-br from-[#E53030] to-[#FF6B35] text-white text-[0.52rem] font-bold tracking-[0.14em] uppercase px-3.5 py-1 rounded-b-lg"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Most Popular
        </motion.div>
      )}

      <span className="text-[0.55rem] font-bold tracking-[0.28em] uppercase text-white/30">
        {plan.tier}
      </span>
      <h3 className="font-serif text-[1.75rem] font-light text-white">
        {plan.name}
      </h3>

      <div className="-mt-1">
        <span className="font-serif text-[2.8rem] font-light leading-none text-grad">
          {plan.price}
        </span>
        <p className="text-[0.7rem] text-white/30 mt-1">{plan.per}</p>
      </div>

      <div className="h-px bg-white/[0.07] my-1" />

      <ul className="flex flex-col gap-2.5 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[0.84rem] font-light text-white/64 leading-[1.65]">
            <Check size={13} className="text-red flex-shrink-0 mt-[3px]" />
            {f}
          </li>
        ))}
      </ul>

      <Button
        href="booking.html"
        variant={plan.hot ? "primary" : "ghost"}
        className="mt-auto w-full justify-center"
      >
        Book This Plan
      </Button>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-bg1">
      <div className="max-w-[1160px] mx-auto px-7">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          Investment
        </motion.span>

        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05]"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, type: "spring", stiffness: 270, damping: 26 }}
        >
          Simple{" "}
          <em className="italic text-grad">Pricing</em>
        </motion.h2>
        <p className="text-[0.88rem] font-light text-white/50 mt-2">
          All prices per person — no hidden fees.
        </p>

        <motion.div
          className="grid md:grid-cols-3 gap-5 mt-14 items-stretch"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.tier} variants={card} className="h-full">
              {plan.hot ? (
                <ShimmerCard>
                  <PricingCardBody plan={plan} />
                </ShimmerCard>
              ) : (
                <div className="bg-card border border-white/[0.06] rounded-2xl h-full animate-pulse-glow">
                  <PricingCardBody plan={plan} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
