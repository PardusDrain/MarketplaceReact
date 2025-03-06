import React, { useState, useEffect } from 'react';
import './Main.css';
import { mockProducts } from './mockProducts';

export default function Main() {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    // Временное использование тестовых данных
    setProductList(mockProducts);

    // Оригинальный запрос к API
    // const ProductAPI = 'http://localhost:9001/products';
    // fetch(ProductAPI)
    //   .then((result) => result.json())
    //   .then((result) => {
    //     setProductList(result.productFetch);
    //   });
  }, []);
  return (
    <>
      <main>
        {productList.map((productItem) => (
          <div className="product" key={productItem._id}>
            <img
              src={`/images/${productItem.img}`}
              className="productImg"
              alt=""
            />
            <p className="itemName">{productItem.productName}</p>
            <p className="itemPrice">{`${productItem.price}₽`}</p>
            <button className="orderB">В корзину</button>
          </div>
        ))}
      </main>
    </>
  );
}
