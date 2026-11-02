
import React, { useState, useEffect, useContext } from 'react';
import './Addresses.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const Addresses = () => {
    const { url, token } = useContext(StoreContext);
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
        isDefault: false
    });

    useEffect(() => {
        if (token) {
            fetchAddresses();
        }
    }, [token]);

    const fetchAddresses = async () => {
        try {
            const response = await axios.post(`${url}/api/address/list`, {}, {
                headers: { token }
            });

            if (response.data.success) {
                setAddresses(response.data.data);
            }
        } catch (error) {
            console.log("Lỗi khi tải danh sách địa chỉ:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            if (editingId) {
                response = await axios.post(`${url}/api/address/update`, {
                    addressId: editingId,
                    addressData: formData
                }, { headers: { token } });
            } else {
                response = await axios.post(`${url}/api/address/add`, {
                    address: formData
                }, { headers: { token } });
            }

            if (response.data.success) {
                alert(response.data.message);
                fetchAddresses();
                resetForm();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi lưu địa chỉ:", error);
            alert("Không thể lưu địa chỉ. Vui lòng thử lại!");
        }
    };

    const handleEdit = (address) => {
        setFormData({
            label: address.label,
            firstName: address.firstName,
            lastName: address.lastName,
            street: address.street,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
            country: address.country,
            phone: address.phone,
            isDefault: address.isDefault
        });

        setEditingId(address._id);
        setShowForm(true);
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
            return;
        }

        try {
            const response = await axios.post(`${url}/api/address/delete`, {
                addressId
            }, { headers: { token } });

            if (response.data.success) {
                alert(response.data.message);
                fetchAddresses();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi xóa địa chỉ:", error);
            alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            const response = await axios.post(`${url}/api/address/setdefault`, {
                addressId
            }, { headers: { token } });

            if (response.data.success) {
                fetchAddresses();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi thiết lập địa chỉ mặc định:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            label: '',
            firstName: '',
            lastName: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            phone: '',
            isDefault: false
        });

        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className='addresses-page'>
            <h2>📍 Địa chỉ của tôi</h2>

            <button className='add-address-btn' onClick={() => setShowForm(true)}>
                + Thêm địa chỉ mới
            </button>

            {addresses.length > 0 ? (
                <div className='addresses-list'>
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className={`address-card ${address.isDefault ? 'default' : ''}`}
                        >
                            <div className='address-label'>
                                {address.label}
                                {address.isDefault && (
                                    <span className='default-badge'>MẶC ĐỊNH</span>
                                )}
                            </div>

                            <div className='address-details'>
                                <p><strong>{address.firstName} {address.lastName}</strong></p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zipcode}</p>
                                <p>{address.country}</p>
                                <p>📞 {address.phone}</p>
                            </div>

                            <div className='address-actions'>
                                {!address.isDefault && (
                                    <button
                                        className='set-default-btn'
                                        onClick={() => handleSetDefault(address._id)}
                                    >
                                        Đặt làm mặc định
                                    </button>
                                )}

                                <button
                                    className='edit-btn'
                                    onClick={() => handleEdit(address)}
                                >
                                    Chỉnh sửa
                                </button>

                                <button
                                    className='delete-btn'
                                    onClick={() => handleDelete(address._id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='no-addresses'>
                    <p>Bạn chưa lưu địa chỉ nào.</p>
                    <p>Hãy thêm địa chỉ giao hàng đầu tiên để quá trình đặt hàng nhanh chóng và thuận tiện hơn!</p>
                </div>
            )}

            {showForm && (
                <div className='address-form-modal' onClick={resetForm}>
                    <div className='address-form' onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</h3>

                        <form onSubmit={handleSubmit}>
                            <div className='form-grid'>
                                <div className='form-field full-width'>
                                    <label>Tên địa chỉ *</label>
                                    <input
                                        type='text'
                                        name='label'
                                        value={formData.label}
                                        onChange={handleInputChange}
                                        placeholder='Ví dụ: Nhà riêng, Công ty, Nhà mẹ...'
                                        required
                                    />
                                </div>

                                <div className='form-field'>
                                    <label>Tên *</label>
                                    <input
                                        type='text'
                                        name='firstName'
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className='form-field'>
                                    <label>Họ *</label>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className='form-field full-width'>
                                    <label>Địa chỉ đường phố *</label>
                                    <input
                                        type='text'
                                        name='street'
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className='form-field'>
                                    <label>Thành phố *</label>
                                    <input
                                        type='text'
                                        name='city'
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* <div className='form-field'>
                                    <label>Tỉnh / Bang *</label>
                                    <input
                                        type='text'
                                        name='state'
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div> */}

                                {/* <div className='form-field'>
                                    <label>Mã bưu điện *</label>
                                    <input
                                        type='text'
                                        name='zipcode'
                                        value={formData.zipcode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div> */}

                                <div className='form-field'>
                                    <label>Quốc gia *</label>
                                    <input
                                        type='text'
                                        name='country'
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className='form-field full-width'>
                                    <label>Số điện thoại *</label>
                                    <input
                                        type='tel'
                                        name='phone'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className='checkbox-field'>
                                <input
                                    type='checkbox'
                                    id='isDefault'
                                    name='isDefault'
                                    checked={formData.isDefault}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor='isDefault'>
                                    Đặt làm địa chỉ mặc định
                                </label>
                            </div>

                            <div className='form-actions'>
                                <button type='submit' className='save-btn'>
                                    {editingId ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ'}
                                </button>

                                <button
                                    type='button'
                                    className='cancel-btn'
                                    onClick={resetForm}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Addresses;
