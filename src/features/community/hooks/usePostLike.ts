import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

import {
  communityKeys,
  useLikeCommunityPostMutation,
  useUnlikeCommunityPostMutation,
} from '@/src/api/community/hooks';
import { queryClient } from '@/src/lib/queryClient';

type UsePostLikeParams = {
  initialIsLiked?: boolean;
  initialLikeCount?: number;
  postId?: string;
};

export function usePostLike({ initialIsLiked, initialLikeCount, postId }: UsePostLikeParams) {
  const likeMutation = useLikeCommunityPostMutation();
  const unlikeMutation = useUnlikeCommunityPostMutation();
  const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
  const isPending = likeMutation.isPending || unlikeMutation.isPending;

  useEffect(() => {
    setIsLiked(initialIsLiked ?? false);
    setLikeCount(initialLikeCount ?? 0);
  }, [initialIsLiked, initialLikeCount]);

  const refreshPost = async () => {
    if (!postId) {
      return;
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) }),
      queryClient.invalidateQueries({ queryKey: communityKeys.posts({ feed: 'all' }) }),
      queryClient.invalidateQueries({ queryKey: communityKeys.posts({ feed: 'following' }) }),
    ]);
  };

  const like = async () => {
    if (!postId || isPending) {
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    setIsLiked(true);
    setLikeCount((current) => (previousIsLiked ? current : current + 1));

    try {
      if (!previousIsLiked) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const result = await likeMutation.mutateAsync(postId);
        setLikeCount(result.like_count);
      }
      await refreshPost();
    } catch {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    }
  };

  const toggleLike = async () => {
    if (!postId || isPending) {
      return;
    }

    if (!isLiked) {
      await like();
      return;
    }

    const previousLikeCount = likeCount;
    setIsLiked(false);
    setLikeCount((current) => Math.max(0, current - 1));

    try {
      const result = await unlikeMutation.mutateAsync(postId);
      setLikeCount(result.like_count);
      await refreshPost();
    } catch {
      setIsLiked(true);
      setLikeCount(previousLikeCount);
    }
  };

  return {
    isLiked,
    isPending,
    like,
    likeCount,
    toggleLike,
  };
}
