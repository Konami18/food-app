
import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar/Navbar";
import Sidebar from "./components/layout/Sidebar/Sidebar";

import Dashboard from "./pages/Dashboard/Dashboard";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Promo from "./pages/Promo/Promo";
import FlashSale from "./pages/FlashSale/FlashSale";
import Reviews from "./pages/Reviews/Reviews";
import Analytics from "./pages/Analytics/Analytics";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLayout.css";

const AdminLayout = () => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

    return (
        <div className="admin-layout">
            <Navbar />
            <hr />

            <div className="app-content">
                <Sidebar />

                <main className="admin-main">
                    <Routes>
                        <Route index element={<Dashboard url={url} />} />
                        <Route path="add" element={<Add url={url} />} />
                        <Route path="list" element={<List url={url} />} />
                        <Route path="orders" element={<Orders url={url} />} />
                        <Route path="promo" element={<Promo url={url} />} />
                        <Route path="flashsale" element={<FlashSale url={url} />} />
                        <Route path="reviews" element={<Reviews url={url} />} />
                        <Route path="analytics" element={<Analytics url={url} />} />
                    </Routes>
                </main>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />
        </div>
    );
};

export default AdminLayout;
