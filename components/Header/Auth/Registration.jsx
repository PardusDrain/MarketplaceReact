import React, { useState } from 'react';
import '../ModalWindow/ModalWindow.css';

export default function Registration({ onClose }) {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
  });

  // Обработчик регистрации нового пользователя
  function RegProcedure() {
    if (
      !formData.login.trim() ||
      !formData.password.trim() ||
      !formData.email.trim()
    ) {
      setError('Заполните все поля');
      return;
    }

    // Подготовка данных пользователя для отправки на сервер
    const userDataR = {
      login: formData.login,
      password: formData.password,
      email: formData.email,
    };
    const RegAPI = 'http://localhost:9001/registration';
    fetch(RegAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataR),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw err;
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExp', data.exp);
        setTimeout(() => {
          window.location.reload();
        }, 10);
        onClose();
      })
      .catch((error) => {
        console.error('Registration error:', error);
        if (error.status === 409) {
          setError('Пользователь с таким логином уже существует');
        } else {
          setError(error.error || 'Ошибка соединения с сервером');
          console.log('Full error object:', error);
          console.log('Response status:', error.status);
          console.log('Response text:', error.message);
        }
      });
  }

  // Рендер формы регистрации
  return (
    <>
      <input
        type="text"
        placeholder="Логин"
        value={formData.login}
        onChange={(e) => {
          const englishOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
          setFormData({ ...formData, login: englishOnly });
        }}
        pattern="[a-zA-Z0-9]+"
      />
      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Пароль"
          value={formData.password}
          onChange={(e) => {
            const englishOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            setFormData({ ...formData, password: englishOnly });
          }}
          pattern="[a-zA-Z0-9]+"
        />
        <button
          type="button"
          className="password-toggleR"
          onMouseDown={() => setShowPassword(true)}
          onMouseUp={() => setShowPassword(false)}
          onMouseLeave={() => setShowPassword(false)}
        >
          {showPassword ? '🚫' : '👀'}
        </button>
      </div>
      <input
        type="email"
        placeholder="Почта"
        value={formData.email}
        onChange={(e) => {
          const englishOnly = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
          setFormData({ ...formData, email: englishOnly });
        }}
        pattern="[a-zA-Z0-9@._-]+"
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={RegProcedure} className="modalIn">
        Зарегистрироваться
      </button>
    </>
  );
}
