import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products }: any = location.state || {};
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    address: "",
    phone: "",
    paymentMethod: 3, 
  });

  if (!products || products.length === 0) {
    return <div>Không có sản phẩm nào để thanh toán.</div>;
  }

  const formatPrice = (price: any) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";

  const totalPrice = (product: any) =>
    product.price - product.price * (product.discountPercent / 100);

  const calculateFinalAmount = (product: any) =>
    totalPrice(product) * product.quantity;

  const calculateTotalAmount = () => {
    return products.reduce((total: any, product: any) => {
      return total + calculateFinalAmount(product);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post("/User/Checkout", {
        ...formData,
        userID: localStorage.getItem("UserID"),
        products: products.map((product: any) => ({
          ...product,
          price: totalPrice(product),
        })),
        totalAmount,
      });
      if (response.status === 200) {
        if (formData.paymentMethod == 2) { 
          const vnpayResponse = await axios.post("/User/VNPay", {
            totalAmount,
            orderID: response.data.data, 
          });

          window.location.href = vnpayResponse.data.paymentUrl; 
        } else {
          navigate("/confirmation");
        }
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
          
          <div className="payment-methods">
            <h3>Phương thức thanh toán</h3>
            <div className="payment-option">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="3"
                checked={formData.paymentMethod == 3}
                onChange={handleChange}
              />
              <label htmlFor="cash">
                <i className="pi pi-wallet" style={{ marginRight: "8px" }}></i>
                Tiền mặt
              </label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="vnpay"
                name="paymentMethod"
                value="2"
                checked={formData.paymentMethod == 2}
                onChange={handleChange}
              />
              <label htmlFor="vnpay">
                <i className="pi pi-credit-card" style={{ marginRight: "8px" }}></i>
                VNPay
              </label>
            </div>
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