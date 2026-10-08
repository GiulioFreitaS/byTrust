// ═══════════════════════════════════════════════════════════════════
// pages/cartilhas.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { Download } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

const FILES = [
  { arquivo: "10_sinais_de_um_produto_falso.pdf", bgCard: "bg-gold-500/10" },
  { arquivo: "Qual_o_problema_da_falsificação.pdf", bgCard: "bg-cream-200" },
  { arquivo: "O_que_é_consumo_conciente.pdf", bgCard: "bg-emerald-500/10" },
  { arquivo: "Onde_a_falsificação_está_presente.pdf", bgCard: "bg-cream-100" },
  { arquivo: "Falsificação_em_cosmeticos.pdf", bgCard: "bg-red-500/10" },
  { arquivo: "Porque_comprar_original.pdf", bgCard: "bg-gold-400/10" },
];

async function download(arquivo: string) {
  const res = await fetch(`/cartilhas/${arquivo}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = arquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Cartilhas() {
  const { t } = useI18n();
  const tx = t("cartilhas");

  const items = FILES.map((f, i) => ({ ...f, ...tx.items[i] }));

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="section-label mb-3">{tx.eyebrow}</p>
        <h1 className="display-title text-4xl md:text-6xl mb-4">{tx.title}</h1>
        <p className="text-ink-600 max-w-2xl mx-auto">{tx.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.arquivo} className={`card-hover flex flex-col ${it.bgCard}`}>
            <div
              className="aspect-[3/4] rounded-xl border border-ink-200 bg-cream-50 mb-4 p-6 flex flex-col justify-between relative overflow-hidden"
              style={{
                backgroundImage: `url(/cartilhas/preview/${it.arquivo.replace(".pdf", ".jpeg")})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute top-3 right-3">
                <span className="tag tag-gold text-[10px]">PDF · 1p</span>
              </div>
              <div />
              <div className="bg-cream-50/90 p-3 rounded-lg">
                <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">byTrust</div>
                <div className="font-serif font-bold text-lg text-ink-900 leading-tight">{it.t}</div>
              </div>
            </div>
            <p className="text-sm text-ink-600 mb-5 flex-1">{it.d}</p>
            <button
              type="button"
              onClick={() => download(it.arquivo)}
              className="btn-primary text-sm justify-center"
            >
              <Download className="w-4 h-4" /> {tx.downloadBtn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}