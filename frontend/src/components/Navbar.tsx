// ── components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useI18n, LOCALES } from "../hooks/useI18n";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { locale, setLocale, t } = useI18n();
  const tx = t("navbar");

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = LOCALES.find((l) => l.id === locale)!;

  const links = [
    { to: "/", label: tx.home },
    { to: "/verificar", label: tx.verify },
    { to: "/aprender", label: tx.learn },
    { to: "/feed", label: tx.feed },
    { to: "/cartilhas", label: tx.booklets },
    { to: "/contato", label: tx.contact },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-cream-100/90 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 group"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="14" stroke="#1a1a1a" strokeWidth="3.5" />
            <line x1="30" y1="30" x2="42" y2="42" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
            <polyline
              points="12,20 18,26 29,13"
              fill="none"
              stroke="#B8922A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-serif font-bold text-2xl text-ink-900 leading-none">
            by<em className="not-italic text-gold-500">Trust</em>
            <span className="text-gold-500">.</span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wide transition-colors ${
                  isActive ? "text-gold-500" : "text-ink-700 hover:text-ink-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* ── Language Switcher ── */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              aria-label={tx.langLabel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-all"
            >
              <span className="text-base leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline text-xs font-semibold tracking-wide uppercase">
                {currentLang.id}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-cream-50 border border-ink-200 rounded-xl shadow-lg py-1 overflow-hidden z-50">
                {LOCALES.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setLocale(loc.id);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      locale === loc.id
                        ? "bg-gold-500/10 text-gold-700 font-semibold"
                        : "text-ink-700 hover:bg-ink-50"
                    }`}
                  >
                    <span className="text-base">{loc.flag}</span>
                    <span className="flex-1 text-left">{loc.label}</span>
                    {locale === loc.id && (
                      <Check size={13} className="text-gold-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth buttons */}
          {user ? (
            <>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-ink-900 text-cream-100"
                      : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                  }`
                }
              >
                <User size={16} />
                {user.displayName ?? user.username}
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2 rounded-full text-ink-500 hover:text-ink-900 hover:bg-ink-100 transition-colors"
                aria-label={tx.logout}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors"
              >
                <LogOut size={16} className="rotate-180" />
                {tx.login}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="btn-outline text-sm py-2 px-5"
              >
                {tx.createAccount}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="w-10 h-10 rounded-full border border-ink-400 flex items-center justify-center hover:bg-ink-100 transition-colors"
                aria-label="Perfil"
              >
                <User size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-ink-200 overflow-x-auto">
        <div className="flex min-w-max">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? "text-gold-500" : "text-ink-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to={user ? "/perfil" : "/login"}
            className={({ isActive }) =>
              `px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive ? "text-gold-500" : "text-ink-600"
              }`
            }
          >
            {user ? (user.displayName ?? user.username) : tx.login}
          </NavLink>

          {/* Mobile lang switcher compacto */}
          <div className="flex items-center px-3 gap-1 border-l border-ink-200">
            {LOCALES.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setLocale(loc.id)}
                className={`text-xs px-2 py-1 rounded-full font-semibold transition-colors ${
                  locale === loc.id
                    ? "bg-gold-500/10 text-gold-700"
                    : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {loc.flag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}