
import React, { useState, useEffect } from 'react';
import './Analytics.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = ({ url }) => {
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [customerAnalytics, setCustomerAnalytics] = useState(null);
    const [period, setPeriod] = useState('week');
    const [loading, setLoading] = useState(true);

    const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];

    useEffect(() => {
        fetchAllData();
    }, [period]);

    const fetchAllData = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const config = {
                headers: {
                    token: token
                }
            };

            const [statsRes, revenueRes, productsRes, customersRes] = await Promise.all([
                axios.get(`${url}/api/analytics/stats`, config),
                axios.get(`${url}/api/analytics/revenue?period=${period}`, config),
                axios.get(`${url}/api/analytics/top-products?limit=5`, config),
                axios.get(`${url}/api/analytics/customers`, config)
            ]);

            if (statsRes.data.success) setStats(statsRes.data.data);
            if (revenueRes.data.success) setRevenueData(revenueRes.data.data);
            if (productsRes.data.success) setTopProducts(productsRes.data.data);
            if (customersRes.data.success) setCustomerAnalytics(customersRes.data.data);

            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thống kê:", error);
            toast.error("Không thể tải dữ liệu thống kê");
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(`${url}/api/analytics/export/${type}`, {
                headers: {
                    token: token
                },
                responseType: 'blob'
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${type}_export_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success(`Xuất dữ liệu ${type} thành công!`);
        } catch (error) {
            console.error("Lỗi khi xuất dữ liệu:", error);
            toast.error("Không thể xuất dữ liệu");
        }
    };

    const formatCurrency = (amount) => {
        return `${((amount || 0)*1000).toLocaleString('vi-VN')} ₫`;
    };

    const formatRevenueData = () => {
        return revenueData.map(item => ({
            name: period === 'day'
                ? `${item._id.day}/${item._id.month}`
                : period === 'week'
                    ? `Tuần ${item._id.week}`
                    : period === 'month'
                        ? `${item._id.month}/${item._id.year}`
                        : item._id.year,
            revenue: item.revenue,
            orders: item.orders
        }));
    };

    if (loading) {
        return (
            <div className='analytics-page'>
                <h2>Đang tải dữ liệu thống kê...</h2>
            </div>
        );
    }

    return (
        <div className='analytics-page'>
            <h2>📊 Thống kê và Báo cáo</h2>

            {/* Thống kê tổng quan */}
            <div className='stats-grid'>
                <div className='stat-card revenue'>
                    <div className='stat-icon'>💰</div>
                    <div className='stat-label'>Tổng doanh thu</div>
                    <div className='stat-value'>
                        {formatCurrency(stats?.totalRevenue)}
                    </div>
                </div>

                <div className='stat-card orders'>
                    <div className='stat-icon'>📦</div>
                    <div className='stat-label'>Tổng đơn hàng</div>
                    <div className='stat-value'>{stats?.totalOrders}</div>
                </div>

                <div className='stat-card customers'>
                    <div className='stat-icon'>👥</div>
                    <div className='stat-label'>Tổng khách hàng</div>
                    <div className='stat-value'>{stats?.totalCustomers}</div>
                </div>

                <div className='stat-card avg'>
                    <div className='stat-icon'>📈</div>
                    <div className='stat-label'>Giá trị đơn hàng trung bình</div>
                    <div className='stat-value'>
                        {formatCurrency(stats?.avgOrderValue)}
                    </div>
                </div>
            </div>

            {/* Khu vực biểu đồ */}
            <div className='charts-section'>
                <div className='chart-card'>
                    <h3>Doanh thu theo thời gian</h3>

                    <div className='period-selector'>
                        <button
                            className={period === 'day' ? 'active' : ''}
                            onClick={() => setPeriod('day')}
                        >
                            Theo ngày
                        </button>

                        <button
                            className={period === 'week' ? 'active' : ''}
                            onClick={() => setPeriod('week')}
                        >
                            Theo tuần
                        </button>

                        <button
                            className={period === 'month' ? 'active' : ''}
                            onClick={() => setPeriod('month')}
                        >
                            Theo tháng
                        </button>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={formatRevenueData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                formatter={(value, name) => [
                                    name === 'revenue'
                                        ? formatCurrency(value)
                                        : value,
                                    name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                                ]}
                            />
                            <Legend
                                formatter={(value) =>
                                    value === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="revenue"
                                stroke="#4CAF50"
                                strokeWidth={2}
                            />
                            <Line
                                type="monotone"
                                dataKey="orders"
                                name="orders"
                                stroke="#2196F3"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className='chart-card'>
                    <h3>Phân bố khách hàng</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={[
                                    {
                                        name: 'Khách hàng mới',
                                        value: customerAnalytics?.newCustomers || 0
                                    },
                                    {
                                        name: 'Khách hàng quay lại',
                                        value: customerAnalytics?.returningCustomers || 0
                                    }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {[0, 1].map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Khu vực bảng dữ liệu */}
            <div className='tables-section'>
                <div className='table-card'>
                    <h3>🏆 Top món ăn bán chạy</h3>

                    <table className='data-table'>
                        <thead>
                            <tr>
                                <th>Tên món ăn</th>
                                <th>Số lượng đã bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>

                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>{formatCurrency(product.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className='table-card'>
                    <h3>💎 Top khách hàng</h3>

                    <table className='data-table'>
                        <thead>
                            <tr>
                                <th>Khách hàng</th>
                                <th>Số đơn hàng</th>
                                <th>Tổng chi tiêu</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customerAnalytics?.topCustomers.slice(0, 5).map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.name}</td>
                                    <td>{customer.orderCount}</td>
                                    <td>{formatCurrency(customer.totalSpent)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Khu vực xuất dữ liệu */}
            <div className='export-section'>
                <h3>📥 Xuất dữ liệu</h3>

                <div className='export-buttons'>
                    <button
                        className='export-btn'
                        onClick={() => handleExport('orders')}
                    >
                        📦 Xuất đơn hàng (CSV)
                    </button>

                    <button
                        className='export-btn secondary'
                        onClick={() => handleExport('customers')}
                    >
                        👥 Xuất khách hàng (CSV)
                    </button>

                    <button
                        className='export-btn'
                        onClick={() => handleExport('products')}
                    >
                        🍽️ Xuất sản phẩm (CSV)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
