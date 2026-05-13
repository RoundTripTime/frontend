import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCommunityComment,
  createCommunityPost,
  deleteCommunityComment,
  deleteCommunityPost,
  followUser,
  getCommunityPost,
  getUserProfile,
  likeCommunityPost,
  listCommunityComments,
  listCommunityPosts,
  unlikeCommunityPost,
  unfollowUser,
} from '../community';

import type { QueryParams } from '../common';

export const communityKeys = {
  posts: (params?: QueryParams) => ['community', 'posts', params] as const,
  post: (postId: string) => ['community', 'posts', postId] as const,
  comments: (postId: string, params?: QueryParams) =>
    ['community', 'posts', postId, 'comments', params] as const,
  profile: (userId: string) => ['users', userId, 'profile'] as const,
};

export function useCommunityPostsQuery(params?: QueryParams) {
  return useQuery({
    queryKey: communityKeys.posts(params),
    queryFn: () => listCommunityPosts(params),
  });
}

export function useCommunityPostQuery(postId: string) {
  return useQuery({
    queryKey: communityKeys.post(postId),
    queryFn: () => getCommunityPost(postId),
    enabled: !!postId,
  });
}

export function useCreateCommunityPostMutation() {
  return useMutation({ mutationFn: createCommunityPost });
}

export function useDeleteCommunityPostMutation() {
  return useMutation({ mutationFn: deleteCommunityPost });
}

export function useLikeCommunityPostMutation() {
  return useMutation({ mutationFn: likeCommunityPost });
}

export function useUnlikeCommunityPostMutation() {
  return useMutation({ mutationFn: unlikeCommunityPost });
}

export function useCommunityCommentsQuery(postId: string, params?: QueryParams) {
  return useQuery({
    queryKey: communityKeys.comments(postId, params),
    queryFn: () => listCommunityComments(postId, params),
    enabled: !!postId,
  });
}

export function useCreateCommunityCommentMutation(postId: string) {
  return useMutation({
    mutationFn: (body: Parameters<typeof createCommunityComment>[1]) =>
      createCommunityComment(postId, body),
  });
}

export function useDeleteCommunityCommentMutation(postId: string) {
  return useMutation({
    mutationFn: (commentId: string) => deleteCommunityComment(postId, commentId),
  });
}

export function useUserProfileQuery(userId: string) {
  return useQuery({
    queryKey: communityKeys.profile(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}

export function useFollowUserMutation() {
  return useMutation({ mutationFn: followUser });
}

export function useUnfollowUserMutation() {
  return useMutation({ mutationFn: unfollowUser });
}
