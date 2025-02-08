import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "../../styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");
  const [statusToast, setStatusToast] = useState<boolean>(false);
  const navigate = useNavigate();
  const reviewsPerPage = 3;

  useEffect(() => {
    // Lấy thông tin sản phẩm
    axios.get(`/Product/GetProductById/${id}`).then((res) => {
      if (res.data.data.length > 0) {
        setProduct(res.data.data[0]);

        // Sau khi lấy sản phẩm thành công, lấy danh sách đánh giá
        axios.get(`/Product/GetReviewsByProductId/${id}`).then((reviewRes) => {
          setReviews(reviewRes.data.data); // Giả sử dữ liệu đánh giá nằm trong reviewRes.data.data
        });
      }
    });
  }, [id]);

  useEffect(() => {
    const sortedReviews = [...reviews].sort((a, b) =>
      sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
    );
    setReviews(sortedReviews);
  }, [sortOrder]);

  if (!product) {
    return <div className="loading">Đang tải...</div>;
  }

  const formatPrice = (price: any) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = Number(calculateAverageRating());
  const totalReviews = reviews.length;

  const onBuyNow = () => {
    product.quantity = quantity;
    navigate("/checkout", {
      state: {
        products: [product],
      },
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(Number(e.target.value), product.stock));
    setQuantity(value);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="star-rating-product">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingStats = () => {
    const ratingCounts = [0, 0, 0, 0, 0]; // Từ 1 sao đến 5 sao
    reviews.forEach((review) => ratingCounts[review.rating - 1]++);

    return (
      <div className="rating-stats">
        {ratingCounts.map((index) => (
          <div key={index} className="rating-row">
            <span>{5 - index} Sao</span>
            <div className="rating-bar">
              <div
                className="rating-fill"
                style={{
                  width: `${(ratingCounts[4 - index] / totalReviews) * 100}%`,
                }}
              ></div>
            </div>
            <span>{ratingCounts[4 - index]}</span>
          </div>
        ))}
      </div>
    );
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (direction: "next" | "prev") => {
    if (
      direction === "next" &&
      currentPage < Math.ceil(totalReviews / reviewsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBackClick = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  const onAddToCart = async () => {
    try {
      const response = await axios.post("/User/AddToCart", {
        userID: localStorage.getItem("UserID"),
        productID: product.productID,
        quantity: quantity,
      });

      if (response.data.status !== "00") {
        setToast(response.data.message);
        setStatusToast(false);
      } else {
        setToast("Đã thêm vào giỏ hàng.");
        setStatusToast(true);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="product-detail">
      {showToast && (
        <div className={`toast ${statusToast ? "" : "error-toast"}`}>
          {toast}
        </div>
      )}
      <div className="back-button" onClick={handleBackClick}>
        <i className="pi pi-arrow-left"></i>
        <span>Quay lại</span>
      </div>
      <div className="product-header">
        <img
          src={product.imageURL}
          alt={product.productName}
          className="product-image"
        />
        <div className="product-info">
          <h1>{product.productName}</h1>
          <p className="product-price">
            {product.discountPercent > 0 && (
              <span className="original-price">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="discounted-price">
              {formatPrice(
                product.price - product.price * (product.discountPercent / 100)
              )}
            </span>
          </p>

          <div className="rating">
            <span className="average-rating">{averageRating} sao</span>
            <span className="total-reviews">({totalReviews} đánh giá)</span>
            {renderStars(Math.round(averageRating))}
          </div>

          <p className="stock-info">
            <strong>Hàng còn:</strong> {product.stock} sản phẩm
          </p>
          <div className="quantity-selector">
            <label htmlFor="quantity">Số lượng:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              min="1"
              max={product.stock}
              onChange={handleQuantityChange}
            />
          </div>
          <div className="actions">
            <Button
              label="Thêm vào giỏ hàng"
              className="p-button-secondary"
              onClick={onAddToCart}
              disabled={product.stock === 0}
            />
            <Button
              label="Mua ngay"
              className="p-button-warning"
              onClick={onBuyNow}
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </div>
      <div className="product-description">
        <h2>Thông số kỹ thuật</h2>
        <div style={{whiteSpace: "pre-line"}}>{product.description}</div>
      </div>
      <div className="product-reviews">
        <h2>Đánh giá</h2>
        <div className="sort-options">
          <span>Sắp xếp theo:</span>
          <Button
            label="Tăng dần"
            onClick={() => setSortOrder("asc")}
            className={sortOrder === "asc" ? "active" : "inactive"}
          />
          <Button
            label="Giảm dần"
            onClick={() => setSortOrder("desc")}
            className={sortOrder === "desc" ? "active" : "inactive"}
          />
        </div>
        {renderRatingStats()}
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => (
            <div key={review.id} className="review">
              <strong>{review.fullName}</strong>
              <p>{review.comment}</p>
              {renderStars(review.rating)}
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
        <div className="pagination">
          <Button
            label="Trước"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            style={{ color: "#0f0f0f" }}
          />
          <span>
            {currentPage} / {Math.ceil(totalReviews / reviewsPerPage)}
          </span>
          <Button
            label="Sau"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === Math.ceil(totalReviews / reviewsPerPage)}
            style={{ color: "#0f0f0f" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
