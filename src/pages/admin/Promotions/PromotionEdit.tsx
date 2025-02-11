/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import "../../../styles/admin/Add.css"
import { useNavigate, useParams } from "react-router-dom";
import Promotion from "../../../utils/Promotion";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

const PromotionEdit = () => {
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState<Promotion>({
        promotionID: 0, promotionName: '', discountPercent: 0, 
        startDate: new Date(), endDate: new Date()
    });
    const { id } = useParams();
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        axios.get(`Promotion/GetPromotionById/${id}`)
            .then(res => {
                const data = res.data.data[0];
                setPromotion({
                    ...data,
                    startDate: new Date(data.startDate),
                    endDate: new Date(data.endDate)
                })
            }
        );
    }, []);

    const items = ['Quản lý chương trình giảm giá', '/', 'Cập nhật giảm giá']
    const handleClick = (item: string) => {
        if (item === 'Quản lý chương trình giảm giá') {
            navigate('/admin/promotions');
        }
    };

    const validateDates = (startDate: Date | undefined, endDate: Date | undefined) => {
        if (startDate && endDate && startDate > endDate) {
            setErrorMessage('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
            return false;
        } else {
            setErrorMessage('');
            return true;
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setPromotion({ ...promotion, [name]: value });

        // Kiểm tra và cập nhật trạng thái lỗi
        if (name === 'startDate' || name === 'endDate') {
            validateDates(name === 'startDate' ? new Date(value) : promotion.startDate, 
                          name === 'endDate' ? new Date(value) : promotion.endDate);
        }
    };

    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);
    const handleSubmit = (e: any) => {
        e.preventDefault();
        setSubmitted(true);
        if (promotion.promotionName.trim() && promotion.discountPercent) 
        {
            if (!validateDates(promotion.startDate, promotion.endDate)) {
                return;
            }

            // Chuyển đổi ngày về định dạng chuỗi với múi giờ hiện tại
            const startDateLocal = promotion.startDate.toLocaleDateString('en-CA'); 
            const endDateLocal = promotion.endDate.toLocaleDateString('en-CA'); 

            const updatedPromotion = {
                ...promotion,
                startDate: startDateLocal,
                endDate: endDateLocal
            };

            axios.put(`Promotion/${id}`, updatedPromotion)
                .then(() => {
                    if (toast.current) {
                        toast.current.show({ 
                            severity: 'success', summary: 'Thành công', 
                            detail: 'Chương trình giảm giá đã được cập nhật',
                            life: 2000
                        });
                    }
                    setPromotion({ 
                        promotionID: 0, promotionName: '', discountPercent: undefined, 
                        startDate: undefined, endDate: undefined
                    });
                    setSubmitted(false);
                    setErrorMessage('');
                    setTimeout(() => {
                        navigate('/admin/promotions');
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
                            className={item === 'Quản lý chương trình giảm giá' ? 'active' : ''}
                            onClick={() => handleClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <form className="form card flex">
                <div className="p-field">
                    <label htmlFor="promotionName">Tên chương trình giảm giá:</label>
                        <InputText id="promotionName" name="promotionName" 
                            value={promotion.promotionName} onChange={handleChange} 
                            className={submitted && !promotion.promotionName ? 'p-invalid' : ''}/>
                        {submitted && !promotion.promotionName && 
                        <small className="p-error">Vui lòng nhập tên chương trình giảm giá.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="discountPercent">Phần trăm giảm:</label>
                        <InputNumber id="discountPercent" name="discountPercent" 
                            value={promotion.discountPercent} onValueChange={handleChange} 
                            className={submitted && !promotion.discountPercent  ? 'p-invalid' : ''}/>
                        {submitted && !promotion.discountPercent  && 
                        <small className="p-error">Vui lòng nhập phần trăm giảm giá.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="startDate">Ngày bắt đầu:</label>
                        <Calendar id="startDate" name="startDate" onChange={handleChange} 
                            className={submitted && !promotion.startDate ? 'p-invalid' : ''} 
                            value={promotion.startDate} dateFormat="dd/mm/yy" />
                        {submitted && !promotion.startDate && 
                        <small className="p-error">Vui lòng nhập ngày bắt đầu.</small>}
                    </div>
                    <div className="p-field">
                        <label htmlFor="endDate">Ngày kết thúc:</label>
                        <Calendar id="endDate" name="endDate" onChange={handleChange} 
                            className={submitted && !promotion.endDate ? 'p-invalid' : ''} 
                            value={promotion.endDate} dateFormat="dd/mm/yy"/>
                        {submitted && !promotion.endDate && 
                        <small className="p-error">Vui lòng nhập ngày kết thúc.</small>}
                    </div>
                    {errorMessage && <small className="p-error">{errorMessage}</small>}
                <Button className="p-button" label="Cập nhật giảm giá" icon="pi pi-check" type='submit'
                    onClick={handleSubmit} />

                <Toast ref={toast} position="top-right"/>
            </form>
        </div>
    );
}

export default PromotionEdit;