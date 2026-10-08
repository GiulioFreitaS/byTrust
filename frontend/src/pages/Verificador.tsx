// ── pages/Verificador.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
  Share2,
  Trophy,
  Camera,
  X,
} from "lucide-react";
import { api, assetUrl, type Product, type VerifyResult } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function Verificador() {
  const { user } = useAuth();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const tx = t("verificador");

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [serial, setSerial] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.products
      .list()
      .then(setProducts)
      .catch((e: Error) => console.error("[Verificador] erro:", e.message))
      .finally(() => setProductsLoading(false));
  }, []);

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { setErr(tx.errorFormat); return; }
    if (f.size > MAX_FILE_SIZE) { setErr(tx.errorSize); return; }
    setErr(""); setPhoto(f); setPreview(URL.createObjectURL(f)); setResult(null);
  };

  const removePhoto = () => {
    setPhoto(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const verify = async () => {
    if (!user) { nav("/login"); return; }
    if (!photo) { setErr(tx.errorPhoto); return; }
    if (!selectedProduct) { setErr(tx.errorProduct); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const form = new FormData();
      form.append("photo", photo);
      form.append("productId", selectedProduct);
      if (serial.trim()) form.append("serialCode", serial.trim());
      form.append("sourceType", "manual");
      const r = await api.verifications.create(form);
      setResult(r);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setErr(
        msg === "Você já verificou este produto com este código serial"
          ? tx.errorDuplicate
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 fade-up">
      <div className="text-center mb-12">
        <p className="section-label mb-3">{tx.eyebrow}</p>
        <h1 className="font-serif font-black text-5xl text-ink-900 mb-4">{tx.title}</h1>
        <p className="text-ink-500 max-w-sm mx-auto leading-relaxed">{tx.subtitle}</p>
        {!user && (
          <p className="mt-4 text-sm text-gold-600 bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-3 inline-block">
            <button onClick={() => nav("/login")} className="underline font-semibold">
              {tx.loginPromptPre}
            </button>{" "}
            {tx.loginPromptPost}
          </p>
        )}
      </div>

      <div className="card space-y-6">
        {/* Upload */}
        <div>
          <label className="label">{tx.photoLabel}</label>
          {!preview ? (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-52 border-2 border-dashed border-ink-300 rounded-xl flex flex-col items-center justify-center gap-3 text-ink-400 hover:border-ink-600 hover:text-ink-700 transition-all duration-150 bg-cream-100/50 group"
            >
              <Camera size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{tx.photoPlaceholder}</span>
              <span className="text-xs text-ink-300">{tx.photoHint}</span>
            </button>
          ) : (
            <div className="relative rounded-xl overflow-hidden">
              <img src={preview} className="w-full h-64 object-cover" alt="preview" />
              <button
                onClick={removePhoto}
                className="absolute top-3 right-3 bg-ink-900/70 backdrop-blur rounded-full p-1.5 text-cream-100 hover:bg-ink-900 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onPhoto}
          />
        </div>

        {/* Produto */}
        <div>
          <label className="label">{tx.productLabel}</label>
          {productsLoading ? (
            <div className="input flex items-center gap-2 text-ink-400">
              <Loader2 size={14} className="animate-spin" /> {tx.productsLoading}
            </div>
          ) : (
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input appearance-none cursor-pointer"
            >
              <option value="">{tx.productPlaceholder}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand.name} — {p.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Serial */}
        <div>
          <label className="label">
            {tx.serialLabel}{" "}
            <span className="text-ink-400 normal-case font-normal">{tx.serialOptional}</span>
          </label>
          <input
            className="input"
            placeholder={tx.serialPlaceholder}
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verify()}
          />
        </div>

        {err && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {err}
          </div>
        )}

        <button
          onClick={verify}
          disabled={loading || productsLoading}
          className="btn-primary w-full justify-center py-3.5 text-base"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> {tx.btnVerifying}</>
          ) : (
            <><Upload size={18} /> {tx.btnVerify}</>
          )}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <div
          className={`mt-8 rounded-2xl border-2 p-6 ${
            result.authentic
              ? "border-emerald-300 bg-emerald-50"
              : "border-red-300 bg-red-50"
          }`}
        >
          <div className="flex items-start gap-4 mb-6">
            {result.authentic ? (
              <CheckCircle2 size={36} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={36} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div
                className={`font-serif font-black text-2xl ${
                  result.authentic ? "text-emerald-800" : "text-red-800"
                }`}
              >
                {result.authentic ? tx.resultAuthentic : tx.resultSuspect}
              </div>
              <div className="text-ink-700 text-sm mt-1 leading-relaxed">{result.message}</div>
            </div>
          </div>

          {result.authentic && result.seal && (
            <>
              <img
                src={result.seal.imageUrl}
                alt="Selo gerado"
                className="w-full rounded-xl mb-5 border border-ink-200"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="flex gap-2 flex-wrap">
                <a href={result.seal.shareableUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm py-2">
                  {tx.sealPage}
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=Acabei de verificar meu produto com @byTrust! ✅&url=${result.seal.shareableUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-sm py-2"
                >
                  <Share2 size={14} /> {tx.share}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(result.seal!.shareableUrl)}
                  className="btn-ghost text-sm py-2"
                >
                  {tx.copyLink}
                </button>
              </div>
            </>
          )}

          {result.newBadges.length > 0 && (
            <div className="mt-5 p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl">
              <div className="flex items-center gap-2 font-semibold text-gold-600 mb-3">
                <Trophy size={18} /> {tx.newBadge}
              </div>
              <div className="flex gap-3 flex-wrap">
                {result.newBadges.map((b) => (
                  <div key={b.id} className="flex items-center gap-2 text-sm">
                    <img
                      src={assetUrl(b.imageUrl)}
                      className="w-8 h-8 rounded-full border border-gold-500/30"
                      alt={b.name}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-ink-800 font-medium">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}