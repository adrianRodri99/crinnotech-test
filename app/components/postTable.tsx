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
} from "@nextui-org/react";
import { Search, Edit3, Trash2 } from "lucide-react";
import { usePosts } from "../hooks/usePosts";

export default function PostTable() {
  const { posts, page, setPage, loading, searchQuery, handleSearch } = usePosts(
    1,
    5
  );

  const handleEdit = (postId: number) => {
    console.log("Editando post:", postId);
  };

  const handleDelete = (postId: number) => {
    console.log("Eliminando post:", postId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header - Always visible */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">Posts</h1>
        <p className="text-gray-600">Gestiona y visualiza todos los posts</p>
      </div>

      {/* Search Bar - Always visible */}
      <div className="mb-6 flex items-center bg-white border border-gray-200 rounded-lg shadow-sm w-4/12">
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
                        onClick={() => handleEdit(post.id)}
                        className="text-gray-500 hover:text-black hover:bg-gray-100 transition-all duration-200 min-w-unit-8 h-8 rounded-md"
                      >
                        <Edit3 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={() => handleDelete(post.id)}
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

      {/* Pagination - Only show when not loading */}
      {!loading && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600">
              Mostrando {posts.length} posts en la página {page}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="bordered"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              isDisabled={page === 1}
              className="border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black transition-colors"
            >
              Anterior
            </Button>
            <span className="text-sm font-medium text-black px-3">{page}</span>
            <Button
              size="sm"
              variant="bordered"
              onClick={() => setPage((p) => p + 1)}
              isDisabled={posts.length < 5}
              className="border-gray-300 hover:border-gray-500 text-gray-700 hover:text-black transition-colors"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
