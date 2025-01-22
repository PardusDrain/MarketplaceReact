const PORT = 9001

const EXPRESS = require('express')
const CORS = require('cors')
const MONGOOSE = require('mongoose')
const JWT = require('jsonwebtoken')

const APP = EXPRESS()
APP.use(CORS())
APP.use(EXPRESS.json())

const start = () => {
 try{APP.listen(PORT, () => console.log(`Сервер запушен на ${PORT} порте`))} catch (error){
    console.log(error)
 }
}
start()