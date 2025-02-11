import axios from "axios";
import { useState, useEffect } from 'react';
import { DataTable} from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../../styles/admin/List.css";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
// import { Dialog } from "primereact/dialog";
import User from "../../../utils/User";
import { Dialog } from "primereact/dialog";

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>({
        userID: 0, name: '', phone: '', address: '', email: '', password: '',role: ''
    });
    const [deleteDialog, setDeleteDialog] = useState(false)

    useEffect(() => {
        axios.get('User')
            .then(res => setUsers(res.data.data)
        );
    }, []);

    const editUser = (id: number) => {
        navigate(`/admin/users/edit/${id}`);
    };

    const confirmDelete = (user: User) => {
        setUser(user);
        setDeleteDialog(true);
    }

    const deleteUser = () => {
        axios.delete(`User/${user.userID}`)
            .then(() => {
                setDeleteDialog(false);
                setUsers(users.filter(c => c.userID !== user.userID));
            }
        );
    };

    const deleteDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" className="reject" outlined onClick={() => setDeleteDialog(false)}/>
            <Button label="OK" icon="pi pi-check" severity="danger" className="accept" onClick={deleteUser}/>
        </>
        
    );

    const actionTemplate = (rowData: any) => {
        return (
            <div className="action-btns">
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-success p-mr-2 update-btn" 
                    onClick={() => editUser(rowData.userID)} />
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
                <p>Quản lý người dùng</p>
                <Button icon="pi pi-plus" className="add-btn" label="Thêm"
                    onClick={() => navigate("/admin/users/add")}/> 
            </div>

            <div className="card"> 
                {users && users.length > 0 ? (
                    <DataTable 
                        value={users}
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[5, 10, 20]} 
                        sortMode="multiple">
                        <Column field="userID" header="Mã người dùng"sortable headerClassName="user-id-header"></Column>
                        <Column field="name" header="Họ và tên"></Column>
                        <Column field="phone" header="Số điện thoại"></Column>
                        <Column field="email" header="Email"></Column>
                        <Column field="role" header="Quyền"></Column>
                        <Column body={actionTemplate} header="Chức năng" headerClassName="action-header"></Column>
                    </DataTable> 
                ) : (
                    <p>Đang tải...</p>
                )}

                <Dialog visible={deleteDialog} style={{ width: '32rem'}} breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                        modal footer={deleteDialogFooter} onHide={() => setDeleteDialog(false)}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation " style={{ fontSize: '20px' }}>
                            {user && (
                                <span>
                                    Bạn có chắc chắn muốn xóa người dùng <b>{user.name}</b> không?
                                </span>
                            )}
                        </i>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}

export default UserList;
        