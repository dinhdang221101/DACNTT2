import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import axios from "axios"; // Import Axios
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../styles/Register.css"; // Tạo file CSS riêng để tùy chỉnh
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Kiểm tra các trường có được điền hay không
    if (!name || !phone || !email || !password || !confirmPassword) {
      setError("Vui lòng điền tất cả các trường.");
      return;
    }

    // Kiểm tra số điện thoại có hợp lệ không (VD: 10-11 chữ số)
    const phonePattern = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phonePattern.test(phone)) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    // Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    // Kiểm tra đồng ý với điều khoản
    if (!agree) {
      setError("Bạn phải đồng ý với các điều khoản bảo mật cá nhân.");
      return;
    }

    setError("");

    try {
      const response = await axios.post("User/Auth/Register", {
        name,
        phone,
        email,
        password,
      });
      if (response.data.status != "00") {
        setError(response.data.message);
        return;
      }
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng ký tài khoản</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="name">Nhập họ và tên</label>
        <InputText
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Họ và tên"
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Nhập số điện thoại</label>
        <InputText
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại"
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Nhập email</label>
        <InputText
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
      <div className="form-group">
        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
        <InputText
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
        />
      </div>
      <div className="form-group checkbox-group">
        <Checkbox
          inputId="agree"
          checked={agree}
          onChange={(e) => setAgree(e.checked)}
        />
        <span>&nbsp;Tôi đồng ý với các điều khoản bảo mật cá nhân</span>
      </div>
      <Button
        label="Đăng ký"
        onClick={handleRegister}
        className="register-button"
      />
      <p>
        Bạn đã có tài khoản? <a href="/auth/login">Đăng nhập ngay</a>
      </p>
    </div>
  );
};

export default Register;
