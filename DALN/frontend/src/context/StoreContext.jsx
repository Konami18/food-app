import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState(
        localStorage.getItem("token") || ""
    );
    const [food_list, setFoodList] = useState([]);

    const url = "http://localhost:4000";

    // Thêm món vào giỏ hàng
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/add`,
                    { itemId },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Lỗi thêm món vào giỏ hàng:", error);
            }
        }
    };

    // Xóa bớt một món khỏi giỏ hàng
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const currentQuantity = prev[itemId] || 0;

            if (currentQuantity <= 1) {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            }

            return {
                ...prev,
                [itemId]: currentQuantity - 1,
            };
        });

        if (token) {
            try {
                await axios.post(
                    `${url}/api/cart/remove`,
                    { itemId },
                    { headers: { token } }
                );
            } catch (error) {
                console.error("Lỗi xóa món khỏi giỏ hàng:", error);
            }
        }
    };

    // Tính tổng tiền giỏ hàng
    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find(
                    (product) => product._id === item
                );

                if (itemInfo) {
                    totalAmount +=
                        Number(itemInfo.price) * cartItems[item];
                }
            }
        }

        return totalAmount;
    };

    // Lấy danh sách món ăn từ backend
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(
                `${url}/api/food/list`
            );

            if (response.data.success) {
                const foods = Array.isArray(response.data.data)
                    ? response.data.data
                    : [];

                setFoodList(foods);

                console.log(
                    "Đã tải danh sách món ăn:",
                    foods.length,
                    "món"
                );
            } else {
                console.error(
                    "Backend không trả về danh sách món ăn:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error(
                "Lỗi tải danh sách món ăn:",
                error.response?.data || error.message
            );
        }
    };

    // Lấy dữ liệu giỏ hàng từ backend
    const loadCartData = async (userToken) => {
        try {
            const response = await axios.post(
                `${url}/api/cart/get`,
                {},
                { headers: { token: userToken } }
            );

            if (response.data.success) {
                setCartItems(response.data.cartData || {});
            }
        } catch (error) {
            console.error(
                "Lỗi tải giỏ hàng:",
                error.response?.data || error.message
            );
        }
    };

    // Tải dữ liệu khi ứng dụng khởi động
    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();

            const savedToken = localStorage.getItem("token");

            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        };

        loadData();
    }, []);

    const contextValue = {
        food_list,
        setFoodList,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;