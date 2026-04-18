# Alyaqeen Academy — Website

Static website for **Alyaqeen Academy**: online Quran instruction (tahfeez, reading, Noorani Qaida), enrollment via Formspree, and a separate testimonials page. Layout is responsive; Arabic display uses **Amiri** and UI text uses **Outfit** (Google Fonts).

## Pages and features

**Home (`index.html`)**

- Hero with bismillah, Quranic ayah (Surah Al-Muzzammil), headline, and primary CTA to the enrollment section  
- **Courses:** three cards — Tahfeez (memorization), Reading (tajweed / fluency), Noorani Qaida (beginner Arabic foundations)  
- **How it works:** short steps describing the learning flow  
- **Enrollment:** Formspree-backed form with optional phone, country-code selector, and client-side length hints in `script.js`  
- **Footer:** brand line, email / phone / WhatsApp links, copyright  

**Testimonials (`reviews.html`)**

- Grid of family testimonials (star ratings and quotes)  
- Thank-you line and button back to the home page enrollment section  

**Sitewide**

- Main navigation plus a compact floating menu on smaller viewports (same destinations: Home, Courses, How It Works, Testimonials, Enroll)  
- Smooth scrolling for in-page anchor links  
- Scroll-reveal style entrance animation on course cards, steps, features, the enrollment form, testimonial cards, and related blocks  

## Repository contents

| Path | Role |
|------|------|
| `index.html` | Home — hero, courses, how it works, enroll form, footer contacts |
| `reviews.html` | Testimonials and link back to enroll |
| `styles.css` | Global styles, theme variables in `:root`, components |
| `script.js` | Navigation, smooth scrolling, scroll-reveal, form/phone helpers |
| `assets/` | Logos and other images referenced from the HTML |

There is no bundler or `package.json`; deploy the files as-is from the project root.

## Implementation notes

- **Styling:** Colors, radii, and fonts are controlled with CSS variables at the top of `styles.css`. Adjust those tokens to retheme the site.
- **Behavior:** Header hides on scroll on larger viewports; a floating control opens the same links on small screens. Sections use a light scroll-reveal animation (keyframe-based) where configured in `script.js`.
- **Forms:** The enrollment `<form>` posts through [Formspree](https://formspree.io). Replace the form `action` URL and `data-formspree-id` in `index.html` if you switch accounts.
- **Contact links:** Footer email (`mailto:`), phone (`tel:`), and WhatsApp (`wa.me`) appear in **both** HTML files under `footer-contact`. Use E.164 for `tel:`; for WhatsApp, use only digits in the path (no `+`).

## Local preview

Serving the directory avoids oddities with `file://` and remote fonts:

```bash
python -m http.server 8000
```

```bash
npx serve .
```

Then open the printed local URL (often `http://localhost:8000`).

## Deployment

Upload the whole folder to any static host (for example GitHub Pages, Netlify, Cloudflare Pages, or Vercel static hosting). Keep `index.html`, `reviews.html`, `styles.css`, `script.js`, and `assets/` at the same relative paths so links keep working.

## Author

**Mohammad Abuzaher** develops and maintains this repository as the **developer for Alyaqeen Academy’s public site**: structure and layout in HTML/CSS, behavior in JavaScript (navigation, scroll, Formspree + phone helpers, scroll-reveal), the testimonials page, deployment notes in this README, and coordinating updates when the academy changes copy, course descriptions, or contact details in the footer.

**Enrollment and class questions** belong to the academy (see the site footer, e.g. [alyaqeenacad@gmail.com](mailto:alyaqeenacad@gmail.com)).

**Repository / technical contact:** [github.com/Mo-Abuzaher](https://github.com/Mo-Abuzaher) · [mkmhaz@gmail.com](mailto:mkmhaz@gmail.com)

## Content scope

The site is informational and for enrollment outreach only. Policies, schedules, and religious instruction are the responsibility of Alyaqeen Academy.
