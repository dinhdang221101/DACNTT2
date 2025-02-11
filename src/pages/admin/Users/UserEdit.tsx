import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "../../../styles/admin/Add.css"
import { useNavigate, useParams } from "react-router-dom";
import User from "../../../utils/User";
import { Dropdown } from "primereact/dropdown";

const UserEdit = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({
        userID: 0, name: '', phone: '', address: '', email: '', password: '',role: ''
    });
    const { id } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const items = ['Quản lý người dùng', '/', 'Cập nhật người dùng'];
    const roles = [
        { label: 'Khách hàng', value: 'customer' },
        { label: 'Quản trị viên', value: 'admin' }
    ];

    useEffect(() => {
        axios.get(`User/GetUserById/${id}`)
            .then(res => setUser(res.data.data[0])
        );
    }, []);

    const handleClick = (item: string) => {
        if (item === 'Quản lý người dùng') {
            navigate('/admin/users');
        }
    };
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e: any) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        console.log(user);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        if (user.name.trim() && user.email.trim() && 
            user.phone.trim() && user.role.trim()) 
            {
            axios.put(`User/${id}`, user)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Người dùng đã được cập nhật', 
                            life: 2000 
                        });
                    }
                    setUser({ 
                        userID: 0, name: '', phone: '', email: '', 
                        password: '', address: '', role: ''
                    });
                    setSubmitted(false);
                    setTimeout(() => {
                        navigate('/admin/users');
                    }, 2000); 
                });
        }
    };

    return (
        <div className='main-content'>
            <div className="main-header">
                <ul>
                    {items.map((item, index) => (
                        <li 
                            key={index}
                            className={item === 'Quản lý người dùng' ? 'active' : ''}
                            onClick={() => handleClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="form card flex">
                <div className="p-field">
                    <label htmlFor="name">Họ và tên:</label>
                    <InputText id="name" name="name" value={user.name} onChange={handleChange} 
                        className={submitted && !user.name ? 'p-invalid' : ''}/>
                    {submitted && !user.name && <small className="p-error">
                        Vui lòng nhập họ và tên.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email:</label>
                    <InputText id="email" name="email" value={user.email} onChange={handleChange}
                        className={submitted && !user.email ? 'p-invalid' : ''}/>
                    {submitted && !user.email && <small className="p-error">
                        Vui lòng nhập email.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="password">Mật khẩu:</label>
                    <div className="p-inputgroup">
                        <InputText 
                            id="password" name="password" 
                            type={showPassword ? "text" : "password"} 
                            value={user.password || ''} // Giá trị có thể là chuỗi rỗng
                            onChange={handleChange} />
                        <Button 
                            icon={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} 
                            onClick={toggleShowPassword} type="button"
                            className='eye-btn' />
                    </div>
                </div>
                <div className="p-field">
                    <label htmlFor="phone">Số điện thoại:</label>
                    <InputText id="phone" name="phone" value={user.phone} onChange={handleChange}
                        className={submitted && !user.phone ? 'p-invalid' : ''}/>
                    {submitted && !user.phone && <small className="p-error">
                        Vui lòng nhập số điện thoại.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="role">Quyền:</label>
                    <Dropdown 
                        id="role" name="role" 
                        value={user.role} options={roles} 
                        onChange={handleChange} placeholder="Chọn quyền"> 
                    </Dropdown>
                </div>
                <Button className="p-button" label="Cập nhật người dùng" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />

                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default UserEdit;