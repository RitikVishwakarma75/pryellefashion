'use client';

import React from 'react';
import HeroExperience from '@/components/hero/HeroExperience';
import MoodSelector from '@/components/mood/MoodSelector';
import ProductGrid from '@/components/showcase/ProductGrid';
import ProductViewer3D from '@/components/viewer/ProductViewer3D';
import StyleVisualizer from '@/components/styling/StyleVisualizer';
import CollectionSection from '@/components/collections/CollectionSection';
import MaterialStory from '@/components/materials/MaterialStory';
import StylingTutorial from '@/components/tutorial/StylingTutorial';
import SocialProof from '@/components/social/SocialProof';

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Cinematic Hero & Integrated Category Switcher */}
      <HeroExperience />

      {/* 2. Interactive "Find Your Look" Mood Engine */}
      <MoodSelector />

      {/* 3. Non-Amazon Editorial Product Grid Showcase */}
      <ProductGrid />

      {/* 4. Interactive Three.js 360° 3D Product Studio */}
      <ProductViewer3D />

      {/* 5. "See It In Your Hair" Virtual Hairstyle Simulator */}
      <StyleVisualizer />

      {/* 6. Four Cinematic Collection Universes */}
      <CollectionSection />

      {/* 7. Sourcing & Material Storytelling */}
      <MaterialStory />

      {/* 8. Step-by-Step Editorial Hairstyle Tutorial Masterclass */}
      <StylingTutorial />

      {/* 9. Social Proof, Press Quotes & Shoppable Community Lookbook */}
      <SocialProof />
    </div>
  );
}
