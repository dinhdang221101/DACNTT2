import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "../../../styles/admin/Add.css"
import { useNavigate, useParams } from "react-router-dom";
import Category from "../../../utils/Category";

const CategoryEdit = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>({
        categoryID: 0, categoryName: '', description: ''
    });
    const { id } = useParams();

    useEffect(() => {
        axios.get(`Category/GetCategoryById/${id}`)
            .then(res => setCategory(res.data.data[0])
        );
    }, []);

    const items = ['Quản lý loại sản phẩm', '/', 'Cập nhật loại sản phẩm']
    const handleClick = (item: string) => {
        if (item === 'Quản lý loại sản phẩm') {
            navigate('/admin/categories');
        }
    };

    const handleChange = (e: any) => {
        setCategory({ ...category, [e.target.name]: e.target.value });
        console.log(category);
    };

    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        if (category.categoryName.trim() && category.description.trim()) 
            {
            axios.put(`Category/${id}`, category)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Loại sản phẩm đã được cập nhật',
                            life: 2000
                        });
                    }
                    setCategory({ 
                        categoryID: 0, categoryName: '', description: ''
                    });
                    setSubmitted(false);
                    setTimeout(() => {
                        navigate('/admin/categories');
                    }, 2000); // Chờ 2 giây trước khi điều hướng
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
                            className={item === 'Quản lý loại sản phẩm' ? 'active' : ''}
                            onClick={() => handleClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="form card flex">
                <div className="p-field">
                    <label htmlFor="categoryName">Tên loại sản phẩm:</label>
                    <InputText id="categoryName" name="categoryName" value={category.categoryName} onChange={handleChange}
                        className={submitted && !category.categoryName ? 'p-invalid' : ''}/>
                    {submitted && !category.categoryName && <small className="p-error">
                        Vui lòng nhập tên loại sản phẩm.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="description">Mô tả:</label>
                    <InputTextarea id="description" name="description" value={category.description} onChange={handleChange} rows={5}
                        className={submitted && !category.description ? 'p-invalid' : ''}/>
                    {submitted && !category.description && <small className="p-error">
                        Vui lòng nhập mô tả.
                    </small>}
                </div>
                <Button className="p-button" label="Cập nhật loại sản phẩm" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />

                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default CategoryEdit;