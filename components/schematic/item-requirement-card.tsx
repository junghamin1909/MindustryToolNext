import React from 'react';

import FallbackImage from '@/components/common/fallback-image';

import { ItemRequirement } from '@/types/response/ItemRequirement';

type Props = {
  requirements: ItemRequirement[];
};

export default function ItemRequirementCard({ requirements }: Props) {
  if (!requirements) return <></>;

  return (
    <section className=" flex flex-row flex-wrap gap-2">
      {requirements.map((r, index) => (
        <span key={index} className="flex flex-row items-center justify-center">
          <FallbackImage className="size-5" width={24} height={24} src={`/assets/items/item-${r.name}.png`} errorSrc="/assets/items/item-copper.png" alt={r.name} />
          <span> {r.amount} </span>
        </span>
      ))}
    </section>
  );
}
