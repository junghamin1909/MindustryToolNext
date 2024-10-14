'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import InternalLink from '@/components/common/internal-link';

const colorArray = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];

type UserAvatarProps = {
  className?: string;
  url?: string;
  user: {
    name?: string | null;
    id: string;
    imageUrl?: string | null;
  };
  clickable?: boolean;
};

export default function UserAvatar({ className, url, user }: UserAvatarProps) {
  if (url) {
    return (
      <InternalLink className="cursor-pointer" href={url}>
        <AvatarImage className={className} user={user} />
      </InternalLink>
    );
  }

  return <AvatarImage className={className} user={user} />;
}

type AvatarImageProps = {
  className?: string;
  user: {
    name?: string | null;
    imageUrl?: string | null;
  };
};

function AvatarImage({ className, user: { imageUrl, name } }: AvatarImageProps) {
  const [isError, setError] = useState(false);

  useEffect(() => setError(false), [imageUrl]);

  const username = name ?? '';

  if (isError || !imageUrl) {
    let total = 0;
    for (let i = 0; i < username.length; i++) {
      total += username.charCodeAt(i);
    }
    const color = colorArray[total % colorArray.length];

    return (
      <div className={cn('flex size-8 min-h-8 min-w-8 items-center justify-center rounded-full border border-border capitalize', className)} style={{ backgroundColor: color }}>
        {username.at(0)}
      </div>
    );
  }

  return (
    <div className={cn('flex size-8 min-h-8 min-w-8 items-center justify-center overflow-hidden rounded-full border border-border capitalize', className)}>
      <Image className={cn('h-full w-full object-cover', className)} height={32} width={32} src={imageUrl} alt={username} priority onError={() => setError(true)} />
    </div>
  );
}
