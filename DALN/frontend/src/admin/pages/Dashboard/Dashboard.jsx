
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = ({ url }) => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Lấy danh sách đơn hàng
            const token = localStorage.getItem("adminToken");

            const ordersResponse = await axios.get(`${url}/api/order/list`, {
                headers: {
                    token: token
                }
            });

            if (ordersResponse.data.success) {
                const orders = ordersResponse.data.data;

                // Tính tổng doanh thu
                const revenue = orders.reduce((sum, order) => {
                    return order.payment ? sum + order.amount : sum;
                }, 0);

                // Lấy 5 đơn hàng gần đây nhất
                const recent = orders.slice(0, 5);

                // Tính số lượng sản phẩm đã bán
                const productSales = {};

                orders.forEach(order => {
                    if (order.payment) {
                        order.items.forEach(item => {
                            if (productSales[item._id]) {
                                productSales[item._id].totalQuantity += item.quantity;
                            } else {
                                productSales[item._id] = {
                                    ...item,
                                    totalQuantity: item.quantity
                                };
                            }
                        });
                    }
                });

                const topProds = Object.values(productSales)
                    .sort((a, b) => b.totalQuantity - a.totalQuantity)
                    .slice(0, 5);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orders.length,
                    totalCustomers: new Set(orders.map(o => o.userId)).size,
                    totalProducts: 0
                });

                setRecentOrders(recent);
                setTopProducts(topProds);
            }

            // Lấy số lượng món ăn trong thực đơn
            const foodResponse = await axios.get(`${url}/api/food/list`);

            if (foodResponse.data.success) {
                setStats(prev => ({
                    ...prev,
                    totalProducts: foodResponse.data.data.length
                }));
            }

        } catch (error) {
            console.log("Lỗi khi tải dữ liệu bảng điều khiển:", error);
        }
    };

    const getStatusColor = (status) => {
        if (status === "Delivered") return "delivered";
        if (status === "Food Processing") return "pending";
        return "";
    };

    const formatCurrency = (amount) => {
        return `${(amount * 1000).toLocaleString('vi-VN')} ₫`;
    };

    const translateStatus = (status) => {
        const statusMap = {
            "Food Processing": "Đang xử lý",
            "Out for delivery": "Đang giao hàng",
            "Delivered": "Đã giao hàng"
        };

        return statusMap[status] || status;
    };

    return (
        <div className='dashboard'>
            <h2>Tổng quan</h2>

            <div className='dashboard-stats'>
                <div className='stat-card'>
                    <h3>Tổng doanh thu</h3>
                    <div className='stat-value'>
                        {formatCurrency(stats.totalRevenue)}
                    </div>
                    <div className='stat-change'>Tổng doanh thu từ trước đến nay</div>
                </div>

                <div className='stat-card'>
                    <h3>Tổng đơn hàng</h3>
                    <div className='stat-value'>{stats.totalOrders}</div>
                    <div className='stat-change'>Tất cả đơn hàng</div>
                </div>

                <div className='stat-card'>
                    <h3>Khách hàng</h3>
                    <div className='stat-value'>{stats.totalCustomers}</div>
                    <div className='stat-change'>Số lượng khách hàng duy nhất</div>
                </div>

                <div className='stat-card'>
                    <h3>Sản phẩm</h3>
                    <div className='stat-value'>{stats.totalProducts}</div>
                    <div className='stat-change'>Số món trong thực đơn</div>
                </div>
            </div>

            <div className='dashboard-charts'>
                <div className='recent-orders'>
                    <h3>Đơn hàng gần đây</h3>
                    <div className='order-list'>
                        {recentOrders.map((order, index) => (
                            <div
                                key={index}
                                className={`order-item-dash ${getStatusColor(order.status)}`}
                            >
                                <div>
                                    <div className='order-id'>
                                        Đơn hàng #{order._id.slice(-6)}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#666' }}>
                                        {order.address.firstName} {order.address.lastName}
                                    </div>
                                </div>

                                <div className='order-amount'>
                                    {formatCurrency(order.amount)}
                                </div>

                                <div className='order-status-dash'>
                                    {translateStatus(order.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='top-products'>
                    <h3>Món ăn bán chạy</h3>
                    <div className='product-list'>
                        {topProducts.map((product, index) => (
                            <div key={index} className='product-item'>
                                <img
                                    src={`${url}/images/${product.image}`}
                                    alt={product.name}
                                />

                                <div className='product-info'>
                                    <h4>{product.name}</h4>
                                    <p>Đã bán {product.totalQuantity}</p>
                                </div>

                                <div className='product-sales'>
                                    {formatCurrency(product.price * product.totalQuantity)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
