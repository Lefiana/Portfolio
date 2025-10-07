"use client";

import React from "react";
import Image from "next/image";

interface AboutPreviewProps {
  info: {
    photo_url: string;
    long_bio: string;
  };
}

const AboutPreview: React.FC<AboutPreviewProps> = ({ info }) => {
  const paragraphs = (info.long_bio || "")
    .split("\n\n")
    .filter((p) => p.trim() !== "");

  return (
    <section
      className="
        mx-auto 
        px-6 
        sm:px-8 
        md:px-12 
        py-0
        max-w-[90rem]
        xl:max-w-[95rem]
        2xl:max-w-[100rem]
        transition-all 
        duration-500
      "
    >
      <div
        className="
          grid 
          md:grid-cols-[1.1fr_1.9fr] 
          gap-10 
          lg:gap-14 
          xl:gap-20 
          items-center
        "
      >
        {/* Image Column */}
        <div className="flex justify-center lg:justify-end">
          <div
            className="
              relative 
              w-64 h-64 
              sm:w-72 sm:h-72 
              xl:w-80 xl:h-80 
              2xl:w-96 2xl:h-96
              rounded-xl 
              overflow-hidden 
              shadow-2xl 
              border-4 border-white 
              transform 
              hover:scale-[1.03] 
              transition-transform 
              duration-500 
              ease-out
            "
          >
            <Image
              src={info.photo_url}
              alt="Profile photo"
              fill
              className="object-cover object-center opacity-95"
            />
          </div>
        </div>

        {/* Text Column */}
        <div className="max-w-[850px]">
          <h2
            className="
              text-4xl 
              md:text-5xl 
              2xl:text-6xl 
              font-bold 
              text-gray-800 
              mb-6 
              tracking-tight
            "
          >
            About Me
          </h2>

          <div
            className="
              space-y-5 
              text-lg 
              lg:text-xl 
              2xl:text-[1.35rem] 
              text-gray-700 
              leading-relaxed
            "
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
