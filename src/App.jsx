

import { useState } from 'react'
import './index.css'
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/frontpages/Dashboard';
import ProductDetail from './pages/frontpages/ProductDetail';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/adminpages/AdminDashboard';
import AboutPage from './pages/adminpages/AboutPage';
import Cart from './pages/frontpages/Cart';
import ProductForm from "./pages/adminpages/ProductForm";
import ProductEdit from "./pages/adminpages/ProductEdit";
import BookList from "./pages/adminpages/BookList";
import BookForm from "./pages/adminpages/BookForm";

function App() { 
  return ( 
    // <> 
    //   <div className="min-h-screen bg-gray-100 flex items-center justify-center"> 
    //     <div className="bg-white p-8 rounded-md shadow-md text-center max-w-md"> 
    //       <h1 className="text-2xl font-bold text-blue-600 mb-3">
    //         Welcome to My Admin
    //       </h1> 
    //       <p className="text-gray-600">
    //         Your Tailwind CSS React app is ready!
    //       </p> 
    //     </div> 
    //   </div> 
    // </> 
    
    <Routes>
      <Route path="/" element={<MainLayout/>} >
        <Route index element={<Dashboard />} /> 
        <Route path="product/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<Cart/>} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}> 
        {/* Default route di dalam AdminLayout */} 
        {/* mapping path ke component page, gunakan autocompletion */} 
        <Route path="dashboard" element={<AdminDashboard />} /> 
        <Route path="about" element={<AboutPage />} /> 
        <Route path="add-product" element={<ProductForm />} />
        <Route path="edit-product/:id" element={<ProductEdit />} />
        <Route path="/admin/books" element={<BookList />} />
        <Route path="/admin/books/create" element={<BookForm />} />
      </Route> 
    </Routes>

  ); 
}

export default App