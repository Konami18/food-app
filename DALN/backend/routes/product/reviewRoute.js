// import express from "express";
// import { 
//     addReview, 
//     getFoodReviews, 
//     getAllReviews, 
//     deleteReview,
//     markHelpful,
//     addAdminReply,
//     getReviewsFiltered
// } from "../../controllers/products-management/reviewController.js";
// import authMiddleware from "../../middleware/auth.js";
// import multer from "multer";

// const reviewRouter = express.Router();

// // Image storage configuration for review images
// const storage = multer.diskStorage({
//     destination: "uploads/reviews",
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}_${file.originalname}`);
//     }
// });

// const upload = multer({ storage: storage });

// // Add review (requires authentication)
// reviewRouter.post("/add", authMiddleware, upload.array("images", 5), addReview);

// // Get reviews for a specific food
// reviewRouter.get("/food/:foodId", getFoodReviews);

// // Get reviews with filters
// reviewRouter.get("/food/:foodId/filtered", getReviewsFiltered);

// // Mark review as helpful (requires authentication)
// reviewRouter.post("/helpful/:reviewId", authMiddleware, markHelpful);

// // Admin reply to review
// reviewRouter.post("/reply/:reviewId", addAdminReply);

// // Get all reviews (admin)
// reviewRouter.get("/all", getAllReviews);

// // Delete review (admin)
// reviewRouter.post("/delete", deleteReview);

// export default reviewRouter;



import express from "express";
import {
    addReview,
    getFoodReviews,
    getAllReviews,
    deleteReview,
    markHelpful,
    addAdminReply,
    getReviewsFiltered
} from "../../controllers/products-management/reviewController.js";

import authMiddleware from "../../middleware/auth.js";
import authAdmin from "../../middleware/authAdmin.js";
import multer from "multer";

const reviewRouter = express.Router();

// Image storage configuration for review images
const storage = multer.diskStorage({
    destination: "uploads/reviews",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Khách hàng đã đăng nhập gửi đánh giá
reviewRouter.post(
    "/add",
    authMiddleware,
    upload.array("images", 5),
    addReview
);

// Công khai: xem đánh giá của một món ăn
reviewRouter.get("/food/:foodId", getFoodReviews);

// Công khai: xem đánh giá có bộ lọc
reviewRouter.get("/food/:foodId/filtered", getReviewsFiltered);

// Khách hàng đã đăng nhập đánh dấu đánh giá hữu ích
reviewRouter.post("/helpful/:reviewId", authMiddleware, markHelpful);

// Chỉ admin được phản hồi đánh giá
reviewRouter.post("/reply/:reviewId", authAdmin, addAdminReply);

// Chỉ admin được xem tất cả đánh giá
reviewRouter.get("/all", authAdmin, getAllReviews);

// Chỉ admin được xóa đánh giá
reviewRouter.post("/delete", authAdmin, deleteReview);

export default reviewRouter;