import Link from 'next/link';
import React from 'react';

import CopyButton from '@/components/button/copy-button';
import DownloadButton from '@/components/button/download-button';
import {
  Preview,
  PreviewActions,
  PreviewDescription,
  PreviewHeader,
  PreviewImage,
} from '@/components/common/preview';
import env from '@/constant/env';
import { MapPreview } from '@/types/response/MapPreview';
import { LinkIcon } from '@/components/common/icons';
import { BulkActionSelector } from '@/components/common/bulk-action';
import ColorText from '@/components/common/color-text';

type UploadMapPreviewCardProps = {
  map: MapPreview;
};

function _UploadMapPreviewCard({
  map: { id, name },
}: UploadMapPreviewCardProps) {
  const link = `${env.url.base}/admin/maps/${id}`;
  const detailLink = `/admin/maps/${id}`;
  const imageLink = `${env.url.image}/map-previews/${id}.png`;
  const errorImageLink = `${env.url.api}/maps/${id}/image`;
  const downloadLink = `${env.url.api}/maps/${id}/download`;
  const downloadName = `{${name}}.msch`;

  return (
    <Preview>
      <CopyButton
        position="absolute"
        variant="ghost"
        data={link}
        content={link}
      >
        <LinkIcon />
      </CopyButton>
      <BulkActionSelector value={id} />
      <Link href={detailLink}>
        <PreviewImage src={imageLink} errorSrc={errorImageLink} alt={name} />
      </Link>
      <PreviewDescription>
        <PreviewHeader>
          <ColorText text={name} />
        </PreviewHeader>
        <PreviewActions>
          <DownloadButton href={downloadLink} fileName={downloadName} />
        </PreviewActions>
      </PreviewDescription>
    </Preview>
  );
}

const UploadMapPreviewCard = React.memo(_UploadMapPreviewCard);

export default UploadMapPreviewCard;
