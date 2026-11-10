import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function BookList() {
  const { getBooks, deleteBook } = useProducts();
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
  });

  const fetchBooksData = async (currentPage = 1, searchQuery = "") => {
    try {
      const res = await getBooks({ page: currentPage, search: searchQuery });
      setBooks(res.data || []);
      setPagination({
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total,
      });
    } catch (error) {
      console.error("Gagal memuat data buku:", error);
    }
  };

  useEffect(() => {
    fetchBooksData(page, search);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooksData(1, search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      await deleteBook(id);
      toast.success("Buku berhasil dihapus");
      fetchBooksData(page, search);
    } catch (error) {
      toast.error("Gagal menghapus buku");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">
          Daftar Buku Perpustakaan
        </h2>
        <Link
          to="/admin/books/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Pendaftaran Buku Baru
        </Link>
      </div>

      {/* Form Pencarian */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari judul, penulis, atau ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          Cari
        </button>
      </form>

      {/* Tabel Data Buku */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Cover</th>
              <th className="border p-2">Judul</th>
              <th className="border p-2">Penulis</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2">ISBN</th>
              <th className="border p-2">Tahun</th>
              <th className="border p-2">Stok</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.book_id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {book.cover_img ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${book.cover_img}`}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2 font-medium">{book.title}</td>
                  <td className="border p-2">{book.author}</td>
                  <td className="border p-2">{book.category?.name || "-"}</td>
                  <td className="border p-2">{book.isbn}</td>
                  <td className="border p-2">{book.publication_year}</td>
                  <td className="border p-2">{book.stock}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDelete(book.book_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  Belum ada data buku.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Navigasi Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Halaman {pagination.current_page} dari {pagination.last_page} (Total:{" "}
          {pagination.total} buku)
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            disabled={page >= pagination.last_page}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}