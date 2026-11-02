
import React, { useState, useEffect } from 'react';
import './FlashSale.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const FlashSale = ({ url }) => {
    const [flashSales, setFlashSales] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        discountPercent: '',
        startTime: '',
        endTime: '',
        foodItems: [],
        priority: 0
    });

    // Lấy danh sách tất cả chương trình Flash Sale
    const fetchFlashSales = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(`${url}/api/flashsale/all`, {
                headers: {
                    token: token
                }
            });

            if (response.data.success) {
                setFlashSales(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching flash sales:", error);
            toast.error("Không thể tải danh sách Flash Sale");
        }
    };

    // Lấy danh sách tất cả món ăn
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    useEffect(() => {
        fetchFlashSales();
        fetchFoodList();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFoodItemToggle = (foodId) => {
        setFormData(prev => ({
            ...prev,
            foodItems: prev.foodItems.includes(foodId)
                ? prev.foodItems.filter(id => id !== foodId)
                : [...prev.foodItems, foodId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.discountPercent || !formData.startTime || !formData.endTime) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.post(
                `${url}/api/flashsale/create`,
                formData,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success("Tạo chương trình Flash Sale thành công!");

                setFormData({
                    title: '',
                    description: '',
                    discountPercent: '',
                    startTime: '',
                    endTime: '',
                    foodItems: [],
                    priority: 0
                });

                fetchFlashSales();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error creating flash sale:", error);
            toast.error("Không thể tạo chương trình Flash Sale");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.patch(
                `${url}/api/flashsale/toggle/${id}`,
                {},
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                fetchFlashSales();
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Không thể thay đổi trạng thái Flash Sale");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa chương trình Flash Sale này không?")) return;

        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.delete(
                `${url}/api/flashsale/delete/${id}`,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success("Xóa chương trình Flash Sale thành công!");
                fetchFlashSales();
            }
        } catch (error) {
            console.error("Error deleting flash sale:", error);
            toast.error("Không thể xóa chương trình Flash Sale");
        }
    };

    const getFlashSaleStatus = (sale) => {
        const now = new Date();
        const start = new Date(sale.startTime);
        const end = new Date(sale.endTime);

        if (!sale.isActive) return 'inactive';
        if (now < start) return 'upcoming';
        if (now > end) return 'expired';
        return 'active';
    };

    return (
        <div className='flash-sale-admin'>
            <h2>⚡ Quản lý Flash Sale</h2>

            {/* Form tạo chương trình Flash Sale */}
            <div className='create-flash-sale-form'>
                <h3>Tạo chương trình Flash Sale mới</h3>

                <form onSubmit={handleSubmit}>
                    <div className='form-grid'>
                        <div className='form-group'>
                            <label>Tên chương trình *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Ví dụ: Ưu đãi cuối tuần"
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Phần trăm giảm giá * (1-100)</label>
                            <input
                                type="number"
                                name="discountPercent"
                                value={formData.discountPercent}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                placeholder="Ví dụ: 30"
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Thời gian bắt đầu *</label>
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Thời gian kết thúc *</label>
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label>Mức độ ưu tiên (0-10)</label>
                            <input
                                type="number"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                min="0"
                                max="10"
                                placeholder="0"
                            />
                        </div>

                        <div className='form-group full-width'>
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Nhập mô tả cho chương trình Flash Sale (không bắt buộc)"
                            />
                        </div>

                        <div className='form-group full-width'>
                            <label>Chọn món ăn (Không bắt buộc - để trống nếu áp dụng cho tất cả món ăn)</label>

                            <div className='food-items-selector'>
                                {foodList.map((food) => (
                                    <div
                                        key={food._id}
                                        className={`food-item-checkbox ${formData.foodItems.includes(food._id) ? 'selected' : ''}`}
                                        onClick={() => handleFoodItemToggle(food._id)}
                                    >
                                        <img src={`${url}/images/${food.image}`} alt={food.name} />
                                        <span>{food.name}</span>
                                        <input
                                            type="checkbox"
                                            checked={formData.foodItems.includes(food._id)}
                                            onChange={() => { }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className='submit-btn'>
                        Tạo Flash Sale
                    </button>
                </form>
            </div>

            {/* Danh sách chương trình Flash Sale */}
            <div className='flash-sales-list'>
                <h3>Tất cả Flash Sale ({flashSales.length})</h3>

                {flashSales.map((sale) => {
                    const status = getFlashSaleStatus(sale);

                    return (
                        <div key={sale._id} className='flash-sale-card'>
                            <div className='flash-sale-card-header'>
                                <div className='flash-sale-info'>
                                    <h3>{sale.title}</h3>
                                    <p>{sale.description}</p>
                                    <p><strong>Giảm giá:</strong> {sale.discountPercent}%</p>
                                    <p><strong>Bắt đầu:</strong> {new Date(sale.startTime).toLocaleString('vi-VN')}</p>
                                    <p><strong>Kết thúc:</strong> {new Date(sale.endTime).toLocaleString('vi-VN')}</p>
                                    <p><strong>Mức độ ưu tiên:</strong> {sale.priority}</p>
                                    <p>
                                        <strong>Món ăn:</strong>{' '}
                                        {sale.foodItems.length > 0
                                            ? `${sale.foodItems.length} món đã chọn`
                                            : 'Tất cả món ăn'}
                                    </p>
                                </div>

                                <span className={`flash-sale-status ${status}`}>
                                    {{
                                        inactive: 'ĐÃ TẮT',
                                        upcoming: 'SẮP DIỄN RA',
                                        expired: 'ĐÃ KẾT THÚC',
                                        active: 'ĐANG DIỄN RA'
                                    }[status]}
                                </span>
                            </div>

                            {sale.foodItems.length > 0 && (
                                <div className='flash-sale-items-preview'>
                                    {sale.foodItems.slice(0, 10).map((item) => (
                                        <img
                                            key={item._id}
                                            src={`${url}/images/${item.image}`}
                                            alt={item.name}
                                            className='item-preview'
                                            title={item.name}
                                        />
                                    ))}

                                    {sale.foodItems.length > 10 && (
                                        <span style={{ alignSelf: 'center', color: '#666' }}>
                                            Còn {sale.foodItems.length - 10} món khác
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className='flash-sale-actions'>
                                <button
                                    className='action-btn toggle-btn'
                                    onClick={() => handleToggleStatus(sale._id)}
                                >
                                    {sale.isActive ? 'Tắt chương trình' : 'Bật chương trình'}
                                </button>

                                <button
                                    className='action-btn delete-btn'
                                    onClick={() => handleDelete(sale._id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FlashSale;
