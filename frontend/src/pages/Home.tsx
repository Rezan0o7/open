import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "../lib/api";
import { LiveStreamCard } from "../components/cards/LiveStreamCard";
import { ClipCard } from "../components/cards/ClipCard";

export function Home() {
  const [live, setLive] = React.useState<any[]>([]);
  const [clips, setClips] = React.useState<any[]>([]);
  const [cats, setCats] = React.useState<any[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  const [clipStart, setClipStart] = React.useState(0);
  const clipWindow = 6;

  React.useEffect(() => {
    api
      .home()
      .then((r) => {
        setLive((r.live || []).slice(0, 9));
        setClips((r.clips || []).slice(0, 20));
      })
      .catch((e) => setErr(e.message));

    api
      .categorySamples(3)
      .then((r) => setCats(r.items || []))
      .catch(() => setCats([]));
  }, []);

  const maxClipStart = Math.max(0, clips.length - clipWindow);
  const clipSlice = clips.slice(clipStart, clipStart + clipWindow);

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Live Now</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Top live streams right now.
            </div>
          </div>
          <a
            href="#/live"
            className="rounded-2xl px-4 py-2 text-sm font-semibold"
            style={{
              border: "1px solid var(--border)",
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 28%, transparent), color-mix(in oklab, var(--accent) 18%, transparent))",
            }}
          >
            Live Streams
          </a>
        </div>

        {err && (
          <div
            className="mt-4 rounded-2xl px-4 py-3 text-sm"
            style={{
              border: "1px solid color-mix(in oklab, var(--accent) 35%, var(--border))",
              background: "color-mix(in oklab, var(--accent) 8%, transparent)",
            }}
          >
            Backend not reachable: {err}. Start FastAPI on port 8000.
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {live.map((x) => <LiveStreamCard key={x.stream_id} item={x} />)}
          {!live.length && !err && (
            <>
              <div className="h-[260px] rounded-3xl glass animate-pulse" />
              <div className="h-[260px] rounded-3xl glass animate-pulse" />
              <div className="h-[260px] rounded-3xl glass animate-pulse hidden xl:block" />
            </>
          )}
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Top Clips</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Browse clips. Use arrows to slide, or open the full clips page.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="h-10 w-10 rounded-2xl grid place-items-center hover:opacity-95 transition disabled:opacity-40"
              style={{ border: "1px solid var(--border)" }}
              onClick={() => setClipStart((v) => Math.max(0, v - clipWindow))}
              disabled={clipStart === 0}
              title="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className="h-10 w-10 rounded-2xl grid place-items-center hover:opacity-95 transition disabled:opacity-40"
              style={{ border: "1px solid var(--border)" }}
              onClick={() => setClipStart((v) => Math.min(maxClipStart, v + clipWindow))}
              disabled={clipStart >= maxClipStart}
              title="Next"
            >
              <ChevronRight size={18} />
            </button>

            <a
              href="#/clips"
              className="rounded-2xl px-4 py-2 text-sm font-semibold"
              style={{
                border: "1px solid var(--border)",
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--primary) 28%, transparent), color-mix(in oklab, var(--accent) 18%, transparent))",
              }}
            >
              Show more
            </a>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {clipSlice.map((x) => <ClipCard key={x.clip_id} item={x} />)}
          {!clipSlice.length && !err &&
            Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-[320px] rounded-3xl glass animate-pulse" />)}
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Categories</div>
            <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Each category shows 3 random live streams.
            </div>
          </div>
          <a href="#/categories" className="rounded-2xl px-4 py-2 text-sm" style={{ border: "1px solid var(--border)" }}>
            Browse all
          </a>
        </div>

        <div className="mt-5 space-y-6">
          {cats.map((c) => (
            <div key={c.category_id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{c.name}</div>
                <a
                  href={`#/live?category_id=${encodeURIComponent(c.category_id)}`}
                  className="text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Show all
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(c.samples || []).map((s: any) => <LiveStreamCard key={s.stream_id} item={s} />)}
                {(!c.samples || !c.samples.length) && (
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    No live streams in this category right now.
                  </div>
                )}
              </div>
            </div>
          ))}
          {!cats.length && <div className="text-sm" style={{ color: "var(--muted)" }}>No categories yet.</div>}
        </div>
      </div>
    </div>
  );
}
