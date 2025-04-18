import React, { useState } from 'react';
import { useCart } from './CartContext';
import OrderModal from './OrderModal';

export default function Basket() {
  const { cart, removeItem, clearCart } = useCart();
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Расчет общей суммы заказа
  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0,
  );

  // Рендер содержимого корзины и кнопок управления
  return (
    <>
      <div className="basket">
        <h2>Корзина</h2>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.cartItemId}>
                  {item.productName} {item.price}₽ × {item.quantity}
                  <button onClick={() => removeItem(item.cartItemId)}>
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
            <p>Общая сумма: {cartTotal}₽</p>
            <button onClick={clearCart}>Очистить корзину</button>
            <button
              onClick={() => {
                setShowOrderModal(true);
              }}
            >
              Оформить заказ
            </button>
          </>
        )}
      </div>
      {showOrderModal && (
        <OrderModal
          total={cartTotal}
          onClose={() => {
            setShowOrderModal(false);
          }}
        />
      )}
    </>
  );
}
