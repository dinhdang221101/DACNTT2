/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Product from '../../../utils/Product';
import "../../../styles/admin/Add.css"
import { useNavigate, useParams } from "react-router-dom";

const ProductEdit = () => {
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState<Product>({
        productID: 0, productName: '', categoryID: 0, brand: '',
        price: 0, stock: 0, description: '', imageURL: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        axios.get('Category')
            .then(res => {
                console.log('Category:', res.data.data);
                setCategories(res.data.data)
            });
        axios.get(`Product/GetProductById/${id}`)
            .then(res => {
                console.log('Product:', res.data.data);
                setProduct(res.data.data[0])
            });
    }, []);

    const items = ['Quản lý sản phẩm', '/', 'Cập nhật sản phẩm']
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
            axios.put(`Product/${id}`, product)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Sản phẩm đã được cập nhật', 
                            life: 2000 
                        });
                    }
                    setProduct({ 
                        productID: 0, productName: '', categoryID: 0, brand: '',
                        price: 0, stock: 0, description: '', imageURL: ''
                    });
                    setSubmitted(false);
                    setTimeout(() => {
                        navigate('/admin/products');
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
                    <InputText id="productName" name="productName" value={product.productName} onChange={handleChange}
                        className={submitted && !product.productName ? 'p-invalid' : ''}/>
                    {submitted && !product.productName && <small className="p-error">
                        Vui lòng nhập tên sản phẩm.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="categoryID">Loại sản phẩm:</label>
                    <Dropdown name='categoryID' value={product.categoryID} optionValue="categoryID" onChange={(handleChange)} 
                        options={categories} optionLabel="categoryName" placeholder="Chọn" 
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="brand">Thương hiệu:</label>
                    <InputText id="brand" name="brand" value={product.brand} onChange={handleChange} 
                        className={submitted && !product.brand ? 'p-invalid' : ''}/>
                    {submitted && !product.brand && <small className="p-error">
                        Vui lòng nhập thương hiệu.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="price">Giá:</label>
                    <InputNumber id="price" name="price" value={product.price} onValueChange={handleChange} 
                        className={submitted && product.price === 0 ? 'p-invalid' : ''}/>
                    {submitted && product.price === 0 && <small className="p-error">
                        Vui lòng nhập giá.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="stock">Tồn kho:</label>
                    <InputNumber id="stock" name="stock" value={product.stock} onValueChange={handleChange}/>
                </div>
                <div className="p-field">
                    <label htmlFor="description">Mô tả sản phẩm:</label>
                    <InputTextarea id="description" name="description" value={product.description} onChange={handleChange} rows={5}
                        className={submitted && !product.description ? 'p-invalid' : ''}/>
                    {submitted && !product.description && <small className="p-error">
                        Vui lòng nhập mô tả sản phẩm.
                    </small>}
                </div>
                <div className="p-field">
                    <label htmlFor="imageURL">URL của hình ảnh:</label>
                    <InputText id="imageURL" name="imageURL" value={product.imageURL} onChange={handleChange}
                        className={submitted && !product.imageURL ? 'p-invalid' : ''}/>
                    {submitted && !product.imageURL && <small className="p-error">
                        Vui lòng nhập URL của hình ảnh.
                    </small>}
                </div>
                <Button className="p-button" label="Cập nhật sản phẩm" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />

                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default ProductEdit;