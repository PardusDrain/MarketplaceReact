import React from 'react'
import './Header.css'

export default function Header({setScreen, modalWindowOpened }) {
  return (
   <>
   <header>
    <ul className='nav'>
      <li onClick={()=> setScreen('Main')}>Главная</li>
      <li onClick={()=> setScreen('Basket')}>Корзина</li>
    </ul>
    <div className='userB'>
      <button onClick={()=> modalWindowOpened('LoginWrapper')} className='enterB'>Войти</button>
      <button onClick={()=> modalWindowOpened('RegWrapper')}  className='regB'>Зарегистрироваться</button>
    </div>
   </header>
   </>
  )
}
