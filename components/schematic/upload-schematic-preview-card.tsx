import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import { Preview, PreviewActions, PreviewDescription, PreviewHeader, PreviewImage } from '@/components/common/preview';
import env from '@/constant/env';
import useClientApi from '@/hooks/use-client';
import useToastAction from '@/hooks/use-toast-action';
import { Schematic } from '@/types/response/Schematic';
import { LinkIcon } from '@/components/common/icons';
import { getSchematicData } from '@/query/schematic';
import { BulkActionSelector } from '@/components/common/bulk-action';
import ColorText from '@/components/common/color-text';
import InternalLink from '@/components/common/internal-link';
import useImageLoading from '@/hooks/use-image-loading';
import Tran from '@/components/common/tran';

type UploadSchematicPreviewCardProps = {
  schematic: Schematic;
  imageCount: number;
};

function InternalUploadSchematicPreviewCard({ schematic: { id, name }, imageCount }: UploadSchematicPreviewCardProps) {
  const axios = useClientApi();

  const link = `${env.url.base}/admin/schematics/${id}`;
  const detailLink = `/admin/schematics/${id}`;
  const imageLink = `${env.url.image}/schematic-previews/${id}${env.imageFormat}`;
  const detailImageLink = `${env.url.image}/schematics/${id}${env.imageFormat}`;
  const errorImageLink = `${env.url.api}/schematics/${id}/image`;
  const copyContent = `Copied schematic ${name}`;
  const downloadLink = `${env.url.api}/schematics/${id}/download`;
  const downloadName = `{${name}}.msch`;

  const getData = useToastAction({
    title: <Tran text="copying" />,
    content: <Tran text="downloading-data" />,
    action: async () => await getSchematicData(axios, id),
  });

  const loading = useImageLoading(imageCount);

  return (
    <Preview>
      <CopyButton position="absolute" variant="ghost" data={link} content={link}>
        <LinkIcon />
      </CopyButton>
      <BulkActionSelector value={id} />
      <InternalLink href={detailLink} preloadImage={detailImageLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} loading={loading} />
      </InternalLink>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
        </PreviewHeader>
        <PreviewActions>
          <CopyButton content={copyContent} data={getData} />
          <DownloadButton href={downloadLink} fileName={downloadName} />
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

const UploadSchematicPreviewCard = React.memo(InternalUploadSchematicPreviewCard);

export default UploadSchematicPreviewCard;
