import axios from "axios";
import { useState, useEffect } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../../styles/admin/List.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Product from '../../../utils/Product';
import { Dialog } from "primereact/dialog";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product>({
        productID: 0, productName: '', categoryID: 0, brand: '',
        price: 0, stock: 0, description: '', imageURL: ''
    });
    const [deleteProductDialog, setDeleteProductDialog] = useState(false)

    useEffect(() => {
        axios.get('Product')
            .then(res => setProducts(res.data.data)
        );
    }, []);

    const editProduct = (id: number) => {
        navigate(`/admin/products/edit/${id}`);
        console.log('Product:', id);
    };

    const confirmDeleteProduct = (product: Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        axios.delete(`Product/${product.productID}`)
            .then(() => {
                setDeleteProductDialog(false);
                setProducts(products.filter(p => p.productID !== product.productID));
            }
        );
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" className="reject" outlined onClick={() => setDeleteProductDialog(false)}/>
            <Button label="OK" icon="pi pi-check" severity="danger" className="accept" onClick={deleteProduct}/>
        </>
        
    );

    const actionTemplate = (rowData: any) => {
        return (
            <div className="action-btns">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-mr-2 update-btn" 
                    onClick={() => editProduct(rowData.productID)} />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger delete-btn" 
                    onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        )
    }

    const imageBodyTemplate = (rowData: { imageURL: string | undefined; }) => {
        return <img src={rowData.imageURL} style={{ width: '100px', height: 'auto'}}/>
    }

    return (
        <div className="main-content">
            <div className="main-header">
                <p>Quản lý sản phẩm</p>
                <Button icon="pi pi-plus" className="add-btn" label="Thêm"
                    onClick={() => navigate("/admin/products/add")}/> 
            </div>

            <div className="card"> 
                {products && products.length > 0 ? (
                    <DataTable 
                        value={products}
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[5, 10, 20]} 
                        sortMode="multiple">
                        <Column field="productID" header="Mã sản phẩm"sortable headerClassName="product-id-header"></Column>
                        <Column field="productName" header="Tên sản phẩm" headerClassName="product-name-header"></Column>
                        <Column field="brand" header="Thương hiệu" headerClassName="brand-header"></Column>
                        <Column field="price" header="Giá" headerClassName="price-header"></Column>
                        <Column field="stock" header="Tồn kho" headerClassName="stock-header"></Column>
                        <Column field="description" header="Mô tả" headerClassName="description-header"></Column>
                        <Column body={imageBodyTemplate} header="Hình ảnh" headerClassName="imageURL-header"></Column>
                        <Column body={actionTemplate} header="Chức năng" ></Column>
                    </DataTable> 
                ) : (
                    <p>Đang tải...</p>
                )}

                <Dialog visible={deleteProductDialog} style={{ width: '32rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal footer={deleteProductDialogFooter} onHide={() => setDeleteProductDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation " style={{ fontSize: '20px' }}>
                            {product && (
                                <span>
                                    Bạn có chắc chắn muốn xóa sản phẩm <b>{product.productName}</b> không?
                                </span>
                            )}
                        </i>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default ProductList;
        