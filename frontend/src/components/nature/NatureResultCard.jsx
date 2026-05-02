import { useState, useEffect } from "react";
import { fetchYouTubeVideo } from "../../services/api";

export default function NatureResultCard({ data }) {
  const {
    scene,
    emotion,
    symbolism,
    reflection,
    philosophy,
    quote,
    actions,
    music,
  } = data;

  const [youtubeVideos, setYoutubeVideos] = useState([null, null, null]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loadingMusic, setLoadingMusic] = useState(true);

  const tracks = music?.tracks ?? [];

  useEffect(() => {
    if (!tracks.length) return;

    const loadMusic = async () => {
      setLoadingMusic(true);
      try {
        const results = await Promise.allSettled(
          tracks.slice(0, 3).map((t) => fetchYouTubeVideo(t.search_query)),
        );
        setYoutubeVideos(
          results.map((r) => (r.status === "fulfilled" ? r.value : null)),
        );
      } finally {
        setLoadingMusic(false);
      }
    };

    loadMusic();
  }, [tracks]);

  const intensityPercent = Math.round((emotion?.intensity ?? 0) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Main Analysis Card */}
      <div className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-2xl shadow-sage/10">
        
        {/* Header: Scene Description */}
        <div className="text-center space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold text-text italic tracking-tight">
            {scene?.title}
          </h3>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-md mx-auto">
            {scene?.description}
          </p>
          <div className="w-16 h-px bg-border mx-auto pt-4" />
        </div>

        {/* Emotion & Resonance */}
        <div className="space-y-4">
          <p className="text-[10px] md:text-xs font-black text-sage tracking-[0.25em]">
            Current Resonance
          </p>
          <div className="flex items-center gap-6">
            <span className="text-base md:text-lg font-bold text-text capitalize">
              {emotion?.mood}
            </span>
            <div className="flex-1 h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border/50">
              <div
                className="h-full bg-seafoam rounded-full transition-all duration-[1500ms] ease-out"
                style={{ width: `${intensityPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono text-text-muted">{intensityPercent}%</span>
          </div>
          <div className="inline-block px-4 py-1.5 bg-sage/10 text-sage text-[10px] md:text-xs font-bold rounded-full tracking-wider">
            {emotion?.feeling}
          </div>
        </div>

        {/* Symbolism & Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <div className="space-y-3">
            <p className="text-[10px] font-black text-sage tracking-[0.2em]">
              Symbolic Meaning
            </p>
            <p className="text-lg font-semibold text-text leading-snug">
              {symbolism?.meaning}
            </p>
            <p className="text-sm text-text-muted leading-relaxed italic">
              {symbolism?.insight}
            </p>
          </div>

          {philosophy?.tradition && (
            <div className="space-y-3">
              <p className="text-[10px] font-black text-sage tracking-[0.2em]">
                {philosophy.tradition} Tradition
              </p>
              <p className="text-sm text-text-muted leading-relaxed">
                {philosophy.insight}
              </p>
            </div>
          )}
        </div>

        {/* Reflection: Deep Water Box */}
        <div className="bg-slate-blue/5 border border-slate-blue/10 rounded-[2rem] p-8 space-y-4">
          <p className="text-base md:text-lg text-text leading-relaxed font-medium italic">
            "{reflection?.message}"
          </p>
          <div className="pt-4 border-t border-slate-blue/10">
            <p className="text-xs md:text-sm text-slate-blue font-bold">
               Inner Inquiry: <span className="font-medium text-text-muted">{reflection?.question}</span>
            </p>
          </div>
        </div>

        {/* Quote */}
        {quote?.text && (
          <div className="py-6 text-center space-y-3">
            <p className="text-lg md:text-xl text-text italic font-medium leading-relaxed max-w-sm mx-auto">
              "{quote.text}"
            </p>
            <p className="text-[10px] md:text-xs text-sage font-black tracking-[0.3em]">
              — {quote.author}
            </p>
          </div>
        )}

        {/* Mindful Seeds (Actions) */}
        {actions?.length > 0 && (
          <div className="space-y-6">
            <p className="text-[10px] font-black text-sage tracking-[0.2em]">
              Actions
            </p>
            <div className="grid grid-cols-1 gap-3">
              {actions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 text-sm md:text-base text-text bg-surface-muted/30 p-5 rounded-2xl border border-border/20 hover:border-terracotta/30 transition-all group"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-terracotta text-white text-xs font-bold shadow-lg shadow-terracotta/20 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </span>
                  {action}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Music Section */}
        <div className="space-y-6 pt-6 border-t border-border/40">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black text-sage tracking-[0.2em]">
              Soundscape Selection
            </p>
            <span className="text-[10px] font-bold text-text-muted tracking-widest bg-surface-muted px-3 py-1 rounded-full">
              {music?.mood}
            </span>
          </div>

          {loadingMusic ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 bg-surface-muted rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {youtubeVideos.map((video, i) =>
                video ? (
                  <div key={i} className="group space-y-3">
                    {activeVideo === i ? (
                      <div className="rounded-[2rem] overflow-hidden aspect-video shadow-2xl ring-4 ring-seafoam/10 animate-in zoom-in-95 duration-500">
                        <iframe
                          src={`${video.embedUrl}?autoplay=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div
                        className="relative group rounded-[1.5rem] overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all active:scale-[0.98]"
                        onClick={() => setActiveVideo(i)}
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-32 object-cover brightness-[0.6] group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center ring-1 ring-white/40 group-hover:scale-110 transition-transform">
                            <span className="text-white text-xs ml-1">▶</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                          <p className="text-xs text-white font-bold truncate tracking-wide">{video.title}</p>
                        </div>
                      </div>
                    )}
                    <p className="text-[11px] md:text-xs text-text-muted px-4 italic leading-relaxed border-l-2 border-sage/20 ml-2">
                      "{tracks[i]?.reason}"
                    </p>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer decorative element */}
      <div className="text-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
        <span className="text-2xl">🍃</span>
      </div>
    </div>
  );
}