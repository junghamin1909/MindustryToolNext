import React, { HTMLAttributes } from "react";
import Preview from "@/components/preview/preview";
import Schematic from "@/types/Schematic";
import conf from "@/constant/global";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn, fixProgressBar } from "@/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import LikeComponent from "@/components/like/like-component";
import { toast } from "@/hooks/use-toast";
import CopyButton from "@/components/ui/copy-button";
import axiosClient from "@/query/config/axios-config";

type SchematicPreviewProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function SchematicPreview({
  className,
  schematic,
  ...rest
}: SchematicPreviewProps) {
  const link = `${conf.baseUrl}/schematics/${schematic.id}`;

  const getSchematicData = async () => {
    const { dismiss } = toast({
      title: "Coping",
      content: "Downloading data from server",
    });
    const result = await axiosClient.get(`/schematics/${schematic.id}/data`);
    dismiss();
    return result.data as Promise<string>;
  };

  return (
    <Preview className={cn("relative flex flex-col", className)} {...rest}>
      <CopyButton
        className="absolute left-1 top-1 "
        title="Copy"
        variant="ghost"
        data={link}
        content={link}
      />
      <Link href={`/schematics/${schematic.id}`}>
        <Preview.Image
          className="h-preview w-preview"
          src={`${conf.apiUrl}/schematics/${schematic.id}/image`}
          alt={schematic.name}
        />
      </Link>
      <Preview.Description>
        <Preview.Header className="h-12">{schematic.name}</Preview.Header>
        <Preview.Actions>
          <CopyButton
            title="Copied"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getSchematicData}
          />
          <Button
            className="aspect-square"
            title="Download"
            size="icon"
            variant="outline"
            asChild
          >
            <a
              href={`${conf.apiUrl}/schematics/${schematic.id}/download`}
              download
              onClick={fixProgressBar}
            >
              <ArrowDownTrayIcon className="h-6 w-6" />
            </a>
          </Button>
          <LikeComponent
            initialLikeCount={schematic.like}
            initialLikeData={schematic.userLike}
          >
            <LikeComponent.LikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Like"
            />
            <LikeComponent.LikeCount
              className="aspect-square text-xl"
              size="icon"
              variant="outline"
              title="Like count"
            />
            <LikeComponent.DislikeButton
              className="aspect-square"
              size="icon"
              variant="outline"
              title="Dislike"
            />
          </LikeComponent>
        </Preview.Actions>
      </Preview.Description>
    </Preview>
  );
}
