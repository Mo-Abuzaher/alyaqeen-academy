"use client";

import React from "react";
import { InfiniteMovingCards } from "@/src/components/ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="py-2 rounded-2xl flex flex-col antialiased items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={academyTestimonials}
        direction="left"
        speed="slow"
      />
    </div>
  );
}

const academyTestimonials = [
  {
    quote:
      "The Tajweed is good. She's a pre-school teacher also, and she's very sweet. My son is 7 years old. It's on WhatsApp so you don't have to take your kiddo anywhere. I actually sit with him and it's helped me also (some stuff I said the desi way has been corrected). Hands down would recommend her.",
    name: "Sana Ali",
    title: "Parent",
  },
  {
    quote:
      "Sister K. is a wonderful teacher. She teaches with patience and proper tajweed. She is also extremely flexible with time and her rate is very fair for the amount of classes she offers per week.",
    name: "Sofia Khan",
    title: "Parent",
  },
  {
    quote:
      "My daughter had no interest in reading Quran until we started with Sister K. Alhamdulillah! Sister K. has the patience, skills, and technique to teach my 6-year-old proper tajweed, makharij, and recitation. Now she actually enjoys reading.",
    name: "Sarah's Mom",
    title: "Parent",
  }
];
