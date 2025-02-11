import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "primereact/checkbox";
import "./ProductList.css";

const ProductList = ({ onSelectionChange, promotionID }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    axios.get(`Product/AddToPromotion/${promotionID}`).then((res) => {
      setProducts(res.data.data);
      const updatedSelection = res.data.data.filter((p) => p.promotionID > 0);

      setSelectedProducts(updatedSelection);
      onSelectionChange(updatedSelection);
    });
  }, []);

  const toggleProduct = (product) => {
    const updatedSelection = selectedProducts.includes(product)
      ? selectedProducts.filter((p) => p !== product)
      : [...selectedProducts, product];

    console.log(updatedSelection);

    setSelectedProducts(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  return (
    <div>
      {products.map((product) => (
        <div
          key={product.productID}
          className="product-item"
          style={{ marginBottom: "12px" }}
        >
          <Checkbox
            inputId={product.productID}
            checked={selectedProducts.includes(product)}
            onChange={() => toggleProduct(product)}
          />
          <label htmlFor={product.productID} className="product-item">
            <img
              src={product.imageURL}
              alt={product.productName}
              style={{ width: "40px", margin: "0px 10px 0px 20px" }}
            />
            {product.productName}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
