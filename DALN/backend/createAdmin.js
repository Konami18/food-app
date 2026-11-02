import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/user/userModel.js";

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = "admin@food.com";
        const password = "admin123@";
        const name = "admin";

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            console.log("Email này đã tồn tại. Không thay đổi tài khoản.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Tạo tài khoản admin thành công!");
        console.log("Email:", email);
    } catch (error) {
        console.error("Không thể tạo admin:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();