import React, { useState } from 'react';
import '../ModalWindow/ModalWindow.css';

export default function Login({ onAuth }) {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  function LogProcedure() {
    if (!formData.login.trim() || !formData.password.trim()) {
      setError('Заполните все поля');
      return;
    }

    // Подготовка данных для отправки на сервер
    const userDataL = {
      login: formData.login,
      password: formData.password,
    };
    const LogAPI = 'http://localhost:9001/login';
    fetch(LogAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataL),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error('Данные пользователя неверны');
        }
        return result.json();
      })
      .then((result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('tokenExp', result.exp);
        onAuth();
      })
      .catch((error) => {
        setError(error.message);
      });
  }
  // Рендер формы ввода логина/пароля
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
      <input
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={(e) => {
          const englishOnly = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
          setFormData({ ...formData, password: englishOnly });
        }}
        pattern="[a-zA-Z0-9]+"
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={LogProcedure}>Войти</button>
    </>
  );
}
