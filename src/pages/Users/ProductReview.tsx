import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/ProductReview.css";

const ProductReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, product } = location.state || {};

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const UserID = localStorage.getItem("UserID");

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const totalPrice = (product) =>
    product.price - product.price * (product.discountPercent / 100);

  const calculateFinalAmount = (product) =>
    totalPrice(product) * product.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/User/SubmitReview", {
        orderID: product.orderID,
        userID: UserID,
        productID: product.productID,
        rating,
        comment,
      });
      if (res.data.status === "00") {
        setSuccessMessage("Đánh giá của bạn đã được gửi thành công!");
        setTimeout(() => {
          const currentPath = window.location.pathname;
          product.rating = rating;
          const newProducts = products.map((p) =>
            p.productID == product.productID ? product : p
          );
          navigate(`${currentPath.replace(/\/product-review$/, "")}`, {
            state: {
              products: newProducts,
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="review-container">
      <div
        className="back-button"
        onClick={() => {
          const currentPath = window.location.pathname;
          navigate(`${currentPath.replace(/\/product-review$/, "")}`, {
            state: { products },
          });
        }}
      >
        <i className="pi pi-arrow-left"></i>
        <span>Quay lại</span>
      </div>
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
              <strong>{formatPrice(product.price * product.quantity)}</strong>
            )}
          </p>
        </div>
      </div>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""}`}
            onClick={() => {
              setRating(star);
            }}
          >
            ★
          </span>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Nhập đánh giá của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={200}
          ></textarea>
        </div>
        {/* Ẩn nút submit khi hiển thị thông báo thành công */}
        {!successMessage && <button type="submit">Gửi đánh giá</button>}
      </form>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default ProductReview;
