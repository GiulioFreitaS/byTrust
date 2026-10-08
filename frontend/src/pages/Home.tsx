// ── pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Zap, Trophy, Users } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

const TICKER_ITEMS = [
  "API ANTIPIRATARIA",
  "CONFIANÇA CERTIFICADA",
  "VERIFICAÇÃO EM TEMPO REAL",
  "+500 MIL PRODUTOS VERIFICADOS",
  "CONFIANÇA CERTIFICADA",
  "PRODUTOS VERIFICADOS",
  "API ANTIPIRATARIA",
  "VERIFICAÇÃO EM TEMPO REAL",
];

export default function Home() {
  const nav = useNavigate();
  const { t } = useI18n();
  const tx = t("home");

  return (
    <div className="min-h-screen flex flex-col fade-up">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 relative">
        <span
          className="absolute right-[9%] top-36 text-2xl text-ink-400 select-none hidden lg:block"
          aria-hidden
        >
          ···
        </span>

        <p className="section-label mb-6">{tx.eyebrow}</p>

        <div className="relative mb-2">
          <span className="relative inline-block">
            <span
              className="absolute inset-0 bg-gold-500/20 rounded -rotate-1 scale-x-105 scale-y-110"
              aria-hidden
            />
            <h1 className="display-title text-5xl md:text-7xl lg:text-8xl relative z-10 px-4">
              byTrust
            </h1>
          </span>
        </div>

        <h2 className="display-title text-4xl md:text-6xl lg:text-7xl mt-2 max-w-3xl">
          {tx.headline2}
          <br />
          {tx.headline3}
        </h2>

        <div className="mt-8 mb-8">
          <span className="stamp">{tx.stamp}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => nav("/verificar")}
            className="btn-primary text-base px-8 py-3.5"
          >
            {tx.ctaVerify} <ArrowRight size={17} />
          </button>
          <button
            onClick={() => nav("/aprender")}
            className="btn-outline text-base px-8 py-3.5"
          >
            {tx.ctaLearn}
          </button>
        </div>

        <p className="mt-8 text-ink-500 text-sm max-w-md leading-relaxed">
          {tx.description.split(tx.descriptionOriginal)[0]}
          <strong className="text-ink-800">{tx.descriptionOriginal}</strong>
          {tx.description
            .split(tx.descriptionOriginal)[1]
            ?.split(tx.descriptionFake)[0]}
          <strong className="text-ink-800">{tx.descriptionFake}</strong>
          {tx.description
            .split(tx.descriptionOriginal)[1]
            ?.split(tx.descriptionFake)[1]}
        </p>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-y border-ink-200 py-3 bg-ink-900 text-cream-100">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase whitespace-nowrap px-6"
            >
              {item}
              <span className="text-gold-400" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <ShieldCheck size={26} className="text-gold-500" />,
            tag: tx.feature1Tag,
            title: tx.feature1Title,
            desc: tx.feature1Desc,
          },
          {
            icon: <Trophy size={26} className="text-gold-500" />,
            tag: tx.feature2Tag,
            title: tx.feature2Title,
            desc: tx.feature2Desc,
          },
          {
            icon: <Users size={26} className="text-gold-500" />,
            tag: tx.feature3Tag,
            title: tx.feature3Title,
            desc: tx.feature3Desc,
          },
        ].map((f) => (
          <div key={f.title} className="card-hover group">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                {f.icon}
              </div>
              <span className="font-serif text-4xl font-black text-ink-200 group-hover:text-ink-300 transition-colors">
                {f.tag}
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-ink-900 mb-2">{f.title}</h3>
            <p className="text-ink-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Bottom CTA band */}
      <section className="bg-ink-900 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label text-cream-300 mb-4">{tx.bandEyebrow}</p>
          <h2 className="font-serif font-black text-4xl md:text-5xl text-cream-100 mb-8 leading-tight">
            {tx.bandHeadline}
          </h2>
          <button
            onClick={() => nav("/verificar")}
            className="inline-flex items-center gap-2 bg-cream-100 text-ink-900 font-semibold px-8 py-3.5 rounded-full hover:bg-cream-200 transition-colors"
          >
            <Zap size={16} className="text-gold-500" /> {tx.bandCta}
          </button>
        </div>
      </section>
    </div>
  );
}