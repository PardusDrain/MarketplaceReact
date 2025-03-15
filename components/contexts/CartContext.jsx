import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  dispatch: () => {},
});

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(
        (item) => item._id === action.payload._id,
      );
      if (existingItem) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: action.payload.quantity }
            : item,
        );
      }
      return [
        ...state,
        {
          ...action.payload,
          quantity: Number(action.payload.quantity),
          cartItemId: Date.now() + Math.random(),
        },
      ];
    }
    case 'REMOVE_ITEM': {
      const newState = state.filter(
        (item) => item.cartItemId !== action.payload,
      );
      return newState;
    }
    case 'INCREMENT_QUANTITY': {
      return state.map((item) =>
        item.cartItemId === action.payload
          ? { ...item, quantity: Number(item.quantity) + 1 }
          : item,
      );
    }
    case 'DECREMENT_QUANTITY': {
      return state.map((item) => {
        if (item.cartItemId === action.payload) {
          if (item.quantity === 1) {
            return item;
          }
          return { ...item, quantity: Math.max(1, Number(item.quantity) - 1) };
        }
        return item;
      });
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addItem = useCallback(
    (product, quantity = 1) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          ...product,
          quantity: Number(quantity),
          price: Number(product.price),
        },
      });
    },
    [dispatch],
  );

  const removeItem = useCallback(
    (id) => {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    },
    [dispatch],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, clearCart, dispatch }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};
