import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';

import { Post } from '../types/post';
import { createPost, deletePost, getPostById, getPosts, searchPosts, updatePost } from '../services/postServices';

export const usePosts = (initialPage = 1, initialLimit = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debounce the search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = debouncedSearchQuery.trim() 
        ? await searchPosts(debouncedSearchQuery, page, limit)
        : await getPosts(page, limit);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearchQuery, limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query !== searchQuery) {
      setPage(1); // Reset to first page when searching
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

  return {
    posts,
    page,
    setPage,
    limit,
    setLimit: handleLimitChange,
    loading,
    searchQuery,
    handleSearch,
    refetch: fetchPosts, // Añadir función de refetch
  };
};

export const usePostById = (id: number | null) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPostById(id).then(data => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  return { post, loading };
};

export const useUpdatePost = () => {
  const [loading, setLoading] = useState(false);

  const submitUpdate = async (id: number, data: { title: string; body: string }) => {
    setLoading(true);
    try {
      await updatePost(id, data);
      // toast.success('Post actualizado correctamente');
    } catch (err) {
      console.log('error al actualizar el post:', err);
      
      // toast.error('Error al actualizar el post');
    } finally {
      setLoading(false);
    }
  };

  return { submitUpdate, loading };
};

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);

  const create = async (data: { title: string; body: string; userId: number }) => {
    setLoading(true);
    try {
      const newPost = await createPost(data as Post);
      // toast.success('Post creado correctamente');
      return newPost;
    } catch (err) {
      console.error('Error al crear el post:', err);
      // toast.error('Error al crear el post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
};

export const useDeletePost = () => {
  const [loading, setLoading] = useState(false);

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await deletePost(id);
      // toast.success('Post eliminado');
    } catch (err) {
      console.error('Error al eliminar el post:', err);
      // toast.error('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};

