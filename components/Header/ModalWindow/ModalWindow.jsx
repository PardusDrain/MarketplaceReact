import React from 'react';
import './ModalWindow.css';

export default function ModalWindow({ onClose = () => {}, children }) {
  return (
    <>
      <div
        className="echo"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      ></div>
      <div className="modalAuth" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </>
  );
}
