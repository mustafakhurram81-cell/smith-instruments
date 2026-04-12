/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_EMAILJS_SERVICE_ID: string
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    readonly VITE_EMAILJS_CONTACT_TEMPLATE_ID: string
    readonly VITE_EMAILJS_QUOTE_TEMPLATE_ID: string
    readonly VITE_RECAPTCHA_SITE_KEY: string
    readonly VITE_ADMIN_EMAILS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
