import React from 'react'
import '../ModalWindow/ModalWindow.css'

export default function Registration() {
function RegProcedure(){
    const loginValueR = document.getElementById('putLoginR').value
    const passwordValueR = document.getElementById('putPasswordR').value
    const emailValueR = document.getElementById('putEmailR').value
    const userDataR ={
      loginDataR: loginValueR,
      passwordDataR: passwordValueR,
      emailDataR: emailValueR
    }
    const RegAPI = 'http://localhost:9001/registration'
     fetch(RegAPI, {
      method: 'POST', 
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDataR)
     })
     .then(result => result.JSON())
     .then((result) => {
      console.log(result)
     })
  }
  
  return (
    <>
    <input type="text" placeholder='Логин' id='putLoginR'/>
    <input type="password" placeholder='Пароль' id='putPasswordR' />
    <input type="email" placeholder='Почта' id='putEmailR' />
    <button onClick={RegProcedure} className='modalIn'>Зарегистрироваться</button>
    </>
   )
     
 }


