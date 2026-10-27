<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Smith Instruments

Premium surgical instruments manufacturer website — [smithinstruments.net](https://smithinstruments.net)

Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

## Features

- 📦 Product catalog with 3,000+ surgical instruments, served as static data (`npm run catalog`)
- 🔍 Instant catalogue search
- 📄 Interactive PDF catalogue viewer (FlipBook)
- 🛒 Quote request cart system
- 🌐 Multi-language support (Google Translate)
- 📊 SEO optimized with structured data (JSON-LD)
- ⚡ Code-split lazy loading for fast page loads

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your credentials
3. Run the dev server:
   ```
   npm run dev
   ```

## Environment Variables

See [.env.example](.env.example) for the full list of required variables:
- `VITE_EMAILJS_*` — EmailJS for contact/quote forms
- `VITE_RECAPTCHA_SITE_KEY` — Google reCAPTCHA v2

## Deployment

Deployed on **Vercel**. Push to `main` triggers automatic builds.

```
npm run build
```
