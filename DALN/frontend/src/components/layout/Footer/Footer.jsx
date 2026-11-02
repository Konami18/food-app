import React from 'react'
import './Footer.css'
import { assets } from '../../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>Chúng tôi mang đến cho bạn những món ăn thơm ngon, tươi mới, được chế biến bằng tất cả niềm đam mê ẩm thực. Đặt món dễ dàng – giao hàng nhanh chóng – thưởng thức hương vị tuyệt vời ngay hôm nay!</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-content-center">
          {/* nội dung phần giữa */}
          <h2>Công ty</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Giới thiệu</li>
            <li>Đặt hàng</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div className="footer-content-right">
          {/* nội dung phần phải */}
          <h2>Liên Hệ</h2>
          <ul>
            <li>0945 - 648 - JQk</li>
            <li>contact@konami.components</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © Konami.com - All Rights Reserved.
      </p>
    </div>
  )
}

export default Footer
