import React from 'react'
import '../ModalWindow/ModalWindow.css'

export default function Login() {
  
  function LogProcedure(){
    const loginValueL = document.getElementById('putLoginL').value
    const passwordValueL = document.getElementById('putPasswordL').value
    const userDataL ={
      loginDataL: loginValueL,
      passwordDataL: passwordValueL
    }
    debugger
  }
  return (
   <>
   <input type="text" placeholder='Логин' id='putLoginL'/>
   <input type="password" placeholder='Пароль' id='putPasswordL' />
   <button onClick={LogProcedure} className='modalIn'>Войти</button>
   </>
  )
}