import { CartProvider } from './components/Basket/CartContext';
import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Main from './components/Main/Main.jsx';
import Basket from './components/Basket/Basket.jsx';
import ModalWindow from './components/Header/ModalWindow/ModalWindow.jsx';
import Login from './components/Header/Auth/Login.jsx';
import Registration from './components/Header/Auth/Registration.jsx';
import Profile from './components/Profile/Profile.jsx';

export default function App() {
  const [screen, setScreen] = useState('Main');
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Очистка данных авторизации и сброс состояния при выходе
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExp');
    setLoggedIn(false);
    setScreen('Main');
    setModalWindow(null);
  };
  // Проверка авторизации
  useEffect(() => {
    onAuth();
  }, []);
  // Конфигурация доступных экранов приложения
  const screens = {
    Main: <Main isLoggedIn={isLoggedIn} />,
    Basket: <Basket />,
    Profile: <Profile />,
  };
  // Проверка и обновление состояния авторизации пользователя
  const onAuth = async () => {
    const token = localStorage.getItem('token');
    const tokenExp = localStorage.getItem('tokenExp');

    if (token && tokenExp) {
      const isTokenValid = Date.now() < tokenExp * 1000;

      if (isTokenValid) {
        try {
          const response = await fetch('http://localhost:9001/verify-user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('User verification failed');
          }

          const data = await response.json();
          if (data.exists) {
            setLoggedIn(true);
            setModalWindow(null);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('User verification error:', error);
          handleLogout();
        }
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
      }
    }
  };
  // Управление состоянием модальных окон (логин/регистрация)
  const [modalWindow, setModalWindow] = useState(null);
  const modalWindows = {
    LoginWrapper: (
      <ModalWindow onClose={() => setModalWindow(null)}>
        <Login onAuth={onAuth} />
      </ModalWindow>
    ),
    RegWrapper: (
      <ModalWindow onClose={() => setModalWindow(null)}>
        <Registration onClose={() => setModalWindow(null)} />
      </ModalWindow>
    ),
  };
  return (
    <CartProvider>
      <div className="App">
        {modalWindows[modalWindow]}
        <Header
          setScreen={setScreen}
          modalWindowOpened={setModalWindow}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
        {screens[screen]}
        <Footer />
      </div>
    </CartProvider>
  );
}
