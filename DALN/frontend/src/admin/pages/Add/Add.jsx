
import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("image", image);
      formData.append("category", data.category);

      const token = localStorage.getItem("adminToken");

      const response = await axios.post(
        `${url}/api/food/add`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          category: "Salad",
          price: "",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể thêm món ăn"
      );
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Tải ảnh món ăn</p>
          <label htmlFor="image">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Tên món ăn</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Nhập tên món ăn"
            required
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Mô tả món ăn</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Nhập mô tả món ăn"
            required
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Danh mục món ăn</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
            >
              <option value="Salad">Salad</option>
              <option value="Deserts">Món tráng miệng</option>
              <option value="Rolls">Món cuốn</option>
              <option value="Sandwich">Bánh mì Sandwich</option>
              <option value="Cake">Bánh ngọt</option>
              <option value="Pure Veg">Món chay</option>
              <option value="Pasta">Mì Ý</option>
              <option value="Noodles">Mì</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Giá món ăn (VNĐ)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              placeholder="Nhập giá món ăn"
              min="0"
              required
            />
          </div>
        </div>

        <button type="submit" className="add-btn">
          THÊM MÓN
        </button>
      </form>
    </div>
  );
};

export default Add;
