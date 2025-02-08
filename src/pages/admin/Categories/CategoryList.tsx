/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../../styles/admin/List.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import Category from "../../../utils/Category";

const CategoryList = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category>({
        categoryID: 0, categoryName: '', description: ''
    });
    const [deleteDialog, setDeleteDialog] = useState(false)

    useEffect(() => {
        axios.get('Category')
            .then(res => setCategories(res.data.data)
        );
    }, []);

    const editCategory = (id: number) => {
        navigate(`/admin/categories/edit/${id}`);
    };

    const confirmDelete = (category: Category) => {
        setCategory(category);
        setDeleteDialog(true);
    }

    const deleteCategory = () => {
        axios.delete(`Category/${category.categoryID}`)
            .then(() => {
                setDeleteDialog(false);
                setCategories(categories.filter(c => c.categoryID !== category.categoryID));
            }
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" className="reject" outlined onClick={() => setDeleteDialog(false)}/>
            <Button label="OK" icon="pi pi-check" severity="danger" className="accept" onClick={deleteCategory}/>
        </>
        
    );

    const actionTemplate = (rowData: any) => {
        return (
            <div className="action-btns">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-mr-2 update-btn" 
                    onClick={() => editCategory(rowData.categoryID)} />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger delete-btn" 
                    onClick={() => confirmDelete(rowData)} />
            </div>
        )
    }

    return (
        <div className="main-content">
            <div className="main-header">
                <p>Quản lý loại sản phẩm</p>
                <Button icon="pi pi-plus" className="add-btn" label="Thêm"
                    onClick={() => navigate("/admin/categories/add")}/> 
            </div>

            <div className="card"> 
                {categories && categories.length > 0 ? (
                    <DataTable 
                        value={categories}
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[5, 10, 20]} 
                        sortMode="multiple">
                        <Column field="categoryID" header="Mã loại sản phẩm"sortable headerClassName="category-id-header"></Column>
                        <Column field="categoryName" header="Tên loại sản phẩm" headerClassName="category-name-header"></Column>
                        <Column field="description" header="Mô tả" headerClassName="description-header"></Column>
                        <Column body={actionTemplate} header="Chức năng" headerClassName="action-header"></Column>
                    </DataTable> 
                ) : (
                    <p>Đang tải...</p>
                )}

                <Dialog visible={deleteDialog} style={{ width: '32rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                        modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation " style={{ fontSize: '20px' }}>
                            {category && (
                                <span>
                                    Bạn có chắc chắn muốn xóa loại <b>{category.categoryName}</b> không?
                                </span>
                            )}
                        </i>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default CategoryList;
        