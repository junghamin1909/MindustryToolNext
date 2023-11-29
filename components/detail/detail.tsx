import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { HTMLAttributes } from "react";

type DetailProps = HTMLAttributes<HTMLDivElement>;

function Detail({ className, children }: DetailProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full w-full flex-1 flex-col justify-between gap-2 overflow-x-hidden rounded-xl border-2 p-2 lg:items-stretch",
        className,
      )}
    >
      {children}
    </Card>
  );
}
type InfoProps = React.HTMLAttributes<HTMLDivElement>;

function Info({ className, children }: InfoProps) {
  return (
    <div className={cn("flex flex-row flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}

type HeaderProps = React.HTMLAttributes<HTMLDivElement>;

function Header({ className, children }: HeaderProps) {
  return <h1 className={cn("text-xl capitalize", className)}>{children}</h1>;
}

type AuthorProps = React.HTMLAttributes<HTMLDivElement>;

function Author({ className, children }: HeaderProps) {
  return <h1 className={cn("text-xl capitalize", className)}>{children}</h1>;
}
type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

function PImage({ className, src, alt }: ImageProps) {
  return (
    <Image
      className={cn(
        "overflow-hidden rounded-md border-2 border-border",
        className,
      )}
      src={src}
      alt={alt}
      width={576}
      height={576}
      priority
    />
  );
}

type ActionsProps = React.HTMLAttributes<HTMLDivElement>;

function Actions({ className, children }: ActionsProps) {
  return (
    <section className={cn("flex items-center gap-1", className)}>
      {children}
    </section>
  );
}

type DescriptionProps = React.HTMLAttributes<HTMLDivElement>;

function Description({ className, children }: DescriptionProps) {
  return (
    <section className={cn("flex flex-col gap-1", className)}>
      {children}
    </section>
  );
}

Detail.Info = Info;
Detail.Header = Header;
Detail.Actions = Actions;
Detail.Image = PImage;
Detail.Description = Description;

export default Detail;
