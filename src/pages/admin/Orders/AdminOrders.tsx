import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import axios from "axios";
import "../../../styles/admin/AdminOrders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const toast = useRef<any>(null);

  useEffect(() => {
    axios
      .get("/admin/orders")
      .then((response) => {
        const data = response.data;
        if (data.status === "00") {
          setOrders(
            data.data.map((order) => ({
              orderID: order.orderID,
              orderDate: new Date(order.orderDate).toLocaleString(),
              totalAmount: order.totalAmount,
              orderStatus: order.orderStatus,
              paymentStatus: order.paymentStatus,
              paymentMethod: order.paymentMethodID === 2 ? "VNPAY" : "Tiền mặt",
              paymentDate:
                order.paymentDate !== "0001-01-01T00:00:00"
                  ? new Date(order.paymentDate).toLocaleString()
                  : "",
            }))
          );
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      });
  }, []);

  const orderStatusOptions = [
    { label: "Đang chờ", value: "pending" },
    { label: "Đang xử lý", value: "processing" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  const paymentStatusOptions = [
    { label: "Chưa thanh toán", value: "pending" },
    { label: "Đã thanh toán", value: "completed" },
    { label: "Thanh toán thất bại", value: "failed" },
  ];

  const onStatusChange = (e: any, orderID: number, field: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.orderID === orderID) {
        return { ...order, [field]: e.value };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const getClassForStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      case "failed":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const handleConfirm = (rowData: any) => {
    const payload = {
      orderID: rowData.orderID,
      orderStatus: rowData.orderStatus,
      paymentStatus: rowData.paymentStatus,
    };

    axios
      .post("/admin/orders", payload)
      .then((response) => {
        if (response.data.status === "00") {
          showToast("Đã xác nhận chỉnh sửa!");
        } else {
          showToast("Có lỗi xảy ra khi xác nhận!");
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi gửi yêu cầu xác nhận:", error);
        showToast("Có lỗi xảy ra khi xác nhận!");
      });
  };

  const showToast = (message: string) => {
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: message,
      closable: false,
      life: 2000,
    });
  };

  return (
    <div className="main-content">
      <Toast ref={toast} />
      <div className="main-header">
        <p>Quản lý đơn hàng</p>
      </div>
      <div className="card">
        {orders && orders.length > 0 ? (
          <DataTable
            value={orders}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            sortMode="multiple"
          >
            <Column
              field="orderID"
              header="Mã đơn hàng"
              sortable
              headerClassName="order-id-header"
            ></Column>
            <Column
              field="orderDate"
              header="Ngày đặt hàng"
              sortable
              headerClassName="order-date-header"
            ></Column>
            <Column
              field="totalAmount"
              header="Tổng số tiền"
              sortable
              headerClassName="total-amount-header"
              body={(rowData) => rowData.totalAmount.toLocaleString()}
            ></Column>
            <Column
              field="status"
              header="Trạng thái"
              sortable
              headerClassName="status-header"
              body={(rowData) => (
                <Dropdown
                  value={rowData.orderStatus}
                  options={orderStatusOptions}
                  onChange={(e) =>
                    onStatusChange(e, rowData.orderID, "orderStatus")
                  }
                  placeholder="Chọn trạng thái"
                  itemTemplate={(option) => (
                    <div
                      className={`status-label ${getClassForStatus(option.value)}`}
                    >
                      {option.label}
                    </div>
                  )}
                  valueTemplate={(option) => (
                    <div
                      className={`status-label ${getClassForStatus(option.value)}`}
                    >
                      {option.label}
                    </div>
                  )}
                />
              )}
            ></Column>
            <Column
              field="paymentStatus"
              header="Trạng thái thanh toán"
              sortable
              headerClassName="payment-status-header"
              body={(rowData) => (
                <Dropdown
                  value={rowData.paymentStatus}
                  options={paymentStatusOptions}
                  onChange={(e) =>
                    onStatusChange(e, rowData.orderID, "paymentStatus")
                  }
                  placeholder="Chọn trạng thái thanh toán"
                  itemTemplate={(option) => (
                    <div
                      className={`status-label ${getClassForStatus(option.value)}`}
                    >
                      {option.label}
                    </div>
                  )}
                  valueTemplate={(option) => (
                    <div
                      className={`status-label ${getClassForStatus(option.value)}`}
                    >
                      {option.label}
                    </div>
                  )}
                />
              )}
            ></Column>
            <Column
              field="paymentMethod"
              header="Phương thức"
              sortable
              headerClassName="payment-method-header"
              body={(rowData) =>
                rowData.paymentMethod === "VNPAY" ? (
                  <label htmlFor="vnpay">
                    <i
                      className="pi pi-credit-card"
                      style={{ marginRight: "8px" }}
                    >
                      &nbsp;VN Pay
                    </i>
                  </label>
                ) : (
                  <label htmlFor="cash">
                    <i className="pi pi-wallet" style={{ marginRight: "8px" }}>
                      &nbsp;Tiền mặt
                    </i>
                  </label>
                )
              }
            ></Column>
            <Column
              field="paymentDate"
              header="Ngày thanh toán"
              sortable
              headerClassName="payment-date-header"
            ></Column>
            <Column
              header="Hành động"
              body={(rowData) => (
                <Button
                  label="Xác nhận"
                  onClick={() => handleConfirm(rowData)}
                  className="confirm-button"
                />
              )}
            ></Column>
          </DataTable>
        ) : (
          <p>Đang tải...</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
