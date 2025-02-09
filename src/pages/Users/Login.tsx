import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import axios from "axios"; 
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../styles/Login.css"; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng điền tất cả các trường.");
      return;
    }

    setError("");

    try {
      const response = await axios.post("User/Auth/Login", {
        email,
        password,
      });
      if (response.data.status !== "00") {
        setError(response.data.message);
        return;
      }

      localStorage.setItem("UserID", response.data.data.userID);
      localStorage.setItem("Role", response.data.data.role);

      Cookies.set("user", JSON.stringify(response.data.data), {
        expires: 7,
      });

      if (response.data.data.role == "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setError("Tài khoản hoặc mật khẩu không chính xác.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập tài khoản</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="email">Nhập email hoặc số điện thoại</label>
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email hoặc số điện thoại"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Nhập mật khẩu</label>
        <InputText
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
        />
      </div>
      <Button
        label="Đăng nhập"
        onClick={handleLogin}
        className="login-button"
      />
      <p>
        Bạn chưa có tài khoản? <a href="/auth/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default Login;
