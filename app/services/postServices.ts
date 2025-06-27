import { Post } from "../types/post";
import { apiPost } from "./axiosInstance";

export const getPosts = async (
  page: number = 1,
  limit: number = 10
): Promise<Post[]> => {
  const res = await apiPost.get(`/posts?_page=${page}&_limit=${limit}`);
  return res.data;
};

export const searchPosts = async (
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<Post[]> => {
  const res = await apiPost.get(
    `/posts?q=${query}&_page=${page}&_limit=${limit}`
  );
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
