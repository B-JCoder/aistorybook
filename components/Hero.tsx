'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

import dragon1 from '@/public/dragon-1.jpg';
import dragon2 from '@/public/placeholder-logo.svg';
import dragon3 from '@/public/placeholder-logo.svg';
import dragon4 from '@/public/placeholder-logo.svg';
import dragon5 from '@/public/placeholder-logo.svg';
import dragon6 from '@/public/placeholder-logo.svg';

interface DragonData {
  id: number;
  image: string;
  title: string;
  description: string;
  story: string;
}

const dragonData: DragonData[] = [
  {
    id: 1,
    image: dragon1.src,
    title: "Neural Flame",
    description: "AI-powered dragon born from algorithmic fire.",
    story: "Born in the molten cores of data clusters, Neural Flame guards the sacred code of evolution."
  },
  {
    id: 2,
    image: dragon2.src,
    title: "Frostbyte",
    description: "Glacier-born guardian of frozen archives.",
    story: "Dwelling in cryo-clouds, Frostbyte holds ancient encrypted dreams."
  },
  {
    id: 3,
    image: dragon3.src,
    title: "Verdant Node",
    description: "Nature-linked dragon merged with bio-code.",
    story: "Its veins pulse with green energy as it sings to the root AI mother."
  },
  {
    id: 4,
    image: dragon4.src,
    title: "Shadow Loop",
    description: "Watcher in the neural shadows.",
    story: "Built by lost civilizations, Shadow Loop patrols the void between algorithms."
  },
  {
    id: 5,
    image: dragon5.src,
    title: "Starlink Spirit",
    description: "Cosmic AI bonded with light-speed data streams.",
    story: "Drifting between satellites, Starlink Spirit glows with celestial firewalls."
  },
  {
    id: 6,
    image: dragon6.src,
    title: "Steamware",
    description: "Mechanical steampunk dragon powered by quantum gears.",
    story: "Its core runs on dream-fuel mined from alternate timelines."
  }
];

const HeroSection: React.FC = () => {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedDragon, setSelectedDragon] = useState<DragonData | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotationSpeed = 24;

  const carouselDimensions = useMemo(() => ({
    width: 'w-36 h-48 sm:w-48 sm:h-60 md:w-56 md:h-72',
    translateZ: 280
  }), []);

  const handleDragonClick = useCallback((dragon: DragonData) => {
    setSelectedDragon(dragon);
    router.push(`/story/${dragon.id}`);
  }, [router]);

  useEffect(() => {
    const carousel = document.querySelector('.dragon-carousel') as HTMLElement;
    if (carousel) {
      const shouldAnimate = isPlaying && !isHovered;
      carousel.style.animationDuration = `${rotationSpeed}s`;
      if (shouldAnimate) carousel.classList.add('animate-rotate3d');
      else carousel.classList.remove('animate-rotate3d');
    }
  }, [isPlaying, isHovered]);

  return (
    <section className="relative w-full h-[100vh]  font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-black z-0" />

      {/* Carousel */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-20 z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`dragon-carousel relative ${carouselDimensions.width}`}
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            animationDuration: `${rotationSpeed}s`,
          }}
        >
          {dragonData.map((dragon, index) => (
            <div
              key={dragon.id}
              className="carousel-item absolute inset-0 cursor-pointer group transition-all duration-500 hover:z-10"
              style={{
                transform: `rotateY(${index * (360 / dragonData.length)}deg) translateZ(${carouselDimensions.translateZ}px)`,
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`relative w-full h-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ${
                hoveredIndex === index ? 'scale-105 shadow-neon' : ''
              }`}>
                <img
                  src={dragon.image}
                  alt={dragon.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="absolute bottom-0 p-3 w-full text-white">
                    <h3 className="font-[Good_Times] text-sm sm:text-lg text-center">{dragon.title}</h3>
                    <p className="text-xs sm:text-sm text-center text-[#12B0FC] mb-2">{dragon.description}</p>
                    <Button
                      size="sm"
                      className="w-full bg-[#BD02F7] text-white hover:scale-105 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDragonClick(dragon);
                      }}
                    >
                      <Sparkles className="mr-1 h-4 w-4" /> Begin Story
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-2">
        <Button onClick={() => setIsPlaying(!isPlaying)} size="icon" variant="outline">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button onClick={() => {
          setIsPlaying(false);
          setTimeout(() => setIsPlaying(true), 100);
        }} size="icon" variant="outline">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Dragon Info */}
      {selectedDragon && (
        <div className="absolute bottom-6 left-6 right-6 z-30 bg-[#121212]/90 backdrop-blur-md p-5 rounded-xl text-white border border-[#BD02F7]/30">
          <h2 className="font-[Good_Times] text-xl text-[#BD02F7] mb-1">{selectedDragon.title}</h2>
          <p className="text-sm text-[#ccc] mb-4">{selectedDragon.story}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => router.push(`/story/${selectedDragon.id}`)} className="flex-1 bg-[#12B0FC] text-black">
              <Sparkles className="mr-2 h-4 w-4" /> Enter the Realm
            </Button>
            <Button variant="outline" onClick={() => setSelectedDragon(null)} className="flex-1 border-[#BD02F7] text-white">
              Back to Dragons
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
