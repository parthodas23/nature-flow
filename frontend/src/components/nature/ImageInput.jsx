import { useState, useRef } from "react";
import { analyzeNature } from "../../services/api";
import NatureResultCard from "./NatureResultCard";

const MODES = ["upload", "camera"];

export default function ImageInput() {
  const [mode, setMode] = useState("upload");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [camera, setCamera] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    stopCamera();
  };

  const handleModeSwitch = (m) => {
    setMode(m);
    reset();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCamera(true);
    } catch {
      setError(
        "Camera access denied. Please allow permissions to capture nature.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const captured = new File([blob], "capture.jpg", {
          type: "image/jpeg",
        });
        setFile(captured);
        setPreview(URL.createObjectURL(captured));
        stopCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const data = await analyzeNature(file);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 px-4 pb-20">
      {/* Input Section */}
      <div className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-xl shadow-sage/5 transition-all">
        {/* Header Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-text tracking-tight italic">
            Capture the Wild
          </h2>
          <p className="text-sm md:text-base text-text-muted">
            Document the flora and fauna around you
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-surface-muted p-1.5 rounded-full w-full max-w-[320px] border border-border/50">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => handleModeSwitch(m)}
                className={`
                  flex-1 px-6 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300
                  ${
                    mode === m
                      ? "bg-sage text-white shadow-md shadow-sage/20"
                      : "text-text-muted hover:text-sage"
                  }
                `}
              >
                {m === "upload" ? "Gallery" : "Lens"}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Mode UI */}
        {mode === "upload" && !preview && (
          <label className="group relative flex flex-col items-center justify-center gap-4 border-2 border-dashed border-sage/30 rounded-[2rem] px-6 py-12 md:py-16 cursor-pointer hover:border-sage hover:bg-sage/5 transition-all overflow-hidden">
            <div className="bg-sage/10 p-5 rounded-full group-hover:scale-110 transition-transform duration-500">
              <span className="text-4xl md:text-5xl">🌿</span>
            </div>
            <div className="text-center">
              <span className="block text-sm md:text-lg font-medium text-text">
                Choose a photo
              </span>
              <span className="text-[10px] md:text-xs text-text-muted uppercase tracking-tighter opacity-70">
                JPG, PNG, HEIC
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {/* Camera Mode UI */}
        {mode === "camera" && !preview && (
          <div className="space-y-4">
            <div className="relative bg-text rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-video shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${camera ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
              />
              {!camera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/50">
                  <div className="w-16 h-16 border-2 border-dashed border-white/20 rounded-full animate-spin-slow flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-widest">
                    Ready to Focus
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {!camera ? (
                <button
                  onClick={startCamera}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold bg-slate-blue text-white shadow-lg shadow-slate-blue/20 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  Wake Lens
                </button>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-terracotta text-white shadow-lg shadow-terracotta/20 hover:scale-[1.01] active:scale-95 transition-all"
                  >
                    Capture Moment
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-8 py-4 rounded-2xl text-sm font-bold border border-border text-text-muted hover:bg-surface-muted transition-all"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview UI */}
        {preview && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] md:aspect-video bg-surface-muted shadow-lg ring-4 ring-sage/10">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={reset}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-text text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-terracotta hover:text-white transition-all shadow-sm"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Error Handling */}
        {error && (
          <div className="text-xs md:text-sm text-red-600 bg-red-50/50 border border-red-100 p-5 rounded-2xl flex items-center gap-3 italic">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Primary Action Button */}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="group relative w-full py-5 rounded-2xl text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden
            bg-terracotta text-white shadow-xl shadow-terracotta/20
            disabled:bg-surface-muted disabled:text-text-muted disabled:shadow-none disabled:cursor-not-allowed
            hover:shadow-terracotta/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Listening to nature...
            </span>
          ) : (
            "Begin Reflection"
          )}
        </button>
      </div>

      {/* Result Card: Appearing Below for Scrolling Flow */}
      {result && (
        <div className="animate-in slide-in-from-bottom-12 duration-1000 delay-150">
          <NatureResultCard data={result} />
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
