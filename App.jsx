import React, { useState } from 'react'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Main from './components/Main/Main.jsx'
import Basket from './components/Basket/Basket.jsx'
import ModalWindow from './components/Header/ModalWindow/ModalWindow.jsx'
import Login from './components/Header/User/Login.jsx'
import Registration from './components/Header/User/Registration.jsx'

export default function App() {
  const [screen, setScreen] = useState('Main')
  const screens = {
    Main: <Main/>,
    Basket: <Basket/>,
    
  }
  const [modalWindow, setModalWindow] = useState(null)
  const modalWindows ={
    LoginWrapper: <ModalWindow modalWindowClosed={setModalWindow}><Login/></ModalWindow>,
    RegWrapper: <ModalWindow modalWindowClosed ={setModalWindow}><Registration/></ModalWindow>
   }
  return (
    <>
   {modalWindows[modalWindow]}
    <Header setScreen = {setScreen} modalWindowOpened = {setModalWindow}/>
   {screens[screen]}
    <Footer/>
    </>
  )
}


