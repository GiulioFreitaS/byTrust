// ═══════════════════════════════════════════════════════════════════
// pages/Auth.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, Loader2, LogIn, UserPlus, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = "login" | "register";
type Step = 1 | 2 | 3;
type Profile = "Consumidor" | "Varejista" | "Marca";
type Plan = "Gratuito" | "Profissional" | "Enterprise";

interface FormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile: Profile;
  company: string;
  plan: Plan;
  rememberMe: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PLANS: { id: Plan; description: string }[] = [
  { id: "Gratuito", description: "10 verificações/mês" },
  { id: "Profissional", description: "1.000 verificações/mês" },
  { id: "Enterprise", description: "Verificações ilimitadas" },
];

const PROFILES: Profile[] = ["Consumidor", "Varejista", "Marca"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <div className="w-10 h-10 rounded-full bg-ink-900 flex items-center justify-center">
        <ShieldCheck size={18} className="text-cream-100" />
      </div>
      <span className="font-serif font-bold text-xl text-ink-900">
        by<em className="not-italic text-gold-400">Trust</em>
        <span className="text-gold-400">.</span>
      </span>
    </div>
  );
}

function StepIndicator({ step, total = 3 }: { step: Step; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const num = (i + 1) as Step;
        const done = num < step;
        const active = num === step;
        return (
          <div key={num} className="flex items-center gap-2">
            <div
              className={[
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                done
                  ? "bg-ink-900 text-cream-100"
                  : active
                  ? "bg-ink-900 text-cream-100 ring-4 ring-ink-900/20"
                  : "bg-cream-200 text-ink-400 border border-ink-200",
              ].join(" ")}
            >
              {done ? <Check size={14} /> : num}
            </div>
            {i < total - 1 && (
              <div className={["w-8 h-px", done ? "bg-ink-900" : "bg-ink-200"].join(" ")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  onKeyDown,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? "••••••••"}
          className="input pr-11"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hint && <p className="text-xs text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}

function PasswordRules({ password, rules }: { password: string; rules: { label: string; ok: boolean }[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {rules.map((r) => (
        <li key={r.label} className="flex items-center gap-1.5 text-xs">
          <span
            className={[
              "w-3.5 h-3.5 rounded-full flex items-center justify-center",
              r.ok ? "bg-green-500 text-white" : "bg-ink-200 text-ink-400",
            ].join(" ")}
          >
            {r.ok && <Check size={8} />}
          </span>
          <span className={r.ok ? "text-ink-700" : "text-ink-400"}>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md bg-white border border-ink-100 rounded-2xl p-8 shadow-sm">
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-ink-100" />
      <span className="text-xs text-ink-400 uppercase tracking-widest">ou</span>
      <div className="flex-1 h-px bg-ink-100" />
    </div>
  );
}

function DotProgress({ step, total = 3 }: { step: Step; total?: number }) {
  return (
    <div className="flex justify-center gap-1.5 mt-6 mb-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={[
            "w-1.5 h-1.5 rounded-full transition-all",
            i + 1 === step ? "bg-ink-900 w-3" : "bg-ink-200",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginForm({
  onSwitch,
  login,
  loading,
}: {
  onSwitch: () => void;
  login: (email: string, password: string) => Promise<void>;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { t } = useI18n();
  const tx = t("auth");

  const submit = async () => {
    setErr("");
    try {
      await login(email, password);
      nav("/verificar", { replace: true });
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro desconhecido");
    }
  };

  return (
    <>
      <h1 className="font-serif font-black text-4xl text-ink-900 text-center mb-1">
        {tx.loginTitle}
      </h1>
      <p className="text-ink-500 text-sm text-center mb-8">{tx.loginSubtitle}</p>

      <Card>
        <div className="space-y-5">
          <div>
            <label className="label">{tx.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={tx.emailPlaceholder}
              className="input"
            />
          </div>

          <PasswordField
            label={tx.passwordLabel}
            value={password}
            onChange={setPassword}
            placeholder={tx.passwordPlaceholder}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-ink-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-ink-300"
              />
              {tx.rememberMe}
            </label>
            <Link to="/esqueci-senha" className="text-ink-500 hover:text-gold-500 underline text-xs">
              {tx.forgotPassword}
            </Link>
          </div>

          {err && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full justify-center py-3 text-base"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> {tx.loginLoading}</>
            ) : (
              <><LogIn size={16} className="mr-2" /> {tx.loginBtn}</>
            )}
          </button>

          <Divider />

          <p className="text-center text-sm text-ink-500">
            {tx.noAccount}{" "}
            <button onClick={onSwitch} className="text-ink-900 font-semibold hover:underline">
              {tx.createAccount}
            </button>
          </p>
        </div>
      </Card>

      <p className="text-center mt-6">
        <Link to="/" className="text-sm text-ink-500 hover:text-ink-700">
          {tx.backToHome}
        </Link>
      </p>
    </>
  );
}

// ─── Register Step 1 — Credentials ───────────────────────────────────────────

function RegisterStep1({
  data,
  onChange,
  onNext,
  onSwitch,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onSwitch: () => void;
}) {
  const [err, setErr] = useState("");
  const { t } = useI18n();
  const tx = t("auth");

  const rules = [
    { label: tx.ruleMinChars, ok: data.password.length >= 6 },
    { label: tx.ruleOneLetter, ok: /[a-zA-Z]/.test(data.password) },
    { label: tx.ruleOneNumber, ok: /\d/.test(data.password) },
  ];

  const next = () => {
    setErr("");
    if (!data.displayName.trim()) { setErr("Nome completo é obrigatório."); return; }
    if (!data.email.includes("@")) { setErr("E-mail inválido."); return; }
    if (data.password.length < 6) { setErr(tx.ruleMinChars); return; }
    if (!/[a-zA-Z]/.test(data.password)) { setErr(tx.ruleOneLetter); return; }
    if (!/\d/.test(data.password)) { setErr(tx.ruleOneNumber); return; }
    if (data.password !== data.confirmPassword) { setErr("As senhas não conferem."); return; }
    onNext();
  };

  return (
    <>
      <StepIndicator step={1} />

      <Card>
        <div className="space-y-5">
          <div>
            <label className="label">{tx.nameLabel}</label>
            <input
              type="text"
              value={data.displayName}
              onChange={(e) => onChange({ displayName: e.target.value })}
              placeholder={tx.namePlaceholder}
              className="input"
            />
          </div>

          <div>
            <label className="label">{tx.emailLabel}</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder={tx.emailPlaceholder}
              className="input"
            />
            <p className="text-xs text-ink-400 mt-1">{tx.emailHint}</p>
          </div>

          <div>
            <PasswordField
              label={tx.newPasswordLabel}
              value={data.password}
              onChange={(v) => onChange({ password: v })}
              placeholder={tx.newPasswordPlaceholder}
            />
            <PasswordRules password={data.password} rules={rules} />
          </div>

          <PasswordField
            label={tx.confirmPasswordLabel}
            value={data.confirmPassword}
            onChange={(v) => onChange({ confirmPassword: v })}
            placeholder={tx.confirmPasswordPlaceholder}
          />

          {err && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          <button onClick={next} className="btn-primary w-full justify-center py-3 text-base">
            {tx.nextBtn}
          </button>

          <DotProgress step={1} />

          <Divider />

          <p className="text-center text-sm text-ink-500">
            {tx.hasAccount}{" "}
            <button onClick={onSwitch} className="text-ink-900 font-semibold hover:underline">
              {tx.doLogin}
            </button>
          </p>
        </div>
      </Card>
    </>
  );
}

// ─── Register Step 2 — Profile & Plan ────────────────────────────────────────

function RegisterStep2({
  data,
  onChange,
  onNext,
  onBack,
  onSwitch,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSwitch: () => void;
}) {
  const { t } = useI18n();
  const tx = t("auth");

  return (
    <>
      <StepIndicator step={2} />

      <Card>
        <div className="space-y-5">
          <div>
            <label className="label">{tx.profileLabel}</label>
            <div className="flex gap-2">
              {PROFILES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ profile: p })}
                  className={[
                    "flex-1 px-3 py-2 rounded-full text-sm font-medium border transition-all",
                    data.profile === p
                      ? "bg-ink-900 text-cream-100 border-ink-900"
                      : "bg-transparent text-ink-700 border-ink-200 hover:border-ink-400",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">
              {tx.companyLabel}{" "}
              <span className="text-ink-400 font-normal normal-case">{tx.companyOptional}</span>
            </label>
            <input
              type="text"
              value={data.company}
              onChange={(e) => onChange({ company: e.target.value })}
              placeholder={tx.companyPlaceholder}
              className="input"
            />
          </div>

          <div>
            <label className="label">{tx.planLabel}</label>
            <div className="space-y-2">
              {PLANS.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => onChange({ plan: pl.id })}
                  className={[
                    "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all",
                    data.plan === pl.id
                      ? "bg-cream-50 border-ink-300"
                      : "bg-transparent border-ink-100 hover:border-ink-200",
                  ].join(" ")}
                >
                  <div>
                    <p className="font-medium text-ink-900 text-sm">{pl.id}</p>
                    <p className="text-xs text-ink-400">{pl.description}</p>
                  </div>
                  {data.plan === pl.id && (
                    <div className="w-5 h-5 rounded-full border-2 border-ink-900 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-ink-900" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 btn-secondary justify-center py-3">
              {tx.backBtn}
            </button>
            <button onClick={onNext} className="flex-1 btn-primary justify-center py-3">
              {tx.nextBtn}
            </button>
          </div>

          <DotProgress step={2} />

          <Divider />

          <p className="text-center text-sm text-ink-500">
            {tx.hasAccount}{" "}
            <button onClick={onSwitch} className="text-ink-900 font-semibold hover:underline">
              {tx.doLogin}
            </button>
          </p>
        </div>
      </Card>
    </>
  );
}

// ─── Register Step 3 — Confirm ───────────────────────────────────────────────

function RegisterStep3({
  data,
  onBack,
  onSubmit,
  loading,
  onSwitch,
}: {
  data: FormData;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  onSwitch: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [err, setErr] = useState("");
  const { t } = useI18n();
  const tx = t("auth");

  const submit = () => {
    if (!agreed) { setErr("Você precisa aceitar os Termos de Uso e a Política de Privacidade."); return; }
    setErr("");
    onSubmit();
  };

  const rows: { label: string; value: string }[] = [
    { label: tx.summaryName, value: data.displayName || "—" },
    { label: tx.summaryEmail, value: data.email || "—" },
    { label: tx.summaryProfile, value: data.profile },
    { label: tx.summaryPlan, value: data.plan },
  ];

  return (
    <>
      <StepIndicator step={3} />

      <Card>
        <div className="space-y-5">
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.label} className="bg-cream-50 rounded-xl px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-0.5">{r.label}</p>
                <p className="text-ink-900 text-sm font-medium">{r.value}</p>
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer text-sm text-ink-600 leading-snug">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-ink-300"
            />
            <span>
              {tx.agreeText}{" "}
              <Link to="/termos" className="underline text-ink-900 hover:text-gold-500">
                {tx.agreeTerms}
              </Link>{" "}
              {tx.agreeAnd}{" "}
              <Link to="/privacidade" className="underline text-ink-900 hover:text-gold-500">
                {tx.agreePrivacy}
              </Link>{" "}
              {tx.agreeOf}
            </span>
          </label>

          {err && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {err}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 btn-secondary justify-center py-3">
              {tx.backBtn}
            </button>
            <button
              onClick={submit}
              disabled={loading || !agreed}
              className="flex-1 btn-primary justify-center py-3"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin mr-1" /> {tx.submitLoading}</>
              ) : (
                <><UserPlus size={16} className="mr-1" /> {tx.submitBtn}</>
              )}
            </button>
          </div>

          <DotProgress step={3} />

          <Divider />

          <p className="text-center text-sm text-ink-500">
            {tx.hasAccount}{" "}
            <button onClick={onSwitch} className="text-ink-900 font-semibold hover:underline">
              {tx.doLogin}
            </button>
          </p>
        </div>
      </Card>
    </>
  );
}

// ─── Main Auth Page ───────────────────────────────────────────────────────────

export default function Auth() {
  const { user, login, register, loading } = useAuth();
  const nav = useNavigate();
  const { t } = useI18n();
  const tx = t("auth");

  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>(1);

  const [f, setF] = useState<FormData>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "Consumidor",
    company: "",
    plan: "Gratuito",
    rememberMe: false,
  });

  useEffect(() => {
    if (user) nav("/verificar", { replace: true });
  }, [user, nav]);

  const patch = (p: Partial<FormData>) => setF((x) => ({ ...x, ...p }));

  const switchMode = (m: Mode) => {
    setMode(m);
    setStep(1);
  };

  const submitRegister = async () => {
    try {
      await register(f.email, f.displayName.split(" ")[0].toLowerCase(), f.password, f.displayName);
      nav("/verificar", { replace: true });
    } catch (e) {
      throw e;
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <nav className="h-14 border-b border-ink-100 bg-white flex items-center px-8 gap-8">
        <div className="flex items-center gap-2 font-serif font-bold text-lg text-ink-900">
          <div className="w-7 h-7 rounded-full bg-ink-900 flex items-center justify-center">
            <ShieldCheck size={13} className="text-cream-100" />
          </div>
          by<em className="not-italic text-gold-400">Trust</em>
          <span className="text-gold-400">.</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3 text-sm text-ink-600">
          <button
            onClick={() => switchMode("login")}
            className="flex items-center gap-1.5 hover:text-ink-900"
          >
            <LogIn size={14} /> {tx.loginBtn}
          </button>
          <button
            onClick={() => switchMode("register")}
            className="btn-secondary py-1.5 px-4 text-sm"
          >
            {tx.createAccount} →
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <Logo />

        {mode === "login" ? (
          <LoginForm onSwitch={() => switchMode("register")} login={login} loading={loading} />
        ) : (
          <>
            <h1 className="font-serif font-black text-4xl text-ink-900 text-center mb-1">
              {tx.registerTitle}
            </h1>
            <p className="text-ink-500 text-sm text-center mb-8">{tx.registerSubtitle}</p>

            {step === 1 && (
              <RegisterStep1
                data={f}
                onChange={patch}
                onNext={() => setStep(2)}
                onSwitch={() => switchMode("login")}
              />
            )}
            {step === 2 && (
              <RegisterStep2
                data={f}
                onChange={patch}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                onSwitch={() => switchMode("login")}
              />
            )}
            {step === 3 && (
              <RegisterStep3
                data={f}
                onBack={() => setStep(2)}
                onSubmit={submitRegister}
                loading={loading}
                onSwitch={() => switchMode("login")}
              />
            )}

            <p className="text-center mt-6">
              <Link to="/" className="text-sm text-ink-500 hover:text-ink-700">
                {tx.backToHome}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}