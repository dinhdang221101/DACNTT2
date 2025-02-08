import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Thêm axios nếu bạn muốn gửi yêu cầu đến server
import "../../styles/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = location.state || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  if (!products || products.length === 0) {
    return <div>Không có sản phẩm nào để thanh toán.</div>;
  }

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const totalPrice = (product) =>
    product.price - product.price * (product.discountPercent / 100);

  const calculateFinalAmount = (product) =>
    totalPrice(product) * product.quantity;

  const calculateTotalAmount = () => {
    return products.reduce((total, product) => {
      return total + calculateFinalAmount(product);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/User/Checkout", {
        ...formData,
        userID: localStorage.getItem("UserID"),
        products: products.map((product) => ({
          ...product,
          price: totalPrice(product),
        })),
        totalAmount,
      });
      if (response.status === 200) {
        navigate("/confirmation");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Trang Thanh Toán</h1>
      <div className="product-summary">
        <h2>Thông tin sản phẩm</h2>
        {products.map((product) => (
          <div key={product.productID} className="product-details">
            <img
              src={product.imageURL}
              alt={product.productName}
              className="product-image-summary"
            />
            <div className="product-info">
              <h3>{product.productName}</h3>
              <p>
                Số lượng: <strong>{product.quantity}</strong>
              </p>
              <p>
                Đơn giá:&nbsp;
                {product.discountPercent > 0 ? (
                  <>
                    <span className="original-price">
                      {formatPrice(product.price)}
                    </span>
                    <span className="discounted-price">
                      {formatPrice(totalPrice(product))}
                    </span>
                  </>
                ) : (
                  <span className="current-price">
                    {formatPrice(product.price)}
                  </span>
                )}
              </p>
              <p>
                Tổng cộng:&nbsp;
                {product.discountPercent > 0 ? (
                  <span>
                    <span className="original-price">
                      {formatPrice(product.price * product.quantity)}
                    </span>
                    <span className="discounted-price">
                      {formatPrice(calculateFinalAmount(product))}
                    </span>
                  </span>
                ) : (
                  <strong>
                    {formatPrice(product.price * product.quantity)}
                  </strong>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="payment-info">
        <h2>Thông tin thanh toán</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ giao hàng</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Thanh toán
          </button>
        </form>
      </div>

      <div className="total-summary">
        <h2>
          Tổng cộng:{" "}
          <span className="discounted-price">{formatPrice(totalAmount)}</span>
        </h2>
      </div>
    </div>
  );
};

export default Checkout;
