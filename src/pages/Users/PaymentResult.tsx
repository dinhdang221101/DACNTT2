import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/PaymentResult.css";

const PaymentResult = () => {
  const [result, setResult] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = Object.fromEntries(query.entries());
        const response = await axios.post("/User/ReturnUrl", params);
        console.log(response.data);
        setResult({ message: response.data.message, error: false });
      } catch (error) {
        console.error("Error verifying payment:", error);
        setResult({
          message: "Có lỗi xảy ra khi xác thực giao dịch.",
          error: true,
        });
      }
    };

    if (query.get("vnp_ResponseCode")) {
      verifyPayment();
    }
  }, []);

  const handleRedirect = () => {
    navigate("/order-history");
  };

  return (
    <div className="result-container">
      <h2>Kết Quả Thanh Toán</h2>
      {result ? (
        <div>
          <p className={result.error ? "error-message" : "success-message-pay"}>
            {result.message}
          </p>
          <button onClick={handleRedirect} className="redirect-button">
            Xem Lịch Sử Mua Hàng
          </button>
        </div>
      ) : (
        <p className="loading-message">Đang xác thực giao dịch...</p>
      )}
    </div>
  );
};

export default PaymentResult;
