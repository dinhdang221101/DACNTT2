import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import "../../styles/OrderHistory.css"; // Đảm bảo tạo file CSS này

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserID");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get(`/User/OrderHistory/${userId}`);
        if (response.data.status === "00") {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    fetchOrderHistory();
  }, [userId]);

  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const viewOrderDetails = (rowData: any) => {
    navigate(`/order-history/${rowData[0].orderID}`, {
      state: {
        products: rowData,
      },
    });
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        label="Chi tiết"
        className="submit-button"
        onClick={() => viewOrderDetails(rowData)}
      />
    );
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Hàm để hiển thị thông tin sản phẩm trong đơn hàng
  const productBodyTemplate = (rowData: any) => {
    return (
      <div>
        {rowData.map((product: any) => (
          <div
            key={`${product.productName}_${rowData.orderID}`}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={product.imageURL}
              alt={product.productName}
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
            <span>
              {product.productName} <strong>x{product.quantity}</strong>
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Hàm để hiển thị trạng thái với thẻ tương ứng
  const statusBodyTemplate = (rowData: any) => {
    const statusMap = {
      pending: { label: "Đang chờ", severity: "warning" },
      processing: { label: "Đang xử lý", severity: "info" },
      completed: { label: "Hoàn thành", severity: "success" },
      cancelled: { label: "Đã hủy", severity: "danger" },
    };

    const orderStatus: keyof typeof statusMap = rowData[0].orderStatus;
    const status = statusMap[orderStatus] || {
      label: "Không xác định",
      severity: "help",
    };

    return <Tag value={status.label} severity={status.severity as "warning" | "info" | "success" | "danger" | "secondary" | "contrast" | undefined} />;
  };

  if (orders.length === 0) {
    return <div className="empty-orders">Bạn chưa có đơn hàng nào.</div>;
  }

  return (
    <div className="order-history">
      <h2>Lịch sử mua hàng của bạn</h2>
      <DataTable value={orders}>
        <Column
          field="orderID"
          header="Mã đơn hàng"
          body={(rowData) => rowData[0].orderID}
        />
        <Column
          field="orderDate"
          header="Ngày đặt hàng"
          body={(rowData) => formatDate(rowData[0].orderDate)}
        />
        <Column
          field="totalAmount"
          header="Tổng số tiền"
          body={(rowData) => formatPrice(rowData[0].totalAmount)}
        />
        <Column
          field="status"
          header="Trạng thái"
          body={statusBodyTemplate} // Sử dụng hàm hiển thị trạng thái
        />
        <Column header="Sản phẩm" body={productBodyTemplate} />
        <Column header="" body={actionBodyTemplate} />
      </DataTable>
    </div>
  );
};

export default OrderHistory;
