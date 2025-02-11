import { useEffect, useState } from 'react';
import '../../styles/AdminDashboard.css'; 
import SalesChart from '../../components/admin/SalesChart'; 
import axios from 'axios'; 

const AdminDashboard = () => {
    const [orderCount, setOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [salesData, setSalesData] = useState([]); 
    const [topProducts, setTopProducts] = useState([]); // Dữ liệu sản phẩm bán chạy

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/admin/reportweek'); 
                const salesResponse = await axios.get('/admin/top3'); // Endpoint để lấy sản phẩm bán chạy
                const data = response.data.data; 
                const productsData = salesResponse.data.data; // Dữ liệu sản phẩm bán chạy

                const totalOrders = data.reduce((acc, item) => acc + item.totalOrders, 0);
                const totalProducts = data.reduce((acc, item) => acc + item.totalProducts, 0);
                const totalAmount = data.reduce((acc, item) => acc + item.totalAmount, 0);

                setOrderCount(totalOrders);
                setProductCount(totalProducts);
                setTotalRevenue(totalAmount);
                setSalesData(data); 
                setTopProducts(productsData); // Lưu dữ liệu sản phẩm bán chạy
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="admin-dashboard-container">
            <h2 style={{color: "#ff9800"}}>Dashboard</h2>
            <div className="dashboard-summary">
                <div className="summary-item">
                    <h2>Số đơn trong tuần</h2>
                    <p>{orderCount}</p>
                </div>
                <div className="summary-item">
                    <h2>Doanh thu trong tuần</h2>
                    <p>{totalRevenue.toLocaleString()} vnđ</p>
                </div>
                <div className="summary-item">
                    <h2>Sản phẩm đã bán trong tuần</h2>
                    <p>{productCount}</p>
                </div>
            </div>
            <SalesChart salesData={salesData} />
            <div className="top-products">
    <h2>Sản phẩm bán chạy nhất</h2>
    <div className="top-products-list">
        {topProducts.slice(0, 3).map(product => (
            <div className="top-product-item" key={product.productID}>
                <div className="image-container-db">
                    <img src={product.imageURL} alt={product.productName} />
                </div>
                <h3>{product.productName}</h3>
                <div className="product-details-db">
                    <span className="dashboard-product-price">{product.price.toLocaleString()} vnđ</span>
                    <div className="dashboard-product-quantity">Số lượng: {product.totalQuantity}</div>
                </div>
            </div>
        ))}
    </div>
</div>
        </div>
    );
};

export default AdminDashboard;