import React from 'react'
import './ModalWindow.css'

export default function ModalWindow({modalWindowClosed, children}) {
  return (
    <>
     <div className='echo' onClick={() => modalWindowClosed('modalWindowClosed')}></div>
    <div className="modal">{children}</div>
    </>
  )
}
