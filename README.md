# Alyaqeen Academy - Official Website

Modern, responsive web application for **Alyaqeen Academy**, built with **React**, **Vite**, and **Tailwind CSS**.

The platform provides a high-performance single-page experience for exploring online Quran education programs including **Tahfeez**, **Quran Reading**, and **Noorani Qaida**, alongside testimonials and enrollment functionality.

Enrollment submissions are securely managed through an integrated **Formspree** workflow.

---

# ✨ Features

## 🎨 Design & Visual Identity

The interface is designed around a calm, premium Islamic-inspired aesthetic:

* **Typography**

  * **Amiri** for elegant Arabic and display typography
  * **Outfit** for modern, highly readable UI text

* **Color Palette**

  * Emerald Green — `#1a7f6b`
  * Deep Green — `#0f5c4d`
  * Premium Gold — `#d4a853`
  * Warm Neutral Background — `#faf9f6`

* **Animations**

  * Smooth scroll-reveal transitions
  * Dynamic fade and stagger animations
  * Responsive interactive hover states

---

# ⚡ Pages & Interactive Components

## 🏠 Home View

### Hero Section

* Elegant Bismillah introduction
* Featured Quranic ayah from *Surah Al-Muzzammil (73:4)*
* Primary enrollment CTA

### Interactive Course Grid

Includes three structured learning programs:

* **Tahfeez Program** — Quran memorization
* **Reading Program** — Fluency & Tajweed
* **Noorani Qaida** — Beginner Arabic foundations

### Enrollment Workflow Timeline

A simplified 3-step onboarding experience for new students.

### Dynamic Enrollment Form

* Secure **Formspree** integration
* Real-time asynchronous submission handling
* International phone input formatting
* Country-specific validation support
* Live submit-state feedback:

  * `Sending...`
  * `Submitted Successfully ✔`

---

## 💬 Testimonials View

* Verified parent and student feedback
* Structured review layouts with star ratings
* Smooth scroll-reset behavior on navigation
* Re-triggered reveal animations for clean transitions
* Dedicated CTA routing users back to enrollment

---

## 🧭 Navigation Experience

### Desktop Navigation

* Persistent navigation bar
* Auto-hide behavior during scrolling for improved focus

### Responsive Mobile & Tablet Menus

* Route-aware theme styling
* Emerald glass overlay on home view
* Warm neutral styling on testimonials pages

### Floating Scroll Menu

* Compact floating menu appearing dynamically on scroll
* Quick access to important sections and anchors

---

# 🛠️ Tech Stack

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Formspree**

---

# 📂 Project Structure

| Path              | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `/src/App.tsx`    | Main application logic, routes, navigation, and enrollment form        |
| `/src/index.css`  | Tailwind configuration, font imports, custom utilities, and animations |
| `/src/main.tsx`   | React application entry point                                          |
| `/src/assets/`    | Static assets including logos and media                                |
| `/index.html`     | Base HTML configuration and font preloads                              |
| `/vite.config.ts` | Vite configuration and aliases                                         |
| `/package.json`   | Project dependencies and scripts                                       |

---

# 🚀 Installation & Development

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Runs locally on:

```bash
0.0.0.0:3000
```

---

# 📦 Production Build

## Build Optimized Production Files

```bash
npm run build
```

Generated files will appear inside the `/dist` directory.

---

## Preview Production Build

```bash
npm run preview
```

---

# 📤 Enrollment Form Integration

Enrollment requests are processed through **Formspree**.

To connect a different Formspree endpoint:
* Replace the existing Formspree form endpoint ID with your own.

---

# 👥 Authorship & Administration

## 🛠️ Engineering & Development

### Lead Architect & Developer

* **Mohammad Abuzaher**
* GitHub: [https://github.com/Mo-Abuzaher](https://github.com/Mo-Abuzaher)
* Organization: **CoMoputech**

**Responsibilities**

* System architecture
* Backend logic engineering
* Frontend engineering
* Performance optimization
* Repository administration

### Design & Optimization

Developed and refined in collaboration with the **Alyaqeen Academy Team**.

---

## 📖 Academic Administration

### Program Curators

**Academic Staff at Alyaqeen Academy**

**Responsibilities**

* Curriculum structure
* Instruction guidelines
* Scheduling & operations
* Educational policies

---

# 📬 Contact

## Technical Support

For deployment or codebase inquiries, contact:

**Mohammad Abuzaher — CoMoputech**

## Academy Inquiries

For registration, scheduling, or program-related questions, contact:

**Alyaqeen Academy**

---

# 📄 License

This project is privately maintained for Alyaqeen Academy.

All rights reserved.
