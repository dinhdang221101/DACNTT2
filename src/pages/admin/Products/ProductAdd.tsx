/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import "../../../styles/admin/Add.css"
import { useNavigate } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import Product from '../../../utils/Product';

const ProductAdd = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState<Product>({
        productID: 0, productName: '', categoryID: 0, brand: '',
        price: 0, stock: 0, description: '', imageURL: ''
    });

    useEffect(() => {
        axios.get('Category')
            .then(res => setCategories(res.data.data));
    }, []);

    const items = ['Quản lý sản phẩm', '/', 'Tạo sản phẩm mới']
    const handleClick = (item: string) => {
        if (item === 'Quản lý sản phẩm') {
            navigate('/admin/products');
        }
    };

    const handleChange = (e: any) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        console.log(product);
    };

    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        if (product.productName.trim() && product.brand.trim() && 
            product.price.toString().trim() && product.stock.toString().trim() &&
            product.description.trim() && product.imageURL.trim()) 
            {
            axios.post('Product', product)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Sản phẩm đã được thêm', 
                            life: 2000 
                        });
                    }
                    setProduct({ 
                        productID: 0, 
                        productName: '', 
                        categoryID: 0,
                        brand: '',
                        price: 0,
                        stock: 0,
                        description: '',
                        imageURL: ''
                    });
                    setSubmitted(false);
                    setTimeout(() => {
                        navigate('/admin/products');
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
                            className={item === 'Quản lý sản phẩm' ? 'active' : ''}
                            onClick={() => handleClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="form">
                <div className="p-field">
                    <label htmlFor="productName">Tên sản phẩm:</label>
                    <InputText id="productName" name="productName" onChange={handleChange} 
                        className={submitted && !product.productName ? 'p-invalid' : ''}/>
                        {submitted && !product.productName && <small className="p-error">Vui lòng nhập tên sản phẩm.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="categoryID">Loại sản phẩm:</label>
                    <Dropdown 
                        name='categoryID'
                        optionValue="categoryID" 
                        value={product.categoryID} 
                        options={categories} 
                        onChange={(handleChange)} 
                        optionLabel="categoryName" 
                        placeholder="Chọn loại sản phẩm"
                        className={submitted && !product.categoryID ? 'p-invalid' : ''} 
                    />
                    {submitted && !product.categoryID && 
                    <small className="p-error">Vui lòng chọn loại sản phẩm.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="brand">Thương hiệu:</label>
                    <InputText id="brand" name="brand" onChange={handleChange} 
                        className={submitted && !product.brand ? 'p-invalid' : ''}/>
                    {submitted && !product.brand && <small className="p-error">Vui lòng nhập thương hiệu.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="price">Giá:</label>
                    <InputNumber id="price" name="price" onValueChange={handleChange} 
                        className={submitted && !product.price ? 'p-invalid' : ''}/>
                    {submitted && !product.price && <small className="p-error">Vui lòng nhập giá.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="stock">Số lượng:</label>
                    <InputNumber id="stock" name="stock" onValueChange={handleChange}
                        className={submitted && !product.stock ? 'p-invalid' : ''}/>
                    {submitted && !product.stock && 
                    <small className="p-error">Vui lòng nhập số lượng.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="description">Mô tả sản phẩm:</label>
                    <InputTextarea id="description" name="description" onChange={handleChange} rows={5}
                        className={submitted && !product.description ? 'p-invalid' : ''}/>
                    {submitted && !product.description && <small className="p-error">Vui lòng nhập mô tả sản phẩm.</small>}
                </div>
                <div className="p-field">
                    <label htmlFor="imageURL">URL của hình ảnh:</label>
                    <InputText id="imageURL" name="imageURL" onChange={handleChange} 
                        className={submitted && !product.imageURL ? 'p-invalid' : ''}/>
                    {submitted && !product.imageURL && <small className="p-error">Vui lòng nhập URL của hình ảnh.</small>}
                </div>
                <Button className="p-button" label="Thêm sản phẩm" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />
                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default ProductAdd;