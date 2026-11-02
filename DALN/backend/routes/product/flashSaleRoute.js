// import express from 'express';
// import { 
//     getActiveFlashSales, 
//     getAllFlashSales, 
//     createFlashSale, 
//     updateFlashSale, 
//     deleteFlashSale,
//     toggleFlashSaleStatus,
//     getFlashSalePrice
// } from '../../controllers/products-management/flashSaleController.js';
// import authMiddleware from '../../middleware/auth.js';

// const flashSaleRouter = express.Router();

// // Public routes
// flashSaleRouter.get('/active', getActiveFlashSales);
// flashSaleRouter.get('/price/:foodId', getFlashSalePrice);

// // Admin routes (no auth required for admin panel in current setup)
// flashSaleRouter.get('/all', getAllFlashSales);
// flashSaleRouter.post('/create', createFlashSale);
// flashSaleRouter.put('/update/:id', updateFlashSale);
// flashSaleRouter.delete('/delete/:id', deleteFlashSale);
// flashSaleRouter.patch('/toggle/:id', toggleFlashSaleStatus);

// export default flashSaleRouter;


import express from 'express';

import {
    getActiveFlashSales,
    getAllFlashSales,
    createFlashSale,
    updateFlashSale,
    deleteFlashSale,
    toggleFlashSaleStatus,
    getFlashSalePrice
} from '../../controllers/products-management/flashSaleController.js';

import authAdmin from '../../middleware/authAdmin.js';

const flashSaleRouter = express.Router();

// API công khai: khách hàng xem Flash Sale đang hoạt động
flashSaleRouter.get('/active', getActiveFlashSales);

// API công khai: khách hàng xem giá Flash Sale của món ăn
flashSaleRouter.get('/price/:foodId', getFlashSalePrice);

// API chỉ dành cho admin
flashSaleRouter.get('/all', authAdmin, getAllFlashSales);
flashSaleRouter.post('/create', authAdmin, createFlashSale);
flashSaleRouter.put('/update/:id', authAdmin, updateFlashSale);
flashSaleRouter.delete('/delete/:id', authAdmin, deleteFlashSale);
flashSaleRouter.patch('/toggle/:id', authAdmin, toggleFlashSaleStatus);

export default flashSaleRouter;