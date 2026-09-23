import type { Metadata } from 'next';

const POLICIES: Record<string, { title: string; content: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    content: [
      'At PRAYELE, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your personal information.',
      '**Information We Collect:** We collect information you provide when creating an account, placing an order, or contacting us — including your name, email, phone number, and shipping address.',
      '**How We Use Your Information:** Your information is used to process orders, deliver products, send order confirmations, and improve our services. We never sell your data to third parties.',
      '**Cookies:** We use essential cookies for cart functionality and session management. Analytics cookies help us understand how visitors use our site.',
      '**Data Security:** All payment information is processed through Razorpay\'s secure infrastructure. We never store credit card details on our servers.',
      '**Your Rights:** You can request access to, modification, or deletion of your personal data at any time by contacting hello@prayele.com.',
      '**Updates:** We may update this policy periodically. Continued use of our website constitutes acceptance of the revised policy.',
    ],
  },
  returns: {
    title: 'Returns & Refunds',
    content: [
      'We want you to love every PRAYELE piece. If you\'re not completely satisfied, our return process is simple and hassle-free.',
      '**Return Window:** You have 14 days from delivery to initiate a return. Items must be unused, undamaged, and in their original packaging.',
      '**How to Return:** Contact us at hello@prayele.com with your order number. We\'ll arrange a pickup or provide shipping instructions.',
      '**Refund Processing:** Once we receive and inspect the returned item, your refund will be processed within 5–7 business days to your original payment method.',
      '**Exchange Policy:** If you\'d like to exchange for a different color or size, contact us and we\'ll handle it at no extra cost.',
      '**Non-Returnable Items:** For hygiene reasons, silk scrunchies and hair nets cannot be returned once opened.',
      '**Damaged Items:** If your order arrives damaged, contact us immediately with photos. We\'ll send a replacement at no charge.',
    ],
  },
  shipping: {
    title: 'Shipping Information',
    content: [
      'PRAYELE delivers across India with care and speed. Every order is packaged in our signature recycled linen pouch.',
      '**Standard Shipping:** 3–5 business days. ₹99 flat rate, or FREE on orders above ₹999.',
      '**Express Shipping:** 1–2 business days for metro cities. Available at checkout for ₹199.',
      '**Order Processing:** Orders placed before 2 PM IST are processed the same day. Weekend orders are processed on Monday.',
      '**Tracking:** You\'ll receive a tracking number via email once your order ships. Track your delivery in real-time.',
      '**International Shipping:** Coming soon. Join our newsletter to be the first to know when we launch global delivery.',
      '**Packaging:** All orders arrive in our signature black gift box with a hand-written thank you note and care instruction card.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    content: [
      'By using the PRAYELE website and purchasing our products, you agree to these terms and conditions.',
      '**Products & Pricing:** All prices are in Indian Rupees (₹) and include applicable taxes. We reserve the right to update prices without notice.',
      '**Orders:** An order confirmation email does not guarantee availability. In rare cases of stock issues, we\'ll contact you with alternatives or a full refund.',
      '**Intellectual Property:** All content on this website — including images, text, logos, and designs — is the property of PRAYELE and protected by copyright law.',
      '**User Accounts:** You are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorized access.',
      '**Limitation of Liability:** PRAYELE is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.',
      '**Governing Law:** These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai.',
      '**Contact:** For questions about these terms, email hello@prayele.com.',
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = POLICIES[slug];
  return {
    title: `${policy?.title || 'Policy'} — PRAYELE Haute Hairwear`,
    description: policy?.content[0] || 'PRAYELE legal and policy information.',
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = POLICIES[slug];

  if (!policy) {
    return (
      <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="editorial-serif text-3xl text-white mb-3">Policy Not Found</h1>
          <p className="text-stone-500 text-sm">The requested policy page does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <p className="caps-subtitle text-[#C5A059] mb-3">Legal</p>
          <h1 className="editorial-serif text-4xl font-light text-white">{policy.title}</h1>
        </div>

        <div className="space-y-6">
          {policy.content.map((paragraph, i) => {
            // Handle bold markers
            const parts = paragraph.split(/(\*\*.*?\*\*)/g);
            return (
              <p key={i} className="text-sm text-stone-400 leading-relaxed">
                {parts.map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={j} className="text-white font-medium">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={j}>{part}</span>;
                })}
              </p>
            );
          })}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-stone-600">
          <p>Last updated: September 2026</p>
          <p className="mt-1">
            Questions? Contact us at{' '}
            <a href="mailto:hello@prayele.com" className="text-[#C5A059] hover:underline">
              hello@prayele.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
