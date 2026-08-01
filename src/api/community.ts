import { apiClient } from './client';

import type { QueryParams } from './common';
import type {
  CommunityComment,
  CommunityCommentsResponse,
  CommunityPost,
  CommunityPostsResponse,
  CreateCommentRequest,
  CreateCommunityPostRequest,
  LikeResponse,
  PublicUserProfile,
} from './community/types';

export async function listCommunityPosts(params?: QueryParams) {
  const { data } = await apiClient.get<CommunityPostsResponse>('/community/posts', { params });
  return data;
}

export async function createCommunityPost(body: CreateCommunityPostRequest) {
  const { data } = await apiClient.post<CommunityPost>('/community/posts', body);
  return data;
}

export async function getCommunityPost(postId: string) {
  const { data } = await apiClient.get<CommunityPost>(`/community/posts/${postId}`);
  return data;
}

export async function deleteCommunityPost(postId: string) {
  await apiClient.delete(`/community/posts/${postId}`);
}

export async function likeCommunityPost(postId: string) {
  const { data } = await apiClient.post<LikeResponse>(`/community/posts/${postId}/like`);
  return data;
}

export async function unlikeCommunityPost(postId: string) {
  const { data } = await apiClient.delete<LikeResponse>(`/community/posts/${postId}/like`);
  return data;
}

export async function listCommunityComments(postId: string, params?: QueryParams) {
  const { data } = await apiClient.get<CommunityCommentsResponse>(
    `/community/posts/${postId}/comments`,
    { params },
  );
  return data;
}

export async function createCommunityComment(postId: string, body: CreateCommentRequest) {
  const { data } = await apiClient.post<CommunityComment>(
    `/community/posts/${postId}/comments`,
    body,
  );
  return data;
}

export async function deleteCommunityComment(postId: string, commentId: string) {
  await apiClient.delete(`/community/posts/${postId}/comments/${commentId}`);
}

export async function getUserProfile(userId: string) {
  const { data } = await apiClient.get<PublicUserProfile>(`/users/${userId}/profile`);
  return data;
}

export async function followUser(userId: string) {
  await apiClient.post(`/users/${userId}/follow`);
}

export async function unfollowUser(userId: string) {
  await apiClient.delete(`/users/${userId}/follow`);
}
