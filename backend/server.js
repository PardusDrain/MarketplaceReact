const PORT = 9001;
const DBconnect = 'mongodb://localhost:27017/ReactMarketplaceDB';

const EXPRESS = require('express');
const CORS = require('cors');
const { mongoose } = require('mongoose');
const User = require('./UserSchema');
const ProductDB = require('./ProductSchema');
const JWT = require('jsonwebtoken');
const { secretKey } = require('./config');
const ProfileSchema = require('./ProfileSchema');

const generateAccessToken = (login) => {
  const payload = { login };
  return JWT.sign(payload, secretKey, { expiresIn: '12h' });
};

const APP = EXPRESS();
APP.use(CORS());
APP.use(EXPRESS.json());
APP.post('/registration', async (req) => {
  console.log(req.body);
  const { login, password, email } = req.body;
  const user = new ProfileSchema({ login, password, email });
  await user.save();
});
APP.post('/login', async (req, res) => {
  console.log(req.body);
  const { login, password } = req.body;
  const user = await ProfileSchema.findOne({ login });
  if (!user) {
    return res.status(400).json({ message: 'Такого пользователя нет' });
  }
  if (user.password !== password) {
    return res.status(400).json({ message: 'Неверные данные пользователя' });
  }
  const token = generateAccessToken(user.login);
  const decoded = JWT.verify(token, secretKey);
  console.log(decoded);
  res.json({
    message: 'Вы успешно авторизованы',
    token: token,
    exp: decoded.exp,
  });
});
APP.get('/products', async (req, res) => {
  const serverProduct = await ProductDB.find();
  res.json({ productFetch: serverProduct });
});
APP.get('/profile', async (req, res) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send('Access Denied / Unauthorized request');
  try {
    token = token.split(' ')[1]; // Remove Bearer
    if (token === 'null' || !token)
      return res.status(401).send('Unauthorized request');
    var decoded = JWT.verify(token, secretKey);
    console.log(decoded);
    const profile = await ProfileSchema.findOne({ login: decoded.login });
    res.json(profile);
  } catch (err) {
    return res.status(400).json({ message: 'User not authorized' });
  }
});
APP.post('/update-profile', async (req, res) => {
  const resData = await ProfileSchema.findOneAndUpdate(
    { login: req.query.login },
    req.body.profile,
    { upsert: true },
  );
  console.log(resData);
});
const start = async () => {
  try {
    await mongoose.connect(DBconnect);
    APP.listen(PORT, () => console.log(`Сервер запушен на ${PORT} порте`));
  } catch (error) {
    console.log(error);
  }
};
start();
