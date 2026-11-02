
import React from 'react'
import './Sidebar.css'
import { assets } from '../../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">

        <NavLink to='/admin' end className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Tổng quan</p>
        </NavLink>

        <NavLink to='/admin/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Thêm món ăn</p>
        </NavLink>

        <NavLink to='/admin/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Danh sách món ăn</p>
        </NavLink>

        <NavLink to='/admin/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Đơn hàng</p>
        </NavLink>

        <NavLink to='/admin/promo' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Mã khuyến mãi</p>
        </NavLink>

        <NavLink to='/admin/flashsale' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Khuyến mãi chớp nhoáng</p>
        </NavLink>

        <NavLink to='/admin/reviews' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Đánh giá</p>
        </NavLink>

        <NavLink to='/admin/analytics' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Thống kê</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
