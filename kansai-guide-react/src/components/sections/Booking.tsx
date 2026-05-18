"use client";
import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";

const WA_LINKS = [
  {
    flag: "🇬🇧",
    label: "Write in English",
    msg: "Hi Tony! I'd like to book a private tour in Kansai. Could you tell me more about availability?",
  },
  {
    flag: "🇪🇸",
    label: "Escribir en Español",
    msg: "¡Hola Tony! Me gustaría reservar un tour privado en Kansai. ¿Puedes contarme más sobre la disponibilidad?",
  },
  {
    flag: "🇷🇺",
    label: "Написать по-русски",
    msg: "Привет Тони! Я хотел бы забронировать частный тур в Кансай. Расскажи мне о доступных датах.",
  },
  {
    flag: "🇨🇿",
    label: "Napsat česky",
    msg: "Ahoj Tony! Rád bych si zarezervoval soukromý výlet do Kansai. Můžeš mi říct více o dostupnosti?",
  },
  {
    flag: "🇸🇦",
    label: "الكتابة بالعربية",
    msg: "مرحباً توني! أود حجز جولة خاصة في كانساي. هل يمكنك إخباري عن التواريخ المتاحة؟",
  },
];

const WA_NUMBER = "34634193106";

const inputCls = [
  "w-full bg-white/[0.04] border border-white/[0.1] rounded-xl text-white/90",
  "font-sans text-[0.9rem] font-light px-4 py-3 outline-none placeholder:text-white/25",
  "transition-all duration-200",
  "focus:border-[rgba(229,48,48,0.5)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(229,48,48,0.1)]",
].join(" ");

export function Booking() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <section id="booking" className="py-28 bg-bg">
      <div className="max-w-[1160px] mx-auto px-7">
        <motion.span
          className="block text-[0.58rem] font-bold tracking-[0.34em] uppercase text-red mb-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          Reserve Your Date
        </motion.span>
        <motion.h2
          className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-light leading-[1.05] mb-12"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.07, type: "spring", stiffness: 270, damping: 26 }}
        >
          Book Your{" "}
          <em className="italic text-grad">Tour</em>
        </motion.h2>

        {/* Calendar CTA */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 26 }}
        >
          <Button href="booking.html" variant="primary" className="text-sm">
            📅 Check Availability &amp; Book
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* WhatsApp quick links */}
          <motion.div
            className="bg-card border border-[rgba(37,211,102,0.18)] rounded-2xl p-8"
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle size={18} className="text-[#25D366]" />
              <h3 className="font-serif text-[1.55rem] font-light text-white">
                Chat on WhatsApp
              </h3>
            </div>
            <p className="text-[0.88rem] font-light text-white/55 leading-[1.8] mb-6">
              Tony typically replies within 2 hours. Choose your language and your message arrives pre-written.
            </p>

            <div className="flex flex-col gap-2">
              {WA_LINKS.map((wa) => (
                <motion.a
                  key={wa.label}
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(wa.msg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3.5 bg-[rgba(37,211,102,0.05)] border border-[rgba(37,211,102,0.15)] rounded-xl text-white/80 text-[0.84rem] font-light no-underline transition-colors duration-200 hover:bg-[rgba(37,211,102,0.12)] hover:border-[rgba(37,211,102,0.4)]"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <span className="text-lg flex-shrink-0">{wa.flag}</span>
                  <span className="flex-1">{wa.label}</span>
                  <span className="text-white/25">→</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <h3 className="font-serif text-[1.55rem] font-light text-white mb-6">
              Send a Message
            </h3>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 size={48} className="text-[#E53030]" />
                  </motion.div>
                  <p className="font-serif text-[1.5rem] italic font-light text-red">
                    Message sent!
                  </p>
                  <p className="text-[0.85rem] font-light text-white/50">
                    Tony will reply within 24 h.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[
                    { label: "Your Name",      id: "name",  type: "text",  placeholder: "Jane Smith",              required: true  },
                    { label: "Email",          id: "email", type: "email", placeholder: "jane@example.com",        required: true  },
                    { label: "Travel Dates",   id: "dates", type: "text",  placeholder: "e.g. 15–18 October 2026", required: false },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="block text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-white/30 mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={inputCls}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-[0.62rem] font-semibold tracking-[0.1em] uppercase text-white/30 mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell Tony about your ideal day in Kansai…"
                      rows={4}
                      className={`${inputCls} resize-y min-h-[100px]`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-[#E53030] to-[#FF6B35] text-white text-[0.68rem] font-semibold tracking-[0.1em] uppercase disabled:opacity-60 cursor-pointer border-none mt-1"
                    whileHover={{ scale: loading ? 1 : 1.03, boxShadow: loading ? "none" : "0 8px 28px rgba(229,48,48,0.35)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        Send Message <Send size={13} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
