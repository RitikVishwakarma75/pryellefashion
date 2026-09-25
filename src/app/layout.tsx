import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import FlyToCartEffect from '@/components/cart/FlyToCartEffect';
import CheckoutModal from '@/components/cart/CheckoutModal';
import AmbientBackground from '@/components/hero/AmbientBackground';

import MobileBottomBar from '@/components/layout/MobileBottomBar';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PRAYELE • Haute Hairwear — One Hair. Endless Looks.',
  description:
    'Sculpted Italian cellulose claw clips, baroque freshwater pearl hair pins, pure Mulberry silk scrunchies, and hand-carved botanical combs. Transform everyday hair into a runway statement.',
  keywords: [
    'luxury hair accessories',
    'claw clips',
    'hair pins',
    'mulberry silk scrunchies',
    'botanical combs',
    'hair barrettes',
    'velvet headbands',
    'high-end hair accessories India',
    'Prayele Haute Hairwear',
  ],
  authors: [{ name: 'Prayele Haute Hairwear' }],
  openGraph: {
    title: 'PRAYELE • Haute Hairwear — One Hair. Endless Looks.',
    description:
      'Immersive luxury hair accessories brand. Sculpted acetate claws, freshwater pearls, and silk clouds.',
    siteName: 'PRAYELE',
    locale: 'en_IN',
    type: 'website',
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-FMTN7XE5H9';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-screen flex flex-col font-sans selection:bg-[var(--theme-accent)] selection:text-black pb-16 md:pb-0">
        <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              {/* Dynamic World Background & Ambient Atmosphere */}
              <AmbientBackground />

              {/* Sticky Navigation */}
              <Navigation />

              {/* Main Page Content */}
              <main className="flex-1 relative z-10">{children}</main>

              {/* Editorial Footer */}
              <Footer />

              {/* Global Overlays & Drawers */}
              <CartDrawer />
              <FlyToCartEffect />
              <CheckoutModal />
              <MobileBottomBar />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
