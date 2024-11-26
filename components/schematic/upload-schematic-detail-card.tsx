'use client';

import React, { useEffect, useState } from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { Detail, DetailActions, DetailContent, DetailDescription, DetailHeader, DetailImage, DetailInfo, DetailTitle } from '@/components/common/detail';
import { LinkIcon } from '@/components/common/icons';
import Tran from '@/components/common/tran';
import { DeleteSchematicButton } from '@/components/schematic/delete-schematic-button';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import VerifySchematicButton from '@/components/schematic/verify-schematic-button';
import TagSelector from '@/components/search/tag-selector';
import IdUserCard from '@/components/user/id-user-card';

import env from '@/constant/env';
import { useTags } from '@/context/tags-context.client';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { getSchematicData } from '@/query/schematic';
import { SchematicDetail } from '@/types/response/SchematicDetail';
import TagGroup, { TagGroups } from '@/types/response/TagGroup';

type UploadSchematicDetailCardProps = {
  schematic: SchematicDetail;
};

export default function UploadSchematicDetailCard({ schematic: { id, name, tags, requirements, description, userId, width, height } }: UploadSchematicDetailCardProps) {
  const axios = useClientApi();
  const {
    uploadTags: { schematic },
  } = useTags();

  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);

  useEffect(() => {
    setSelectedTags(TagGroups.parseString(tags, schematic));
  }, [tags, schematic]);

  const link = `${env.url.base}/schematics/${id}`;
  const imageUrl = `${env.url.image}/schematics/${id}${env.imageFormat}`;
  const errorImageUrl = `${env.url.api}/schematics/${id}/image`;
  const copyMessage = `Copied schematic ${name}`;
  const downloadUrl = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const getData = useToastAction({
    title: <Tran text="copying" />,
    content: <Tran text="downloading-data" />,
    action: async () => await getSchematicData(axios, id),
  });

  return (
    <Detail>
      <DetailContent>
        <DetailInfo>
          <CopyButton position="absolute" variant="ghost" data={link} content={link}>
            <LinkIcon />
          </CopyButton>
          <DetailImage src={imageUrl} errorSrc={errorImageUrl} alt={name} />
          <DetailHeader>
            <DetailTitle>{name}</DetailTitle>
            <IdUserCard id={userId} />
            <span>
              <Tran text="size" /> {width}x{height}
            </span>
            <DetailDescription>{description}</DetailDescription>
            <ItemRequirementCard requirements={requirements} />
            <TagSelector tags={schematic} value={selectedTags} onChange={setSelectedTags} />
          </DetailHeader>
        </DetailInfo>
        <DetailActions>
          <CopyButton content={copyMessage} data={getData} />
          <DownloadButton href={downloadUrl} fileName={downloadName} />
          <DeleteSchematicButton id={id} name={name} />
          <VerifySchematicButton id={id} name={name} selectedTags={selectedTags} />
        </DetailActions>
      </DetailContent>
    </Detail>
  );
}
