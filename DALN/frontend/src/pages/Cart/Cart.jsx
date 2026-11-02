
import React, { useContext, useState } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {

  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } = useContext(StoreContext);
  const nagivate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');

  const applyPromoCode = async () => {
    if (!token) {
      alert("Vui lòng đăng nhập để sử dụng mã khuyến mãi");
      return;
    }

    if (!promoCode) {
      alert("Vui lòng nhập mã khuyến mãi");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/promo/validate`,
        {
          code: promoCode,
          orderAmount: getTotalCartAmount()
        },
        { headers: { token } }
      );

      if (response.data.success) {
        setDiscount(response.data.discount);
        setPromoApplied(true);
        setPromoMessage(`✓ ${response.data.message} - Bạn đã tiết kiệm được ${response.data.discount.toLocaleString('vi-VN')}₫`);
      } else {
        setDiscount(0);
        setPromoApplied(false);
        setPromoMessage(`✗ ${response.data.message}`);
      }
    } catch (error) {
      console.log("Lỗi khi áp dụng mã khuyến mãi:", error);
      alert("Không thể áp dụng mã khuyến mãi. Vui lòng thử lại!");
    }
  };

  const getFinalTotal = () => {
    if (getTotalCartAmount() === 0) return 0;
    return getTotalCartAmount() + 10 - discount;
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Sản phẩm</p>
          <p>Tên món</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Thành tiền</p>
          <p>Xóa</p>
        </div>
        <br />
        <hr />

        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{(item.price * 1000).toLocaleString('vi-VN')}₫</p>
                  <p>{cartItems[item._id]}</p>
                  <p>{(item.price * cartItems[item._id] * 1000).toLocaleString('vi-VN')}₫</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Tổng tiền giỏ hàng</h2>
          <div>
            <div className="cart-total-details">
              <p>Tạm tính</p>
              <p>{(getTotalCartAmount() * 1000).toLocaleString('vi-VN')}₫</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{getTotalCartAmount() === 0 ? 0 : (10 * 1000).toLocaleString('vi-VN')}₫</p>
            </div>
            <hr />

            {discount > 0 && (
              <>
                <div className="cart-total-details" style={{ color: 'green' }}>
                  <p>Giảm giá</p>
                  <p>-{(discount * 1000).toLocaleString('vi-VN')}₫</p>
                </div>
                <hr />
              </>
            )}

            <div className="cart-total-details">
              <b>Tổng cộng</b>
              <b>{(getFinalTotal() * 1000).toLocaleString('vi-VN')}₫</b>
            </div>
          </div>

          <button
            onClick={() => nagivate('/order', {
              state: {
                discount: discount,
                subtotal: getTotalCartAmount(),
                delivery: 10
              }
            })}
          >
            TIẾN HÀNH ĐẶT HÀNG
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Nếu bạn có mã khuyến mãi, hãy nhập vào đây</p>

            {promoMessage && (
              <p style={{
                color: promoApplied ? 'green' : 'red',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                {promoMessage}
              </p>
            )}

            <div className='cart-promocode-input'>
              <input
                type="text"
                placeholder='Nhập mã khuyến mãi'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={promoApplied}
              />

              <button onClick={applyPromoCode} disabled={promoApplied}>
                {promoApplied ? 'Đã áp dụng' : 'Áp dụng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
