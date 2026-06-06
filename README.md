# Kamene Goro — Official Website

Premium celebrity-brand website built with HTML5, Bootstrap 5, vanilla JavaScript, GSAP, AOS and SwiperJS.

## Run locally
Open `index.html` directly in a browser, or serve the folder:
```
python3 -m http.server 8000
```

## Structure
- `*.html` — 16 pages (Home, About, Store, Bookings, Meet & Greet, Consultations, Birthday Wishes, Digital Products, Gallery, Media, Testimonials, Contact, FAQ, Privacy, Terms, 404)
- `assets/css/style.css` — design system + components
- `assets/js/main.js` — animations, cart UI, forms, gallery, lightbox
- `assets/images/` — hero, gallery, products, logo
- `robots.txt`, `sitemap.xml` — SEO

## Customise
- **Brand colors / fonts** — top of `assets/css/style.css` (`:root` variables).
- **Products** — list in the store grid; data attributes `data-name` and `data-price` drive the cart.
- **Real photos** — drop replacements into `assets/images/` keeping the same filenames; AI-generated placeholders ship by default.
- **Forms** — currently client-side validation only (no backend). Wire `#booking-form`, `#contact-form` and the shoutout form to your email service (Formspree, Mailgun, etc.).

## Deploy
Upload the entire folder to any static host: Netlify (drag-and-drop), Vercel, Cloudflare Pages, GitHub Pages, Hostinger, cPanel, AWS S3 + CloudFront.

## Notes
- All third-party libs load from CDN (Bootstrap, Font Awesome, AOS, Swiper, GSAP, Google Fonts).
- Replace `https://kamenegoro.com` in `sitemap.xml` and the `<link rel="canonical">` tags if the production URL changes.
