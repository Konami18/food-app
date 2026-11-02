
import React, { useState, useEffect, useContext } from 'react';
import './ReviewSection.css';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';

const ReviewSection = ({ foodId, setShowLogin }) => {
    const { url, token } = useContext(StoreContext);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [sortBy, setSortBy] = useState('newest');
    const [filterRating, setFilterRating] = useState('all');

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                `${url}/api/review/food/${foodId}/filtered?sortBy=${sortBy}&rating=${filterRating}`
            );
            if (response.data.success) {
                setReviews(response.data.data);
                setAverageRating(response.data.averageRating);
                setTotalReviews(response.data.totalReviews);
            }
        } catch (error) {
            console.log("Lỗi khi tải đánh giá:", error);
        }
    };

    useEffect(() => {
        if (foodId) {
            fetchReviews();
        }
    }, [foodId, sortBy, filterRating]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!token) {
            setShowLogin(true);
            return;
        }

        if (rating === 0) {
            alert("Vui lòng chọn số sao đánh giá!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('foodId', foodId);
            formData.append('rating', rating);
            formData.append('comment', comment);

            if (images.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
            }

            const response = await axios.post(`${url}/api/review/add`, formData, {
                headers: { token }
            });

            if (response.data.success) {
                alert("Đánh giá của bạn đã được gửi thành công!");
                setRating(0);
                setComment('');
                setImages([]);
                document.getElementById('review-images').value = '';
                fetchReviews();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log("Lỗi khi gửi đánh giá:", error);
            alert("Không thể gửi đánh giá. Vui lòng thử lại!");
        }
    };

    const renderStars = (count) => {
        return '★'.repeat(count) + '☆'.repeat(5 - count);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleMarkHelpful = async (reviewId) => {
        if (!token) {
            setShowLogin(true);
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/review/helpful/${reviewId}`,
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                fetchReviews();
            }
        } catch (error) {
            console.log("Lỗi khi đánh dấu đánh giá hữu ích:", error);
        }
    };

    return (
        <div className='review-section'>
            <h3>Đánh giá và nhận xét</h3>

            {totalReviews > 0 && (
                <div className='rating-summary'>
                    <div className='avg-rating'>{averageRating}</div>
                    <div>
                        <div className='stars'>
                            {renderStars(Math.round(averageRating))}
                        </div>
                        <div className='total-reviews'>
                            {totalReviews} lượt đánh giá
                        </div>
                    </div>
                </div>
            )}

            <div className='review-filters'>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Mới nhất</option>
                    <option value="helpful">Hữu ích nhất</option>
                    <option value="rating-high">Đánh giá cao nhất</option>
                    <option value="rating-low">Đánh giá thấp nhất</option>
                </select>

                <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                    <option value="all">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                </select>
            </div>

            {token ? (
                <div className='add-review-form'>
                    <h4>Viết đánh giá</h4>
                    <form onSubmit={handleSubmitReview}>
                        <div className='rating-input'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea
                            placeholder='Hãy chia sẻ trải nghiệm của bạn về món ăn này...'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />

                        <input
                            type="file"
                            id="review-images"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImages([...e.target.files])}
                        />

                        <button type='submit'>Gửi đánh giá</button>
                    </form>
                </div>
            ) : (
                <div className='login-prompt'>
                    <p>Vui lòng đăng nhập để viết đánh giá</p>
                    <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
                </div>
            )}

            <div className='review-list'>
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className='review-item'>
                            <div className='review-header'>
                                <div className='review-user-info'>
                                    <span className='review-user-name'>{review.userName}</span>
                                    <span className='review-date'>
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>

                                <div className='review-rating'>
                                    {renderStars(review.rating)}
                                </div>
                            </div>

                            <p className='review-comment'>{review.comment}</p>

                            {review.images && review.images.length > 0 && (
                                <div className='review-images'>
                                    {review.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={`${url}/images/${img}`}
                                            alt="Hình ảnh đánh giá"
                                        />
                                    ))}
                                </div>
                            )}

                            <div className='review-actions'>
                                <button
                                    className='helpful-btn'
                                    onClick={() => handleMarkHelpful(review._id)}
                                >
                                    👍 Hữu ích ({review.helpfulVotes || 0})
                                </button>
                            </div>

                            {review.adminReply && (
                                <div className='admin-reply'>
                                    <strong>Phản hồi từ nhà hàng:</strong>
                                    <p>{review.adminReply.message}</p>
                                    <small>
                                        {formatDate(review.adminReply.repliedAt)}
                                    </small>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className='no-reviews'>
                        <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá món ăn này!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;
