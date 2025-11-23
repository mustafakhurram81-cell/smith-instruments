import React, { useState, useRef } from 'react';
import { Section, Button, FadeIn } from '../components/Shared';
import { Plus, Minus, Phone, Mail, MapPin, MessageCircle, Clock, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const FAQS = [
  { q: "What materials are used in your instruments?", a: "We strictly use high-grade German Stainless Steel (AISI 410, 420, 304) depending on the instrument type, ensuring corrosion resistance and longevity." },
  { q: "Do you offer international shipping?", a: "Yes, we ship globally using DHL, FedEx, and UPS. All shipments are fully insured." },
  { q: "What is your return policy?", a: "We offer a 'Payment After Satisfaction' policy. If the instruments do not meet your quality standards upon inspection, you may return them without charge." },
  { q: "Can you manufacture custom instruments?", a: "Absolutely. Our OEM division can modify existing patterns or create entirely new instruments based on your technical drawings or samples." },
  { q: "Are your products certified?", a: "Yes, Smith Instruments is ISO 9001, ISO 13485 certified, and our products are CE marked and FDA compliant." },
];

const AccordionItem: React.FC<{ item: { q: string, a: string } }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0 bg-white first:rounded-t-sm last:rounded-b-sm">
      <button
        className="w-full py-6 px-6 flex justify-between items-center text-left focus:outline-none group hover:bg-stone-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-serif text-lg text-brand-charcoal group-hover:text-stone-600 transition-colors">{item.q}</span>
        {isOpen ? <Minus size={20} className="text-brand-gold shrink-0 ml-4" /> : <Plus size={20} className="text-stone-400 shrink-0 ml-4" />}
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

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // TODO: Replace these with your actual EmailJS credentials
  const SERVICE_ID = 'service_dzj0fa2';
  const TEMPLATE_ID = 'template_3kqu18e';
  const PUBLIC_KEY = 'JVcDcowpyoY1HnUQO';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    if (form.current) {
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
        .then((result) => {
          console.log(result.text);
          setFormStatus('success');
          // Reset form status after 5 seconds to allow sending another
          setTimeout(() => setFormStatus('idle'), 5000);
        }, (error) => {
          console.log(error.text);
          setFormStatus('error');
          setTimeout(() => setFormStatus('idle'), 5000);
        });
    }
  };

  return (
    <div className="pt-20 bg-stone-50 min-h-screen">

      {/* Header */}
      <div className="bg-brand-charcoal py-20 text-center">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Contact Us</h1>
        <p className="text-stone-400 font-light max-w-xl mx-auto px-6">
          Reach out for quotes, custom manufacturing inquiries, or support.
        </p>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDEBAR: Contact Info */}
          <div className="space-y-8">
            <FadeIn>
              {/* Contact Details Card */}
              <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100">
                <h3 className="font-serif text-2xl text-brand-charcoal mb-8">Get In Touch</h3>

                <div className="space-y-8">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center shrink-0 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal mb-1">Phone</h4>
                      <p className="text-stone-600 font-light">+92 330 2449855</p>
                      <p className="text-xs text-stone-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center shrink-0 shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal mb-1">Email</h4>
                      <p className="text-stone-600 font-light break-all">sales@smithinstruments.com</p>
                      <p className="text-xs text-stone-400 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-charcoal text-brand-gold flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-charcoal mb-1">Location</h4>
                      <p className="text-stone-600 font-light">123 Medical Park Blvd<br />New York, NY 10012</p>
                      <p className="text-xs text-stone-400 mt-1">Serving clients globally</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <div className="mt-10">
                  <a
                    href="https://wa.me/923302449855"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 rounded-full font-medium transition-colors shadow-sm"
                  >
                    <MessageCircle size={20} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              {/* Business Hours Card */}
              <div className="bg-stone-100 p-8 rounded-sm border border-stone-200">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-brand-charcoal" size={20} />
                  <h3 className="font-serif text-xl text-brand-charcoal">Business Hours</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 2:00 PM</span>
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
                <h3 className="font-serif text-3xl text-brand-charcoal mb-8">Send Us a Message</h3>

                {formStatus === 'success' ? (
                  <div className="bg-stone-50 text-brand-charcoal p-8 border border-brand-gold/50 text-center rounded-sm">
                    <div className="w-16 h-16 bg-brand-gold text-brand-charcoal rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={32} />
                    </div>
                    <h4 className="font-serif text-2xl mb-2 text-brand-charcoal">Inquiry Sent</h4>
                    <p className="font-light text-stone-600">We have received your message and will respond shortly.</p>
                  </div>
                ) : formStatus === 'error' ? (
                  <div className="bg-red-50 text-red-900 p-8 border border-red-200 text-center rounded-sm mb-6">
                    <h4 className="font-serif text-xl mb-2">Something went wrong</h4>
                    <p className="text-sm">Please check your internet connection or try contacting us via WhatsApp.</p>
                    <Button className="mt-4" onClick={() => setFormStatus('idle')}>Try Again</Button>
                  </div>
                ) : (
                  <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                    {/* Note: 'name' attributes are required for EmailJS to map fields */}
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Full Name <span className="text-brand-gold">*</span></label>
                      <input
                        required
                        type="text"
                        name="user_name"
                        placeholder="Dr. John Smith"
                        className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all outline-none text-brand-charcoal placeholder-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Email Address <span className="text-brand-gold">*</span></label>
                      <input
                        required
                        type="email"
                        name="user_email"
                        placeholder="john.smith@hospital.com"
                        className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all outline-none text-brand-charcoal placeholder-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Catalogue of Interest</label>
                      <input
                        type="text"
                        name="interest"
                        placeholder="e.g., Orthopedic Instruments"
                        className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all outline-none text-brand-charcoal placeholder-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Message <span className="text-brand-gold">*</span></label>
                      <textarea
                        required
                        rows={6}
                        name="message"
                        placeholder="Tell us about your requirements or questions..."
                        className="w-full bg-white border border-stone-200 p-4 rounded-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all outline-none text-brand-charcoal placeholder-stone-300 resize-none"
                      ></textarea>
                      <p className="text-xs text-stone-400 mt-2 text-right">0/1000 characters</p>
                    </div>

                    <div className="pt-4">
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

                    <p className="text-xs text-stone-400 bg-stone-50 p-4 rounded-sm mt-4">
                      <strong>Privacy Notice:</strong> Your information will be used solely to respond to your inquiry. We do not share your data with third parties.
                    </p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

        </div>
      </div>

      {/* FAQ SECTION */}
      <section className="bg-white py-24 border-t border-stone-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4">Frequently Asked Questions</h2>
            <p className="text-stone-500 font-light">Common questions about our manufacturing, shipping, and policies.</p>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-stone-100">
            {FAQS.map((item, idx) => (
              <AccordionItem key={idx} item={item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};