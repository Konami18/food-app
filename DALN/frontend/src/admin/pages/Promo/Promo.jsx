
import React, { useState, useEffect } from 'react';
import './Promo.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Promo = ({ url }) => {
    const [promos, setPromos] = useState([]);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: '',
        validFrom: '',
        validUntil: '',
        description: ''
    });

    const fetchPromos = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                `${url}/api/promo/list`,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                setPromos(response.data.data);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách mã khuyến mãi");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Lỗi khi tải danh sách mã khuyến mãi"
            );
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.post(
                `${url}/api/promo/add`,
                formData,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success("Tạo mã khuyến mãi thành công!");

                setFormData({
                    code: '',
                    discountType: 'percentage',
                    discountValue: '',
                    minOrderAmount: '',
                    maxDiscount: '',
                    usageLimit: '',
                    validFrom: '',
                    validUntil: '',
                    description: ''
                });

                fetchPromos();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log("Error creating promo:", error);
            toast.error("Không thể tạo mã khuyến mãi");
        }
    };

    const deletePromo = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này không?")) {
            try {
                const token = localStorage.getItem("adminToken");

                const response = await axios.post(
                    `${url}/api/promo/delete`,
                    { id },
                    {
                        headers: {
                            token: token
                        }
                    }
                );

                if (response.data.success) {
                    toast.success("Xóa mã khuyến mãi thành công!");
                    fetchPromos();
                }
            } catch (error) {
                console.log("Error deleting promo:", error);
                toast.error("Không thể xóa mã khuyến mãi");
            }
        }
    };

    const getPromoStatus = (promo) => {
        const now = new Date();
        if (!promo.isActive) return 'inactive';
        if (now > new Date(promo.validUntil)) return 'expired';
        return 'active';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `${((amount || 0) * 1000).toLocaleString('vi-VN')} ₫`;
    };

    return (
        <div className='promo add flex-col'>
            <h3>Quản lý mã khuyến mãi</h3>

            <div className='add-promo-form'>
                <h4>Tạo mã khuyến mãi mới</h4>

                <form onSubmit={handleSubmit}>
                    <div className='promo-form-grid'>
                        <div className='promo-form-field'>
                            <label>Mã khuyến mãi *</label>
                            <input
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                placeholder="GIAM20"
                                required
                            />
                        </div>

                        <div className='promo-form-field'>
                            <label>Loại giảm giá *</label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleInputChange}
                            >
                                <option value="percentage">Theo phần trăm (%)</option>
                                <option value="fixed">Số tiền cố định (VNĐ)</option>
                            </select>
                        </div>

                        <div className='promo-form-field'>
                            <label>Giá trị giảm giá *</label>
                            <input
                                type="number"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleInputChange}
                                placeholder={formData.discountType === 'percentage' ? '20' : '10'}
                                required
                            />
                        </div>

                        <div className='promo-form-field'>
                            <label>Giá trị đơn hàng tối thiểu (VNĐ)</label>
                            <input
                                type="number"
                                name="minOrderAmount"
                                value={formData.minOrderAmount}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                        </div>

                        {formData.discountType === 'percentage' && (
                            <div className='promo-form-field'>
                                <label>Mức giảm tối đa (VNĐ)</label>
                                <input
                                    type="number"
                                    name="maxDiscount"
                                    value={formData.maxDiscount}
                                    onChange={handleInputChange}
                                    placeholder="Không bắt buộc"
                                />
                            </div>
                        )}

                        <div className='promo-form-field'>
                            <label>Giới hạn lượt sử dụng</label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                placeholder="Không giới hạn"
                            />
                        </div>

                        <div className='promo-form-field'>
                            <label>Thời gian bắt đầu *</label>
                            <input
                                type="datetime-local"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='promo-form-field'>
                            <label>Thời gian kết thúc *</label>
                            <input
                                type="datetime-local"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='promo-form-field full-width'>
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Giảm 20% cho tất cả đơn hàng từ 50.000 VNĐ"
                            />
                        </div>
                    </div>

                    <button type='submit' className='promo-submit-btn'>
                        Tạo mã khuyến mãi
                    </button>
                </form>
            </div>

            <div className='promo-list'>
                <div className='promo-list-header'>
                    <div>Mã khuyến mãi</div>
                    <div>Mức giảm</div>
                    <div>Đơn tối thiểu</div>
                    <div>Hạn sử dụng</div>
                    <div>Lượt dùng</div>
                    <div>Trạng thái</div>
                    <div>Thao tác</div>
                </div>

                {promos.map((promo) => {
                    const status = getPromoStatus(promo);

                    return (
                        <div key={promo._id} className='promo-list-item'>
                            <div>
                                <span className='promo-code'>{promo.code}</span>
                            </div>

                            <div>
                                {promo.discountType === 'percentage'
                                    ? `${promo.discountValue}%`
                                    : formatCurrency(promo.discountValue)}
                            </div>

                            <div>{formatCurrency(promo.minOrderAmount)}</div>

                            <div>{formatDate(promo.validUntil)}</div>

                            <div className='promo-used-count'>
                                {promo.usedCount} / {promo.usageLimit || '∞'}
                            </div>

                            <div>
                                <span className={`promo-status ${status}`}>
                                    {{
                                        inactive: 'ĐÃ TẮT',
                                        expired: 'HẾT HẠN',
                                        active: 'ĐANG HOẠT ĐỘNG'
                                    }[status]}
                                </span>
                            </div>

                            <div>
                                <button
                                    className='promo-delete-btn'
                                    onClick={() => deletePromo(promo._id)}
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

export default Promo;
