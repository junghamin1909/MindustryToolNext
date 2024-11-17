import type { Metadata } from 'next';
import React from 'react';
import removeMd from 'remove-markdown';

import { serverApi, translate } from '@/action/action';
import ErrorScreen from '@/components/common/error-screen';
import PostDetailCard from '@/components/post/post-detail-card';
import { Locale } from '@/i18n/config';
import { formatTitle, isError } from '@/lib/utils';
import { getPost } from '@/query/post';

type Props = {
  params: Promise<{ id: string; locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const post = await serverApi((axios) => getPost(axios, { id }));
  const title = await translate(locale, 'post');

  if (isError(post)) {
    return { title: 'Error' };
  }

  return {
    title: formatTitle(title),
    description: [post.title, removeMd(post.content)].join('|'),
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await serverApi((axios) => getPost(axios, { id }));

  if (isError(post)) {
    return <ErrorScreen error={post} />;
  }

  return <PostDetailCard post={post} />;
}
