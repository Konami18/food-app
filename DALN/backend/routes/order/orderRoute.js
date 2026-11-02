// import express from "express"
// import authMiddleware from "../../middleware/auth.js"
// import { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getOrderTracking } from "../../controllers/orders-management/orderController.js"

// const orderRoute = express.Router();

// orderRoute.post("/place", authMiddleware, placeOrder, placeOrder);
// orderRoute.post("/verify", verifyOrder)
// orderRoute.post("/userorders", authMiddleware, userOrders);
// orderRoute.get("/list", listOrders)
// orderRoute.post("/status",updateStatus)
// orderRoute.get("/tracking/:orderId", authMiddleware, getOrderTracking);

// export default orderRoute;

import express from "express";
import authMiddleware from "../../middleware/auth.js";
import authAdmin from "../../middleware/authAdmin.js";

import {
    placeOrder,
    verifyOrder,
    userOrders,
    listOrders,
    updateStatus,
    getOrderTracking
} from "../../controllers/orders-management/orderController.js";

const orderRoute = express.Router();

// Khách hàng đặt hàng
orderRoute.post("/place", authMiddleware, placeOrder);

// Xác minh thanh toán
orderRoute.post("/verify", verifyOrder);

// Khách hàng xem đơn hàng của mình
orderRoute.post("/userorders", authMiddleware, userOrders);

// Chỉ admin được xem danh sách tất cả đơn hàng
orderRoute.get("/list", authAdmin, listOrders);

// Chỉ admin được cập nhật trạng thái đơn hàng
orderRoute.post("/status", authAdmin, updateStatus);

// Khách hàng xem quá trình giao hàng
orderRoute.get("/tracking/:orderId", authMiddleware, getOrderTracking);

export default orderRoute;