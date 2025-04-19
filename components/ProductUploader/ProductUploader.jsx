import React, { useState } from 'react';
import axios from 'axios';
import './ProductUploader.css';
import ModalWindow from '../Header/ModalWindow/ModalWindow';

// Компонент загрузки новых товаров с изображением
const ProductUploader = ({ isLoggedIn }) => {
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Обработка отправки формы с новым товаром
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Товар успешно добавлен');
      setTimeout(() => {
        setSuccess();
        window.location.reload();
      }, 1000);
      setFormData({ name: '', price: '' });
      setFile(null);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки');
      setTimeout(() => setError(''), 5000);
    }
  };
  // Рендер кнопки добавления и модального окна формы
  return (
    <div className="productUploader">
      <button
        className="uploadButton"
        onClick={() => {
          if (!isLoggedIn) return;
          setIsModalOpen(true);
        }}
      >
        +
      </button>

      {isModalOpen && (
        <ModalWindow
          onClose={() => setIsModalOpen(false)}
          closeOnOutsideClick={false}
        >
          <div className="modalContent">
            <h3>Добавить новый товар</h3>

            {error && <div className="errorMessage">{error}</div>}
            {success && <div className="successMessage">{success}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Название товара"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Цена"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />

              <div className="formActions">
                <button type="submit">Добавить</button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </ModalWindow>
      )}
    </div>
  );
};

export default ProductUploader;
