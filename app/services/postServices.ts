import { Post } from '../types/post';
import { apiPost } from './axiosInstance';

export const getPosts = async (page: number = 1, limit: number = 10): Promise<Post[]> => {
    const res = await apiPost.get(`/posts?_page=${page}&_limit=${limit}`);
    return res.data;
};

export const searchPosts = async (query: string, page: number = 1, limit: number = 10): Promise<Post[]> => {
    const res = await apiPost.get(`/posts?q=${query}&_page=${page}&_limit=${limit}`);
    return res.data;
};
