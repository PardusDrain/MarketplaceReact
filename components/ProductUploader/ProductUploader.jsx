import React, { useState } from 'react';
import axios from 'axios';
import './ProductUploader.css';

const ProductUploader = ({ isLoggedIn }) => {
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProgress(20);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    if (file) data.append('image', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/products', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
        },
      });

      setProgress(100);
      setSuccess('Товар успешно добавлен');
      setTimeout(() => setSuccess(''), 3000);
      setFormData({ name: '', price: '' });
      setFile(null);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка загрузки');
      setTimeout(() => setError(''), 5000);
      setProgress(0);
    }
  };
  return (
    <div className="product-uploader">
      <button
        className="upload-button"
        onClick={() => document.getElementById('upload-modal').showModal()}
      >
        +
      </button>

      <dialog id="upload-modal" className="uploaderEcho" open={isModalOpen}>
        <div className="modal-content">
          <h3>Добавить новый товар</h3>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
            />

            {progress > 0 && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit">Добавить</button>
              <button
                type="button"
                className="cancel"
                onClick={() => document.getElementById('upload-modal').close()}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default ProductUploader;
