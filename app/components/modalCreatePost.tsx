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
} from "@nextui-org/react";
import { X, Save, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreatePost, useUpdatePost } from "../hooks/usePosts";
import { Post } from "../types/post";

interface ModalCreatePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback para refrescar la tabla
  postToEdit?: Post | null; // Si existe, es edición; si no, es creación
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
  const { create, loading: createLoading } = useCreatePost();
  const { submitUpdate, loading: updateLoading } = useUpdatePost();
  
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
  const loading = createLoading || updateLoading;
  const titleLength = watch("title")?.length || 0;

  // Cargar datos del post a editar cuando se abre el modal
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
      if (isEditing && postToEdit) {
        await submitUpdate(postToEdit.id, {
          title: data.title,
          body: data.body,
        });
      } else {
        await create({
          title: data.title,
          body: data.body,
          userId: 1, // Siempre enviar userId como 1
        });
      }
      
      onSuccess(); // Refrescar la tabla
      onClose(); // Cerrar modal
    } catch (error) {
      console.error("Error al guardar post:", error);
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
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      placement="center"
      hideCloseButton={true}
      isDismissable={!loading}
      isKeyboardDismissDisabled={loading}
      classNames={{
        backdrop: "bg-black/50 backdrop-blur-sm",
        base: "border-0 bg-white shadow-xl rounded-2xl mx-4 sm:mx-8",
        header: "border-b border-gray-200 bg-white px-8 py-4",
        body: "px-8 py-6",
        footer: "border-t border-gray-200 bg-gray-50/50 px-8 py-4",
      }}
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
            onClick={handleClose}
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
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Título del Post *
                    </label>
                    <span className={`text-xs ${titleLength > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                      {titleLength}/50
                    </span>
                  </div>
                  <Input
                    {...register("title", {
                      required: "El título es requerido",
                      maxLength: {
                        value: 50,
                        message: "El título no puede tener más de 50 caracteres"
                      },
                      minLength: {
                        value: 3,
                        message: "El título debe tener al menos 3 caracteres"
                      }
                    })}
                    placeholder="Ingresa un título llamativo y descriptivo"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "text-black py-2 px-4 outline-none focus:outline-none",
                      inputWrapper: `ring-0 focus:ring-0 focus-visible:ring-0 outline-none focus:outline-none ${
                        errors.title ? 'border-red-500' : ''
                      }`,
                    }}
                  />
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
                        placeholder="Escribe aquí el contenido completo de tu post. Puedes usar múltiples párrafos para organizar mejor la información..."
                        isInvalid={!!errors.body}
                        errorMessage={errors.body?.message}
                        variant="bordered"
                        minRows={6}
                        maxRows={12}
                        classNames={{
                            input: "bg-transparent border-0 p-0 text-sm text-gray-700 leading-relaxed shadow-none",
                            inputWrapper: `bg-transparent border-0 ring-0 focus:ring-0 focus-visible:ring-0 outline-none ${
                                errors.body ? 'border-red-500' : ''
                            }`,
                        }}
                    />
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="gap-3 justify-end">
            <Button
              type="button"
              variant="bordered"
              onClick={handleClose}
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