"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function MovingBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    const randomShape = () => {
      return `polygon(
        ${Math.random() * 30}% ${Math.random() * 30}%, 
        ${70 + Math.random() * 20}% ${Math.random() * 40}%, 
        ${80 + Math.random() * 15}% ${70 + Math.random() * 20}%, 
        ${Math.random() * 40}% ${80 + Math.random() * 15}%
      )`;
    };

    gsap.to(bgRef.current, {
      clipPath: () => randomShape(),
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#f5f5f5]">
      {/* Animated Background */}
      <div
        ref={bgRef}
        className="absolute w-[600px] h-[600px] bg-[#C9DDFD] -z-10"
        style={{
          clipPath: "polygon(20% 10%, 80% 20%, 90% 80%, 10% 90%)",
        }}
      />

      {/* Person Image */}
      <Image
        src="/hero2.png"
        alt="Person"
        className="relative w-[500px] h-auto z-10"
      />
    </div>
  );
}
