"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, ExternalLink } from "lucide-react"

interface VillaClientProps {
  villa: any
}

export default function VillaClient({ villa }: VillaClientProps) {
  const [isSpecialRequestOpen, setIsSpecialRequestOpen] = useState(false)

  const has360Tour = villa.tour_link && villa.tour_link.trim() !== ""
  const hasVideoEmbed = villa.video_embed && villa.video_embed.trim() !== ""

  // Έξυπνη ανίχνευση αν είναι iframe embed code
  const isIframeEmbed = has360Tour && villa.tour_link.includes("<iframe")

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section - υπάρχον κώδικας (δεν αλλάζει) */}
      {/* ... (όλος ο υπάρχων hero κώδικας μένει ίδιος) ... */}

      {/* 360 TOUR SECTION - ΝΕΑ ΈΞΥΠΝΗ ΛΟΓΙΚΗ */}
      {has360Tour && (
        <section className="py-16 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8">360° Virtual Tour</h2>
            
            {isIframeEmbed ? (
              // Αν είναι πλήρες iframe embed code
              <div 
                className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                dangerouslySetInnerHTML={{ __html: villa.tour_link }}
              />
            ) : (
              // Αν είναι απλό link (Panoee, Matterport κλπ.)
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Play size={42} className="text-[#c9a962] ml-1" />
                  </div>
                  <h3 className="text-2xl font-light mb-3">Immersive 360° Experience</h3>
                  <p className="text-white/60 max-w-md mx-auto mb-8">
                    Explore the property in full 360 degrees with exceptional detail
                  </p>
                  <a
                    href={villa.tour_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-[#c9a962] hover:bg-[#d8b86d] text-black px-10 py-4 rounded-xl font-medium transition-all duration-200"
                  >
                    OPEN 360° TOUR
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Video Embed Section - υπάρχον κώδικας */}
      {hasVideoEmbed && (
        <section className="py-16 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-8">Video</h2>
            <div 
              className="aspect-video w-full rounded-2xl overflow-hidden bg-black"
              dangerouslySetInnerHTML={{ __html: villa.video_embed }}
            />
          </div>
        </section>
      )}

      {/* Υπόλοιπο περιεχόμενο της σελίδας... */}
    </div>
  )
}