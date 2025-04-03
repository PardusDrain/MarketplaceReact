import React from 'react';
import './ModalWindow.css';

export default function ModalWindow({ onClose, children }) {
  return (
    <>
      <div
        className="echo"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      ></div>
      <div className="modalAuth">{children}</div>
    </>
  );
}
