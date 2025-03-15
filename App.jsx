import { CartProvider } from './components/contexts/CartContext';
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
  useEffect(() => {
    onAuth();
  }, []);
  const screens = {
    Main: <Main />,
    Basket: <Basket />,
    Profile: <Profile />,
  };
  const onAuth = () => {
    const token = localStorage.getItem('token');
    const tokenExp = localStorage.getItem('tokenExp');
    if (token && tokenExp && Date.now() < tokenExp * 1000) {
      setLoggedIn(true);
      setModalWindow(null);
    }
  };
  const [modalWindow, setModalWindow] = useState(null);
  const modalWindows = {
    LoginWrapper: (
      <ModalWindow modalWindowClosed={setModalWindow}>
        <Login onAuth={onAuth} />
      </ModalWindow>
    ),
    RegWrapper: (
      <ModalWindow modalWindowClosed={setModalWindow}>
        <Registration />
      </ModalWindow>
    ),
  };
  return (
    <CartProvider>
      {modalWindows[modalWindow]}
      <Header
        setScreen={setScreen}
        modalWindowOpened={setModalWindow}
        isLoggedIn={isLoggedIn}
      />
      {screens[screen]}
      <Footer />
    </CartProvider>
  );
}
