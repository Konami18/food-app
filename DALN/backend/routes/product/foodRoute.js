// import express from "express"
// import { addFood, listFood, removeFood } from "../../controllers/products-management/foodControllers.js"
// import multer from "multer"


// const foodRouter = express.Router();

// // Image Storage Engine

// const storage = multer.diskStorage({
//     destination: "uploads",
//     filename: (req, file, cb) => {
//         return cb(null, `${Date.now()}-${file.originalname}`)
//     }
// })

// const upload = multer({ storage: storage })

// foodRouter.post("/add", upload.single("image"), addFood)
// foodRouter.get("/list", listFood)
// foodRouter.post("/remove", removeFood);

// export default foodRouter;

import express from "express";
import {
    addFood,
    listFood,
    removeFood
} from "../../controllers/products-management/foodControllers.js";
import multer from "multer";
import authAdmin from "../../middleware/authAdmin.js";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Chỉ admin mới được thêm món ăn
foodRouter.post("/add", authAdmin, upload.single("image"), addFood);

// Khách hàng và admin đều được xem danh sách món ăn
foodRouter.get("/list", listFood);

// Chỉ admin mới được xóa món ăn
foodRouter.post("/remove", authAdmin, removeFood);

export default foodRouter;
