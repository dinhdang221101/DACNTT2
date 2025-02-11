/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState, useEffect } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../../styles/admin/List.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import Promotion from "../../../utils/Promotion";

const PromotionList = () => {
    const navigate = useNavigate();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [promotion, setPromotion] = useState<Promotion>({
        promotionID: 0, promotionName: '', discountPercent: 0, 
        startDate: new Date(), endDate: new Date()
    });
    const [deleteDialog, setDeleteDialog] = useState(false)

    useEffect(() => {
        axios.get('Promotion')
            .then(res => setPromotions(res.data.data)
        );
    }, []);

    const editPromotion = (id: number) => {
        navigate(`/admin/promotions/edit/${id}`);
    };

    const confirmDelete = (promotion: Promotion) => {
        setPromotion(promotion);
        setDeleteDialog(true);
    }

    const deletePromotion = () => {
        axios.delete(`Promotion/${promotion.promotionID}`)
            .then(() => {
                setDeleteDialog(false);
                setPromotions(promotions.filter(c => c.promotionID !== promotion.promotionID));
            }
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" className="reject" outlined onClick={() => setDeleteDialog(false)}/>
            <Button label="OK" icon="pi pi-check" severity="danger" className="accept" onClick={deletePromotion}/>
        </>
        
    );

    const actionTemplate = (rowData: any) => {
        return (
            <div className="action-btns">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-mr-2 update-btn" 
                    onClick={() => editPromotion(rowData.promotionID)} />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-rounded p-button-danger delete-btn" 
                    onClick={() => confirmDelete(rowData)} />
            </div>
        )
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB');
    };

    return (
        <div className="main-content">
            <div className="main-header">
                <p>Quản lý chương trình giảm giá</p>
                <Button icon="pi pi-plus" className="add-btn" label="Thêm"
                    onClick={() => navigate("/admin/promotions/add")}/> 
            </div>

            <div className="card"> 
                {promotions && promotions.length > 0 ? (
                    <DataTable 
                        value={promotions}
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[5, 10, 20]} 
                        sortMode="multiple">
                        <Column field="promotionID" header="Mã giảm giá" sortable></Column>
                        <Column field="promotionName" header="Tên"></Column>
                        <Column field="discountPercent" header="Phần trăm giảm"></Column>
                        <Column field="startDate" header="Ngày bắt đầu" 
                            body={(rowData) => formatDate(new Date(rowData.startDate))}>
                        </Column>
                        <Column field="endDate" header="Ngày kết thúc" 
                            body={(rowData) => formatDate(new Date(rowData.endDate))}>
                        </Column>
                        <Column body={actionTemplate} header="Chức năng" headerClassName="action-header"></Column>
                    </DataTable> 
                ) : (
                    <p>Đang tải...</p>
                )}

                <Dialog visible={deleteDialog} style={{ width: '32rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                        modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation " style={{ fontSize: '20px' }}>
                            {promotion && (
                                <span>
                                    Bạn có chắc chắn muốn xóa chương trình <b>{promotion.promotionName}</b> không?
                                </span>
                            )}
                        </i>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default PromotionList;
        