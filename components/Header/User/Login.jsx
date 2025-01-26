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
    const LogAPI = 'http://localhost:9001/login'
    fetch(LogAPI, {
     method: 'POST', 
     headers:{
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(userDataL)
    })
    .then(result => result.json())
    .then((result) => {
     console.log(result)
    })
  }
  return (
   <>
   <input type="text" placeholder='Логин' id='putLoginL'/>
   <input type="password" placeholder='Пароль' id='putPasswordL' />
   <button onClick={LogProcedure} className='modalIn'>Войти</button>
   </>
  )
}