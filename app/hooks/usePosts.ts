import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Post } from '../types/post';
import { getPosts, searchPosts } from '../services/postServices';

export const usePosts = (initialPage = 1, limit = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(initialPage);
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

  return {
    posts,
    page,
    setPage,
    loading,
    searchQuery,
    handleSearch,
  };
};
