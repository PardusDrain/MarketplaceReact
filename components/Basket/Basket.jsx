import React from 'react';
import { useCart } from '../contexts/CartContext';

export default function Basket() {
  const { cart, removeItem, clearCart, dispatch } = useCart();

  return (
    <div className="basket">
      <h2>Корзина</h2>
      {cart.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.cartItemId}>
                {item.productName} - {item.price}₽ × {item.quantity}
                <button onClick={() => removeItem(item.cartItemId)}>
                  Удалить
                </button>
              </li>
            ))}
          </ul>
          <p>
            Общая сумма:{' '}
            {cart.reduce(
              (sum, item) =>
                sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
              0,
            )}
            ₽
          </p>
          <button onClick={clearCart}>Очистить корзину</button>
        </>
      )}
    </div>
  );
}
