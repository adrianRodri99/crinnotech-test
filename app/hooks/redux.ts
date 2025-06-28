import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { useCallback } from 'react';
import type { RootState, AppDispatch } from '../store/store';
import { 
  setPosts, 
  addPost, 
  updatePost, 
  deletePost, 
  setSelectedPost 
} from '../store/slices/postsSlice';
import { 
  addNotification, 
  removeNotification, 
  clearAllNotifications 
} from '../store/slices/notificationSlice';
import { 
  getPosts,
  createPost, 
  updatePost as updatePostAPI, 
  deletePost as deletePostAPI,
//   getPostById 
} from '../services/postServices';
import { Post } from '../types/post';

// Hook personalizado para useDispatch con tipos
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook personalizado para useSelector con tipos
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook para manejar posts con Redux
export const usePostsRedux = () => {
  const dispatch = useAppDispatch();
  const { posts, selectedPost } = useAppSelector(state => state.posts);
  
  // Cargar posts desde la API
  const loadPosts = useCallback(async (page: number = 1, limit: number = 10, searchQuery?: string) => {
    try {
      dispatch(addNotification({
        type: 'info',
        title: 'Cargando posts...',
        message: 'Obteniendo datos del servidor',
        duration: 2000
      }));

      const data = await getPosts(page, limit, searchQuery);
      
      dispatch(setPosts(data));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Posts cargados',
        message: `Se cargaron ${data.length} posts correctamente`,
        duration: 3000
      }));
    } catch (error) {
      console.error('Error loading posts:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error al cargar posts',
        message: 'No se pudieron cargar los posts del servidor',
        duration: 5000
      }));
    }
  }, [dispatch]);

  // Crear nuevo post
  const createNewPost = useCallback(async (postData: { title: string; body: string; userId: number }) => {
    try {
      const newPost = await createPost(postData as Post);
      dispatch(addPost(newPost));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Post creado',
        message: 'El post se creó correctamente',
        duration: 3000
      }));
      
      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error al crear post',
        message: 'No se pudo crear el post',
        duration: 5000
      }));
      throw error;
    }
  }, [dispatch]);

  // Actualizar post existente
  const updateExistingPost = useCallback(async (id: number, postData: { title: string; body: string }) => {
    try {
      const updatedPost = await updatePostAPI(id, postData);
      dispatch(updatePost(updatedPost));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Post actualizado',
        message: 'Los cambios se guardaron correctamente',
        duration: 3000
      }));
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating post:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error al actualizar',
        message: 'No se pudieron guardar los cambios',
        duration: 5000
      }));
      throw error;
    }
  }, [dispatch]);

  // Eliminar post
  const removePost = useCallback(async (id: number) => {
    try {
      await deletePostAPI(id);
      dispatch(deletePost(id));
      
      dispatch(addNotification({
        type: 'success',
        title: 'Post eliminado',
        message: 'El post se eliminó correctamente',
        duration: 3000
      }));
    } catch (error) {
      console.error('Error deleting post:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Error al eliminar',
        message: 'No se pudo eliminar el post',
        duration: 5000
      }));
      throw error;
    }
  }, [dispatch]);

  // Seleccionar post para modal
  const selectPost = useCallback((post: Post | null) => {
    dispatch(setSelectedPost(post));
  }, [dispatch]);

  return {
    posts,
    selectedPost,
    loadPosts,
    createNewPost,
    updateExistingPost,
    removePost,
    selectPost
  };
};

// Hook para manejar notificaciones
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.notifications);

  const showNotification = useCallback((notification: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  const hideNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearAllNotifications());
  }, [dispatch]);

  return {
    notifications,
    showNotification,
    hideNotification,
    clearAll
  };
};
