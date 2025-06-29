"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";
import { X, User, Calendar } from "lucide-react";
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { getPostById } from '../services/postServices';
import { Post } from '../types/post';
import { addNotification } from '../store/slices/notificationSlice';

interface ModalDetailPostProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | null;
}

export default function ModalDetailPost({
  isOpen,
  onClose,
  postId,
}: ModalDetailPostProps) {
  // ✅ Implementar lógica Redux directamente en el componente
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

  console.log("Modal state:", { isOpen, postId, post, loading });

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black">
            Detalles del Post
          </h3>
          <Button
            isIconOnly
            variant="light"
            onPress={onClose}
            isDisabled={loading}
            className="flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-200 rounded-lg h-10 w-10 transition-colors"
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <ModalBody>
          {loading || !post ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner size="lg" color="default" />
              <p className="mt-4 text-gray-600 font-medium">Cargando detalles del post...</p>
              <p className="mt-1 text-gray-400 text-sm">Por favor espera un momento</p>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>Usuario {post.userId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>ID: {post.id}</span>
                </div>
              </div>

              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  TÍTULO
                </h4>
                <div className="max-h-24 overflow-y-auto">
                  <p className="text-lg font-semibold text-black leading-relaxed">
                    {post.title}
                  </p>
                </div>
              </div>

              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  CONTENIDO
                </h4>
                <div className="max-h-64 overflow-y-auto pr-2">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="flex justify-end w-full">
            <Button
              variant="solid"
              onPress={onClose}
              className="border-gray-700 hover:border-red-400 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
