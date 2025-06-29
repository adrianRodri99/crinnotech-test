"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Spinner,
} from "@heroui/react";
import { X, Save, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePostsRedux } from "../hooks/redux";
import { Post } from "../types/post";

interface ModalCreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  postToEdit?: Post | null;
}

interface FormData {
  title: string;
  body: string;
}

export default function ModalCreatePost({
  isOpen,
  onClose,
  onSuccess,
  postToEdit,
}: ModalCreatePostProps) {

  const { createNewPost, updateExistingPost } = usePostsRedux();
  

  const [loading, setLoading] = useState(false);
  
  console.log("🎨 ModalCreatePost render - isOpen:", isOpen, "postToEdit:", postToEdit);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      body: "",
    }
  });

  const isEditing = !!postToEdit;
  const titleLength = watch("title")?.length || 0;

  
  useEffect(() => {
    if (isOpen && postToEdit) {
      setValue("title", postToEdit.title);
      setValue("body", postToEdit.body);
    } else if (isOpen && !postToEdit) {
      reset({
        title: "",
        body: "",
      });
    }
  }, [isOpen, postToEdit, setValue, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      
      if (isEditing && postToEdit) {
        // ✅ Usar Redux para actualizar - incluye notificaciones automáticas
        await updateExistingPost(postToEdit.id, {
          title: data.title,
          body: data.body,
        });
      } else {

        await createNewPost({
          title: data.title,
          body: data.body,
          userId: 1,
        });
      }
      
      onSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Error al guardar post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      hideCloseButton={true}
      isDismissable={!loading}
      isKeyboardDismissDisabled={loading}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isEditing ? 'bg-blue-50' : 'bg-green-50'}`}>
              {isEditing ? (
                <Save className="text-blue-600" size={20} />
              ) : (
                <Plus className="text-green-600" size={20} />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditing ? "Editar Post" : "Crear Post"}
              </h3>
              <p className="text-sm text-gray-500">
                {isEditing ? "Modifica los datos del post" : "Completa la información para crear un nuevo post"}
              </p>
            </div>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={handleClose}
            isDisabled={loading}
            className="flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-200 rounded-lg h-10 w-10 transition-colors"
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Spinner size="lg" color="primary" />
                  <p className="mt-3 text-gray-600 font-medium">
                    {isEditing ? "Actualizando post..." : "Creando post..."}
                  </p>
                </div>
              </div>
            )}

            {!loading && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Título del Post *
                    </label>
                    <span className={`text-xs font-medium ${
                      titleLength > 50 
                        ? 'text-red-500' 
                        : titleLength > 40 
                        ? 'text-orange-500' 
                        : 'text-gray-400'
                    }`}>
                      {titleLength}/50
                    </span>
                  </div>
                  <Input
                    {...register("title", {
                      required: "El título es requerido",
                      maxLength: {
                        value: 50,
                        message: "El título no puede exceder los 50 caracteres"
                      },
                      minLength: {
                        value: 3,
                        message: "El título debe tener al menos 3 caracteres"
                      }
                    })}
                    placeholder="Escribe un título atractivo para tu post"
                    isInvalid={!!errors.title}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-black py-2 px-4 outline-none focus:outline-none",
                      inputWrapper: `ring-0 focus:ring-0 focus-visible:ring-0 outline-none focus:outline-none ${
                        errors.title ? 'border-red-500' : ''
                      }`,
                    }}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Contenido del Post *
                  </label>
                  <Textarea
                    {...register("body", {
                      required: "El contenido es requerido",
                      minLength: {
                        value: 10,
                        message: "El contenido debe tener al menos 10 caracteres"
                      }
                    })}
                    placeholder="Escribe aquí el contenido completo de tu post. Puedes incluir detalles, descripción y toda la información relevante..."
                    isInvalid={!!errors.body}
                    variant="bordered"
                    minRows={6}
                    maxRows={12}
                    classNames={{
                      input: "text-black py-2 px-4 outline-none focus:outline-none",
                      inputWrapper: `ring-0 focus:ring-0 focus-visible:ring-0 outline-none focus:outline-none ${
                        errors.body ? 'border-red-500' : ''
                      }`,
                    }}
                  />
                  {errors.body && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.body.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="gap-3 justify-end">
            <Button
              type="button"
              variant="bordered"
              onPress={handleClose}
              isDisabled={loading}
              size="lg"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium px-6 h-11 rounded-lg transition-all duration-200"
            >
              Cancelar
            </Button>
            <Button
                type="submit"
                isLoading={loading}
                isDisabled={loading || !isValid}
                size="lg"
                className={`flex items-center gap-2 font-medium px-6 h-11 rounded-lg text-white transition-all duration-200 shadow-sm ${
                    isEditing 
                        ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' 
                        : 'bg-green-600 hover:bg-green-700 hover:shadow-md'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {!loading && (isEditing ? <Save size={18} /> : <Plus size={18} />)}
                {isEditing ? "Actualizar Post" : "Crear Post"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}