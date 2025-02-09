/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../../styles/Cart.css";

const Cart = () => {
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorProducts, setErrorProducts] = useState<{ productID: number; stock: number }[]>([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("UserID");
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/User/Cart/${userId}`);
        if (response.data.status === "00") {
          setCartItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const formatPrice = (price: any) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const calculateTotalPrice = (items: any) => {
    const total = items.reduce((sum: any, item: any) => {
      const discountedPrice =
        item.price - item.price * (item.discountPercent / 100);
      return sum + discountedPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const handleRemoveFromCart = async (productId: any) => {
    // const userId = localStorage.getItem("UserID");
    try {
      // const response = await axios.post("/User/RemoveFromCart", {
      //   userID: userId,
      //   productID: productId,
      // });
      // if (response.data.status === "00") {
        const updatedCartItems = cartItems.filter(
          (item: any) => item.productID !== productId
        );
        setCartItems(updatedCartItems);
        calculateTotalPrice(updatedCartItems);
        // Reset selected items if the removed item is selected
        if (selectedItems.includes(productId)) {
          setSelectedItems((prevSelected) =>
            prevSelected.filter((id) => id !== productId)
          );
        }
      // }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = async () => {
    const selectedProducts = cartItems.filter((item: any) =>
      selectedItems.includes(item.productID)
    );
    try {
      const response = await axios.post(
        "/User/FirstCheckout",
        selectedProducts
      );
      if (response.data.data.length > 0) {
        setErrorProducts(response.data.data);
      } else {
        setErrorProducts(response.data.data);
        navigate("/checkout", {
          state: {
            products: selectedProducts,
          },
        });
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        label="Xóa"
        className="p-button-danger"
        onClick={() => handleRemoveFromCart(rowData.productID)}
      />
    );
  };

  const updateQuantity = async (productId: any, increment: any, event: any) => {
    event.stopPropagation();
    const newCartItems = cartItems.map((item: any) => {
      if (item.productID === productId) {
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
        return {
          ...item,
          quantity: Math.max(newQuantity, 1), // Đảm bảo số lượng không nhỏ hơn 1
        };
      }
      return item;
    });

    setCartItems(newCartItems);
    calculateTotalPrice(
      newCartItems.filter((item) => selectedItems.includes(item.productID))
    );
  };

  const onSelectionChange = (e: any) => {
    setSelectedItems(e.value.map((item: any) => item.productID));
    calculateTotalPrice(e.value);
  };

  if (cartItems.length === 0) {
    return <div className="empty-cart">Giỏ hàng của bạn đang trống.</div>;
  }

  return (
    <div className="cart">
      <h2>Giỏ hàng của bạn</h2>
      <DataTable
        value={cartItems}
        selectionMode="multiple"
        selection={selectedItems.map((id) =>
          cartItems.find((item) => item.productID === id)
        )}
        onSelectionChange={onSelectionChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3em" }} />
        <Column
          field="productName"
          header="Sản phẩm"
          body={(rowData) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={rowData.imageURL}
                alt={rowData.productName}
                className="product-image-cart"
              />
              {rowData.productName}
            </div>
          )}
        />
        <Column
          field="price"
          header="Đơn giá"
          body={(rowData) => (
            <div>
              {rowData.discountPercent > 0 ? (
                <>
                  <span className="original-price">
                    {formatPrice(rowData.price)}
                  </span>
                  <span className="discounted-price">
                    {formatPrice(
                      rowData.price -
                        rowData.price * (rowData.discountPercent / 100)
                    )}
                  </span>
                </>
              ) : (
                <span className="current-price">
                  {formatPrice(rowData.price)}
                </span>
              )}
            </div>
          )}
        />
        <Column
          field="quantity"
          header="Số lượng"
          body={(rowData) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Button
                  icon="pi pi-minus"
                  className="p-button-text"
                  onClick={(event) =>
                    updateQuantity(rowData.productID, false, event)
                  }
                />
                <span>{rowData.quantity}</span>
                <Button
                  icon="pi pi-plus"
                  className="p-button-text"
                  onClick={(event) =>
                    updateQuantity(rowData.productID, true, event)
                  }
                />
              </div>
              {errorProducts.find(
                (item: any) => item.productID == rowData.productID
              ) && (
                <span style={{ color: "red", fontSize: "14px" }}>
                  Số lượng hàng trong kho chỉ còn{" "}
                  {
                    errorProducts.find(
                      (item: any) => item.productID == rowData.productID
                    )?.stock
                  }{" "}
                  sản phẩm
                </span>
              )}
            </div>
          )}
        />
        <Column header="" body={actionBodyTemplate} />
      </DataTable>
      <div className="total-price">
        <h3>Tổng tiền: {formatPrice(totalPrice)}</h3>
        <Button
          label="Thanh toán"
          disabled={selectedItems.length === 0}
          className="submit-button"
          onClick={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;
