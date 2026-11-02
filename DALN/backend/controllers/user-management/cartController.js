
import userModel from "../../models/user/userModel.js";

// Thêm món ăn vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản người dùng"
            });
        }

        const cartData = userData.cartData || {};

        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({
            success: true,
            message: "Đã thêm món ăn vào giỏ hàng"
        });

    } catch (error) {
        console.log("Lỗi thêm vào giỏ hàng:", error);
        res.status(500).json({
            success: false,
            message: "Không thể thêm món ăn vào giỏ hàng"
        });
    }
};


// Xóa một món ăn khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản người dùng"
            });
        }

        const cartData = userData.cartData || {};

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;

            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({
            success: true,
            message: "Đã cập nhật giỏ hàng"
        });

    } catch (error) {
        console.log("Lỗi xóa món khỏi giỏ hàng:", error);
        res.status(500).json({
            success: false,
            message: "Không thể cập nhật giỏ hàng"
        });
    }
};


// Lấy dữ liệu giỏ hàng
const getCart = async (req, res) => {
    try {
        const userId = req.body.userId;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài khoản người dùng"
            });
        }

        const cartData = userData.cartData || {};

        res.json({
            success: true,
            cartData
        });

    } catch (error) {
        console.log("Lỗi lấy giỏ hàng:", error);
        res.status(500).json({
            success: false,
            message: "Không thể lấy dữ liệu giỏ hàng"
        });
    }
};

export { addToCart, removeFromCart, getCart };
