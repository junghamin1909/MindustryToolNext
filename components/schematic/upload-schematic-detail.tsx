'use client';

import Detail from '@/components/detail/detail';
import BackButton from '@/components/ui/back-button';
import CopyButton from '@/components/button/copy-button';
import env from '@/constant/env';
import { useToast } from '@/hooks/use-toast';
import { Schematic } from '@/types/response/Schematic';
import React, { HTMLAttributes, useState } from 'react';
import DownloadButton from '@/components/button/download-button';
import IdUserCard from '@/components/user/id-user-card';
import useClientAPI from '@/hooks/use-client';
import ItemRequirementCard from '@/components/schematic/item-requirement-card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import postVerifySchematic from '@/query/schematic/post-verify-schematic';
import VerifySchematicRequest from '@/types/request/VerifySchematicRequest';
import { Button } from '@/components/ui/button';
import getSchematicData from '@/query/schematic/get-schematic-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import TagGroup from '@/types/response/TagGroup';
import NameTagSelector from '@/components/search/name-tag-selector';
import useTags from '@/hooks/use-tags';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import _ from 'lodash';

type UploadSchematicDetailProps = HTMLAttributes<HTMLDivElement> & {
  schematic: Schematic;
};

export default function UploadSchematicDetail({
  schematic,
}: UploadSchematicDetailProps) {
  const { toast } = useToast();
  const { back } = useRouter();
  const { axios } = useClientAPI();
  const queryClient = useQueryClient();
  const [selectedTags, setSelectedTags] = useState<TagGroup[]>([]);
  const { schematic: schematicTags } = useTags();

  const { mutate: verifySchematic, isPending: isVerifying } = useMutation({
    mutationFn: (data: VerifySchematicRequest) =>
      postVerifySchematic(axios, data),
    onSuccess: () => {
      queryClient.setQueriesData<{ pages: Schematic[][] }>(
        { predicate: (q) => q.queryKey.includes('schematic-uploads') },
        (data) => {
          if (data) {
            data.pages = data.pages.map((page) =>
              page.filter((item) => item.id !== schematic.id),
            );

            return _.cloneDeep(data);
          }
        },
      );

      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes('schematics'),
      });

      back();
      toast({
        title: 'Verify schematic successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to verify schematic',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = isVerifying;
  const link = `${env.url.base}/schematics/${schematic.id}`;

  const getData = async () => {
    const { dismiss } = toast({
      title: 'Coping',
      content: 'Downloading data from server',
    });
    const result = await getSchematicData(axios, schematic.id);
    dismiss();
    return result;
  };

  function VerifySchematicButton() {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="aspect-square h-9 w-9 rounded-md border p-2">
          <CheckIcon className="h-5 w-5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Verify this schematic: {schematic.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                title="Verify"
                onClick={() =>
                  verifySchematic({ id: schematic.id, tags: selectedTags })
                }
              >
                Verify
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  function RejectSchematicButton() {
    return (
      <AlertDialog>
        <AlertDialogTrigger className="aspect-square h-9 w-9 rounded-md border p-2">
          <XMarkIcon className="h-5 w-5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Reject this schematic: {schematic.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Button
                title="Reject"
                variant="destructive"
                onClick={() =>
                  verifySchematic({ id: schematic.id, tags: selectedTags })
                }
              />
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Detail>
      <Detail.Info>
        <div className="relative">
          <CopyButton
            className="absolute left-1 top-1 "
            title="Copy"
            variant="ghost"
            data={link}
            content={link}
          />
          <Detail.Image
            src={`${env.url.image}/schematics/${schematic.id}.png`}
            errorSrc={`${env.url.api}/schematics/${schematic.id}/image`}
            alt={schematic.name}
          />
        </div>
        <Detail.Header>
          <Detail.Title>{schematic.name}</Detail.Title>
          <IdUserCard id={schematic.authorId} />
          <Detail.Description>{schematic.description}</Detail.Description>
          <ItemRequirementCard requirement={schematic.requirement} />
          <NameTagSelector
            tags={schematicTags}
            value={selectedTags}
            onChange={setSelectedTags}
          />
        </Detail.Header>
      </Detail.Info>
      <Detail.Actions className="flex justify-between">
        <div className="flex gap-1">
          <CopyButton
            className="aspect-square h-9 w-9"
            title="Copy"
            variant="outline"
            content={`Copied schematic ${schematic.name}`}
            data={getData}
          />
          <DownloadButton
            className="aspect-square h-9 w-9"
            href={`${env.url.api}/schematics/${schematic.id}/download`}
          />
          <RejectSchematicButton />
          <VerifySchematicButton />
        </div>
        <BackButton />
      </Detail.Actions>
    </Detail>
  );
}
