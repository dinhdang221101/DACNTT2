/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown"; 
import { useParams } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import "../../styles/Home.css";
import "../../styles/Product.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`Product/GetProductsByCategory/${id}`, {
        params: {
          page: currentPage + 1,
          pageSize: rowsPerPage,
          brand: selectedBrand ? selectedBrand : null,
          sortOrder: sortOrder, 
        },
      })
      .then((res) => {
        if (res.data.data.length > 0) {
          setProducts(res.data.data);
          setTotalRecords(res.data.data[0].totalCount);
        }
      });
  }, [id, currentPage, rowsPerPage, selectedBrand, sortOrder]); 

  useEffect(() => {
    axios.get(`Category/GetBrandByCategory/${id}`).then((res) => {
      if (res.data.data.length > 0) {
        setBrands(res.data.data);
      }
    });
  }, [id]);

  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const calculateDiscountedPrice = (price: any, discountPercent: any) => {
    return price - price * (discountPercent / 100);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`); 
  };

  const renderProductCard = (product: any) => {
    const discountedPrice = product.discountPercent
      ? calculateDiscountedPrice(product.price, product.discountPercent)
      : product.price;

    return (
      <div
        className="product-card"
        key={product.productName}
        onClick={() => handleProductClick(product.productID)}
      >
        <div className="card-header">
          {product.discountPercent > 0 && (
            <span className={`product-tag sale`}>{"SALE"}</span>
          )}
        </div>
        <div className="image-container">
          <img
            src={product.imageURL}
            alt={product.productName}
            className="product-image"
          />
        </div>
        <div className="card-body">
          <h4 className="name">{product.productName}</h4>
          <p className="price">
            {product.discountPercent > 0 && (
              <span className="original-price">
                {formatPrice(product.price)}
              </span>
            )}
            {formatPrice(discountedPrice)}
          </p>
          <p
            className={`discount ${product.discountPercent > 0 ? "visible" : "hidden"}`}
          >
            {`Giảm ${product.discountPercent}%`}
          </p>
          <Button label="Mua" className="p-button-warning buy-button" />
        </div>
      </div>
    );
  };

  const onPageChange = (e: any) => {
    setCurrentPage(e.page);
    setRowsPerPage(e.rows);
  };

  const onBrandClick = (brand: any) => {
    setSelectedBrand(brand);
    setCurrentPage(0); 
  };

  const onSortChange = (e: any) => {
    setSortOrder(e.value);
    setCurrentPage(0); 
  };

  const sortOptions = [
    { label: "Giá từ thấp đến cao", value: "asc" },
    { label: "Giá từ cao đến thấp", value: "desc" },
  ];

  const news = [
    {
      title: "DIỆN THOẠI THÔNG MINH",
      content: "CHẤT LƯỢNG CAO NHẤT - HẬU MÃI SỐ 1 - GIÁ RẺ NHẤT",
      imageUrl:
        "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/01/w800/banner-dien-thoai-mobilecity-02.jpg.webp",
    },
    {
      title: "PHỤ KIỆN ĐIỆN THOẠI",
      content:
        "ĐA DẠNG SẢN PHẨM - CHẤT LƯỢNG TỐT, GIÁ RẺ - ĐA DẠNG KÊNH BÁN HÀNG",
      imageUrl:
        "https://cdn.mobilecity.vn/mobilecity-vn/images/2024/01/w800/banner-phu-kien-mobilecity-01.jpg.webp",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
  };

  return (
    <div>
      <div className="banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <h3>{news[currentIndex].title}</h3>
            <p>{news[currentIndex].content}</p>
          </div>
          <img
            src={news[currentIndex].imageUrl}
            alt={`Banner ${currentIndex + 1}`}
            className="banner-image"
          />
        </div>
        <div className="banner-controls">
          <button className="prev-button" onClick={handlePrevious}>
            ❮
          </button>
          <button className="next-button" onClick={handleNext}>
            ❯
          </button>
        </div>
      </div>

      <div className="filter-section">
        <div className="brand-filter">
          {brands.map((brand) => (
            <Button
              key={brand}
              label={brand}
              className={`brand-button ${selectedBrand === brand ? "brand-button-active" : ""}`}
              onClick={() => onBrandClick(brand)}
            />
          ))}
        </div>

        <div className="sort-filter">
          <Dropdown
            value={sortOrder}
            options={sortOptions}
            onChange={onSortChange}
            placeholder="Sắp xếp theo giá"
          />
        </div>
      </div>

      <div className="product-list">
        <div className="product-grid">
          {products.map((product) => renderProductCard(product))}
        </div>

        <Paginator
          first={currentPage * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default ProductList;
