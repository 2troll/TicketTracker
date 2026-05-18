"use client";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const LANGS = [
  { flag: "🇬🇧", label: "English" },
  { flag: "🇪🇸", label: "Spanish" },
  { flag: "🇷🇺", label: "Russian" },
  { flag: "🇨🇿", label: "Czech" },
  { flag: "🇸🇦", label: "Arabic" },
];

const fadeUp = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 270, damping: 26, delay },
  },
});

export function About() {
  return (
    <section id="about" className="py-28 bg-bg1">
      <div className="max-w-[1160px] mx-auto px-7">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Your Guide
        </motion.span>

        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05]"
          variants={fadeUp(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Meet{" "}
          <span className="italic text-grad">Tony</span>
        </motion.h2>

        <div className="grid md:grid-cols-[300px_1fr] gap-16 mt-14 items-start">
          {/* Portrait */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/tony-portrait.jpg"
                alt="Tony Hanma"
                className="w-full aspect-[3/4] object-cover object-top block"
              />
              {/* Inner border overlay */}
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)]" />
            </div>
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 bg-card border border-white/[0.1] rounded-xl px-4 py-3"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 24 }}
            >
              <span className="block text-[0.56rem] font-bold tracking-[0.2em] uppercase text-white/35">Since</span>
              <span className="block font-serif text-2xl font-light text-grad leading-none">2018</span>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {[
              "Tony Hanma is a private tour guide based in the Kansai region — the cultural heartland of Japan. Born and raised between Osaka and Kyoto, he spent years exploring every alley, shrine, and local market that most tourists never find.",
              "His tours are entirely private and always tailored to you. Whether you want a deep dive into ancient Buddhist temples, the best hidden ramen, or a sunrise hike above the clouds, Tony builds the day around your pace and your curiosity.",
              "He speaks English, Spanish, Russian, Czech and Arabic — so you can ask questions, share stories, and laugh without a language barrier.",
            ].map((p, i) => (
              <motion.p
                key={i}
                className="text-[0.95rem] font-light text-white/62 leading-[1.95] mb-4"
                variants={fadeUp(0)}
              >
                {p}
              </motion.p>
            ))}

            {/* Language chips */}
            <motion.div
              className="flex flex-wrap gap-2 my-6"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {LANGS.map((l) => (
                <motion.span
                  key={l.label}
                  className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full border border-white/[0.1] text-white/35"
                  variants={{ hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 350, damping: 28 } } }}
                  whileHover={{ borderColor: "rgba(229,48,48,0.5)", color: "rgba(240,234,216,0.9)", scale: 1.05 }}
                >
                  {l.flag} {l.label}
                </motion.span>
              ))}
            </motion.div>

            <motion.div className="flex gap-3 flex-wrap mt-2" variants={fadeUp(0)}>
              <Button href="booking.html" variant="primary">Book a Tour</Button>
              <Button href="/companions.html" variant="ghost">Meet All Guides</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
