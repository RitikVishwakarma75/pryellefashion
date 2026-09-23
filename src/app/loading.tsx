import React from 'react';

export default function Loading() {
  return (
    <section className="min-h-screen bg-[#0D0C0B] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-[#C5A059]/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C5A059] animate-spin" />
        </div>
        <p className="caps-subtitle text-[#C5A059]/60 text-xs">Loading</p>
      </div>
    </section>
  );
}
