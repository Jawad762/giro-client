"use client";
import React from "react";
import Image from "next/image";
import heroImage from "../../../../public/hero.webp";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="_container flex-1 flex flex-col xl:flex-row items-center justify-center gap-3 bg-pattern-1 relative">
      <div className="w-full xl:w-1/2 space-y-4 pt-32 xl:pt-10">
        <h2 className="text-5xl font-bold leading-snug">
          Click GO to Clock-in!
        </h2>
        <button
        onClick={() => router.push('/driver/go')}
            className="bg-white disabled:bg-white/50 disabled:cursor-not-allowed text-black rounded-lg py-3 px-10"
          >
            GO
          </button>
      </div>
      <Image
        height={500}
        width={500}
        alt="hero"
        src={heroImage}
        className="pt-10"
      />
    </section>
  );
};

export default Hero;
