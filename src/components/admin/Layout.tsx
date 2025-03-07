import { Outlet, useNavigate } from "react-router-dom";
import "../../styles/admin/Layout.css";
import { useState } from "react";
import { PanelMenu } from "primereact/panelmenu";
import Cookies from "js-cookie";

const Layout = () => {
  const navigate = useNavigate();
  const [items] = useState([
    {
      label: "Sản phẩm",
      icon: "pi pi-fw pi-box",
      items: [
        {
          label: "Tất cả sản phẩm",
          icon: "pi pi-fw pi-list",
          command: () => {
            navigate("/admin/products");
          },
        },
        {
          label: "Thêm sản phẩm",
          icon: "pi pi-fw pi-plus",
          command: () => {
            navigate("/admin/products/add");
          },
        },
      ],
    },
    {
      label: "Loại sản phẩm",
      icon: "pi pi-fw pi-tags",
      items: [
        {
          label: "Tất cả loại sản phẩm",
          icon: "pi pi-fw pi-list",
          command: () => {
            navigate("/admin/categories");
          },
        },
        {
          label: "Thêm loại sản phẩm",
          icon: "pi pi-fw pi-plus",
          command: () => {
            navigate("/admin/categories/add");
          },
        },
      ],
    },
    {
      label: "Đơn hàng",
      icon: "pi pi-fw pi-shopping-cart",
      items: [
        {
          label: "Tất cả đơn hàng",
          icon: "pi pi-fw pi-list",
          command: () => {
            navigate("/admin/orders");
          },
        },
      ],
    },
    {
      label: 'Người dùng',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Tất cả người dùng',
          icon: 'pi pi-fw pi-list',
          command: () => { navigate("/admin/users"); }
        },
        {
          label: 'Thêm người dùng',
          icon: 'pi pi-fw pi-plus',
          command: () => { navigate("/admin/users/add"); }
        }
      ]
    },
    {
      label: "Giảm giá",
      icon: "pi pi-fw pi-gift",
      items: [
        {
          label: 'Tất cả giảm giá',
          icon: 'pi pi-fw pi-list',
          command: () => { navigate("/admin/promotions"); }
        },
        {
          label: 'Thêm giảm giá',
          icon: 'pi pi-fw pi-plus',
          command: () => { navigate("/admin/promotions/add"); }
        }
      ],
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-fw pi-sign-out",
      className: "logout-item",
      command: () => {
        handleUserOptions("logout");
      },
    },
  ]);

  const handleUserOptions = (option: string) => {
    switch (option) {
      case "logout":
        localStorage.removeItem("UserID");
        localStorage.removeItem("Role");
        Cookies.remove("user");
        navigate("/auth/login");
        break;
      default:
        break;
    }
  };
  return (
    <>
      <div className="container-fluid">
        <div className="topbar">
          <h2 style={{cursor: "pointer"}} onClick={() => navigate("/admin")}>DHPhoneStore</h2>
        </div>
        <div className="sidebar">
          <PanelMenu model={items} />
        </div>
        <div className="main">
          <Outlet />
          <div className="main-footer">
            <hr />
            <p>&copy; 2025 DHPhoneStore. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Layout;
