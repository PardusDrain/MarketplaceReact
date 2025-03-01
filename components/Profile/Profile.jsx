import React, { useEffect, useState  } from 'react'

export default function Profile() {
    const [profile, setProfile] = useState()
    useEffect(() => {
        const ProfileAPI = 'http://localhost:9001/profile?login=test'
    fetch(ProfileAPI, {
     method: 'GET', 
     headers:{
       'Content-Type': 'application/json'
     },
    })
    .then(result => result.json())
    .then((result) => {
        setProfile(result)

    })
  }, [])
  const onSubmit = () => {
    const updateProfileAPI = 'http://localhost:9001/update-profile?login=test'
    fetch(updateProfileAPI, {
     method: 'POST', 
     headers:{
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({profile})
    })
    .then(result => result.json())
    .then((result) => {
     console.log(result)
    })
  }
  

  return (
   <>
   <input type="email" value={profile?.email} placeholder='Ваша новая почта' onChange={e => setProfile({ 
...profile,
email: e.target.value,
})}/> 
   <input type="text" value={profile?.login}placeholder='Новый логин' onChange={e => setProfile({ 
...profile,
login: e.target.value,
})}/>
   <button className='orderB' onClick={onSubmit}>Изменить</button>

   </>
  )
}
