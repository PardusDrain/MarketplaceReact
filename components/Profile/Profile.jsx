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

  // Обработчик обновления данных профиля
  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredProfile = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== ''),
    );

    if (Object.keys(filteredProfile).length === 0) {
      setModalContent('Заполните поля новой информацией!');
      return;
    }

    try {
      await axios.post(
        '/api/update-profile',
        { profile: filteredProfile },
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

  // Рендер формы обновления профиля
  return (
    <div className="profileContainer">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Новый логин"
          value={formData.login}
          onChange={(e) => {
            const englishOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            setFormData({ ...formData, login: englishOnly });
          }}
          pattern="[a-zA-Z0-9]+"
        />

        {/* Блок ввода пароля с переключателем видимости */}
        <div className="passwordWrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Новый пароль"
            value={formData.password}
            onChange={(e) => {
              const englishOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
              setFormData({ ...formData, password: englishOnly });
            }}
            pattern="[a-zA-Z0-9]+"
          />
          <button
            type="button"
            className="passwordToggleP"
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
          onChange={(e) => {
            const englishOnly = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
            setFormData({ ...formData, email: englishOnly });
          }}
          pattern="[a-zA-Z0-9@._-]+"
        />

        <button type="submit" className="updateButton">
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
