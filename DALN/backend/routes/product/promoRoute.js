// import express from "express";
// import { addPromo, validatePromo, applyPromo, getAllPromos, updatePromo, deletePromo } from "../../controllers/products-management/promoController.js";
// import authMiddleware from "../../middleware/auth.js";

// const promoRouter = express.Router();

// // Add promo code (Admin)
// promoRouter.post("/add", addPromo);

// // Validate promo code (User)
// promoRouter.post("/validate", authMiddleware, validatePromo);

// // Apply promo code after successful payment (User)
// promoRouter.post("/apply", authMiddleware, applyPromo);

// // Get all promo codes (Admin)
// promoRouter.get("/list", getAllPromos);

// // Update promo code (Admin)
// promoRouter.post("/update", updatePromo);

// // Delete promo code (Admin)
// promoRouter.post("/delete", deletePromo);

// export default promoRouter;


import express from "express";
import {
    addPromo,
    validatePromo,
    applyPromo,
    getAllPromos,
    updatePromo,
    deletePromo
} from "../../controllers/products-management/promoController.js";

import authMiddleware from "../../middleware/auth.js";
import authAdmin from "../../middleware/authAdmin.js";

const promoRouter = express.Router();

// Chỉ admin được thêm mã khuyến mãi
promoRouter.post("/add", authAdmin, addPromo);

// Người dùng đã đăng nhập được kiểm tra mã khuyến mãi
promoRouter.post("/validate", authMiddleware, validatePromo);

// Người dùng đã đăng nhập được áp dụng mã khuyến mãi
promoRouter.post("/apply", authMiddleware, applyPromo);

// Chỉ admin được xem toàn bộ mã khuyến mãi
promoRouter.get("/list", authAdmin, getAllPromos);

// Chỉ admin được sửa mã khuyến mãi
promoRouter.post("/update", authAdmin, updatePromo);

// Chỉ admin được xóa mã khuyến mãi
promoRouter.post("/delete", authAdmin, deletePromo);

export default promoRouter;