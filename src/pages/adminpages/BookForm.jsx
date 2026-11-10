import React, { useState } from "react";
import { useProducts } from "../../utils/ProductContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function BookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    publication_year: "",
    isbn: "",
    stock: 1,
    category_id: "",
    synopsis: "",
    cover_img: null,
  });

  const [errors, setErrors] = useState({});
  const { addBook, getCategories } = useProducts();
  const navigate = useNavigate();

  // Ambil daftar kategori untuk dropdown relasi
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      await addBook(data);
      toast.success("Buku baru berhasil didaftarkan!");
      setTimeout(() => navigate("/admin/books"), 1000);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
        toast.error("⚠ Periksa kembali data buku yang dimasukkan.");
      } else {
        toast.error("❌ Gagal menyimpan pendaftaran buku.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
        Form Pendaftaran Buku Baru
      </h2>

      {/* Judul Buku */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Judul Buku
        </label>
        <input
          name="title"
          placeholder="Masukkan judul buku"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${errors.title ? "border-red-500" : ""}`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
        )}
      </div>

      {/* Kategori Buku (Relasi Tabel) */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Kategori Buku
        </label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          className={`border rounded-md p-2 w-full bg-white ${errors.category_id ? "border-red-500" : ""}`}
        >
          <option value="">-- Pilih Kategori --</option>
          {(Array.isArray(categories) ? categories : categories.data || []).map(
            (cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            )
          )}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm mt-1">{errors.category_id[0]}</p>
        )}
      </div>

      {/* Penulis */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Penulis / Pengarang
        </label>
        <input
          name="author"
          placeholder="Nama penulis"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${errors.author ? "border-red-500" : ""}`}
        />
        {errors.author && (
          <p className="text-red-500 text-sm mt-1">{errors.author[0]}</p>
        )}
      </div>

      {/* Penerbit */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Penerbit
        </label>
        <input
          name="publisher"
          placeholder="Nama penerbit"
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${errors.publisher ? "border-red-500" : ""}`}
        />
        {errors.publisher && (
          <p className="text-red-500 text-sm mt-1">{errors.publisher[0]}</p>
        )}
      </div>

      {/* Tahun Terbit & ISBN */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Tahun Terbit
          </label>
          <input
            name="publication_year"
            type="number"
            placeholder="2026"
            onChange={handleChange}
            className={`border rounded-md p-2 w-full ${errors.publication_year ? "border-red-500" : ""}`}
          />
          {errors.publication_year && (
            <p className="text-red-500 text-sm mt-1">
              {errors.publication_year[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">ISBN</label>
          <input
            name="isbn"
            placeholder="978-602-..."
            onChange={handleChange}
            className={`border rounded-md p-2 w-full ${errors.isbn ? "border-red-500" : ""}`}
          />
          {errors.isbn && (
            <p className="text-red-500 text-sm mt-1">{errors.isbn[0]}</p>
          )}
        </div>
      </div>

      {/* Jumlah Stok */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Jumlah Eksemplar / Stok
        </label>
        <input
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          className={`border rounded-md p-2 w-full ${errors.stock ? "border-red-500" : ""}`}
        />
        {errors.stock && (
          <p className="text-red-500 text-sm mt-1">{errors.stock[0]}</p>
        )}
      </div>

      {/* Sinopsis */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          Sinopsis Buku
        </label>
        <textarea
          name="synopsis"
          placeholder="Ringkasan isi buku"
          onChange={handleChange}
          rows="3"
          className="border border-gray-300 rounded-lg p-2 resize-none"
        />
      </div>

      {/* Upload File Cover Buku */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600 mb-1">
          File Cover Buku (Gambar / PDF)
        </label>
        <input
          name="cover_img"
          type="file"
          accept="image/*,.pdf"
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
        />
        {errors.cover_img && (
          <p className="text-red-500 text-sm mt-1">{errors.cover_img[0]}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
      >
        Daftarkan Buku
      </button>
    </form>
  );
}