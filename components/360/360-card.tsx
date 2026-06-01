"use client"

import Image from "next/image"

export default function ThreeSixtyCard() {
  return (
    <div className="h-[480px] rounded-3xl border border-white/10 bg-[#0f0f0f] flex flex-col items-center justify-center relative overflow-hidden">

      {/* OUTER RINGS */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[260px] h-[260px] rounded-full border border-white/10" />
        <div className="absolute w-[320px] h-[320px] rounded-full border border-white/5" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-white/[0.03]" />
      </div>

      {/* CENTER IMAGE CIRCLE */}
      <div className="relative w-[180px] h-[180px] rounded-full overflow-hidden border border-white/20 z-10">
        <Image
          src="/villa/placeholder.jpg"
          alt="360 view"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 360 LABEL */}
      <div className="absolute z-20 text-white/80 text-sm tracking-[0.3em] uppercase">
        360°
      </div>

      {/* CTA */}
      <div className="absolute bottom-8 text-xs text-white/50 tracking-[0.35em] uppercase">
        Explore 360 Tour →
      </div>

    </div>
  )
}