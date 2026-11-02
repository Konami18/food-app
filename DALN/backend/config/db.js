// import mongoose from "mongoose";


// export const connectDB = async () => {
//     await mongoose.connect('mongodb+srv://greatstack:13022004@cluster0.igpdgep.mongodb.net/daln').then(() => console.log("DB Connected"));
// }

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};