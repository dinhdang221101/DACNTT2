/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import "../../../styles/admin/Add.css"
import { useNavigate } from 'react-router-dom';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Category from '../../../utils/Category';

const CategoryAdd = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>({
        categoryID: 0, categoryName: '', description: ''
    });

    const items = ['Quản lý loại sản phẩm', '/', 'Tạo loại sản phẩm mới']
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
            axios.post('Category', category)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Loại sản phẩm đã được thêm', 
                            life: 2000 
                        });
                    }
                    setCategory({ 
                        categoryID: 0, categoryName: '', description: ''
                    });
                    setSubmitted(false);
                    setTimeout(() => {
                        navigate('/admin/categories');
                    }, 2000);
                }
            );
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

            <form className="form">
                <div className="p-field">
                    <label htmlFor="categoryName">Tên loại sản phẩm:</label>
                    <InputText id="categoryName" name="categoryName" onChange={handleChange} 
                        className={submitted && !category.categoryName ? 'p-invalid' : ''}/>
                    {submitted && !category.categoryName && <small className="p-error">
                        Vui lòng nhập tên loại sản phẩm.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="description">Mô tả sản phẩm:</label>
                    <InputTextarea id="description" name="description" onChange={handleChange} rows={5}
                        className={submitted && !category.description ? 'p-invalid' : ''}/>
                    {submitted && !category.description && <small className="p-error">
                        Vui lòng nhập mô tả sản phẩm.
                    </small>}
                </div>
                <Button className="p-button" label="Thêm loại sản phẩm" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />

                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default CategoryAdd;