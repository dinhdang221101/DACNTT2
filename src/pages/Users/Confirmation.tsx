import { useNavigate } from "react-router-dom";
import "../../styles/PaymentResult.css";

const Confirmation = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/order-history");
  };

  return (
    <div className="result-container">
      <h1>Đặt hàng thành công!</h1>
      <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xử lý.</p>
      <button onClick={handleRedirect} className="redirect-button">
        Xem Lịch Sử Mua Hàng
      </button>
    </div>
  );
};

export default Confirmation;
