"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  postTitle?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que quieres eliminar este elemento?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
  postTitle,
}: ConfirmDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      backdrop="blur"
      placement="center"
      hideCloseButton={true}
      isDismissable={!isLoading}
      isKeyboardDismissDisabled={isLoading}
      classNames={{
        backdrop: "bg-black/40 backdrop-blur-sm",
        base: "border-0 bg-white shadow-lg rounded-4xl mx-4",
        header: "border-b border-gray-200 bg-white px-6 py-3",
        body: "px-6 py-4",
        footer: "border-t border-gray-100 bg-white px-6 py-3",
        wrapper: "z-[10000] fixed inset-0 flex items-center justify-center p-4",
      }}
    >
      <ModalContent >
        <ModalHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={handleCancel}
            isDisabled={isLoading}
            className="flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-200 rounded-lg h-10 w-10 transition-colors"
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              {message}
            </p>
            
            {postTitle && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Post:</p>
                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                  &quot;{postTitle}&quot;
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={16} />
              <p className="text-red-700 text-xs">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="gap-2 justify-end">
          <Button
            variant="bordered"
            onPress={handleCancel}
            isDisabled={isLoading}
            size="md"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 h-9 rounded-lg transition-all duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onPress={handleConfirm}
            isLoading={isLoading}
            isDisabled={isLoading}
            size="md"
            className="flex items-center gap-1.5 font-medium px-4 h-9 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
          >
            {!isLoading && <Trash2 size={14} />}
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
