import type { Metadata } from 'next';
import { Sparkles, Leaf, Heart, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story — PRAYELE Haute Hairwear',
  description: 'Discover the story behind PRAYELE — where Italian craftsmanship meets modern Indian elegance in luxury hair accessories.',
};

const VALUES = [
  {
    icon: Sparkles,
    title: 'Artisanal Craft',
    description: 'Every piece is sculpted by hand using techniques passed down through generations of Italian artisans. We use only cellulose acetate, freshwater pearls, and Mulberry silk.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Luxury',
    description: 'Our acetate is derived from renewable cotton and wood pulp. Zero plastic, zero compromise. Even our packaging is crafted from recycled French linen.',
  },
  {
    icon: Heart,
    title: 'Empowering Expression',
    description: 'Hair is your most versatile accessory. We design pieces that transform a simple hairstyle into a statement — effortless luxury for every mood and moment.',
  },
  {
    icon: Globe,
    title: 'Global Heritage',
    description: 'Inspired by Italian ateliers, Parisian runways, and Indian artisanship. Our designs bridge cultures, celebrating beauty in all its forms.',
  },
];

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#0D0C0B] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="caps-subtitle text-[#C5A059] mb-4">Our Story</p>
          <h1 className="editorial-serif text-5xl md:text-6xl font-light text-white mb-6">
            Where Heritage
            <br />Meets Hair
          </h1>
          <p className="text-stone-400 text-base max-w-2xl mx-auto leading-relaxed">
            PRAYELE was born from a simple belief: your hair deserves the same artistry as haute couture.
            We create sculpted, hand-finished hair accessories that transform the everyday into the extraordinary.
          </p>
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-[#C5A059]/30 mx-auto mb-16" />

        {/* Origin Story */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="caps-subtitle text-[#C5A059] mb-3">The Beginning</p>
              <h2 className="editorial-serif text-3xl text-white mb-4">
                From a Parisian Atelier to Your Hair
              </h2>
              <div className="space-y-4 text-sm text-stone-400 leading-relaxed">
                <p>
                  It started with a single claw clip — hand-carved from Italian cellulose acetate,
                  polished until it caught the light like a jewel. That first prototype, created in a
                  small atelier in Milan, was the seed of what PRAYELE would become.
                </p>
                <p>
                  Our founder believed that hair accessories shouldn&apos;t be afterthoughts. They should
                  be the hero — the piece that elevates a simple ponytail into a runway moment.
                  Every PRAYELE design is a study in proportion, material, and emotion.
                </p>
                <p>
                  Today, we work with artisans across Italy, Japan, and India to source the finest
                  materials: Mazzucchelli acetate, Baroque freshwater pearls, Grade 6A Mulberry silk,
                  and hand-carved botanical hardwoods.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1815] to-[#0D0C0B] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-[#C5A059]/30 mx-auto mb-4" />
                <p className="text-stone-600 text-xs">Atelier Imagery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <p className="caps-subtitle text-[#C5A059] mb-3 text-center">Our Philosophy</p>
          <h2 className="editorial-serif text-3xl text-white mb-10 text-center">
            Four Pillars of PRAYELE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#C5A059]/20 transition-colors"
                >
                  <Icon className="w-6 h-6 text-[#C5A059] mb-4" />
                  <h3 className="text-sm font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Numbers */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { num: '40+', label: 'Unique Designs' },
            { num: '12K+', label: 'Happy Clients' },
            { num: '8', label: 'Categories' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <p className="editorial-serif text-3xl text-[#C5A059] mb-1">{stat.num}</p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-stone-400 text-sm mb-6">Ready to discover your signature piece?</p>
          <a
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E6B85C] text-black text-sm font-bold hover:brightness-110 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Explore the Collection
          </a>
        </div>
      </div>
    </section>
  );
}
