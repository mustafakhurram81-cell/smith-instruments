import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormValues } from '../lib/validations';
import { Section, Button, FadeIn, ParallaxHeader } from '../components/Shared';
import { SEO } from '../components/SEO';
import { Plus, Minus, Phone, Mail, MapPin, MessageCircle, Clock, Loader2, Award, ShieldCheck } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { CONTACT_INFO } from '../constants';

const FAQS = [
  { q: "What materials are used in your instruments?", a: "We strictly use high-grade German Stainless Steel (AISI 410, 420, 304) depending on the instrument type, ensuring corrosion resistance and longevity." },
  { q: "Do you offer international shipping?", a: "Yes, we ship globally using DHL, FedEx, and UPS. All shipments are fully insured." },
  { q: "What is your return policy?", a: "We offer a 'Payment After Satisfaction' policy. If the instruments do not meet your quality standards upon inspection, you may return them without charge." },
  { q: "Can you manufacture custom instruments?", a: "Absolutely. Our OEM division can modify existing patterns or create entirely new instruments based on your technical drawings or samples." },
  { q: "Are your products certified?", a: "Yes, Smith Instruments is ISO 9001, ISO 13485 certified, and our products are CE marked and FDA compliant." },
];

// FAQ Schema for structured data (appears in Google search results)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
};

const AccordionItem: React.FC<{ item: { q: string, a: string } }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0 bg-white first:rounded-t-sm last:rounded-b-sm">
      <button
        className="w-full py-6 px-6 flex justify-between items-center text-left focus:outline-none group hover:bg-stone-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-heading text-lg text-brand-charcoal group-hover:text-stone-600 transition-colors">{item.q}</span>
        {isOpen ? <Minus size={20} className="text-brand-orange shrink-0 ml-4" /> : <Plus size={20} className="text-stone-400 shrink-0 ml-4" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6 pt-0 text-stone-500 font-light leading-relaxed">
          {item.a}
        </div>
      </div>
    </div>
  );
};

