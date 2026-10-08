// ═══════════════════════════════════════════════════════════════════
// pages/Feed.tsx — com i18n
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import {
  Loader2, Send, Trash2, ShieldCheck, Newspaper, ExternalLink,
} from "lucide-react";
import { api, type Post } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../hooks/useI18n";


// ── Fix: extrai o tipo da prop "tx" sem genérico inline em TSX.
// ReturnType<ReturnType<typeof useI18n>["t"]<"feed">> causa TS1005
// porque o compilador interpreta <"feed"> como JSX.
// Solução: usar o overload sem argumento e tipar como Record<string, string>.
type FeedTx = Record<string, string>;

function parseNewsPost(content: string) {
  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  const rawTitle = lines.find((l) => l.startsWith("📰")) || "";
  const dateLine = lines.find((l) => l.startsWith("📅")) || "";
  const sourceLine = lines.find((l) => l.startsWith("🔗 Fonte:")) || "";
  const urlLine = lines.find((l) => /^https?:\/\//i.test(l)) || "";
  const title = rawTitle.replace(/^📰\s*/, "").trim();
  const date = dateLine.replace(/^📅\s*/, "").trim();
  const source = sourceLine.replace(/^🔗 Fonte:\s*/, "").trim();
  const bodyLines = lines.filter(
    (l) =>
      !l.startsWith("📰") && !l.startsWith("📅") && !l.startsWith("🔗 Fonte:") &&
      !/^https?:\/\//i.test(l)
  );
  return { title, date, source, url: urlLine, description: bodyLines.join(" ").trim() };
}

function isNewsPost(post: Post) {
  return post.isAuto && (post.content.includes("📰") || post.content.includes("🔗 Fonte:"));
}

function PostImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img src={src} alt={alt} className="mt-4 w-full rounded-xl border border-ink-200"
      onError={(e) => { e.currentTarget.style.display = "none"; }} />
  );
}

function NewsCard({ post, canDelete, onDelete, tx }: {
  post: Post;
  canDelete: boolean;
  onDelete: (id: string) => void;
  tx: FeedTx;
}) {
  const news = parseNewsPost(post.content);
  return (
    <div className="card hover:border-ink-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 grid place-items-center text-gold-600 shrink-0">
            <Newspaper size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-ink-900 truncate">
                {post.user.displayName ?? post.user.username}
              </p>
              <span className="tag-green"><ShieldCheck size={10} /> {tx.verified}</span>
            </div>
            <div className="text-xs text-ink-400 mt-1">
              {news.date || new Date(post.createdAt).toLocaleDateString()}
              {news.source ? ` • ${news.source}` : ""}
            </div>
          </div>
        </div>
        {canDelete && (
          <button onClick={() => onDelete(post.id)} className="text-ink-300 hover:text-red-500 transition-colors p-1" aria-label="Delete">
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="rounded-2xl border border-ink-200 bg-white/70 p-4">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
            {tx.newsLabel}
          </span>
        </div>
        <h3 className="text-lg font-semibold leading-snug text-ink-900">{news.title || tx.newsDefaultTitle}</h3>
        {news.description && (
          <p className="mt-3 text-sm leading-6 text-ink-700 whitespace-pre-wrap break-words wrap-anywhere">{news.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-ink-400">{tx.publishedAt} {new Date(post.createdAt).toLocaleDateString()}</div>
          {news.url && (
            <a href={news.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-ink-800">
              {tx.readArticle} <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
      {post.imageUrl && <PostImage src={post.imageUrl} alt={news.title || "Imagem"} />}
    </div>
  );
}

function RegularPostCard({ post, canDelete, onDelete, tx }: {
  post: Post;
  canDelete: boolean;
  onDelete: (id: string) => void;
  tx: FeedTx;
}) {
  return (
    <div className="card hover:border-ink-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-4 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 grid place-items-center text-sm font-bold text-gold-600 shrink-0">
            {(post.user.displayName ?? post.user.username)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-ink-900">{post.user.displayName ?? post.user.username}</div>
            <div className="text-xs text-ink-400">{new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {post.isAuto && <span className="tag-green"><ShieldCheck size={10} /> {tx.verified}</span>}
          {canDelete && (
            <button onClick={() => onDelete(post.id)} className="text-ink-300 hover:text-red-500 transition-colors p-1" aria-label="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-ink-700 leading-relaxed mb-4 whitespace-pre-wrap break-words wrap-anywhere">{post.content}</p>
      {post.imageUrl && <PostImage src={post.imageUrl} alt="Imagem da publicação" />}
    </div>
  );
}

export default function Feed() {
  const { user } = useAuth();
  const { t } = useI18n();
  const tx = t("feed");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState("");

  useEffect(() => {
    api.community.feed()
      .then(setPosts)
      .catch((e: Error) => setLoadErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!text.trim()) return;
    setPostErr(""); setPosting(true);
    try {
      const p = await api.community.post(text.trim());
      setPosts((x) => [p, ...x]);
      setText("");
    } catch (e: unknown) {
      setPostErr(e instanceof Error ? e.message : "Erro ao publicar");
    } finally { setPosting(false); }
  };

  const del = async (id: string) => {
    try {
      await api.community.delete(id);
      setPosts((x) => x.filter((p) => p.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-20 fade-up">
      <div className="mb-10">
        <p className="section-label mb-2">{tx.eyebrow}</p>
        <h1 className="font-serif font-black text-5xl text-ink-900">{tx.title}</h1>
        <p className="text-ink-500 mt-2 text-sm">{tx.subtitle}</p>
      </div>

      {user && (
        <div className="card mb-8">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/20 grid place-items-center text-sm font-bold text-gold-600 shrink-0">
              {(user.displayName ?? user.username)[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea value={text} onChange={(e) => setText(e.target.value)}
                placeholder={tx.postPlaceholder}
                className="w-full bg-transparent resize-none text-sm text-ink-900 placeholder-ink-400 focus:outline-none min-h-20 leading-relaxed"
                onKeyDown={(e) => { if (e.key === "Enter" && e.metaKey) submit(); }} />
              {postErr && <p className="text-xs text-red-600 mt-1">{postErr}</p>}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
                <span className="text-xs text-ink-400">{tx.postHint}</span>
                <button onClick={submit} disabled={posting || !text.trim()} className="btn-primary text-sm py-2 px-5">
                  {posting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {tx.postBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-ink-400" /></div>
      ) : loadErr ? (
        <div className="text-center py-20 text-red-600">{loadErr}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-ink-400">
          <p className="font-serif text-xl font-bold text-ink-700 mb-2">{tx.emptyTitle}</p>
          <p className="text-sm">{tx.emptySubtitle}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => {
            const canDelete = user?.username === p.user.username;
            return isNewsPost(p) ? (
              <NewsCard key={p.id} post={p} canDelete={canDelete} onDelete={del} tx={tx} />
            ) : (
              <RegularPostCard key={p.id} post={p} canDelete={canDelete} onDelete={del} tx={tx} />
            );
          })}
        </div>
      )}
    </div>
  );
}