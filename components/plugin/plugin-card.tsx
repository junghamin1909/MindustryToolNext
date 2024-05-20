'use client';

import DeleteButton from '@/components/button/delete-button';
import useClientAPI from '@/hooks/use-client';
import useQueriesData from '@/hooks/use-queries-data';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/locales/client';
import deletePlugin from '@/query/plugin/delete-plugin';
import { Plugin } from '@/types/response/Plugin';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

type Props = {
  plugin: Plugin;
};

const GITHUB_PATTERN =
  /https:\/\/api\.github\.com\/repos\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/.+/;
export default function PluginCard({
  plugin: { id, name, description, url },
}: Props) {
  const { toast } = useToast();
  const { invalidateByKey } = useQueriesData();
  const t = useI18n();

  const { axios } = useClientAPI();
  const { mutate: deletePluginById, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deletePlugin(axios, id),
    onSuccess: () => {
      invalidateByKey(['plugins']);
      toast({
        title: t('delete-success'),
        variant: 'success',
      });
    },
    onError: (error) => {
      toast({
        title: t('delete-fail'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const matches = GITHUB_PATTERN.exec(url);
  const user = matches?.at(1);
  const repo = matches?.at(2);

  const githubUrl = `https://github.com/${user}/${repo}`;

  return (
    <Link
      className="relative grid gap-2 rounded-md border p-2"
      href={githubUrl}
    >
      <h2>{name}</h2>
      <span>{description}</span>
      <div className="flex gap-2">
        <DeleteButton
          className="absolute right-2 top-2 backdrop-brightness-50"
          description={`${t('delete')} ${name}`}
          isLoading={isDeleting}
          onClick={() => deletePluginById(id)}
        />
      </div>
    </Link>
  );
}