// reCAPTCHA site key from environment variables (invisible reCAPTCHA)
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // React Hook Form
  const { register, handleSubmit, reset, trigger, watch, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      user_name: '',
      phone: '',
      user_email: '',
      country: '',
      interest: '',
      message: ''
    }
  });

  const messageVal = watch('message', '');

  // EmailJS credentials from environment variables
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  /*
    EMAILJS TEMPLATE SETTINGS FOR CONTACT FORM:
    -------------------------------------------
    1. Go to EmailJS Dashboard > Email Templates
    2. Create/Edit Template with ID: template_3kqu18e (or create new one and update ID above)
    3. Subject Line: New Inquiry from {{user_name}} - {{interest}}
    4. Content:
       Name: {{user_name}}
       Phone: {{phone}}
       Email: {{user_email}}
       Country: {{country}}
       Subject: {{interest}}
       
       Message:
       {{message}}
  */

  // Called when invisible reCAPTCHA is verified
  const handleCaptchaChange = (token: string | null) => {
    if (token && formRef.current) {
      // CAPTCHA verified, now send the email
      setFormStatus('sending');

      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
        .then((_result) => {
          setFormStatus('success');
          // Reset Form
          reset();
          recaptchaRef.current?.reset();
          setTimeout(() => setFormStatus('idle'), 5000);
        }, (error) => {
          console.error("EmailJS Error:", error);
          setErrorMessage(error.text || "Unknown error occurred");
          setFormStatus('error');
          recaptchaRef.current?.reset();
        });
    }
  };

  const onSubmitValid = async (data: ContactFormValues) => {
    if (formStatus === 'sending') return;

    // Check if reCAPTCHA is configured
    if (!RECAPTCHA_SITE_KEY) {
      setErrorMessage("Form submission is temporarily unavailable. Please contact us via WhatsApp or email.");
      setFormStatus('error');
      return;
    }

    if (recaptchaRef.current) {
      recaptchaRef.current.execute();
    } else {
      console.error("reCAPTCHA ref is null");
      setErrorMessage("reCAPTCHA failed to load. Please refresh.");
      setFormStatus('error');
    }
  };

  return (
    <div className="pt-20 bg-stone-50 min-h-screen">
      <SEO
        title="Contact Us"
        description="Get in touch with Smith Instruments for quotes, custom manufacturing inquiries, or support. Global shipping available."
        keywords="contact surgical instruments supplier, request quote medical tools, custom OEM surgical manufacturing, buy surgical instruments online, surgical instrument distributor inquiry"
        structuredData={faqSchema}
      />

      {/* Header */}
      <ParallaxHeader
        title="Contact Us"
        description="Reach out for quotes, custom manufacturing inquiries, or support."
        image="/images/headers/contact-header.webp"
      />

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDEBAR: Contact Info */}
          <div className="space-y-8">
            <FadeIn>
              {/* Contact Details Card */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                <h3 className="font-heading text-2xl text-brand-charcoal mb-8">Get In Touch</h3>

                <div className="space-y-8">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-brand-charcoal flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal mb-1">Phone</h4>
                      <p className="text-stone-600 font-light">{CONTACT_INFO.phone}</p>
                      <p className="text-xs text-stone-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-brand-charcoal flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal mb-1">Email</h4>
                      <p className="text-stone-600 font-light break-all">{CONTACT_INFO.email}</p>
                      <p className="text-xs text-stone-400 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  {/* Locations */}
                  {CONTACT_INFO.locations.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-stone-100 text-brand-charcoal flex items-center justify-center shrink-0 shadow-sm border border-stone-200">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-charcoal mb-1">{loc.type}</h4>
                        <p className="text-stone-600 font-light pr-4">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-10">
                  <a
                    href="https://wa.me/923302449855"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-full font-medium transition-colors shadow-sm"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              {/* Business Hours Card */}
              <div className="bg-stone-100 p-8 rounded-sm border border-stone-200">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-brand-charcoal" size={20} />
                  <h3 className="font-heading text-xl text-brand-charcoal">Business Hours</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Monday - Saturday</span>
                    <span className="font-medium">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT CONTENT: Form */}
          <div className="lg:col-span-2">
            <FadeIn delay={0.2}>
              <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-stone-100">
                <h3 className="font-heading text-3xl text-brand-charcoal mb-8">Send Us a Message</h3>

                {formStatus === 'success' ? (
                  <div className="bg-stone-50 text-brand-charcoal p-8 border border-brand-orange/50 text-center rounded-sm">
                    <div className="w-16 h-16 bg-brand-orange text-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={32} />
                    </div>
                    <h4 className="font-heading text-2xl mb-2 text-brand-charcoal">Inquiry Sent</h4>
                    <p className="font-light text-stone-600">We have received your message and will respond shortly.</p>
                  </div>
                ) : formStatus === 'error' ? (
                  <div className="bg-red-50 text-red-900 p-8 border border-red-200 text-center rounded-sm mb-6">
                    <h4 className="font-heading text-xl mb-2">Something went wrong</h4>
                    <p className="text-sm mb-2">{errorMessage}</p>
                    <p className="text-xs text-red-700">Please check your internet connection or contact us via WhatsApp.</p>
                    <Button className="mt-4" onClick={() => setFormStatus('idle')}>Try Again</Button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit(onSubmitValid)} className="space-y-5">

                    {/* Row 1: Full Name + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Full Name <span className="text-brand-orange">*</span></label>
                        <input
                          type="text"
                          {...register('user_name')}
                          placeholder="Dr. John Smith"
                          className={`w-full bg-white border p-4 rounded-sm transition-all outline-none text-brand-charcoal placeholder-stone-300 ${errors.user_name ? 'border-red-400 focus:!border-red-500' : 'border-stone-200 focus:!border-stone-400'}`}
                        />
                        {errors.user_name && <p className="text-red-500 text-xs mt-1">{errors.user_name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Phone (Optional)</label>
                        <input
                          type="text"
                          {...register('phone')}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:!border-stone-400 focus:ring-0 transition-all outline-none text-brand-charcoal placeholder-stone-300"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email + Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Email Address <span className="text-brand-orange">*</span></label>
                        <input
                          type="email"
                          {...register('user_email')}
                          placeholder="john.smith@hospital.com"
                          className={`w-full bg-white border p-4 rounded-sm transition-all outline-none text-brand-charcoal placeholder-stone-300 ${errors.user_email ? 'border-red-400 focus:!border-red-500' : 'border-stone-200 focus:!border-stone-400'}`}
                        />
                        {errors.user_email && <p className="text-red-500 text-xs mt-1">{errors.user_email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Country</label>
                        <input
                          type="text"
                          {...register('country')}
                          placeholder="United States"
                          className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:!border-stone-400 focus:ring-0 transition-all outline-none text-brand-charcoal placeholder-stone-300"
                        />
                      </div>
                    </div>

                    {/* Row 3: Subject Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Subject / Interest <span className="text-brand-orange">*</span></label>
                      <div className="relative">
                        <select
                          {...register('interest')}
                          className={`w-full bg-white border p-4 rounded-sm transition-all outline-none text-brand-charcoal appearance-none cursor-pointer ${errors.interest ? 'border-red-400 focus:!border-red-500' : 'border-stone-200 focus:!border-stone-400'}`}
                        >
                          <option value="" disabled>Select a topic...</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Quote Request">Request a Quote</option>
                          <option value="Custom Manufacturing">Custom Manufacturing / OEM</option>
                          <option value="Distributorship">Distributorship Inquiry</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                      {errors.interest && <p className="text-red-500 text-xs mt-1">{errors.interest.message}</p>}
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Message <span className="text-brand-orange">*</span></label>
                      <textarea
                        rows={6}
                        {...register('message')}
                        placeholder="Tell us about your requirements or questions..."
                        className={`w-full bg-white border p-4 rounded-sm transition-all outline-none text-brand-charcoal placeholder-stone-300 resize-none ${errors.message ? 'border-red-400 focus:!border-red-500' : 'border-stone-200 focus:!border-stone-400'}`}
                      ></textarea>
                      <div className="flex justify-between items-start mt-1">
                        {errors.message ? (
                          <p className="text-red-500 text-xs">{errors.message.message}</p>
                        ) : (
                          <span></span>
                        )}
                        <p className="text-xs text-stone-400 text-right">{messageVal.length}/2000 characters</p>
                      </div>
                    </div>

                    {/* Invisible reCAPTCHA - validates on form submit */}
                    {RECAPTCHA_SITE_KEY && (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                        size="invisible"
                      />
                    )}

                    {/* Hide the floating badge via CSS since we are displaying the legal text manually */}
                    <style>{`
                      .grecaptcha-badge { visibility: hidden; }
                    `}</style>

                    {/* Reduced top margin for unified feel */}
                    <div className="pt-2">
                      <Button type="submit" variant="secondary" disabled={formStatus === 'sending'} className="w-full md:w-auto px-10 flex items-center gap-2">
                        {formStatus === 'sending' ? (
                          <>
                            <Loader2 className="animate-spin" size={18} /> Sending...
                          </>
                        ) : (
                          "Send Inquiry"
                        )}
                      </Button>
                    </div>

                    {/* Google reCAPTCHA Legal Text (Required when hiding the badge) */}
                    <div className="text-[10px] text-stone-400 space-y-2 mt-4">
                      <p>
                        Protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" className="hover:text-brand-orange underline decoration-stone-300">Privacy</a> & <a href="https://policies.google.com/terms" className="hover:text-brand-orange underline decoration-stone-300">Terms</a>.
                      </p>
                      <p>
                        <strong>Privacy:</strong> We use your info solely to respond. No third parties.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

        </div>
      </div >

      {/* FAQ SECTION */}
      < section className="bg-stone-50 bg-noise py-24 border-t border-stone-200" >
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-brand-charcoal mb-4">Frequently Asked Questions</h2>
            <p className="text-stone-500 font-light">Common questions about our manufacturing, shipping, and policies.</p>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-stone-100">
            {FAQS.map((item, idx) => (
              <AccordionItem key={idx} item={item} />
            ))}
          </div>
        </div>
      </section >

    </div >
  );
};