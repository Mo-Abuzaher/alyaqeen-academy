import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  BookOpenText, 
  Award, 
  Mail, 
  Phone, 
  MessageCircle, 
  ArrowRight,
  Check,
  ChevronRight,
  BookMarked,
  MessageSquare,
  Star,
  X,
  Trash2
} from "lucide-react";
import EnrollForm from "./components/EnrollForm";
import { FooterSocials } from "./components/FooterSocials";
import InfiniteMovingCardsDemo from "./components/infinite-moving-cards-demo";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";
import logo1 from "./assets/logo1.png";
import heroBg from "./assets/hero bg.mp4";


const COURSES_DATA = [
  {
    id: "tahfeez",
    title: "Tahfeez",
    arabic: "تحفيظ القرآن",
    desc: "Memorization of the Holy Quran. Our qualified teachers guide students through systematic memorization with proper tajweed, helping them commit the entire Quran to memory with understanding and reverence.",
    icon: Award,
    features: [
      "One-on-one sessions",
      "Structured memorization plan",
      "Revision & retention support"
    ],
    delay: "delay-1",
    featured: false
  },
  {
    id: "reading",
    title: "Reading",
    arabic: "قراءة القرآن",
    desc: "Learn to read the Quran with correct pronunciation and fluency. Our reading program focuses on proper recitation, tajweed rules, and building confidence in reading the Holy Book.",
    icon: BookOpenText,
    features: [
      "Tajweed-focused instruction",
      "Fluency building",
      "All levels welcome"
    ],
    delay: "delay-2",
    featured: true
  },
  {
    id: "noorani",
    title: "Noorani Qaida",
    arabic: "القاعدة النورانية",
    desc: "Perfect for beginners. Our teachers introduce the Noorani Qaida—a foundational booklet that teaches Arabic phonetics, the alphabet, and basic pronunciation rules. The essential first step for every Quran learner.",
    icon: BookMarked,
    features: [
      "Arabic alphabet mastery",
      "Phonetics & pronunciation",
      "Beginner-friendly pace"
    ],
    delay: "delay-3",
    featured: false
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "sana",
    stars: 5,
    quote: "The Tajweed is good. She's a pre-school teacher also. And she's very sweet. He does it 5 days a week for 15-20 mins. My son is 7 years old. It's on WhatsApp so you don't have to take your kiddo anywhere. I actually sit with him and it's helped me also (I say some stuff the desi way so it's been corrected). I can only say wonderful things about her. Hands down would recommend her.",
    name: "Sana Ali"
  },
  {
    id: "zahra",
    stars: 5,
    quote: "Your patience is unmatched. Allah humma barek. I am amazed that in one month we have learned so much. I am thankful for you Mrs. K. And the best part you are remote so you can go with us anywhere we go.",
    name: "Zahra"
  },
  {
    id: "iqra",
    stars: 5,
    quote: "I just wanted to sincerely thank you for the effort and care you put into teaching my child. I've noticed that even on days when she is not in the mood, you handle her with so much patience and kindness, and it really means a lot to me.\nI can clearly see improvement in her, and I truly appreciate your dedication and teaching الطريقة.\nMay Allah reward you for your hard work and bless you always. JazakAllah Khair.",
    name: "Iqra Shaikh"
  },
  {
    id: "sofia",
    stars: 5,
    quote: "Sister K. is a wonderful teacher. She teaches with patience and proper tajweed. She is also extremely flexible with time and her rate is very fair for amount of classes she offers per week.",
    name: "Sofia Khan"
  },
  {
    id: "sarahs-mom",
    stars: 5,
    quote: "My daughter had no interest in reading Quran. Until we started reading with Sister K. Alhamdulillah.\nMaShaAllah Sister K. has the patience, skills, and technique to teach my 6 year old daughter proper tajweed, makharij, and recitation of Quran. Now my daughter actually enjoys reading. And best thing is it's only 15 minutes 5 days a week that is enough for her age group to stay engaged and focused. I would highly recommend Sister K. for Quran classes because of her experience, excellent character, and her engagement with my child.",
    name: "Sarah's Mom"
  },
  {
    id: "najla-siddiqui",
    stars: 5,
    quote: "We’ve had a wonderful experience with Sister K. She has guided our daughter from learning the Arabic alphabet to being able to read confidently and memorize several surahs. Her teaching style is clear, structured, and very effective. \nWhat truly stands out is her kindness and patience—she creates a supportive environment that keeps our daughter engaged and motivated. We’re very grateful for the progress she’s made under her guidance and highly recommend her to other families.",
    name: "Najla Siddiqui"
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "reviews">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compactMenuOpen, setCompactMenuOpen] = useState(false);
  const [compactMenuHovered, setCompactMenuHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const hoverTimeoutRef = useRef<any>(null);

  const handleCompactMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setCompactMenuHovered(true);
  };

  const handleCompactMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCompactMenuHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const [hoveredCourseIndex, setHoveredCourseIndex] = useState<number | null>(1);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Leave a review states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewQuote, setNewReviewQuote] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverReviewRating, setHoverReviewRating] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const openWriteModal = () => {
    setNewReviewName("");
    setNewReviewTitle("");
    setNewReviewQuote("");
    setNewReviewRating(5);
    setIsReviewModalOpen(true);
  };

  // Initialize reviews from localStorage or default
  const [testimonials, setTestimonials] = useState<any[]>(() => {
    const saved = localStorage.getItem("alyaqeen_testimonials");
    let customReviews: any[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out duplicate IDs or any leftover "Najla" overrides to let the static declaration govern
          customReviews = parsed.filter(
            (r: any) => 
              !DEFAULT_TESTIMONIALS.some((d) => d.id === r.id) && 
              r.id !== "najla-siddiqui" &&
              !r.name?.includes("Najla")
          );
        }
      } catch (e) {
        console.error("Error reading testimonials from local storage", e);
      }
    }
    return [...customReviews, ...DEFAULT_TESTIMONIALS];
  });

  // Fetch reviews from Supabase in background
  useEffect(() => {
    async function fetchReviews() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching testimonials from Supabase:", error);
          return;
        }

        if (data) {
          const fetched: any[] = data.map((item: any) => ({
            id: item.id || `supabase_${item.created_at || Date.now()}`,
            stars: item.stars || 5,
            quote: item.quote || "",
            name: item.name || "Anonymous",
            title: item.title || ""
          }));

          setTestimonials((prev) => {
            // Keep transient local reviews created in this current browser session in the last 45 seconds.
            // This prevents race-conditions where a review is added but the concurrent fetch takes action.
            const now = Date.now();
            const transientUnsynced = prev.filter((p) => {
              if (DEFAULT_TESTIMONIALS.some((d) => d.id === p.id)) return false;
              if (fetched.some((f) => f.id === p.id)) return false;
              if (p.id.startsWith("review_")) {
                const ts = parseInt(p.id.replace("review_", ""), 10);
                if (!isNaN(ts) && now - ts < 45000) {
                  return true;
                }
              }
              return false;
            });

            // Sync the updated list of custom reviews back to localStorage
            const mergedCustom = [...transientUnsynced, ...fetched];
            localStorage.setItem("alyaqeen_testimonials", JSON.stringify(mergedCustom));

            return [...mergedCustom, ...DEFAULT_TESTIMONIALS];
          });
        }
      } catch (error) {
        console.error("Failed to connect or fetch from Supabase:", error);
      }
    }
    fetchReviews();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Admin Mode state (hidden controls for you to manage submissions easily)
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("alyaqeen_admin_authorized") === "true";
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Seamless Dual Video Crossfader states & refs
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<'v1' | 'v2'>('v1');

  const handleTimeUpdate1 = () => {
    const v1 = videoRef1.current;
    if (activeVideo === 'v1' && v1 && v1.duration) {
      const timeLeft = v1.duration - v1.currentTime;
      if (timeLeft <= 1.5) {
        const v2 = videoRef2.current;
        if (v2) {
          v2.currentTime = 0;
          v2.play().catch(() => {});
          setActiveVideo('v2');
        }
      }
    }
  };

  const handleTimeUpdate2 = () => {
    const v2 = videoRef2.current;
    if (activeVideo === 'v2' && v2 && v2.duration) {
      const timeLeft = v2.duration - v2.currentTime;
      if (timeLeft <= 1.5) {
        const v1 = videoRef1.current;
        if (v1) {
          v1.currentTime = 0;
          v1.play().catch(() => {});
          setActiveVideo('v1');
        }
      }
    }
  };

  useEffect(() => {
    if (videoRef1.current) {
      videoRef1.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (currentPage === "home") {
      const v1 = videoRef1.current;
      const v2 = videoRef2.current;
      if (activeVideo === 'v1' && v1) {
        v1.play().catch(() => {});
      } else if (activeVideo === 'v2' && v2) {
        v2.play().catch(() => {});
      }
    }
  }, [currentPage, activeVideo]);

  // Dynamic SEO Title and Meta Description Handler
  useEffect(() => {
    if (currentPage === "home") {
      document.title = "Online Quran Classes | Tahfeez, Reading & Noorani Qaida";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          "Enroll in premium 1-on-1 Online Quran Classes with Alyaqeen Academy. Professional Quran teachers offering Tahfeez (memorization), Quran Reading fluency, and Noorani Qaida for kids and adults at flexible schedules."
        );
      }
    } else if (currentPage === "reviews") {
      document.title = "Student Testimonials & Reviews | Alyaqeen Academy";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          "Read authentic parent and student reviews about our online Quran classes. Learn about our teaching patience, customized schedules, and successful progress."
        );
      }
    }
  }, [currentPage]);

  // Instantly restore view scroll position to the top upon page transition
  useEffect(() => {
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    
    // Instantly scroll to top
    window.scrollTo(0, 0);
    
    // Reset previous reveal elements so they animate cleanly from the top down
    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => {
      el.classList.remove("is-visible");
    });

    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }, 50);

    return () => clearTimeout(timer);
  }, [currentPage]);



  // Hero Scroll Animation References (Premium SaaS Zoom-out Effect)
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Background and content transitions based on progress
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.45]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const patternOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.1]);

  const triggerAdminPrompt = () => {
    setAdminPasscode("");
    setIsAdminModalOpen(true);
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminPasscode.trim().toLowerCase();
    if (trimmed === "yaqeen2026" || trimmed === "admin26") {
      setIsAdmin(true);
      localStorage.setItem("alyaqeen_admin_authorized", "true");
      showToast("Admin mode activated. You can now delete reviews directly from the website.", "success");
      setIsAdminModalOpen(false);
      setAdminPasscode("");
    } else {
      showToast("Incorrect passcode.", "error");
    }
  };

  const handleAdminNodeClick = () => {
    if (isAdmin) {
      setIsLogoutConfirmOpen(true);
    } else {
      triggerAdminPrompt();
    }
  };

  // Use refs to track multiple clicks reliably on mobile and different devices
  const copyrightClickCountRef = useRef(0);
  const copyrightClickTimeoutRef = useRef<any>(null);

  const handleCopyrightClick = () => {
    copyrightClickCountRef.current += 1;
    if (copyrightClickTimeoutRef.current) {
      clearTimeout(copyrightClickTimeoutRef.current);
    }
    
    // Check if double tapped/clicked within 500ms (raised from 400 for easier double taps)
    if (copyrightClickCountRef.current >= 2) {
      copyrightClickCountRef.current = 0;
      handleAdminNodeClick();
    } else {
      copyrightClickTimeoutRef.current = setTimeout(() => {
        copyrightClickCountRef.current = 0;
      }, 500);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReviewName.trim() || !newReviewQuote.trim()) {
      showToast("Please fill in your name and testimonial review", "error");
      return;
    }

    const newId = "review_" + Date.now();
    // Create mode
    const newReview = {
      id: newId,
      stars: newReviewRating,
      quote: newReviewQuote.trim(),
      name: newReviewName.trim(),
      title: newReviewTitle.trim()
    };

    const updatedReviews = [newReview, ...testimonials];
    setTestimonials(updatedReviews);
    
    // Save only custom user-submitted reviews to local storage (not static defaults)
    const customOnly = updatedReviews.filter(
      (r) => !DEFAULT_TESTIMONIALS.some((d) => d.id === r.id)
    );
    localStorage.setItem("alyaqeen_testimonials", JSON.stringify(customOnly));

    // Submit to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("testimonials")
        .insert([
          {
            id: newId,
            stars: newReviewRating,
            quote: newReviewQuote.trim(),
            name: newReviewName.trim(),
            title: newReviewTitle.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .then(({ error }) => {
          if (error) {
            console.error("Supabase submission error:", error);
            showToast("Saved locally, cloud sync pending.", "error");
          } else {
            showToast("Thank you! Your testimonial has been published online.");
          }
        });
    } else {
      showToast("Thank you! Your testimonial has been saved successfully.");
    }

    // Reset Form
    setNewReviewName("");
    setNewReviewTitle("");
    setNewReviewQuote("");
    setNewReviewRating(5);
    setIsReviewModalOpen(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    // 1. Update the local UI state instantly
    const updatedReviews = testimonials.filter((r) => r.id !== reviewId);
    setTestimonials(updatedReviews);

    // 2. Remove from LocalStorage
    const customOnly = updatedReviews.filter(
      (r) => !DEFAULT_TESTIMONIALS.some((d) => d.id === r.id)
    );
    localStorage.setItem("alyaqeen_testimonials", JSON.stringify(customOnly));

    // 3. Remove from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("testimonials")
          .delete()
          .eq("id", reviewId);

        if (error) {
          console.error("Error deleting review from Supabase:", error);
          showToast("Deleted locally, failed to sync deletion with database.", "error");
        } else {
          showToast("Review deleted permanently.");
        }
      } catch (err) {
        console.error("Failed to make delete request:", err);
        showToast("Deleted locally, failed to sync deletion with database.", "error");
      }
    } else {
      showToast("Review deleted from your browser.");
    }
  };

  // Intercept scroll state on window
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      document.documentElement.classList.toggle("scrolled-page", isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load to verify starting offset
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // IntersectionObserver for custom fade scroll animations
  useEffect(() => {
    let observerInstance: IntersectionObserver | null = null;
    let pendingReveals: HTMLElement[] = [];
    let revealTimeout: NodeJS.Timeout | null = null;

    const setupObserver = () => {
      const revealElements = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window) || revealElements.length === 0) {
        revealElements.forEach(el => el.classList.add("is-visible"));
        return;
      }

      observerInstance = new IntersectionObserver(
        (entries) => {
          const newlyIntersecting = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLElement);

          if (newlyIntersecting.length > 0) {
            newlyIntersecting.forEach((el) => {
              observerInstance?.unobserve(el);
            });

            // Queue and sort all pending elements by their absolute position on the page (top to bottom, left to right)
            pendingReveals = [...pendingReveals, ...newlyIntersecting];
            pendingReveals.sort((a, b) => {
              const rectA = a.getBoundingClientRect();
              const rectB = b.getBoundingClientRect();
              const aTop = rectA.top + window.scrollY;
              const bTop = rectB.top + window.scrollY;
              if (Math.abs(aTop - bTop) < 20) {
                return rectA.left - rectB.left;
              }
              return aTop - bTop;
            });

            const processQueue = () => {
              if (pendingReveals.length === 0) {
                revealTimeout = null;
                return;
              }
              const nextEl = pendingReveals.shift();
              if (nextEl) {
                nextEl.classList.add("is-visible");
              }
              if (pendingReveals.length > 0) {
                revealTimeout = setTimeout(processQueue, 70); // Beautiful fast staggered cascade delay
              } else {
                revealTimeout = null;
              }
            };

            if (!revealTimeout) {
              processQueue();
            }
          }
        },
        { threshold: 0.05, rootMargin: "0px 0px -15px 0px" }
      );

      revealElements.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        observerInstance?.observe(el);
      });
    };

    // Small delay ensures child react states are flushed and DOM is stable
    const timer = setTimeout(setupObserver, 150);

    return () => {
      clearTimeout(timer);
      if (revealTimeout) {
        clearTimeout(revealTimeout);
      }
      if (observerInstance) {
        observerInstance.disconnect();
      }
    };
  }, [currentPage, testimonials]);

  // Clean compact menu on outer click
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".compact-toggle") && !target.closest(".compact-menu")) {
        setCompactMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  // Smooth Navigation custom logic
  const handleHashNavigation = (hashId: string) => {
    setMobileMenuOpen(false);
    setCompactMenuOpen(false);
    setCurrentPage("home");

    // Allow states to render home nodes before scrolling
    setTimeout(() => {
      const targetElement = document.getElementById(hashId);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = hashId === "home" ? 0 : elementPosition;

        // Instantly make the target section's reveal elements visible so there is zero delay in their animation
        const sectionReveals = targetElement.querySelectorAll(".reveal");
        sectionReveals.forEach((el) => {
          el.classList.add("is-visible");
        });

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };


  return (
    <div className="min-h-screen bg-[#F9FBF9] text-[#27272A] font-sans selection:bg-[#D4AF37] selection:text-white">
      
      {/* 1. Header & Navigation Stage */}
      <header className={`header ${scrolled ? "scrolled" : "at-top"} ${currentPage === "home" ? "on-home" : ""} ${mobileMenuOpen ? "mobile-menu-opened" : ""}`}>
        <nav className="nav nav-container">
          {/* Left Block: Academy Name on desktop, beautiful Logo on mobile/vertical tablet */}
          <motion.a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleHashNavigation("home"); }} 
            className="brand-logo-left font-sans"
            id="academy-logo-header-text"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="brand-text-desktop">Alyaqeen <span className="brand-word-secondary">Academy</span></span>
            <img 
              src={logo1} 
              alt="Alyaqeen Academy logo" 
              className="brand-logo-mobile"
              referrerPolicy="no-referrer"
            />
          </motion.a>

          {/* Right Actions Container: Groups Enroll button and mobile Hamburger toggle together */}
          <div className="nav-actions-right">
            <motion.div 
              className="nav-enroll-desktop"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); handleHashNavigation("contact"); }}
                className="btn btn-primary"
                style={{ padding: "0.5rem 1.25rem", color: "#ffffff", display: "inline-flex" }}
              >
                Enroll
              </a>
            </motion.div>

            {/* Toggle Menu Button for mobile views */}
            <motion.button 
              className={`nav-toggle ${mobileMenuOpen ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              id="nav-menu-hamburger"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            >
              <span></span>
              <span></span>
              <span></span>
            </motion.button>
          </div>

          {/* Inline Navigation Links (Desktop center aligned, logo nested inside) */}
          <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""} ${currentPage === "reviews" ? "on-testimonials" : ""}`} id="primary-nav-menu">
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleHashNavigation("home"); setMobileMenuOpen(false); }}
                className={currentPage === "home" ? "nav-link" : ""}
              >
                Home
              </a>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              <a 
                href="#courses" 
                onClick={(e) => { e.preventDefault(); handleHashNavigation("courses"); setMobileMenuOpen(false); }}
              >
                Courses
              </a>
            </motion.li>

            {/* Desktop Center logo nestled between Courses and How It Works (Fully Non-Clickable) */}
            <motion.li 
              className="nav-logo-center-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            >
              <div className="nav-logo-center-wrapper">
                <img 
                  src={logo1} 
                  alt="Alyaqeen Academy logo" 
                  className="logo-center-img"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              <a 
                href="#how-it-works" 
                onClick={(e) => { e.preventDefault(); handleHashNavigation("how-it-works"); setMobileMenuOpen(false); }}
              >
                How It Works
              </a>
            </motion.li>
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage("reviews"); setMobileMenuOpen(false); }}
                aria-current={currentPage === "reviews" ? "page" : undefined}
              >
                Testimonials
              </a>
            </motion.li>

            {/* Seamless Mobile view-specific Enroll Link in dropdown drawer menu (Removed on Testimonials reviews page) */}
            {currentPage !== "reviews" && (
              <motion.li 
                className="nav-enroll-mobile-item w-full"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              >
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); handleHashNavigation("contact"); setMobileMenuOpen(false); }}
                  className="btn btn-primary w-full text-center"
                  style={{ padding: "0.6rem 1.25rem", color: "#ffffff", display: "block" }}
                >
                  Enroll
                </a>
              </motion.li>
            )}
          </ul>
        </nav>
      </header>

      {/* 2. Compact Side Scroll Navigation (triggered automatically when scrolled) */}
      <button 
        className="compact-toggle" 
        onClick={() => {
          if (compactMenuOpen || compactMenuHovered) {
            setCompactMenuOpen(false);
            setCompactMenuHovered(false);
          } else {
            setCompactMenuOpen(true);
          }
        }}
        onMouseEnter={handleCompactMouseEnter}
        onMouseLeave={handleCompactMouseLeave}
        aria-label="Open persistent navigation menu" 
        aria-expanded={compactMenuOpen || compactMenuHovered}
        id="persistent-compact-toggle"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Compact Dropdown Menu Overlay */}
      <ul 
        className={`compact-menu ${(compactMenuOpen || compactMenuHovered) ? "compact-open" : ""}`} 
        id="persistent-compact-menu"
        onMouseEnter={handleCompactMouseEnter}
        onMouseLeave={handleCompactMouseLeave}
      >
        <li>
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleHashNavigation("home"); 
              setCompactMenuOpen(false); 
              setCompactMenuHovered(false); 
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a 
            href="#courses" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleHashNavigation("courses"); 
              setCompactMenuOpen(false); 
              setCompactMenuHovered(false); 
            }}
          >
            Courses
          </a>
        </li>
         <li>
          <a 
            href="#how-it-works" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleHashNavigation("how-it-works"); 
              setCompactMenuOpen(false); 
              setCompactMenuHovered(false); 
            }}
          >
            How It Works
          </a>
        </li>
        <li>
          <a 
            href="#" 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentPage("reviews"); 
              setCompactMenuOpen(false); 
              setCompactMenuHovered(false); 
            }}
          >
            Testimonials
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            onClick={(e) => { 
              e.preventDefault(); 
              handleHashNavigation("contact"); 
              setCompactMenuOpen(false); 
              setCompactMenuHovered(false); 
            }}
            className="text-[#064E3B] font-bold"
          >
            Enroll Now
          </a>
        </li>
      </ul>


      {/* 3. Main Stage Page Switcher */}
      {currentPage === "home" ? (
        <main className="homepage">
          
          {/* HERO SECTION */}
          <section id="home" className="hero" ref={heroRef}>
            <motion.div 
              className="hero-bg overflow-hidden"
              style={{
                scale: bgScale,
                opacity: bgOpacity
              }}
            >
              {/* Dual background videos for perfect zero-hiccup crossfade looping */}
              <video
                ref={videoRef1}
                onTimeUpdate={handleTimeUpdate1}
                muted
                playsInline
                preload="auto"
                className="hero-video-loop-smooth absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  pointerEvents: "none",
                  opacity: activeVideo === 'v1' ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                  transform: "translate3d(0, 0, 0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              >
                <source src={heroBg} type="video/mp4" />
              </video>
              <video
                ref={videoRef2}
                onTimeUpdate={handleTimeUpdate2}
                muted
                playsInline
                preload="auto"
                className="hero-video-loop-smooth absolute inset-0 w-full h-full object-cover z-0"
                style={{
                  pointerEvents: "none",
                  opacity: activeVideo === 'v2' ? 1 : 0,
                  transition: "opacity 1.2s ease-in-out",
                  transform: "translate3d(0, 0, 0)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              >
                <source src={heroBg} type="video/mp4" />
              </video>
              {/* Deep green luxurious gradient overlay to blend the video seamlessly with our theme */}
              <div 
                className="absolute inset-0 z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(2, 44, 34, 0.82) 0%, rgba(4, 47, 31, 0.86) 50%, rgba(13, 74, 63, 0.92) 100%)"
                }}
              />
            </motion.div>
            <motion.div 
              className="container hero-content"
              style={{
                y: contentY,
                opacity: contentOpacity,
                scale: contentScale
              }}
            >
              <motion.p 
                className="hero-bismillah" 
                lang="ar"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </motion.p>
              
              <motion.blockquote 
                className="hero-ayah-wrap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              >
                <p className="hero-ayah" lang="ar">وَرَتِّلِ ٱلْقُرْءَانَ تَرْتِيلًا</p>
                <footer className="hero-ayah-meta">
                  <span className="hero-ayah-translation">and recite the Quran with measured recitation.</span>
                  <cite className="hero-ayah-cite">Surah Al-Muzzammil, 73:4</cite>
                </footer>
              </motion.blockquote>

              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              >
                <span className="hero-title-main">Learn the Holy Quran</span><br /><span className="hero-subtitle">From the Comfort of Your Home</span>
              </motion.h1>
              
              <motion.p 
                className="hero-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              >
                Join our online Quran school with qualified teachers. Whether you're a beginner or seeking to memorize, we have the right path for you.
              </motion.p>
              
              <motion.a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); handleHashNavigation("contact"); }} 
                className="btn btn-primary"
                id="hero-enroll-cta"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              >
                Start Learning Today
              </motion.a>
            </motion.div>
            <motion.div 
              className="hero-pattern"
              style={{
                scale: bgScale,
                opacity: patternOpacity
              }}
            ></motion.div>
          </section>

          {/* CLASSES/COURSES SECTION */}
          <section id="courses" className="courses">
            <div className="container">
              <h2 className="section-title reveal delay-1">Our Classes</h2>
              <p className="section-subtitle reveal delay-2">Choose the path that suits your journey</p>
              
              <div 
                className="courses-grid"
              >
                {COURSES_DATA.map((course, idx) => {
                  const IconComponent = course.icon;
                  let variantName = "idle";
                  if (hoveredCourseIndex !== null) {
                    variantName = hoveredCourseIndex === idx ? "hovered" : "dimmed";
                  }

                  return (
                    <motion.article
                      key={course.id}
                      className={`course-card ${course.featured ? "featured" : ""} reveal ${course.delay} overflow-hidden`}
                      id={`course-card-${course.id}`}
                      onMouseEnter={() => setHoveredCourseIndex(idx)}
                      variants={{
                        idle: {
                          scale: 1,
                          y: 0,
                          opacity: 1,
                          filter: "blur(0px) brightness(1) saturate(1) contrast(1)",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                          borderColor: "var(--color-border)",
                        },
                        hovered: {
                          scale: 1.04,
                          y: -10,
                          opacity: 1,
                          filter: "blur(0px) brightness(1.04) contrast(1.02) saturate(1.04)",
                          boxShadow: "0 22px 40px -8px rgba(6, 78, 59, 0.12), 0 12px 20px -8px rgba(6, 78, 59, 0.08), 0 0 0 1px rgba(6, 78, 59, 0.1)",
                          borderColor: "var(--color-primary-light)",
                        },
                        dimmed: {
                          scale: 0.95,
                          y: 2,
                          opacity: 0.42,
                          filter: "blur(2.2px) saturate(0.8) brightness(0.92) contrast(0.98)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                          borderColor: "rgba(230, 228, 223, 0.25)",
                        }
                      }}
                      animate={variantName}
                      transition={{
                        type: "spring",
                        stiffness: 110,
                        damping: 20,
                        mass: 1.0
                      }}
                      style={{
                        willChange: "transform, filter, opacity",
                        transformOrigin: "center center",
                        position: "relative"
                      }}
                    >
                      {/* Magnetic premium highlight glide underlay */}
                      {hoveredCourseIndex === idx && (
                        <motion.div
                          layoutId="activeCardPremiumGlow"
                          className="absolute inset-0 rounded-[inherit] pointer-events-none"
                          style={{
                            background: "radial-gradient(110% 110% at 50% 0%, rgba(6, 78, 59, 0.04) 0%, rgba(6, 78, 59, 0) 70%)",
                            boxShadow: "inset 0 0 15px rgba(6, 78, 59, 0.03)",
                            border: "1px solid rgba(6, 78, 59, 0.15)",
                            zIndex: 1
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 110,
                            damping: 20,
                            mass: 1.0
                          }}
                        />
                      )}

                      <div className={`course-icon ${course.id === "reading" ? "text-[#064E3B]" : ""} relative z-10`}>
                        <IconComponent />
                      </div>
                      <h3 className="relative z-10">{course.title}</h3>
                      <p className="course-arabic relative z-10" lang="ar">{course.arabic}</p>
                      <p className="course-desc relative z-10">{course.desc}</p>
                      <ul className="course-features relative z-10">
                        {course.features.map((feature, fIdx) => (
                          <li key={fIdx}>{feature}</li>
                        ))}
                      </ul>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section id="how-it-works" className="how-it-works">
            <div className="container">
              <h2 className="section-title reveal delay-1 text-center">How It Works</h2>
              <p className="section-subtitle reveal delay-2 text-center mb-12">
                A simple, personalized, and flexible process designed around your life
              </p>
              
              <div className="flex flex-col gap-5 max-w-4xl mx-auto">
                {[
                  {
                    idx: 0,
                    num: "01",
                    title: "Choose Your Course",
                    tagline: "Understand your starting point and select your study focus",
                    desc: "Select from Tahfeez (memorization), Reading with fluency, or Noorani Qaida (for beginners). We schedule a 1-on-1 trial class with our qualified teacher to evaluate your current reciting level, listen to your reading speed, and tailor a custom curriculum to your personal pace.",
                    bullets: [
                      "All skill levels catered (Beginner to Advanced)",
                      "Custom reciting speed and tailored learning plan",
                      "Free trial session with zero pricing commitments"
                    ]
                  },
                  {
                    idx: 1,
                    num: "02",
                    title: "Schedule a Session",
                    tagline: "Integrate high-frequency, brief classes into your daily schedule",
                    desc: "Consistency is key to modern language and Quran learning. We recommend and support highly effective 15-to-20 minute sessions, repeated 5 days a week. Select the specific timeslots that fit around your children's classes, school schedule, or professional routine.",
                    bullets: [
                      "Focused 15-20 min lessons optimal for retention",
                      "Flexible timezone adjustments to fit your routine",
                      "Easy makeup lessons and scheduling corrections"
                    ]
                  },
                  {
                    idx: 2,
                    num: "03",
                    title: "Learn Online One-on-One",
                    tagline: "Experience personalized, highly focused live lessons from home",
                    desc: "Log on to MS Teams or connect instantly on WhatsApp Video to join your live, distraction-free one-on-one lesson. Our qualified teachers approach learners with supreme patience, kindness, and meticulous care, ensuring proper Tajweed and pronunciation.",
                    bullets: [
                      "Live interactive screen sharing and guidance",
                      "Patience-and-kindness-led teaching methodology",
                      "Remote-first: access your classes from anywhere"
                    ]
                  }
                ].map((step) => {
                  const isOpen = activeStepIndex === step.idx;
                  
                  return (
                    <motion.div
                      key={step.idx}
                      className={`group relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden cursor-pointer reveal delay-${step.idx + 1}`}
                      onClick={() => setActiveStepIndex(isOpen ? null : step.idx)}
                      whileHover={{ 
                        scale: 1.015,
                        borderColor: "rgba(26, 127, 107, 0.45)",
                        boxShadow: "0 12px 30px -10px rgba(26, 127, 107, 0.12)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      id={`how-it-works-step-${step.num}`}
                      style={{
                        willChange: "transform, border-color, box-shadow"
                      }}
                    >
                      {/* Active green indicator line on the left */}
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--color-primary)] rounded-l-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.2 }}
                      />

                      {/* Header bar of each drawer */}
                      <div className="flex items-center justify-between py-6 pr-6 pl-6 sm:py-8 sm:pr-8 sm:pl-0 select-none">
                        <div className="flex items-center sm:gap-5 flex-1">
                          {/* Centered number container */}
                          <div className="flex items-center justify-center w-12 sm:w-24 shrink-0">
                            <span className="font-sans font-bold text-3xl sm:text-4xl text-[var(--color-primary)] opacity-85">
                              {step.num}
                            </span>
                          </div>
                          
                          {/* Inner divider (visible on all screens to maintain beautiful symmetry) */}
                          <div className="w-[1px] h-8 bg-[var(--color-border)] shrink-0" />
                          
                          <div className="flex flex-col pl-4 sm:pl-10">
                            <h4 className="font-sans font-bold text-lg sm:text-xl text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors duration-200">
                              {step.title}
                            </h4>
                            <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
                              {step.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Expand indicator icon */}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-bg-alt)] text-[var(--color-primary)] ml-4 shrink-0">
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </motion.svg>
                        </div>
                      </div>

                      {/* Expandable Body */}
                      <motion.div
                        initial={false}
                        animate={{ 
                           height: isOpen ? "auto" : 0, 
                           opacity: isOpen ? 1 : 0 
                        }}
                        transition={{ 
                           height: { type: "spring", stiffness: 150, damping: 20 },
                           opacity: { duration: 0.2 }
                        }}
                        className="overflow-hidden"
                      >
                        {/* Inner content wrapper using perfectly mirrored layout structure for exact horizontal alignment */}
                        <div className="border-t border-[var(--color-border)] bg-[rgba(240,237,232,0.15)] py-6 pr-6 pl-6 sm:py-8 sm:pr-8 sm:pl-0">
                          <div className="flex sm:gap-5">
                            {/* Number spacing matching header number container exactly */}
                            <div className="w-12 sm:w-24 shrink-0" />
                            
                            {/* Divider spacing matching header divider exactly */}
                            <div className="w-[1px] shrink-0" />
                            
                            {/* Content container matching header title container exactly */}
                            <div className="flex-1 pl-4 sm:pl-10 min-w-0">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
                                {/* Main narrative block */}
                                <div className="md:col-span-7">
                                  <p className="font-sans text-sm sm:text-base leading-relaxed text-[var(--color-text-muted)] break-words">
                                    {step.desc}
                                  </p>
                                </div>

                                {/* Bullet checklist points */}
                                <div className="md:col-span-5 flex flex-col gap-3 justify-center">
                                  {step.bullets.map((bullet, bIdx) => (
                                    <div key={bIdx} className="flex gap-3 items-baseline">
                                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(26,127,107,0.1)] text-[var(--color-primary)] shrink-0 text-xs font-semibold">
                                        ✓
                                      </span>
                                      <span className="font-sans text-xs sm:text-sm text-[var(--color-text)] break-words">
                                        {bullet}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ADVANTAGE FEATURES SECTION */}
          <section className="features">
            <div className="container">
              <div className="features-grid">
                
                <div className="feature reveal delay-1">
                  <div className="feature-icon font-bold text-4xl text-[#064E3B]">👥</div>
                  <h4 className="font-bold">One-on-one sessions</h4>
                  <p>Personalized video classes via MS Teams or WhatsApp for focused learning.</p>
                </div>

                <div className="feature reveal delay-2">
                  <div className="feature-icon font-semibold text-4xl text-[#064E3B]">👨‍🏫</div>
                  <h4 className="font-bold">Qualified Teachers</h4>
                  <p>Experienced instructors with proper Islamic education.</p>
                </div>

                <div className="feature reveal delay-3">
                  <div className="feature-icon font-semibold text-4xl text-[#064E3B]">⏰</div>
                  <h4 className="font-bold">Flexible Schedule</h4>
                  <p>Choose class times that fit your routine.</p>
                </div>

                <div className="feature reveal delay-4">
                  <div className="feature-icon font-semibold text-4xl text-[#064E3B]">🎁</div>
                  <h4 className="font-bold">Free Trial Class</h4>
                  <p>Try a session at no cost before you commit.</p>
                </div>

              </div>
            </div>
          </section>

          {/* FEATURED REVIEWS SECTION */}
          <section id="featured-reviews" className="reviews border-t border-[var(--color-border)] overflow-hidden">
            <div className="container">
              <h2 className="section-title text-center reveal delay-1">Loved by Parents & Students</h2>
              <p className="section-subtitle text-center reveal delay-2">Hear what parents say about studying with us</p>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="flex justify-center items-center mt-4 mb-20 sm:mb-24 md:mb-28 relative z-30"
              >
                <button
                  onClick={openWriteModal}
                  className="-translate-y-1 inline-flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base text-white bg-[#064E3B] hover:bg-[#022c22] active:scale-95 transition-all duration-300 cursor-pointer h-12 sm:h-14 px-8 sm:px-10 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1.5 tracking-wide leading-none"
                >
                  <span className="leading-none">Write a Review</span>
                  <MessageSquare className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>
              </motion.div>

              <div className="reveal delay-3 mt-4">
                <InfiniteMovingCardsDemo />
              </div>
            </div>
          </section>

          {/* ENROLL / CONTACT CLASS SECTION */}
          <section id="contact" className="contact">
            <div className="container">
              <h2 className="section-title reveal delay-1">Enroll Now</h2>
              <p className="section-subtitle reveal delay-2">Begin your Quran journey today</p>

              <EnrollForm className="reveal delay-2" />
            </div>
          </section>

        </main>
      ) : (
        
        /* TESTIMONIAL REVIEWS PAGE */
        <main className="reviews-page">
          <section className="reviews-hero">
            <div className="container reviews-hero-content flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2">
              <div>
                <h1 className="section-title">Our Testimonials</h1>
                <p className="section-subtitle reviews-hero-sub flex flex-wrap items-center gap-2">
                  <span>What parents say about learning with us</span>
                  {isAdmin && (
                    <button
                      onClick={() => setIsLogoutConfirmOpen(true)}
                      className="inline-flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full font-semibold transition-all duration-200 cursor-pointer"
                      title="Click to turn off Moderator tools"
                    >
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      Moderator Mode Active
                    </button>
                  )}
                </p>
              </div>
              <button
                onClick={openWriteModal}
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-white bg-[#064E3B] hover:bg-[#022c22] active:scale-95 transition-all duration-300 cursor-pointer h-11 px-6 rounded-full shadow-md shrink-0 self-start md:self-center leading-none"
              >
                <span className="leading-none">Write a Review</span>
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section className="reviews-list">
            <div className="container">
              <div className="reviews-grid">
                {testimonials.map((review: any, idx: number) => {
                  const delayClass = `delay-${(idx % 4) + 1}`;
                  const isDefault = DEFAULT_TESTIMONIALS.some((d) => d.id === review.id);
                  return (
                    <article 
                      key={review.id || idx} 
                      className={`review-card flex flex-col justify-between reveal ${delayClass}`} 
                      id={`review-card-${review.id || idx}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <p className="review-stars" aria-hidden="true">
                            {"★".repeat(review.stars || 5)}{"☆".repeat(5 - (review.stars || 5))}
                          </p>
                          {isAdmin && !isDefault && (
                            <button
                              onClick={() => setReviewIdToDelete(review.id)}
                              className="inline-flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 bg-red-50 p-1.5 rounded-lg active:scale-95 transition-all duration-200 cursor-pointer shadow-xs border border-red-100 z-10"
                              title="Delete this custom review permanently (Admin Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <blockquote className="review-quote" style={{ whiteSpace: "pre-line" }}>
                          “{review.quote}”
                        </blockquote>
                      </div>
                      <p className="review-author mt-4">
                        — {review.name}
                        {review.title && <span className="text-xs opacity-75 font-normal block mt-1">({review.title})</span>}
                      </p>
                    </article>
                  );
                })}
              </div>

              <p className="reviews-note reveal delay-2">We are grateful to every family who took the time to share their experience. Your trust motivates us to keep teaching with patience and care.</p>
              
              <p className="reviews-cta reveal delay-3">
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); handleHashNavigation("contact"); }} 
                  className="btn btn-primary"
                  id="reviews-enroll-cta"
                >
                  Enroll today
                </a>
              </p>
            </div>
          </section>
        </main>
      )}

      {/* 4. Footer */}
      <footer className="footer" id="academy-footer">
        <div className="container">
          <div className="footer-content">
            
            <div className="footer-brand">
              <img 
                src={logo1} 
                alt="Alyaqeen Academy footer logo" 
                className="logo-img logo-img-footer"
                referrerPolicy="no-referrer"
              />
              <span className="logo-text">Alyaqeen Academy</span>
            </div>

            <p className="footer-tagline">Guiding hearts through the light of the Holy Quran</p>

            <address className="footer-contact">
              <ul className="footer-contact-list">
                
                <li>
                  <a href="mailto:alyaqeenacad@gmail.com" className="footer-contact-link" id="footer-contact-email">
                    <span className="footer-contact-icon" aria-hidden="true">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="footer-contact-text">
                      <span className="footer-contact-label">Email</span>
                      <span className="footer-contact-value">alyaqeenacad@gmail.com</span>
                    </span>
                  </a>
                </li>

                <li>
                  <a href="tel:+18323966634" className="footer-contact-link" id="footer-contact-phone">
                    <span className="footer-contact-icon" aria-hidden="true">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span className="footer-contact-text">
                      <span className="footer-contact-label">Phone</span>
                      <span className="footer-contact-value">+1 (832) 396-6634</span>
                    </span>
                  </a>
                </li>

                <li>
                  <a 
                    href="https://wa.me/18323966634" 
                    className="footer-contact-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    id="footer-contact-whatsapp"
                  >
                    <span className="footer-contact-icon text-[#25D366]" aria-hidden="true">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <span className="footer-contact-text">
                      <span className="footer-contact-label">WhatsApp</span>
                      <span className="footer-contact-value">+1 (832) 396-6634</span>
                    </span>
                  </a>
                </li>

              </ul>
            </address>

            <FooterSocials />

            <div className="flex flex-col items-center gap-2 mt-4 selection:bg-transparent">
              <p 
                className="footer-copy cursor-pointer select-none" 
                onClick={handleCopyrightClick}
                title="Click twice to manage moderator tools"
              >
                &copy; {new Date().getFullYear()} Alyaqeen Academy. All rights reserved.
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[11px] text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-full font-semibold transition-all duration-200 cursor-pointer shadow-xs"
                  title="Click to turn off Moderator tools"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  Moderator Mode Active (Click to Logout)
                </button>
              )}
              <div 
                className="flex justify-center items-center gap-2.5 opacity-25 hover:opacity-100 transition-opacity duration-300 py-1"
                title="Admin Access Nodes"
              >
                <span 
                  onClick={handleAdminNodeClick}
                  className="w-1.5 h-1.5 rounded-full bg-[#1e293b]/60 dark:bg-white/60 hover:bg-[#064E3B] hover:scale-150 transition-all duration-200 cursor-pointer"
                />
                <span 
                  onClick={handleAdminNodeClick}
                  className="w-1.5 h-1.5 rounded-full bg-[#1e293b]/60 dark:bg-white/60 hover:bg-[#064E3B] hover:scale-150 transition-all duration-200 cursor-pointer"
                />
                <span 
                  onClick={handleAdminNodeClick}
                  className="w-1.5 h-1.5 rounded-full bg-[#1e293b]/60 dark:bg-white/60 hover:bg-[#064E3B] hover:scale-150 transition-all duration-200 cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* 5. Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="review-modal-root">
          {/* Backdrop with elegant blur */}
          <div 
            className="fixed inset-0 bg-[#064E3B]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsReviewModalOpen(false)}
          />
          
          {/* Modal Content Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white rounded-3xl shadow-2xl border border-[#E4EBE5] w-full max-w-xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-[#064E3B] text-white p-6 sm:p-8">
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold font-sans tracking-tight !text-white">
                Share Your Experience
              </h3>
              <p className="text-white/85 text-xs sm:text-sm mt-1">
                Your feedback helps families find premium Quran education.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 sm:p-8 flex flex-col gap-5 bg-[#FBFDFB]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 mb-1.5" htmlFor="reviewer-name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="reviewer-name"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder="e.g. Abdullah Ahmed or Jawad's Parent"
                  className="w-full bg-white border border-[#D5E1D8] rounded-xl px-4 py-2.5 font-sans text-sm text-[#27272A] focus:outline-none focus:border-[#064E3B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 mb-1.5" htmlFor="reviewer-title">
                  Who are you? (Relationship) - Optional
                </label>
                <input
                  type="text"
                  id="reviewer-title"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Quran Student, or Parent"
                  className="w-full bg-white border border-[#D5E1D8] rounded-xl px-4 py-2.5 font-sans text-sm text-[#27272A] focus:outline-none focus:border-[#064E3B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 mb-1.5">
                  Rating
                </label>
                <div className="flex gap-1.5 items-center">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setNewReviewRating(starValue)}
                      onMouseEnter={() => setHoverReviewRating(starValue)}
                      onMouseLeave={() => setHoverReviewRating(0)}
                      className="p-1 focus:outline-none transition-transform active:scale-95 cursor-pointer text-2xl"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors duration-150 ${
                          starValue <= (hoverReviewRating || newReviewRating)
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-[#D5E1D8]"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B]/80 mb-1.5" htmlFor="reviewer-quote">
                  Your Review / Message
                </label>
                <textarea
                  id="reviewer-quote"
                  required
                  rows={4}
                  value={newReviewQuote}
                  onChange={(e) => setNewReviewQuote(e.target.value)}
                  placeholder="Write your beautiful experience here..."
                  className="w-full bg-white border border-[#D5E1D8] rounded-xl px-4 py-2.5 font-sans text-sm text-[#27272A] focus:outline-none focus:border-[#064E3B] transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="inline-flex items-center justify-center h-11 px-5 rounded-xl font-bold text-sm text-[#064E3B] hover:bg-[#E4EBE5] transition-colors duration-200 active:scale-95 cursor-pointer leading-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-11 px-6 bg-[#064E3B] hover:bg-[#022c22] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer leading-none"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 6. Secure Admin Passcode Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="admin-passcode-modal">
          {/* Backdrop with elegant blur */}
          <div 
            className="fixed inset-0 bg-[#064E3B]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAdminModalOpen(false)}
          />
          
          {/* Modal Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white rounded-3xl shadow-2xl border border-[#E4EBE5] w-full max-w-sm overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-[#064E3B] text-white p-6 relative">
              <button 
                onClick={() => setIsAdminModalOpen(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold font-sans tracking-tight !text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Alyaqeen Academy Admin
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Enter your administrative passcode to toggle moderation tools.
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleAdminVerify} className="p-6 flex flex-col gap-4 bg-[#FBFDFB]">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#064E3B]/85 mb-1.5" htmlFor="admin-pass">
                  Passcode
                </label>
                <input
                  type="password"
                  id="admin-pass"
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-white border border-[#D5E1D8] rounded-xl px-4 py-2.5 font-sans text-sm text-[#27272A] focus:outline-none focus:border-[#064E3B] transition-colors focus:ring-2 focus:ring-[#064E3B]/10"
                />
              </div>

              <div className="flex justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(false)}
                  className="inline-flex items-center justify-center h-10 px-4 rounded-xl font-bold text-xs text-[#064E3B] hover:bg-[#E4EBE5] transition-colors duration-200 active:scale-95 cursor-pointer leading-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-10 px-5 bg-[#064E3B] hover:bg-[#022c22] text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer leading-none"
                >
                  Verify
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 7. Custom React Delete Confirmation Modal */}
      {reviewIdToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="delete-confirm-modal">
          <div 
            className="fixed inset-0 bg-[#064E3B]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setReviewIdToDelete(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white rounded-3xl shadow-2xl border border-red-100 w-full max-w-sm overflow-hidden z-10"
          >
            <div className="bg-red-700 text-white p-6 relative">
              <button 
                onClick={() => setReviewIdToDelete(null)}
                className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold font-sans tracking-tight !text-white flex items-center gap-2">
                Delete Testimonial?
              </h3>
              <p className="text-white/80 text-xs mt-1">
                This action is irreversible and will permanently delete this review from both the website and the cloud database.
              </p>
            </div>
            <div className="p-6 bg-[#FDFBFB] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewIdToDelete(null)}
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl font-bold text-xs text-zinc-600 hover:bg-zinc-100 transition-colors duration-200 active:scale-95 cursor-pointer leading-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (reviewIdToDelete) {
                    handleDeleteReview(reviewIdToDelete);
                    setReviewIdToDelete(null);
                  }
                }}
                className="inline-flex items-center justify-center h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer leading-none"
              >
                Delete permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 8. Custom React Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="logout-confirm-modal">
          <div 
            className="fixed inset-0 bg-[#064E3B]/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsLogoutConfirmOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative bg-white rounded-3xl shadow-2xl border border-[#E4EBE5] w-full max-w-sm overflow-hidden z-10"
          >
            <div className="bg-[#064E3B] text-white p-6 relative">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold font-sans tracking-tight !text-white flex items-center gap-2">
                Exit Moderator Mode?
              </h3>
              <p className="text-white/80 text-xs mt-1">
                Would you like to turn off moderation tools and logout of Alyaqeen Academy Admin?
              </p>
            </div>
            <div className="p-6 bg-[#FBFDFB] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl font-bold text-xs text-zinc-600 hover:bg-zinc-100 transition-colors duration-200 active:scale-95 cursor-pointer leading-none"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdmin(false);
                  localStorage.removeItem("alyaqeen_admin_authorized");
                  showToast("Admin mode deactivated.", "success");
                  setIsLogoutConfirmOpen(false);
                }}
                className="inline-flex items-center justify-center h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all duration-200 active:scale-95 cursor-pointer leading-none"
              >
                Turn Off Admin
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dynamic Toast Success overlay */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-[#E9F3EC]/25 max-w-sm" id="dynamic-toast-popup">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold grow-0 text-white">✓</div>
          <p className="font-sans text-sm font-medium pr-1 text-white">{toast.message}</p>
        </div>
      )}

    </div>
  );
}
