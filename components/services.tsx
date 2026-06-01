"use client"

import { Film, Camera, Plane, Monitor, Share2 } from "lucide-react"

const services = [
  {
    icon: Film,
    title: "360° Virtual Tours",
    description: "Immersive walkthroughs that bring spaces to life."
  },
  {
    icon: Camera,
    title: "Cinematic Videos",
    description: "High-end cinematic videos that tell a story."
  },
  {
    icon: Plane,
    title: "Drone Footage",
    description: "Stunning aerial visuals that elevate perspective."
  },
  {
    icon: Monitor,
    title: "Property Showcases",
    description: "Complete visual packages for luxury properties."
  },
  {
    icon: Share2,
    title: "Social Media Content",
    description: "Engaging content tailored for modern platforms."
  }
]

export default function Services() {
  return (
    <section className="bg-[#0a0a0a] py-16 px-6 md:px-12" id="services">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12">
        {/* Services Grid */}
        <div className="flex-1">
          <h2 className="text-[#c9a962] text-xs tracking-[0.3em] uppercase mb-10">
            Our Services
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {services.map((service, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-lg border border-white/10 flex items-center justify-center mb-4 text-white/60">
                  <service.icon size={24} strokeWidth={1} />
                </div>
                <h3 className="text-white text-[10px] tracking-[0.15em] uppercase font-medium mb-2">
                  {service.title}
                </h3>
                <p className="text-white/40 text-[11px] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="lg:w-[400px] bg-[#111] p-8 flex flex-col items-center justify-center text-center">
          {/* Quote Icon */}
          <div className="mb-6">
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-white/30">
              <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1" />
              <text x="20" y="26" textAnchor="middle" fill="currentColor" fontSize="16">{`"`}{`"`}</text>
            </svg>
          </div>
          
          <p className="text-white/70 text-sm tracking-[0.1em] uppercase leading-relaxed mb-2">
            {"We don't just capture spaces."}
          </p>
          <p className="text-white/70 text-sm tracking-[0.1em] uppercase leading-relaxed mb-8">
            We create experiences.
          </p>

          {/* Logo */}
          <div className="text-[#c9a962] text-4xl font-serif font-light">
            N<sup className="text-lg">+</sup>
          </div>
        </div>
      </div>
    </section>
  )
}
