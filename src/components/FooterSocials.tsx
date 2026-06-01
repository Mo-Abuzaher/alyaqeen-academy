import React, { useState } from "react";
import { motion } from "motion/react";
import { Facebook, Instagram } from "lucide-react";

interface SocialItem {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FooterSocials: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const socials: SocialItem[] = [
    {
      id: "facebook",
      name: "Facebook",
      url: "https://www.facebook.com/AlyaqeenAcad", // Professional URL or customized
      icon: Facebook,
    },
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/alyaqeen__academy", // Official account or customizable placeholder
      icon: Instagram,
    },
  ];

  // Ultra-smooth custom spring physics for luxurious feedback
  const springTransition = {
    type: "spring",
    stiffness: 380,
    damping: 22,
    mass: 0.6,
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-4 select-none unique-socials-section">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-primary-light)] opacity-75">
        Connect With Us
      </span>
      
      {/* Sleek centered horizontal row for individual buttons without background container */}
      <div className="flex items-center justify-center gap-4 mt-1">
        {socials.map((social, index) => {
          const Icon = social.icon;
          const isHovered = hoveredIndex === index;
          
          // Calculate adjacent offset reactions
          let offsetX = 0;
          let adjacencyScale = 1;

          if (hoveredIndex !== null && hoveredIndex !== index) {
            const distance = Math.abs(hoveredIndex - index);
            if (distance === 1) {
              // Smoothly slide away from the hovered item to create a fluid spacing layout
              offsetX = hoveredIndex < index ? 4 : -4;
              adjacencyScale = 0.97;
            }
          }

          return (
            <motion.a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#E4EBE5] cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              animate={{
                y: isHovered ? -6 : 0,
                x: offsetX,
                scale: isHovered ? 1.15 : adjacencyScale,
                boxShadow: isHovered 
                  ? "0 6px 12px rgba(6, 78, 59, 0.1), 0 2px 4px rgba(212, 175, 55, 0.05)" 
                  : "0 1px 4px rgba(6, 78, 59, 0.01)",
                borderColor: isHovered ? "rgba(212, 175, 55, 0.6)" : "rgba(228, 235, 229, 1)",
              }}
              transition={springTransition}
              style={{
                perspective: 1000,
                willChange: "transform, box-shadow, border-color",
              }}
            >
              {/* Cinematic expandable blurred background halo on hover */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-accent)]/15 to-[var(--color-primary-light)]/10"
                style={{ filter: "blur(4px)" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isHovered ? 1.4 : 0,
                  opacity: isHovered ? 0.95 : 0,
                }}
                transition={springTransition}
              />

              {/* Icon component rendering cleanly with active CSS state transitions */}
              <motion.div
                className="z-10 flex items-center justify-center"
                animate={{
                  color: isHovered ? "var(--color-primary-dark)" : "var(--color-primary)",
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <Icon className="w-4.5 h-4.5 stroke-[2]" />
              </motion.div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
