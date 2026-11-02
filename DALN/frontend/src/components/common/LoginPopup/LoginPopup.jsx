
import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../../assets/assets';
import { StoreContext } from '../../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    try {
      const endpoint =
        currState === 'Login'
          ? '/api/user/login'
          : '/api/user/register';

      const response = await axios.post(`${url}${endpoint}`, data);

      if (!response.data.success) {
        alert(response.data.message || 'Đăng nhập thất bại');
        return;
      }

      const { token, role } = response.data;

      if (currState === 'Login' && role === 'admin') {
        localStorage.setItem('adminToken', token);
        setShowLogin(false);
        navigate('/admin', { replace: true });
        return;
      }

      // Đăng nhập khách hàng hoặc đăng ký tài khoản mới
      localStorage.setItem('token', token);
      setToken(token);
      setShowLogin(false);

      // Nếu đang ở trang khác, đưa khách hàng về trang chủ
      if (window.location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Không thể kết nối đến máy chủ'
      );
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState === 'Login' ? 'Đăng nhập' : 'Đăng ký'}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Đóng"
          />
        </div>

        <div className="login-popup-inputs">
          {currState !== 'Login' && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Họ và tên"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Địa chỉ email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>

        <button type="submit">
          {currState === 'Sign Up' ? 'Tạo tài khoản' : 'Đăng nhập'}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            Bằng cách tiếp tục, tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.
          </p>
        </div>

        {currState === 'Login' ? (
          <p>
            Bạn chưa có tài khoản?{' '}
            <span onClick={() => setCurrState('Sign Up')}>
              Đăng ký ngay
            </span>
          </p>
        ) : (
          <p>
            Bạn đã có tài khoản?{' '}
            <span onClick={() => setCurrState('Login')}>
              Đăng nhập ngay
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
