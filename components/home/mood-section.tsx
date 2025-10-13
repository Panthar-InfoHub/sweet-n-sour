"use client";

import Image from "next/image";
import { useState } from "react";

type MoodType = "left-1" | "right-1" | "center-1" | "center-2" | "center-3" | null;

const moodData = {
  "left-1": {
    title: "Kuch Khatta",
    subtitle: "Meetha ho jaye",
    side: "right" as const, // Character appears on right for left bottle
  },
  "right-1": {
    title: "Kuch Spicy Ho",
    subtitle: "Jaye",
    side: "left" as const, // Character appears on left for right bottle
  },
  "center-1": {
    title: "Sweet Mood",
    subtitle: "Feels Good",
    side: "right" as const,
  },
  "center-2": {
    title: "Tangy Vibes",
    subtitle: "Fresh & Zesty",
    side: "left" as const,
  },
  "center-3": {
    title: "Chill Mode",
    subtitle: "Relax & Enjoy",
    side: "right" as const,
  },
};

export function MoodSection() {
  const [hoveredBottle, setHoveredBottle] = useState<MoodType>(null);

  return (
    <section className="py-16 bg-surface">
      <div className="">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-balance">
          What's your mood for the day?
        </h2>
        <p className="text-center font-semibold text-foreground-muted mb-12 max-w-2xl mx-auto text-pretty">
          How are you feeling today? I hope you're doing well! Let's take a moment to brighten your
          mood and bring some positivity into your day!
        </p>
        {/* decorative background */}
        <div className=" bg-[url('/images/mood-decorative.svg')] bg-cover bg-center rounded-2xl py-8 bg-no-repeat px-4">
          {/* kitchen */}
          <div className="relative h-[300px] md:h-[500px] max-w-6xl mx-auto rounded-2xl overflow-hidden bg-[url('/images/mood-bg.png')] bg-no-repeat bg-cover bg-center">
            {/* Mood details tooltip at top - Dialog style */}
            <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2 z-20">
              <div
                className={`relative bg-primary text-primary-foreground px-6 md:px-8 py-3 md:py-4 rounded-2xl shadow-xl transition-opacity duration-300 min-w-[200px] md:min-w-[280px] ${
                  hoveredBottle ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {hoveredBottle && (
                  <div className="text-center">
                    <p className="font-bold text-base md:text-xl whitespace-nowrap">
                      {moodData[hoveredBottle].title}
                    </p>
                    <p className="text-sm md:text-base mt-1">{moodData[hoveredBottle].subtitle}</p>
                  </div>
                )}
                {/* Dialog pointer/tail */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45"></div>
              </div>
            </div>

            {/* table  */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[url('/images/mood-table.png')] bg-no-repeat bg-contain w-full h-48 md:h-64 bg-center">
              {/* // bottles on the table  */}
              <div className="absolute w-72 h-36 md:w-96 md:h-44 left-1/2 -translate-x-1/2 top-2 md:top-0">
                {/* Left bottle */}
                <button
                  onMouseEnter={() => setHoveredBottle("left-1")}
                  onMouseLeave={() => setHoveredBottle(null)}
                  className="absolute left-2 md:left-0 bottom-1/2 translate-y-1/2 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <Image
                    src="/images/dummy-2.png"
                    alt="Kuch Khatta Meetha"
                    width={90}
                    height={90}
                    className="object-contain w-14 h-14 md:w-[90px] md:h-[90px]"
                  />
                </button>

                {/* Right bottle */}
                <button
                  onMouseEnter={() => setHoveredBottle("right-1")}
                  onMouseLeave={() => setHoveredBottle(null)}
                  className="absolute right-2 md:right-0 bottom-1/2 translate-y-1/2 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <Image
                    src="/images/dummy-2.png"
                    alt="Kuch Spicy Ho Jaye"
                    width={90}
                    height={90}
                    className="object-contain w-14 h-14 md:w-[90px] md:h-[90px]"
                  />
                </button>

                {/* Center top bottle */}
                <button
                  onMouseEnter={() => setHoveredBottle("center-1")}
                  onMouseLeave={() => setHoveredBottle(null)}
                  className="absolute right-1/2 -translate-x-1/2 top-4 md:top-4 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <Image
                    src="/images/dummy-2.png"
                    alt="Sweet Mood"
                    width={70}
                    height={70}
                    className="object-contain w-11 h-11 md:w-[70px] md:h-[70px]"
                  />
                </button>

                {/* Center right bottle */}
                <button
                  onMouseEnter={() => setHoveredBottle("center-2")}
                  onMouseLeave={() => setHoveredBottle(null)}
                  className="absolute left-1/2 translate-x-1/2 top-4 md:top-4 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <Image
                    src="/images/dummy-2.png"
                    alt="Tangy Vibes"
                    width={70}
                    height={70}
                    className="object-contain w-11 h-11 md:w-[70px] md:h-[70px]"
                  />
                </button>

                {/* Center bottom bottle */}
                <button
                  onMouseEnter={() => setHoveredBottle("center-3")}
                  onMouseLeave={() => setHoveredBottle(null)}
                  className="absolute right-1/2 translate-x-1/2 bottom-2 md:bottom-0 cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none"
                >
                  <Image
                    src="/images/dummy-2.png"
                    alt="Chill Mode"
                    width={90}
                    height={90}
                    className="object-contain w-14 h-14 md:w-[90px] md:h-[90px]"
                  />
                </button>
              </div>

              {/* character  */}
              <div className="hidden md:block">
                {/* left side character (for left/center bottles) */}
                <div
                  className={`absolute right-8 lg:right-10 bottom-0 transition-opacity duration-300 ${
                    hoveredBottle && moodData[hoveredBottle].side === "left"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <Image
                    src="/images/mood-character.png"
                    alt="Mood Character"
                    width={300}
                    height={300}
                    className="object-contain rotate-y-180 scale-x-[-1] w-[250px] h-[250px] lg:w-[300px] lg:h-[300px]"
                  />
                </div>

                {/* right side character (for right bottles) */}
                <div
                  className={`absolute left-8 lg:left-10 bottom-0 transition-opacity  duration-300 ${
                    hoveredBottle && moodData[hoveredBottle].side === "right"
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <Image
                    src="/images/mood-character.png"
                    alt="Mood Character"
                    width={300}
                    height={300}
                    className="object-contain rotate-y-180 w-[250px] h-[250px] lg:w-[300px] lg:h-[300px]"
                  />
                </div>
              </div>

              {/* Mobile character - appears on left side */}
              <div className="md:hidden">
                <div
                  className={`absolute left-2 bottom-0 transition-opacity duration-300 ${
                    hoveredBottle ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src="/images/mood-character.png"
                    alt="Mood Character"
                    width={140}
                    height={140}
                    className="object-contain rotate-y-180 w-[140px] h-[140px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
