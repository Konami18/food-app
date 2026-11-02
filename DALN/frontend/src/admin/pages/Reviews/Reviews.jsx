
import React, { useState, useEffect } from 'react';
import './Reviews.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const Reviews = ({ url }) => {
    const [reviews, setReviews] = useState([]);
    const [replyText, setReplyText] = useState({});

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(
                `${url}/api/review/all`,
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                setReviews(response.data.data);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách đánh giá");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Lỗi khi tải danh sách đánh giá"
            );
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleReplyChange = (reviewId, text) => {
        setReplyText(prev => ({ ...prev, [reviewId]: text }));
    };

    const handleAddReply = async (reviewId) => {
        const message = replyText[reviewId];
        if (!message || message.trim() === '') {
            toast.error("Vui lòng nhập nội dung phản hồi");
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.post(
                `${url}/api/review/reply/${reviewId}`,
                { message, adminName: "Restaurant Admin" },
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success("Đã gửi phản hồi thành công!");
                setReplyText(prev => ({ ...prev, [reviewId]: '' }));
                fetchReviews();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding reply:", error);
            toast.error("Không thể gửi phản hồi");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;

        try {
            const token = localStorage.getItem("adminToken");

            const response = await axios.post(
                `${url}/api/review/delete`,
                { reviewId },
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {
                toast.success("Đã xóa đánh giá thành công!");
                fetchReviews();
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Không thể xóa đánh giá");
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='reviews-management'>
            <h2>Quản lý đánh giá</h2>

            <div className='reviews-list'>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className='review-card'>
                            <div className='review-card-header'>
                                <div className='review-user-info'>
                                    <span className='review-user-name'>{review.userName}</span>
                                    <span className='review-food-name'>
                                        {review.foodId?.name || 'Món ăn'}
                                    </span>
                                    <span className='review-date'>{formatDate(review.createdAt)}</span>
                                </div>
                                <div className='review-rating'>{renderStars(review.rating)}</div>
                            </div>

                            <div className='review-content'>
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

                                <div className='review-stats'>
                                    <span>👍 {review.helpfulVotes || 0} lượt thấy hữu ích</span>
                                    {review.verified && <span>✓ Đã xác minh mua hàng</span>}
                                </div>
                            </div>

                            <div className='admin-reply-section'>
                                {review.adminReply && review.adminReply.message ? (
                                    <div className='existing-reply'>
                                        <strong>Phản hồi của bạn:</strong>
                                        <p>{review.adminReply.message}</p>
                                        <small>Phản hồi lúc {formatDate(review.adminReply.repliedAt)}</small>
                                    </div>
                                ) : (
                                    <>
                                        <h4>Thêm phản hồi:</h4>
                                        <div className='reply-form'>
                                            <textarea
                                                value={replyText[review._id] || ''}
                                                onChange={(e) => handleReplyChange(review._id, e.target.value)}
                                                placeholder="Cảm ơn bạn đã đánh giá! Chúng tôi rất trân trọng ý kiến đóng góp của bạn..."
                                            />
                                            <button onClick={() => handleAddReply(review._id)}>
                                                Gửi phản hồi
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                className='delete-btn'
                                onClick={() => handleDeleteReview(review._id)}
                            >
                                Xóa đánh giá
                            </button>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        Chưa có đánh giá nào
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
