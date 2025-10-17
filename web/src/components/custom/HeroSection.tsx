"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  const essenceSectionRef = useRef<HTMLElement>(null);

  const scrollToEssenceSection = () => {
    essenceSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    onExploreClick?.();
  };

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between">
      {/* Content Section */}
      <div className="flex flex-col lg:pt-0 flex-1">
        <header className="mb-8">
          <h2 className="font-extrabold text-lg text-gray-500 mb-2">
            Welcome to
          </h2>
          <h1 className="lg:text-[6rem] text-4xl font-bold text-neutral-800 mb-6 leading-tight">
            Bantayan Island
          </h1>
          <p className="max-w-[42rem] text-gray-600 font-medium text-lg leading-relaxed">
            Discover the hidden gem of the Philippines with pristine beaches,
            vibrant culture, and unforgettable adventures.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="w-40 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out cursor-pointer"
            onClick={scrollToEssenceSection}
          >
            Explore Bantayan
          </Button>
        </div>
      </div>

      {/* Image Section */}
      <aside className="hidden lg:block flex-1">
        <figure>
          <Image
            src="/images/splash.png"
            alt="Bantayan Island scenic view showing pristine beaches and crystal clear waters"
            width={750}
            height={550}
            className="rounded-lg drop-shadow-[0_0_25px_rgba(62,151,159,0.4)] w-full h-auto"
            priority
          />
        </figure>
      </aside>
    </section>
  );
}
