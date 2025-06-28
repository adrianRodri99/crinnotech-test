import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from './redux';
import { getPostById } from '../services/postServices';
import { Post } from '../types/post';
import { addNotification } from '../store/slices/notificationSlice';

// Hook para modal de detalles usando Redux
export const usePostDetails = (postId: number | null) => {
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) {
      setPost(null);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      try {
        const postData = await getPostById(postId);
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
        dispatch(addNotification({
          type: 'error',
          title: 'Error al cargar post',
          message: 'No se pudo cargar los detalles del post',
          duration: 5000
        }));
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, dispatch]);

  return { post, loading };
};

// Hook para modal de crear/editar usando Redux
export const usePostForm = () => {
  const dispatch = useAppDispatch();
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const createPost = useCallback(async (data: { title: string; body: string; userId: number }) => {
    setCreateLoading(true);
    try {
      // Importar dinámicamente para evitar dependencias circulares
    //   const { usePostsRedux } = await import('./redux');
      // Esta lógica se moverá al hook usePostsRedux
      dispatch(addNotification({
        type: 'info',
        title: 'Creando post...',
        message: 'Guardando en el servidor',
        duration: 2000
      }));
      
      // Aquí deberías llamar a la función createNewPost del usePostsRedux
      return data; // temporal
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error al crear post',
        message: 'No se pudo crear el post',
        duration: 5000
      }));
      throw error;
    } finally {
      setCreateLoading(false);
    }
  }, [dispatch]);

  const updatePost = useCallback(async (id: number, data: { title: string; body: string }) => {
    setUpdateLoading(true);
    try {
      dispatch(addNotification({
        type: 'info',
        title: 'Actualizando post...',
        message: 'Guardando cambios',
        duration: 2000
      }));
      
      // Aquí deberías llamar a la función updateExistingPost del usePostsRedux
      return data; // temporal
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Error al actualizar',
        message: 'No se pudieron guardar los cambios',
        duration: 5000
      }));
      throw error;
    } finally {
      setUpdateLoading(false);
    }
  }, [dispatch]);

  return {
    createPost,
    updatePost,
    createLoading,
    updateLoading,
    loading: createLoading || updateLoading
  };
};
