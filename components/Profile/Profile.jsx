import React, { useState } from 'react';
import axios from 'axios';
import ModalWindow from '../Header/ModalWindow/ModalWindow.jsx';
import './Profile.css';

export default function Profile() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
  });
  const [modalContent, setModalContent] = useState(null);
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate empty fields
    if (Object.values(formData).every((val) => !val)) {
      setModalContent('Заполните профиль новой информацией');
      return;
    }

    // // Validate email format
    // if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   setModalContent('Некорректный формат email');
    //   return;
    // }

    try {
      await axios.post(
        '/api/update-profile',
        { profile: formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      localStorage.removeItem('token');
      setModalContent('Профиль обновлен. Войдите в аккаунт снова');
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (error) {
      setModalContent('Ошибка при обновлении профиля');
    }
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Новый логин"
          value={formData.login}
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Новый пароль"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="button"
            className="password-toggle"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
          >
            {showPassword ? '🚫' : '👀'}
          </button>
        </div>

        <input
          placeholder="Новая почта"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <button type="submit" className="update-button">
          Обновить профиль
        </button>
      </form>

      {modalContent && (
        <ModalWindow onClose={() => setModalContent(null)}>
          <p>{modalContent}</p>
        </ModalWindow>
      )}
    </div>
  );
}
