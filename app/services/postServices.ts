import { Post } from "../types/post";
import { apiPost } from "./axiosInstance";

export const getPosts = async (
  page: number = 1,
  limit: number = 10,
  query?: string
): Promise<Post[]> => {
  const params = new URLSearchParams();
  params.append("_page", page.toString());
  params.append("_limit", limit.toString());
  if (query) {
    params.append("q", query);
  }
  const res = await apiPost.get(`/posts?${params.toString()}`);
  return res.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const res = await apiPost.get(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data: Post): Promise<Post> => {
  const res = await apiPost.post(`/posts`, data);
  return res.data;
};

export const updatePost = async (
  id: number,
  data: Partial<Post>
): Promise<Post> => {
  const res = await apiPost.put(`/posts/${id}`, data);
  return res.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await apiPost.delete(`/posts/${id}`);
};
