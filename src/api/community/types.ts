import type { ID, ISODateTime, PaginatedResponse } from '../common';

export type CommunityAuthor = {
  user_id: ID;
  nickname: string;
  avatar_url: string;
};

export type TaggedPlace = {
  place_id: ID;
  canonical_name: string;
  category: string;
  thumbnail_url: string;
};

export type TaggedItinerary = {
  itinerary_id: ID;
  title: string;
};

export type CommunityPost = {
  post_id: ID;
  author: CommunityAuthor;
  content: string;
  tagged_places: TaggedPlace[];
  tagged_itinerary: TaggedItinerary | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  created_at: ISODateTime;
};

export type CommunityPostsResponse = PaginatedResponse<CommunityPost>;

export type CreateCommunityPostRequest = {
  content: string;
  tagged_place_ids?: ID[];
  tagged_itinerary_id?: ID;
};

export type LikeResponse = {
  like_count: number;
};

export type CommunityComment = {
  comment_id: ID;
  author: CommunityAuthor;
  content: string;
  created_at: ISODateTime;
};

export type CommunityCommentsResponse = PaginatedResponse<CommunityComment>;

export type CreateCommentRequest = {
  content: string;
};

export type PublicUserProfile = CommunityAuthor & {
  follower_count: number;
  following_count: number;
  post_count: number;
  is_following: boolean;
};
