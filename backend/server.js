const PORT = 9001

const EXPRESS = require('express')
const CORS = require('cors')
const MONGOOSE = require('mongoose')
const JWT = require('jsonwebtoken')

const APP = EXPRESS()
APP.use(CORS())
APP.use(EXPRESS.json())
APP.post('/registration', (req) => {
  console.log(req.body)
} )
APP.post('/login', (req) => {
  console.log(req.body)
} )
APP.get('/products', (req, res) => {
  const serverProduct = [
    {id:10,
      img: '../components/Main/images.jpg',
      productName:'Товар',
      price: '200p',
      },
      {id:11,
        productName:'Товар',
        price: '200p',
        },
        {id:12,
          productName:'Товар',
          price: '200p',
          },
          {id:13,
            productName:'Товар',  
            price: '200p'
            }
  ]
  res.json({data: serverProduct})
} )

const start = () => {
 try{APP.listen(PORT, () => console.log(`Сервер запушен на ${PORT} порте`))} catch (error){
    console.log(error)
 }
}
start()