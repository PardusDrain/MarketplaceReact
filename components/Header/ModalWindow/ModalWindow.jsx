import React from 'react';
import './ModalWindow.css';

// Универсальный компонент модального окна с поддержкой закрытия по клику вне области
export default function ModalWindow({
  onClose = () => {},
  children,
  closeOnOutsideClick = true,
}) {
  return (
    <>
      {/* Затемнение фона с обработкой клика для закрытия */}
      <div
        className="echo"
        onClick={(e) => {
          if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose();
          }
        }}
      ></div>
      {/* Основное содержимое модального окна */}
      <div className="modalAuth" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </>
  );
}
