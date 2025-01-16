import React from 'react'
import '../ModalWindow/ModalWindow.css'

export default function Login() {
  return (
   <>
   <input type="text" placeholder='Логин' id='putLogin'/>
   <input type="password" placeholder='Пароль' id='putPassword' />
   <button className='modalIn'>Войти</button>
   </>
  )
}