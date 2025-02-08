/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Layout = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const UserID = localStorage.getItem("UserID");
  useEffect(() => {
    const user = Cookies.get("user");
    setIsLoggedIn(!!UserID && !!user);
    axios.get("Category").then((res) => {
      setCategories(res.data.data);
    });
  }, [UserID]);

  const renderMenuItem = (item: any) => {
    const isActive = location.pathname === item.url;
    return (
      <a
        href={item.url}
        className={`menu-item ${isActive ? "active-menu-item" : "inactive-menu-item"}`}
      >
        {item.label}
      </a>
    );
  };

  const menuItems = categories.map((category: any) => ({
    label: category.categoryName,
    url: `/category/${category.categoryID}`,
    template: renderMenuItem,
  }));

  const handleUserOptions = (option: any) => {
    switch (option) {
      case "history":
        navigate("/order-history");
        break;
      case "change-password":
        navigate("#");
        break;
      case "logout":
        localStorage.removeItem("UserID");
        localStorage.removeItem("Role");
        Cookies.remove("user");
        setIsLoggedIn(false);
        navigate("/auth/login");
        break;
      default:
        break;
    }
  };

  const userMenuItems = [
    {
      label: "Xem lịch sử mua hàng",
      command: () => handleUserOptions("history"),
    },
    {
      label: "Đổi mật khẩu",
      command: () => handleUserOptions("change-password"),
    },
    { label: "Đăng xuất", command: () => handleUserOptions("logout") },
  ];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/?query=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="container">
        <div className="header">
          <div className="logo" onClick={() => navigate("/")}>
            <h2 style={{ cursor: "pointer" }}>DHPhoneStore</h2>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              icon="pi pi-search"
              className="p-button-outlined"
              onClick={handleSearch}
            />
          </div>
          <div className="header-buttons">
            {isLoggedIn ? (
              <>
                <Dropdown
                  value={null}
                  options={userMenuItems}
                  onChange={(e) => e.value.command()}
                  placeholder="👤"
                  className="p-button-info"
                />
                <Button
                  icon="pi pi-shopping-cart"
                  className="p-button-success"
                  onClick={() => navigate("/cart")}
                  style={{ color: "black" }}
                />
              </>
            ) : (
              <>
                <Button
                  label="Đăng nhập"
                  className="p-button-info"
                  onClick={() => navigate("/auth/login")}
                  style={{ color: "black" }}
                />
                <Button
                  label="Đăng ký"
                  onClick={() => navigate("/auth/register")}
                  className="p-button-success"
                  style={{ color: "black" }}
                />
              </>
            )}
          </div>
        </div>

        <Menubar model={menuItems} className="menu-bar" />
      </div>

      {/* Main content */}
      <main style={{ marginTop: "8rem" }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div>
            <h4>Chính sách</h4>
            <ul>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#">Chính sách giao hàng</a>
              </li>
              <li>
                <a href="#">Chính sách hoàn trả</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <p>
              Hotline: <a href="#">+123 456 789</a>
            </p>
            <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
            <p>
              Email: <a href="#">info@example.com</a>
            </p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/dang.dinh.2211"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="pi pi-facebook"
                  style={{ fontSize: "1.5rem", marginRight: "10px" }}
                ></i>
              </a>
              <a
                href="https://zalo.me/0377100663"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/src/assets/zalo-icon.png"
                  style={{ fontSize: "1.5rem", width: "24px" }}
                />
              </a>
            </div>
          </div>
        </div>
        <hr />
        <p>&copy; 2025 DHPhoneStore. Tất cả các quyền được bảo lưu.</p>
      </footer>
    </div>
  );
};

export default Layout;
