import React, { HTMLAttributes } from 'react';

import ColorText from '@/components/common/color-text';
import FallbackImage from '@/components/common/fallback-image';
import MindustryIcon, { parseIconString } from '@/components/common/mindustry-icon';
import ScrollContainer from '@/components/common/scroll-container';
import Tran from '@/components/common/tran';
import TagContainer from '@/components/tag/tag-container';
import BackButton from '@/components/ui/back-button';
import IdUserCard from '@/components/user/id-user-card';

import { cn } from '@/lib/utils';
import { Tags } from '@/types/response/Tag';

type DetailProps = HTMLAttributes<HTMLDivElement>;

export function Detail({ className, children }: DetailProps) {
  return (
    <ScrollContainer className="absolute inset-0 w-full bg-background p-2 h-full" additionalPadding="pr-4">
      <div className={cn('relative flex flex-col h-full gap-6', className)}>{children}</div>
    </ScrollContainer>
  );
}

type ContentProps = {
  className?: string;
  children: React.ReactNode;
};

export function DetailContent({ className, children }: ContentProps) {
  return <div className={cn('flex w-full flex-col justify-between gap-6 lg:items-stretch', className)}>{children}</div>;
}

type InfoProps = React.HTMLAttributes<HTMLDivElement>;

export function DetailInfo({ className, children }: InfoProps) {
  return <div className={cn('relative flex flex-col items-start gap-2 lg:flex-row', className)}>{children}</div>;
}

type TitleProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: string;
};

export function DetailTitle({ className, children }: TitleProps) {
  return (
    <h3 className={cn('text-2xl capitalize', className)}>
      <ColorText text={children} />
    </h3>
  );
}

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  errorSrc: string;
};

export function DetailImage({ src, errorSrc, alt }: ImageProps) {
  return <FallbackImage className="w-full min-w-[30dvw] overflow-hidden rounded-lg object-cover md:max-w-[min(min(80dvh,80dvw),1920px)]" src={src} alt={alt} errorSrc={errorSrc} width={576} height={576} />;
}
type HeaderProps = React.HTMLAttributes<HTMLDivElement>;
export function DetailHeader({ className, children }: HeaderProps) {
  return <section className={cn('flex flex-col gap-1', className)}>{children}</section>;
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement> & {
  back?: boolean;
};
export function DetailActions({ className, children, back = true }: ActionsProps) {
  return (
    <section className={cn('flex items-end justify-between gap-1', className)}>
      <div className="grid w-full grid-cols-[repeat(auto-fit,4rem)] gap-2">{children}</div>
      {back && <BackButton />}
    </section>
  );
}

type TagsProps = React.HTMLAttributes<HTMLDivElement> & {
  tags: string[];
};

export function DetailTagsCard({ className, tags }: TagsProps) {
  const values = Tags.parseStringArray(tags);

  return <TagContainer className={className} tags={values} />;
}

type DescriptionProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: string;
};

export function DetailDescription({ className, children }: DescriptionProps) {
  const result = parseIconString(children);

  return <section className={cn('flex flex-wrap gap-0.5 max-w-[75ch]', className)}>{result.map((item, index) => (typeof item === 'string' ? <ColorText key={index} text={item} /> : <MindustryIcon key={index} name={item.name} />))}</section>;
}

type VerifierProps = {
  verifierId?: string;
};

export function Verifier({ verifierId }: VerifierProps) {
  if (verifierId) {
    return (
      <div className="flex items-end gap-2">
        <Tran text="verified-by" />
        <IdUserCard id={verifierId} />
      </div>
    );
  }
}
