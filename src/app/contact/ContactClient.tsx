'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Globe, MessageCircle, CheckCircle2 } from 'lucide-react';

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'hello@prayele.com', href: 'mailto:hello@prayele.com' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Studio', value: 'Mumbai, Maharashtra, India', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat, 10 AM – 7 PM IST', href: '#' },
];

const SOCIAL_LINKS = [
  { icon: Globe, label: 'Instagram', handle: '@prayele', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', handle: '+91 98765 43210', href: '#' },
];

const FAQ = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–5 business days across India. Express delivery available in metro cities within 1–2 days.' },
  { q: 'Can I return or exchange?', a: 'Yes! We offer 14-day no-questions-asked returns. Items must be unused and in original packaging.' },
  { q: 'Are your materials sustainable?', a: 'All our acetate is plant-derived. We use recycled packaging and avoid single-use plastics entirely.' },
  { q: 'Do you ship internationally?', a: 'We currently ship across India. International shipping is coming soon.' },
];

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="caps-subtitle text-[#C5A059] mb-3">Get In Touch</p>
          <h1 className="editorial-serif text-4xl md:text-5xl font-light text-white mb-4">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-stone-400 text-sm max-w-lg mx-auto">
            Whether it&apos;s a question about an order, styling advice, or just saying hello —
            our team is here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-6">Send Us a Message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h3 className="editorial-serif text-xl text-white mb-2">Message Sent!</h3>
                  <p className="text-stone-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-400 mb-1.5 font-medium">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#C5A059]/40 resize-none"
                      placeholder="Tell us more..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">Contact Details</h3>
              <div className="space-y-4">
                {CONTACT_INFO.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-3 group"
                    >
                      <Icon className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-stone-500">{item.label}</p>
                        <p className="text-sm text-stone-300 group-hover:text-white transition-colors">{item.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Social */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">Follow Us</h3>
              <div className="space-y-3">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 text-sm text-stone-300 hover:text-[#C5A059] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.handle}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
              <h3 className="text-sm font-semibold text-white mb-4">Quick Answers</h3>
              <div className="space-y-4">
                {FAQ.map((faq) => (
                  <div key={faq.q}>
                    <p className="text-xs font-medium text-white mb-1">{faq.q}</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
