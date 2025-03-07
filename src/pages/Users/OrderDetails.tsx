/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = location.state || {};

  if (!products || products.length === 0) {
    return <div>Không thể xem lịch sử của đơn này.</div>;
  }

  const formatPrice = (price: any) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const totalPrice = (product: any) =>
    product.price - product.price * (product.discountPercent / 100);

  const calculateFinalAmount = (product: any) =>
    totalPrice(product) * product.quantity;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
        if (products[0].paymentMethodID == 2) { 
          const vnpayResponse = await axios.post("/User/VNPay", {
            totalAmount: products[0].totalAmount,
            orderID: products[0].orderID, 
          });

          window.location.href = vnpayResponse.data.paymentUrl; 
        } else {
          navigate("/confirmation");
        }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="checkout-container">
      <div className="back-button" onClick={() => navigate("/order-history")}>
        <i className="pi pi-arrow-left"></i>
        <span>Quay lại</span>
      </div>
      <h2>Chi tiết lịch sử đơn hàng</h2>
      <div className="product-summary">
        <h2>Thông tin sản phẩm</h2>
        {products.map((product: any) => (
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
              <div className="rating-container">
                {product.rating > 0 ? (
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-details star ${star <= product.rating ? "filled" : ""}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                ) : product.orderStatus == "completed" && (
                  <div
                    className="back-button"
                    style={{ width: "fit-content" }}
                    onClick={() => {
                      const currentPath = window.location.pathname;
                      navigate(`${currentPath}/product-review`, {
                        state: { products, product },
                      });
                    }}
                  >
                    <span>Đánh giá</span>
                  </div>
                )}
              </div>
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
              disabled
              name="name"
              value={products[0].name}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              disabled
              name="email"
              value={products[0].email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Địa chỉ giao hàng</label>
            <input
              type="text"
              id="address"
              name="address"
              disabled
              value={products[0].address}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              disabled
              value={products[0].phone}
              required
            />
          </div>
          {products[0].paymentMethodID == 2 && products[0].paymentStatus == "pending" && <button type="submit" className="submit-button">
            Thanh toán
          </button>}
        </form>
      </div>

      <div className="total-summary">
        <h2>
          Tổng cộng:{" "}
          <span className="discounted-price">
            {formatPrice(products[0].totalAmount)}
          </span>
        </h2>
      </div>
    </div>
  );
};

export default Checkout;
