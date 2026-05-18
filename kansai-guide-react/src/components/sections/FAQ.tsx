"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Are the tours really 100% private?",
    a: "Absolutely. Every tour is exclusively for your group — no strangers, no shared buses. If you book a private tour, you get Tony (or your chosen guide) entirely to yourselves.",
  },
  {
    q: "How far in advance should I book?",
    a: "At least 48 hours ahead is ideal, though Tony occasionally fits last-minute requests. Peak season (March–May and October–November) books 2–4 weeks out, so the earlier the better.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations more than 72 hours before the tour are fully refunded. Between 48–72 hours: 50% refund. Under 48 hours: no refund. In case of bad weather affecting hiking tours, Tony will reschedule at no extra cost.",
  },
  {
    q: "How does transport work?",
    a: "Tony navigates everything — trains, subways, taxis and cable cars. All fares listed as 'included' in your route are covered in the price. You walk alongside him rather than following a flag.",
  },
  {
    q: "Can Tony guide in my language?",
    a: "Tony is fluent in English, Spanish, Russian, Czech and Arabic. If your language is different, the team includes additional guides — see the Meet the Team page for other language options.",
  },
];

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className="border border-white/[0.06] rounded-xl bg-card overflow-hidden"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        onClick={onToggle}
        className="w-full bg-transparent border-none text-white font-sans text-[0.93rem] font-medium text-left px-6 py-5 cursor-pointer flex justify-between items-center gap-4 hover:text-red transition-colors duration-200"
      >
        <span>{item.q}</span>
        <motion.span
          className="text-[1.25rem] font-light text-white/30 flex-shrink-0 leading-none select-none"
          animate={{ rotate: isOpen ? 45 : 0, color: isOpen ? "#E53030" : "rgba(255,255,255,0.3)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height:  { type: "spring", stiffness: 300, damping: 32 },
              opacity: { duration: 0.22 },
            }}
            style={{ overflow: "hidden" }}
          >
            <p className="px-6 pb-5 text-[0.9rem] font-light text-white/58 leading-[1.9]">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 bg-bg1">
      <div className="max-w-[1160px] mx-auto px-7">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          Common Questions
        </motion.span>
        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05] mb-10"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, type: "spring", stiffness: 270, damping: 26 }}
        >
          Frequently{" "}
          <em className="italic text-grad">Asked</em>
        </motion.h2>

        <motion.div
          className="max-w-[720px] flex flex-col gap-2.5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              variants={{
                hidden:   { opacity: 0, y: 20 },
                visible:  { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 28 } },
              }}
            >
              <FAQRow
                item={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
