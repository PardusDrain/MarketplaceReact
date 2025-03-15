import React, { useState, useEffect } from 'react';
import './Main.css';
import { mockProducts } from './mockProducts';
import { useCart } from '../contexts/CartContext';

export default function Main() {
  const [productList, setProductList] = useState([]);
  const { addItem } = useCart();
  const [counters, setCounters] = useState({});

  useEffect(() => {
    // // Временное использование тестовых данных
    // setProductList(mockProducts);

    // Оригинальный запрос к API
    const ProductAPI = 'http://localhost:9001/products';
    fetch(ProductAPI)
      .then((result) => result.json())
      .then((result) => {
        setProductList(
          (result.productFetch || [])
            .map((p) => ({
              ...p,
              price: Number(p.price) || 0,
              quantity: 1,
              _id: p._id,
            }))
            .filter((p) => !isNaN(p.price)),
        );

        // Synchronize counters with current product list
        const productIds = new Set(productList.map((p) => p._id));
        setCounters((prevCounters) => {
          const syncedCounters = {};
          Object.entries(prevCounters).forEach(([id, counter]) => {
            if (productIds.has(id)) {
              syncedCounters[id] = counter;
            }
          });
          return syncedCounters;
        });
      });
  }, []);

  useEffect(() => {
    const productIds = new Set(productList.map((p) => p._id));
    setCounters((prevCounters) => {
      const synced = {};
      for (const [id, counter] of Object.entries(prevCounters)) {
        if (productIds.has(id)) {
          synced[id] = {
            quantity: Number.isNaN(counter.quantity)
              ? 1
              : Number(counter.quantity),
            visible: counter.visible,
          };
        }
      }
      return synced;
    });
  }, [productList]);

  const toggleCounter = (product) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [product._id]: {
        quantity: Number(prevCounters[product._id]?.quantity) || 1,
        visible: !(prevCounters[product._id]?.visible || false),
      },
    }));
  };

  const handleAdd = (product) => {
    const quantity = counters[product._id]?.quantity || 1;
    addItem(product, quantity);
    setCounters((prev) => ({
      ...prev,
      [product._id]: {
        ...prev[product._id],
        visible: false,
      },
    }));
  };

  const incrementQuantity = (product) => {
    setCounters((prev) => ({
      ...prev,
      [product._id]: {
        ...prev[product._id],
        quantity: prev[product._id].quantity + 1,
      },
    }));
  };

  const decrementQuantity = (product) => {
    setCounters((prev) => ({
      ...prev,
      [product._id]: {
        ...prev[product._id],
        quantity: Math.max(1, prev[product._id].quantity - 1),
      },
    }));
  };

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
            {counters[productItem._id]?.visible ? (
              <div className="quantity-control">
                <button onClick={() => decrementQuantity(productItem)}>
                  -
                </button>
                <span>{counters[productItem._id].quantity}</span>
                <button onClick={() => incrementQuantity(productItem)}>
                  +
                </button>
                <button onClick={() => handleAdd(productItem)}>Добавить</button>
              </div>
            ) : (
              <button
                className="orderB"
                onClick={() => {
                  handleAdd(productItem);
                  toggleCounter(productItem);
                }}
              >
                В корзину
              </button>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
