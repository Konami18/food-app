import events from "events";
events.EventEmitter.defaultMaxListeners = 20;

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/product/foodRoute.js";
import userRouter from "./routes/user/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/user/cartRoute.js";
import orderRoute from "./routes/order/orderRoute.js";
import reviewRouter from "./routes/product/reviewRoute.js";
import promoRouter from "./routes/product/promoRoute.js";
import favoriteRouter from "./routes/user/favoriteRoute.js";
import addressRouter from "./routes/user/addressRoute.js";
import loyaltyRouter from "./routes/user/loyaltyRoute.js";
import flashSaleRouter from "./routes/product/flashSaleRoute.js";
import recommendationRouter from "./routes/analytics/recommendationRoute.js";
import analyticsRouter from "./routes/analytics/analyticsRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
    origin: process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
        : true
}));

app.use(express.json());

connectDB();

app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRoute);
app.use("/api/review", reviewRouter);
app.use("/api/promo", promoRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/address", addressRouter);
app.use("/api/loyalty", loyaltyRouter);
app.use("/api/flashsale", flashSaleRouter);
app.use("/api/recommendation", recommendationRouter);
app.use("/api/analytics", analyticsRouter);

app.get("/", (req, res) => {
    res.send("API Working");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server started on port ${port}`);
});