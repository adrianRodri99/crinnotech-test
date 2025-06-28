"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Spinner,
} from "@heroui/react";
import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import { Post } from "../types/post";
import { usePostsRedux } from "../hooks/redux";
import ModalDetailPost from "./modalDetailPost";
import ModalCreatePost from "./modalCreatePost";

export default function PostTable() {
  // Redux hooks
  const { 
    posts, 
    // selectedPost, 
    loadPosts, removePost, 
    // selectPost 
  } = usePostsRedux();
  
  // Estado local para UI
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  
  // Estado para modales
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  // Cargar posts cuando cambian los parámetros
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadPosts(page, limit, debouncedSearchQuery);
      setLoading(false);
    };
    fetchData();
  }, [page, limit, debouncedSearchQuery, loadPosts]);

  // Funciones de manejo
  const handleEdit = (post: Post) => {
    console.log("Editando post:", post.id);
    setPostToEdit(post);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (postId: number) => {
    console.log("Eliminando post:", postId);
    if (window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        setDeleteLoading(true);
        await removePost(postId);
        // Los posts se actualizan automáticamente en Redux
      } catch (error) {
        console.error("Error al eliminar post:", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleViewDetails = (postId: number) => {
    console.log("Opening modal for post:", postId);
    setSelectedPostId(postId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    console.log("Closing detail modal");
    setIsDetailModalOpen(false);
    setSelectedPostId(null);
  };

  const handleOpenCreateModal = () => {
    console.log("Opening create modal");
    setPostToEdit(null);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    console.log("Closing create modal");
    setIsCreateModalOpen(false);
    setPostToEdit(null);
  };

  const handleCreateSuccess = async () => {
    console.log("Post created/updated successfully");
    // Recargar posts después de crear/editar
    await loadPosts(page, limit, debouncedSearchQuery);
  };

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

  const limitOptions = [
    { value: "5", label: "5 por página" },
    { value: "10", label: "10 por página" },
    { value: "15", label: "15 por página" },
    { value: "20", label: "20 por página" },
    { value: "50", label: "50 por página" },
    { value: "100", label: "100 por página" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header - Always visible */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Posts</h1>
        <p className="text-gray-600">Gestiona y visualiza todos los posts</p>
      </div>

      {/* Search Bar and Create Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm w-full sm:w-4/12">
          <Search className="text-gray-400 ml-3" size={18} />
          <Input
            placeholder="Buscar posts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
            classNames={{
              input: "text-black py-2 px-4 outline-none focus:outline-none",
              inputWrapper: 'ring-0 focus:ring-0 focus-visible:ring-0 outline-none focus:outline-none',
            }}
          />
        </div>

        <Button
          onPress={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 cursor-pointer rounded-md shadow transition-colors"
        >
          <Plus size={20} className="text-black" />
          <span className="text-black text-base font-semibold">
            <span className="hidden sm:inline">Crear Post</span>
          </span>
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-h-[400px] relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
            <Spinner size="lg" color="default" />
            <p className="mt-4 text-gray-600">Cargando posts...</p>
          </div>
        ) : (
          <Table
            aria-label="Tabla de posts"
            removeWrapper
            classNames={{
              th: "bg-gray-100 text-black font-semibold border-b border-gray-200",
              td: "border-b border-gray-100",
              tbody: "divide-y divide-gray-100",
            }}
          >
            <TableHeader>
              <TableColumn className="py-4 px-6">TÍTULO</TableColumn>
              <TableColumn className="py-4 px-6 hidden sm:table-cell">
                CONTENIDO
              </TableColumn>
              <TableColumn className="py-4 px-6 text-center w-32">
                ACCIONES
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-gray-500 text-lg">
                    {searchQuery
                      ? "No se encontraron posts"
                      : "No hay posts disponibles"}
                  </p>
                  {searchQuery && (
                    <p className="text-gray-400 text-sm mt-1">
                      Intenta con otros términos de búsqueda
                    </p>
                  )}
                </div>
              }
            >
              {posts.map((post) => (
                <TableRow
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col">
                      <p className="font-medium text-black text-sm leading-5">
                        {post.title}
                      </p>
                      <p className="text-gray-500 text-sm mt-1 sm:hidden">
                        {post.body.slice(0, 50)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 hidden sm:table-cell">
                    <p className="text-gray-700 text-sm max-w-xs line-clamp-2">
                      {post.body.slice(0, 120)}...
                    </p>
                  </TableCell>
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => handleViewDetails(post.id)}
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 min-w-unit-8 h-8 rounded-md"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        isIconOnly
                        variant="light"
                        onPress={() => handleEdit(post)}
                        className="text-gray-500 hover:text-black hover:bg-gray-100 transition-all duration-200 min-w-unit-8 h-8 rounded-md"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onPress={() => handleDelete(post.id)}
                        isLoading={deleteLoading}
                        isDisabled={deleteLoading}
                        isIconOnly
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 min-w-unit-8 h-8 rounded-md"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Enhanced Pagination with Limit Selector - Only show when not loading */}
      {!loading && (
        <div className="flex flex-col space-y-4 mt-6">
          {/* Limit Selector */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Mostrar:</span>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 cursor-pointer shadow-sm"
                >
                  {limitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronRight size={14} className="text-gray-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-600 order-2 lg:order-1">
              <span>
                Mostrando {posts.length} posts en la página {page}
              </span>
            </div>
            
            <div className="flex items-center gap-2 order-1 lg:order-2">
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setPage((p) => Math.max(p - 1, 1))}
                isDisabled={page === 1}
                className="border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Anterior</span>
              </Button>
              
              <div className="flex items-center gap-2 mx-2">
                <span className="text-sm text-gray-500">Página</span>
                <div className="flex items-center justify-center min-w-[32px] h-8 bg-black text-white text-sm font-medium rounded-md px-2">
                  {page}
                </div>
              </div>
              
              <Button
                size="sm"
                variant="bordered"
                onPress={() => setPage((p) => p + 1)}
                isDisabled={posts.length < limit}
                className="border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ModalDetailPost
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        postId={selectedPostId}
      />
      
      <ModalCreatePost
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={handleCreateSuccess}
        postToEdit={postToEdit}
      />
      
      
    </div>
  );
}
