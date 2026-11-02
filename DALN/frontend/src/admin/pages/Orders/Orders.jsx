
import React from 'react';
import './Orders.css';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        url + "/api/order/list",
        {
          headers: {
            token: token
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi tải danh sách đơn hàng"
      );
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: event.target.value
        },
        {
          headers: {
            token: token
          }
        }
      );

      if (response.data.success) {
        toast.success("Cập nhật trạng thái đơn hàng thành công");
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng"
      );
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Quản lý đơn hàng</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="Đơn hàng" />

            <div>
              <p className='order-item-food'>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>

              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>

              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city + ", " +
                    order.address.state + ", " +
                    order.address.country + ", " +
                    order.address.zipcode}
                </p>
              </div>

              <p className='order-item-phone'>
                {order.address.phone}
              </p>
            </div>

            <p>Số món: {order.items.length}</p>

            <p>
              {(order.amount * 1000).toLocaleString('vi-VN')} ₫
            </p>

            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Đang xử lý</option>
              <option value="Out For Delivery">Đang giao hàng</option>
              <option value="Delivered">Đã giao hàng</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
