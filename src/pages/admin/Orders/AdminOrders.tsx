import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../../../styles/admin/AdminOrders.css"; // Import file CSS

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const toast = useRef<any>(null); // Initialize useRef for Toast

  useEffect(() => {
    const fakeOrders = [
      {
        orderID: 21,
        orderDate: "04/02/2025 13:14:21",
        totalAmount: 34993000,
        status: "completed",
        paymentStatus: "completed",
        paymentMethod: "VNPAY",
        paymentDate: "04/02/2025 14:00:00",
      },
      {
        orderID: 22,
        orderDate: "04/02/2025 15:12:09",
        totalAmount: 6297000,
        status: "processing",
        paymentStatus: "completed",
        paymentMethod: "Tiền mặt",
        paymentDate: "04/02/2025 16:00:00",
      },
      {
        orderID: 23,
        orderDate: "05/02/2025 16:48:07",
        totalAmount: 2203000,
        status: "processing",
        paymentStatus: "pending",
        paymentMethod: "VNPAY",
        paymentDate: "",
      },
      {
        orderID: 24,
        orderDate: "06/02/2025 14:32:37",
        totalAmount: 19568000,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "Tiền mặt",
        paymentDate: "",
      },
      {
        orderID: 25,
        orderDate: "07/02/2025 15:00:00",
        totalAmount: 2303000,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "Tiền mặt",
        paymentDate: "",
      },
      {
        orderID: 26,
        orderDate: "08/02/2025 16:48:30",
        totalAmount: 6500000,
        status: "completed",
        paymentStatus: "completed",
        paymentMethod: "VNPAY",
        paymentDate: "08/02/2025 17:00:00",
      },
    ];
    setOrders(fakeOrders);
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

  const showToast = () => {
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: "Đã xác nhận chỉnh sửa!",
      closable: false,
      life: 2000,
    });
  };

  return (
    <div className="main-content">
      <Toast ref={toast} /> {/* Toast component */}
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
                  value={rowData.status}
                  options={orderStatusOptions}
                  onChange={(e) => onStatusChange(e, rowData.orderID, "status")}
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
                      {" "}
                      VN Pay
                    </i>
                  </label>
                ) : (
                  <label htmlFor="cash">
                    <i className="pi pi-wallet" style={{ marginRight: "8px" }}>
                      {" "}
                      Tiền mặt
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
                  onClick={showToast}
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
