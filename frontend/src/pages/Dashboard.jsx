import React from "react";
import ImageInput from "../components/nature/ImageInput";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-seafoam/30">
      {/* Header: Desktop padding and max-width expansion */}
      <header className="bg-[--background-image-nature-header] pt-12 pb-24 md:pt-16 md:pb-32 px-6 rounded-b-[3rem] md:rounded-b-[5rem] shadow-lg shadow-slate-blue/20">
        <div className="max-w-md md:max-w-6xl mx-auto flex justify-between items-center text-green-400">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic">
              NatureFlow
            </h1>
          </div>
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-md transition-transform hover:rotate-12 cursor-pointer">
            <span className="text-lg md:text-2xl">🌿</span>
          </div>
        </div>
      </header>

      {/* Main Content: Adaptive grid/width for larger screens */}
      <main className="max-w-md md:max-w-6xl mx-auto -mt-12 md:-mt-16 px-4 md:px-8">
        <section className="bg-white/80 backdrop-blur-sm rounded-[2.5rem] md:rounded-[4rem] p-2 md:p-10 shadow-xl shadow-sage/5">
          <div className="space-y-8">
            <ImageInput />
          </div>
        </section>
      </main>
      
      {/* Footer / Decorative Spacer */}
      <div className="h-20 md:h-32"></div>
    </div>
  );
}