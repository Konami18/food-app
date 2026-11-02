import jwt from "jsonwebtoken";
import userModel from "../models/user/userModel.js";

const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Vui lòng đăng nhập"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền quản trị"
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ hoặc đã hết hạn"
        });
    }
};

export default authAdmin;