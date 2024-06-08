'use client';

import { LikeAction, LikeTarget } from '@/constant/enum';
import { FakeLike, LikeContext } from '@/context/like-context';
import { useSession } from '@/context/session-context';
import useClientAPI from '@/hooks/use-client';
import { useToast } from '@/hooks/use-toast';
import postLike from '@/query/like/post-like';
import { Like } from '@/types/response/Like';

import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ReactNode } from 'react';

type LikeComponentProps = {
  children: ReactNode;
  initialLikeCount: number;
  initialLikeData: Like;
  targetType: LikeTarget;
  targetId: string;
};

function LikeComponent({
  initialLikeCount = 0,
  initialLikeData,
  children,
  targetType,
  targetId,
}: LikeComponentProps) {
  const { session } = useSession();
  const { axios } = useClientAPI();
  const [likeData, setLikeData] = useState({
    ...(initialLikeData ?? FakeLike),
    count: initialLikeCount,
  });
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (action: LikeAction) =>
      await postLike(axios, {
        action,
        targetType,
        targetId,
      }),
  });

  const handleAction = (action: 'LIKE' | 'DISLIKE') => {
    if (isPending) {
      return;
    }

    if (!session) {
      return toast({
        title: 'You are not logged in',
        description: 'Login in to like',
      });
    }

    let change: -2 | -1 | 0 | 1 | 2;
    let state: 0 | 1 | -1;

    if (action === 'LIKE') {
      change = likeData.state === -1 ? 2 : likeData.state === 0 ? 1 : -1;
      state = likeData.state === -1 ? 1 : likeData.state === 0 ? 1 : 0;
    } else {
      change = likeData.state === 1 ? -2 : likeData.state === 0 ? -1 : 1;
      state = likeData.state === 1 ? -1 : likeData.state === 0 ? -1 : 0;
    }

    setLikeData({
      ...likeData,
      state,
      count: likeData.count + change,
    });
    return mutate(action, {
      onError: () => setLikeData({ ...likeData }),
      onSuccess: (result) =>
        setLikeData({ count: likeData.count + result.amount, ...result.like }),
    });
  };

  return (
    <LikeContext.Provider
      value={{
        likeData,
        isLoading: isPending,
        handleAction,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
}

export default LikeComponent;
