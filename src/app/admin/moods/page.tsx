import React from 'react';
import { getMoods } from '@/services/moodService';

export const revalidate = 0;

interface MoodItem {
  id: string;
  name: string;
  emoji?: string | null;
  tagline?: string | null;
  description: string;
  stylingTip?: string | null;
}

export default async function AdminMoodsPage() {
  const moods = (await getMoods()) as unknown as MoodItem[];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="editorial-serif text-3xl font-light text-white">
          Mood Engine Auras ({moods.length})
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Emotional look curations that dynamically change the storefront theme and bundle accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {moods.map((m: MoodItem) => (
          <div
            key={m.id}
            className="p-6 rounded-3xl bg-[#141311] border border-white/10 space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{m.emoji || '✨'}</span>
                <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/15 text-[#C5A059] text-[10px] font-semibold">
                  20% Bundle Discount
                </span>
              </div>
              <h3 className="editorial-serif text-2xl font-medium text-white">{m.name}</h3>
              <p className="text-xs text-[#C5A059] font-medium mt-0.5">{m.tagline}</p>
              <p className="text-xs text-stone-400 mt-2 leading-relaxed">{m.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-stone-400">
              <span className="text-stone-300 font-semibold block mb-0.5">Styling Tip:</span>
              {m.stylingTip || 'Tousle gently and anchor firmly with sculpted claws.'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
