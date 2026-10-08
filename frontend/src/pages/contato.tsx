// ═══════════════════════════════════════════════════════════════════
// pages/contato.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { Send } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

export default function Contato() {
  const [sent, setSent] = useState(false);
  const { t } = useI18n();
  const tx = t("contato");

  const contactInfo = [
    { icon: "mail", t: tx.emailLabel, d: tx.emailValue },
    { icon: "phone", t: tx.phoneLabel, d: tx.phoneValue },
    { icon: "map", t: tx.locationLabel, d: tx.locationValue },
  ];

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-label mb-3">{tx.eyebrow}</p>
        <h1 className="display-title text-4xl md:text-6xl mb-4">{tx.title}</h1>
        <p className="text-ink-600 max-w-2xl mx-auto">{tx.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="space-y-4">
          {contactInfo.map((c) => (
            <div key={c.t} className="card">
              <div className="font-serif font-bold text-lg text-ink-900">{c.t}</div>
              <div className="text-sm text-ink-600">{c.d}</div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 card">
          {sent ? (
            <div className="text-center py-12">
              <h2 className="font-serif font-bold text-2xl mb-2 text-ink-900">{tx.successTitle}</h2>
              <p className="text-ink-600">{tx.successDesc}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label">{tx.formName}</label><input required className="input" /></div>
                <div><label className="label">{tx.formEmail}</label><input type="email" required className="input" /></div>
              </div>
              <div><label className="label">{tx.formCompany}</label><input className="input" /></div>
              <div>
                <label className="label">{tx.formSubject}</label>
                <select className="input">
                  {tx.subjects.map((s: string) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className="label">{tx.formMessage}</label><textarea required rows={5} className="input" /></div>
              <button type="submit" className="btn-primary"><Send className="w-4 h-4" /> {tx.formSubmit}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}