// ═══════════════════════════════════════════════════════════════════
// pages/Perfil.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Trophy, Clock, CheckCircle2, XCircle, Loader2, Lock } from "lucide-react";
import { api, assetUrl, type Verification, type Badge, type BadgeCatalog } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";
import Auth from "./Auth";

type Tab = "verificacoes" | "selos" | "conquistas";

export default function Perfil() {
  const { user } = useAuth();
  if (!user) return <Auth />;
  return <Dashboard />;
}

function Dashboard() {
  const { user, refresh } = useAuth();
  const { t } = useI18n();
  const tx = t("perfil");

  const [tab, setTab] = useState<Tab>("verificacoes");
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<BadgeCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  useEffect(() => {
    refresh().catch(() => {});
    Promise.all([api.verifications.list(), api.badges.mine(), api.badges.all()])
      .then(([v, b, ab]) => { setVerifications(v); setBadges(b); setAllBadges(ab); })
      .catch((e: Error) => setLoadErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const authentic = verifications.filter((v) => v.status === "AUTHENTIC").length;
  const earnedNames = new Set(badges.map((b) => b.badge.name));

  const TAB_LABELS: Record<Tab, string> = {
    verificacoes: tx.tabVerifications,
    selos: tx.tabSeals,
    conquistas: tx.tabAchievements,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-20 fade-up">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-gold-500/10 border-2 border-gold-500/30 grid place-items-center text-3xl font-bold text-gold-600 font-serif shrink-0">
          {(user?.displayName ?? user?.username ?? "U")[0].toUpperCase()}
        </div>
        <div>
          <p className="section-label mb-1">{tx.eyebrow}</p>
          <h1 className="font-serif font-black text-3xl text-ink-900">{user?.displayName ?? user?.username}</h1>
          <div className="text-ink-400 text-sm mt-0.5">@{user?.username}</div>
          {user?.bio && <p className="text-ink-600 text-sm mt-2 max-w-md">{user.bio}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: <ShieldCheck size={20} className="text-emerald-600" />, val: authentic, label: tx.statsAuthentic, bg: "bg-emerald-50 border-emerald-200" },
          { icon: <Trophy size={20} className="text-gold-500" />, val: badges.length, label: tx.statsAchievements, bg: "bg-gold-500/5 border-gold-500/20" },
          { icon: <Clock size={20} className="text-blue-500" />, val: verifications.length, label: tx.statsVerifications, bg: "bg-blue-50 border-blue-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 text-center ${s.bg}`}>
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="font-serif font-black text-4xl text-ink-900">{s.val}</div>
            <div className="text-xs text-ink-500 mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-ink-200 mb-8 gap-0">
        {(["verificacoes", "selos", "conquistas"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${tab === t ? "border-ink-900 text-ink-900" : "border-transparent text-ink-400 hover:text-ink-700"}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-ink-400"><Loader2 size={24} className="animate-spin" /></div>
      ) : loadErr ? (
        <div className="text-center py-20 text-red-600">{loadErr}</div>
      ) : (
        <>
          {tab === "verificacoes" && (
            verifications.length === 0 ? <Empty msg={tx.emptyVerifications} btnLabel={tx.emptyBtn} subMsg={tx.emptySubtitle} /> : (
              <div className="space-y-3">
                {verifications.map((v) => (
                  <div key={v.id} className="card flex items-center gap-4 py-4 hover:border-ink-300 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${v.status === "AUTHENTIC" ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                      {v.status === "AUTHENTIC" ? <CheckCircle2 size={20} className="text-emerald-600" /> : <XCircle size={20} className="text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-ink-900 truncate">{v.product.name}</div>
                      <div className="text-xs text-ink-400 mt-0.5">
                        {v.product.brand.name} · {new Date(v.createdAt).toLocaleDateString()}
                        {v.serialCode && ` · #${v.serialCode}`}
                      </div>
                    </div>
                    {v.seal && (
                      <a href={v.seal.shareableUrl} target="_blank" rel="noreferrer"
                        className="text-xs px-3 py-1.5 rounded-full border border-ink-300 hover:border-ink-700 hover:text-ink-900 transition-colors shrink-0 text-ink-600">
                        {tx.sealView}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "selos" && (
            verifications.filter((v) => v.seal).length === 0 ? <Empty msg={tx.emptySeals} btnLabel={tx.emptyBtn} subMsg={tx.emptySubtitle} /> : (
              <div className="grid sm:grid-cols-2 gap-5">
                {verifications.filter((v) => v.seal).map((v) => (
                  <div key={v.seal!.id} className="card-hover">
                    <img src={v.seal!.imageUrl} alt="Selo" className="w-full rounded-xl mb-4 border border-ink-200"
                      onError={(e) => (e.currentTarget.style.display = "none")} />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-sm font-semibold text-gold-600">{v.seal!.uniqueCode}</div>
                        <div className="text-xs text-ink-500 mt-0.5">{v.product.name}</div>
                      </div>
                      <a href={v.seal!.shareableUrl} target="_blank" rel="noreferrer" className="btn-ghost text-xs py-1.5 px-3">{tx.sealOpen}</a>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {tab === "conquistas" && (
            <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-5">
              {allBadges.map((b) => {
                const earned = earnedNames.has(b.name);
                const userBadge = badges.find((ub) => ub.badge.name === b.name);
                return (
                  <div key={b.id} className={`card text-center transition-all ${earned ? "border-gold-500/30" : "opacity-40"}`}>
                    <div className="relative inline-block mb-3">
                      <img src={assetUrl(b.imageUrl)} alt={b.name}
                        className={`w-20 h-20 mx-auto rounded-full border-2 ${earned ? "border-gold-500" : "border-ink-200"}`}
                        onError={(e) => (e.currentTarget.style.display = "none")} />
                      {!earned && (
                        <div className="absolute inset-0 flex items-center justify-center"><Lock size={18} className="text-ink-400" /></div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-ink-900">{b.name}</div>
                    <div className="text-xs text-ink-500 mt-1 leading-relaxed">{b.description}</div>
                    {earned && userBadge && (
                      <div className="text-xs text-gold-600 font-medium mt-2">{new Date(userBadge.earnedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Empty({ msg, btnLabel, subMsg }: { msg: string; btnLabel: string; subMsg: string }) {
  const nav = useNavigate();
  return (
    <div className="text-center py-20 text-ink-400">
      <p className="font-serif text-xl font-bold text-ink-700 mb-2">{msg}</p>
      <p className="text-sm mb-6">{subMsg}</p>
      <button onClick={() => nav("/verificar")} className="btn-primary">{btnLabel}</button>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// pages/cartilhas.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
// NOTE: este arquivo é separado — veja cartilhas.tsx abaixo