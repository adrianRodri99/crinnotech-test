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
  Select,
  SelectItem,
} from "@heroui/react";
import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, Eye, Plus, ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import { Post } from "../types/post";
import { usePostsRedux } from "../hooks/redux";
import ModalDetailPost from "./modalDetailPost";
import ModalCreatePost from "./modalCreatePost";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function PostTable() {

  const { 
    posts, 
    loadPosts, 
    removePost, 
  } = usePostsRedux();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  
  // Estado para ordenamiento
  const [sortField, setSortField] = useState<keyof Post | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  

  const [deleteLoading, setDeleteLoading] = useState(false);
  

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const sortPosts = (posts: Post[]) => {
    if (!sortField) return posts;
    
    return [...posts].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Convertir a string para comparación consistente
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedPosts = sortPosts(posts);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadPosts(page, limit, debouncedSearchQuery);
      setLoading(false);
    };
    fetchData();
  }, [page, limit, debouncedSearchQuery, loadPosts]);

  const handleEdit = (post: Post) => {
    console.log("Editando post:", post.id);
    setPostToEdit(post);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (post: Post) => {
    console.log("Solicitando eliminación de post:", post.id);
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    
    try {
      setDeleteLoading(true);
      await removePost(postToDelete.id);

      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error al eliminar post:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const handleSort = (field: keyof Post) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Post) => {
    if (sortField !== field) {
      return (
        <span className="flex flex-col items-center opacity-30">
          <ArrowUp size={10} className="mb-0.5" />
          <ArrowDown size={10} />
        </span>
      );
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="text-blue-600" size={14} />
      : <ArrowDown className="text-blue-600" size={14} />;
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
    setIsCreateModalOpen(false);
    setPostToEdit(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query !== searchQuery) {
      setPage(1);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
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
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Posts</h1>
        <p className="text-gray-600">Gestiona y visualiza todos los posts</p>
      </div>


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
              <TableColumn className="py-4 px-6 hidden sm:table-cell">
                <button
                  onClick={() => handleSort('userId')}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer font-semibold"
                >
                  USUARIO
                  {getSortIcon('userId')}
                </button>
              </TableColumn>
              <TableColumn className="py-4 px-6">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer font-semibold"
                >
                  TÍTULO
                  {getSortIcon('title')}
                </button>
              </TableColumn>
              <TableColumn className="py-4 px-6 hidden sm:table-cell">
                <button
                  onClick={() => handleSort('body')}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer font-semibold"
                >
                  CONTENIDO
                  {getSortIcon('body')}
                </button>
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
              {sortedPosts.map((post) => (
                <TableRow
                  key={post.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-4 px-6 hidden sm:table-cell">
                    <p className="text-gray-700 text-sm max-w-xs line-clamp-2">
                      Usuario: {post.userId}
                    </p>
                  </TableCell>
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
                        onPress={() => handleDelete(post)}
                        // isLoading={deleteLoading}
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

      {!loading && (
        <div className="flex flex-col space-y-4 mt-6">

          
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Mostrar:</span>
              <Select
                selectedKeys={[limit.toString()]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  handleLimitChange(parseInt(selected));
                }}
                size="sm"
                variant="bordered"
                classNames={{
                  base: "w-40",
                  trigger: "h-9 min-h-unit-9 bg-white border-gray-300 hover:border-gray-400 data-[hover=true]:border-gray-400 data-[focus=true]:border-black data-[focus=true]:ring-2 data-[focus=true]:ring-black/20 transition-all duration-200",
                  value: "text-sm text-gray-700 font-medium",
                  selectorIcon: "text-gray-400",
                  popoverContent: "bg-white border border-gray-200 shadow-lg",
                  listbox: "p-0",
                }}
                placeholder="Seleccionar"
                aria-label="Posts por página"
              >
                {limitOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    classNames={{
                      base: "  data-[selected=true]:bg-black data-[selected=true]:text-white",
                      title: "text-sm font-medium",
                    }}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          


          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-600 order-2 lg:order-1">
              <span>
                Mostrando {sortedPosts.length} posts en la página {page}
                {sortField && (
                    <span className="ml-2 text-blue-600 text-xs">
                    (ordenado por {sortField === 'userId' ? 'usuario' : sortField === 'title' ? 'título' : 'contenido'} {sortDirection === 'asc' ? 'ascendentemente' : 'descendentemente'})
                    </span>
                )}
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
                isDisabled={sortedPosts.length < limit}
                className="border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

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

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Eliminar Post"
        message="¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer."
        postTitle={postToDelete?.title}
        confirmText="Eliminar Post"
        cancelText="Cancelar"
      />
      
      
    </div>
  );
}
