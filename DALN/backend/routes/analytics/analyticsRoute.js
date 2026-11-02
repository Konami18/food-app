// import express from 'express';
// import {
//     getOverallStats,
//     getRevenueByDate,
//     getTopSellingProducts,
//     getCustomerAnalytics,
//     exportToCSV
// } from '../../controllers/analytics-reports/analyticsController.js';

// const analyticsRouter = express.Router();

// // Get overall statistics
// analyticsRouter.get('/stats', getOverallStats);

// // Get revenue by date
// analyticsRouter.get('/revenue', getRevenueByDate);

// // Get top selling products
// analyticsRouter.get('/top-products', getTopSellingProducts);

// // Get customer analytics
// analyticsRouter.get('/customers', getCustomerAnalytics);

// // Export data to CSV
// analyticsRouter.get('/export/:type', exportToCSV);

// export default analyticsRouter;



import express from 'express';

import {
    getOverallStats,
    getRevenueByDate,
    getTopSellingProducts,
    getCustomerAnalytics,
    exportToCSV
} from '../../controllers/analytics-reports/analyticsController.js';

import authAdmin from '../../middleware/authAdmin.js';

const analyticsRouter = express.Router();

// Chỉ admin được xem thống kê tổng quan
analyticsRouter.get('/stats', authAdmin, getOverallStats);

// Chỉ admin được xem doanh thu theo ngày
analyticsRouter.get('/revenue', authAdmin, getRevenueByDate);

// Chỉ admin được xem sản phẩm bán chạy
analyticsRouter.get('/top-products', authAdmin, getTopSellingProducts);

// Chỉ admin được xem thống kê khách hàng
analyticsRouter.get('/customers', authAdmin, getCustomerAnalytics);

// Chỉ admin được xuất dữ liệu CSV
analyticsRouter.get('/export/:type', authAdmin, exportToCSV);

export default analyticsRouter;
