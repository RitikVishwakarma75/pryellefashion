import React from 'react';
import { getHairstylesWithCombinations } from '@/services/stylingService';
import { Clock } from 'lucide-react';

export const revalidate = 0;

interface StyleCombinationItem {
  id: string;
  accessoryName?: string | null;
  stylingTime: string;
  difficulty: string;
  stylistTip: string;
}

interface HairstyleItem {
  id: string;
  name: string;
  slug: string;
  combinations?: StyleCombinationItem[];
}

export default async function AdminStylingPage() {
  const hairstyles = (await getHairstylesWithCombinations()) as unknown as HairstyleItem[];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="editorial-serif text-3xl font-light text-white">
          Hairstyles & Virtual Simulator Matrix ({hairstyles.length})
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          The 25 hairstyle × accessory combinations that power the &ldquo;See It In Your Hair&rdquo; virtual simulator.
        </p>
      </div>

      <div className="space-y-6">
        {hairstyles.map((style: HairstyleItem) => (
          <div
            key={style.id}
            className="p-6 rounded-3xl bg-[#141311] border border-white/10 space-y-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="editorial-serif text-2xl font-light text-white">{style.name}</h3>
                <span className="text-[10px] font-mono text-[#C5A059]">/{style.slug}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-stone-300">
                {style.combinations?.length || 5} Accessory Pairings
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {style.combinations?.map((combo: StyleCombinationItem) => (
                <div
                  key={combo.id}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-white capitalize">
                      {combo.accessoryName || 'Accessory'}
                    </span>
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C5A059]" />
                      <span>{combo.stylingTime}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">
                    {combo.stylistTip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
