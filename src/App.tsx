import React from 'react'
import SupplyList from './components/SupplyList'
import AdminForm from "./components/AdminForm"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";


export default function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-t from-sky-500 to-indigo-900 text-white 
      bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1752483923346-f7b6940e99ff')`,
      }}
    >
      <Router>
        <nav className="bg-gradient-to-r from-teal-600 to-teal-900 p-4 text-white flex gap-4 shadow-md">
          <Link to="/" className="hover:text-teal-900">Home</Link>
          <Link to="/admin" className="hover:text-teal-900">Admin</Link>
        </nav>

        <main className="p-4 min-h-screen">
          <div className="w-full flex justify-center items-center mt-8 rounded-full">
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-extrabold 
            text-center mb-12 pb-6 px-6 py-3 rounded-xl bg-gray-900/20 backdrop-blur-sm 
            shadow-xl drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)] w-fit">
              Neeru<span className="text-sky-300">Locator</span>
            </h1>
          </div>

          <Routes>
            <Route path="/" element={<SupplyList />} />
            <Route path="/admin" element={<AdminForm />} />
          </Routes>
        </main>
      </Router>
      <Toaster position="top-right" />
    </div>
  );
}
