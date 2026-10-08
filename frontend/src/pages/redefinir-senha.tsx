// ═══════════════════════════════════════════════════════════════════
// pages/redefinir-senha.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { validarSenha } from "../lib/validation";
import { useI18n } from "../hooks/useI18n";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function redefinirSenha(token: string, password: string): Promise<void> {
  const res = await fetch(`${BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      typeof data === "object" && data !== null && "error" in data
        ? String((data as { error: unknown }).error)
        : "Erro desconhecido"
    );
  }
}

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token") || "";
  const { t } = useI18n();
  const tx = t("redefinirSenha");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const rules = [
    { label: tx.ruleMinChars, ok: password.length >= 6 },
    { label: tx.ruleOneLetter, ok: /[A-Za-z]/.test(password) },
    { label: tx.ruleOneNumber, ok: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const senhaResult = validarSenha(password);
    if (!senhaResult.valido) {
      setError(senhaResult.mensagem);
      return;
    }

    if (password !== confirmPassword) {
      setError(tx.passwordsMismatch);
      return;
    }

    setLoading(true);
    try {
      await redefinirSenha(tokenParam, password);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen fade-up pt-24 pb-16 px-5">
        <div className="max-w-md mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 grid place-items-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="display-title text-3xl mb-2">{tx.successTitle}</h1>
          <p className="text-sm text-ink-600 mb-6">{tx.successDesc}</p>
          <button onClick={() => navigate("/login")} className="btn-primary inline-flex">
            {tx.goToLogin} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fade-up pt-24 pb-16 px-5">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="display-title text-3xl md:text-4xl mb-2">{tx.title}</h1>
          <p className="text-sm text-ink-600">{tx.subtitle}</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="label">{tx.newPasswordLabel}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={tx.newPasswordPlaceholder}
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {rules.map((r) => (
                  <div
                    key={r.label}
                    className={`flex items-center gap-1.5 text-xs ${password.length > 0 && r.ok ? "text-emerald-600" : "text-ink-500"}`}
                  >
                    {password.length > 0 && r.ok
                      ? <CheckCircle2 className="w-3 h-3" />
                      : <div className="w-3 h-3 rounded-full border border-current" />}
                    {r.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{tx.confirmPasswordLabel}</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={tx.confirmPasswordPlaceholder}
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <div className="mt-1 flex items-center gap-1.5 text-xs">
                  {password === confirmPassword ? (
                    <><CheckCircle2 className="w-3 h-3 text-emerald-600" /><span className="text-emerald-600">{tx.passwordsMatch}</span></>
                  ) : (
                    <><div className="w-3 h-3 rounded-full border border-red-500" /><span className="text-red-600">{tx.passwordsMismatch}</span></>
                  )}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> {tx.submitting}</>
              ) : (
                <><LockKeyhole className="w-4 h-4" /> {tx.submitBtn}</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900">
            <ArrowRight className="w-4 h-4 rotate-180" /> {tx.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
}