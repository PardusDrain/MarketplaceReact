import React from 'react';
import '../ModalWindow/ModalWindow.css';

export default function Login({ onAuth, onClose }) {
  function LogProcedure() {
    const login = document.getElementById('putLoginL').value;
    const password = document.getElementById('putPasswordL').value;
    const userDataL = {
      login: login,
      password: password,
    };
    const LogAPI = 'http://localhost:9001/login';
    fetch(LogAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDataL),
    })
      .then((result) => result.json())
      .then((result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('tokenExp', result.exp);
        onAuth();
      });
  }
  return (
    <>
      <input type="text" placeholder="Логин" id="putLoginL" />
      <input type="password" placeholder="Пароль" id="putPasswordL" />
      <button onClick={LogProcedure}>Войти</button>
    </>
  );
}
