import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminLogin.css";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (loading) return;

        try {
            setLoading(true);

            // Xóa phiên admin cũ trước khi đăng nhập lại.
            localStorage.removeItem("adminToken");

            const response = await axios.post(
                `${url}/api/user/login`,
                {
                    email: email.trim(),
                    password
                }
            );

            const data = response.data;

            // Kiểm tra kết quả đăng nhập.
            if (!data.success) {
                toast.error(data.message || "Đăng nhập thất bại");
                return;
            }

            // Kiểm tra token do backend trả về.
            if (!data.token) {
                toast.error("Máy chủ không trả về token đăng nhập");
                return;
            }

            // Chỉ tài khoản có role admin mới được vào trang quản trị.
            if (data.role !== "admin") {
                toast.error("Tài khoản không có quyền quản trị");
                return;
            }

            // Lưu token riêng cho trang admin.
            localStorage.setItem("adminToken", data.token);

            // Kiểm tra token đã được lưu.
            if (!localStorage.getItem("adminToken")) {
                toast.error("Không thể lưu phiên đăng nhập admin");
                return;
            }

            toast.success("Đăng nhập Admin thành công");

            // Chuyển đến Dashboard của trang quản trị.
            navigate("/admin", { replace: true });

        } catch (error) {
            console.error(
                "Lỗi đăng nhập Admin:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Không thể kết nối máy chủ"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <form
                className="admin-login-form"
                onSubmit={onSubmitHandler}
            >
                <h2>Admin Login</h2>

                <p>Đăng nhập để quản lý hệ thống</p>

                <label htmlFor="admin-email">Email</label>

                <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Nhập email quản trị"
                    autoComplete="username"
                    required
                />

                <label htmlFor="admin-password">Mật khẩu</label>

                <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading
                        ? "Đang đăng nhập..."
                        : "Đăng nhập"}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;