"use client";

import { cn } from "../../lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = (item as any).cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-8 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[340px] sm:w-[410px] md:w-[450px] max-w-[95vw] shrink-0 rounded-[28px] border border-[#D5E1D8] bg-white px-10 sm:px-12 pt-11 pb-15 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md h-auto min-h-[280px]"
            key={item.name}
          >
            <blockquote className="flex flex-col flex-1 justify-between gap-6">
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <div className="relative z-20 flex flex-1 items-center justify-center !px-5 w-full">
                <span className="text-[14.5px] md:text-[15.5px] leading-[1.75] font-normal text-[#27272A] block text-center break-normal whitespace-normal">
                  “
                  {item.quote.split(/(\S+-\S+(?:-\S+)?)/g).map((part, index) => 
                    part.includes('-') ? (
                      <span key={index} className="inline-block whitespace-nowrap">{part}</span>
                    ) : (
                      part
                    )
                  )}
                  ”
                </span>
              </div>
              <div className="relative z-20 flex flex-row items-center border-t border-[#E4EBE5] pt-5 mt-6">
                <span className="flex flex-col gap-1 pl-2">
                  <span className="text-[14px] md:text-[15px] font-bold text-[#064E3B]">
                    {item.name}
                  </span>
                  <span className="text-[11.5px] md:text-[12.5px] font-semibold text-[#D4AF37]/90 tracking-wider uppercase block leading-none translate-x-4">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
