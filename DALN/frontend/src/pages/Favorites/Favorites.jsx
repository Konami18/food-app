
import React, { useState, useEffect, useContext } from 'react';
import './Favorites.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/features/FoodItem/FoodItem';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Favorites = ({ setShowLogin }) => {
    const { url, token } = useContext(StoreContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchFavorites();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.post(`${url}/api/favorite/list`, {}, {
                headers: { token }
            });

            if (response.data.success) {
                setFavorites(response.data.data);
            }
        } catch (error) {
            console.log("Lỗi khi tải danh sách món ăn yêu thích:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='favorites'>
                <h2>Món ăn yêu thích</h2>
                <p style={{ textAlign: 'center', padding: '40px' }}>
                    Đang tải...
                </p>
            </div>
        );
    }

    if (!token) {
        return (
            <div className='favorites'>
                <div className='login-prompt-favorites'>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>❤️</div>
                    <h3>Đăng nhập để xem món ăn yêu thích</h3>
                    <p>Hãy lưu lại những món ăn yêu thích để dễ dàng tìm và đặt món bất cứ lúc nào!</p>
                    <button onClick={() => setShowLogin(true)}>
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='favorites'>
            <h2>❤️ Món ăn yêu thích</h2>

            {favorites.length > 0 ? (
                <>
                    <p className='favorites-count'>
                        Bạn có <strong>{favorites.length}</strong> món ăn yêu thích
                    </p>

                    <div className='favorites-grid'>
                        {favorites.map((item, index) => (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                price={item.price}
                                description={item.description}
                                image={item.image}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className='empty-favorites'>
                    <div className='empty-favorites-icon'>💔</div>
                    <h3>Bạn chưa có món ăn yêu thích nào</h3>
                    <p>Hãy thêm những món ăn yêu thích để dễ dàng tìm lại và đặt hàng trong những lần tiếp theo nhé!</p>
                    <button
                        className='browse-menu-btn'
                        onClick={() => navigate('/')}
                    >
                        Khám phá thực đơn
                    </button>
                </div>
            )}
        </div>
    );
};

export default Favorites;
