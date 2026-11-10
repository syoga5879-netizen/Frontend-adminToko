import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Buat konteks
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // GET ALL PRODUCTS
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/products");
      return res.data.data;
    },
  });

  // SHOW PRODUCT DETAIL
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  };

  // STORE PRODUCT
  const addProduct = async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // UPDATE PRODUCT
  // const updateProduct = async (id, formData) => {
  //   try {
  //     const response = await apiClient.post(`/products/${id}?_method=PUT`, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     queryClient.invalidateQueries(["products"]);
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const updateProduct = async (id, formData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "application/json" }, // atau multipart/form-data jika pakai FormRequest Laravel
    });
    queryClient.invalidateQueries(["products"]);
    return response;
  } catch (error) {
    throw error;
  }
  };

  // DELETE PRODUCT
  const deleteProduct = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // SHOW CATEGORY DETAIL
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return res.data.data; // <-- Ubah dari res.data menjadi res.data.data
  };

  // 1. Ambil daftar buku (mendukung parameter page & search)
const getBooks = async ({ page = 1, search = "" } = {}) => {
  const response = await apiClient.get(`/books?page=${page}&search=${search}`);
  return response.data;
};

// 2. Tambah buku baru (dengan FormData untuk upload file)
const addBook = async (formData) => {
  const response = await apiClient.post("/books", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 3. Hapus buku
const deleteBook = async (id) => {
  const response = await apiClient.delete(`/books/${id}`);
  return response.data;
};

  // GET PRODUCTS (PAGINATION & FILTER)
  const getProducts = async ({ page = 1, limit = 10, category_id = "", keyword = "" }) => {
    const res = await apiClient.get(`/products?page=${page}&limit=${limit}&category_id=${category_id}&keyword=${keyword}`);
    return res.data.data;
  };


  // EXPORT PROVIDER
  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        isError,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        //get categories
        getCategories,
        getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);