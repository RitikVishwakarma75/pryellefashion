import React from 'react';
import Image from 'next/image';
import { getCollections } from '@/services/collectionService';

export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-white/10">
        <h1 className="editorial-serif text-3xl font-light text-white">
          Cinematic Collections ({collections.length})
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Editorial worlds and sensory aesthetics defining the PRAYELE narrative.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-6 rounded-3xl bg-[#141311] border border-white/10 flex flex-col justify-between overflow-hidden relative shadow-xl"
          >
            {col.image && (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-4 bg-stone-900">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-sm font-semibold text-white">
                  {col.name}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="editorial-serif text-2xl font-light text-white">{col.name}</h3>
                <span className="text-[10px] text-[#C5A059] font-mono">/{col.slug}</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">{col.description}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                {col.products?.length || 0} Products Attached
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                Featured on Runway
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
