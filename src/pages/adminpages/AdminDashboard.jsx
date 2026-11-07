import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// import { confirmDeleteToast } from "../../components/confirmDeleteToast";
// import ProductSearchBar from "../../components/productSearchBar";
import { useProducts } from "../../utils/ProductContext";

//nama komponen
export default function AdminDashboard() {
  const { products: contextProducts, isLoading, isError, deleteProduct, getProducts, getCategories } = useProducts();

  // State untuk Pagination dan Filter
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [categoryId, setCategoryId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterParams, setFilterParams] = useState({ category_id: "", keyword: "" });

  // Fetch data kategori untuk Select filter
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Fetch data produk dengan Pagination & Filter
  const { data: paginatedProducts } = useQuery({
    queryKey: ["products", page, limit, filterParams.category_id, filterParams.keyword],
    queryFn: () =>
      getProducts({
        page,
        limit,
        category_id: filterParams.category_id,
        keyword: filterParams.keyword,
      }),
  });

  // Gunakan data hasil filter/pagination jika tersedia, atau fallback ke products awal
  const products = Array.isArray(paginatedProducts)
    ? paginatedProducts
    : paginatedProducts?.data || contextProducts;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading products.</p>;
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?",
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus produk.");
    }
  };
  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setPage(1);
    setFilterParams({ category_id: categoryId, keyword: keyword });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Manajemen Produk</h1>

      {/* Search & Filter Panel + Tombol Tambah Produk */}
      <div className="mb-4 flex justify-between items-center">
        <form onSubmit={handleSearch} className="flex gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          >
            <option value="">Semua Kategori</option>
            {(Array.isArray(categories) ? categories : categories?.data || []).map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cari produk..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
          >
            Cari
          </button>
        </form>

        <a
          href="/admin/add-product"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium"
        >
          + Tambah Produk
        </a>
      </div>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">#</th>
            <th>Image</th>
            <th className="p-2 border">Nama</th>
            <th className="p-2 border">Harga</th>
            <th className="p-2 border">Stok</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p, index) => (
            <tr key={p.id}>
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={p.img_url}
                  alt={p.name}
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="p-2 border">
                {p.name} <br />
                <small className="text-gray-500">#{p.category?.name}</small>
              </td>
              <td className="p-2 border">Rp. {p.price}</td>
              <td className="p-2 border">{p.stock}</td>
              <td className="p-2 border space-x-2">
                <Link
                  to={`/admin/edit-product/${p.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="cursor-pointer text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Control */}
      <div className="flex justify-center items-center gap-1 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Sebelumnya
        </button>

        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-3 py-1 border rounded text-sm ${
              page === num
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}