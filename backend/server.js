const PORT = 9001;
const DBconnect = 'mongodb://localhost:27017/ReactMarketplaceDB';

const EXPRESS = require('express');
const CORS = require('cors');
const { mongoose } = require('mongoose');
const ProductDB = require('./ProductSchema');
const JWT = require('jsonwebtoken');
const { secretKey } = require('./config');
const ProfileSchema = require('./ProfileSchema');

const authMiddleware = function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const decoded = JWT.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
};

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
  const payload = JWT.decode(token);
  res.json({
    message: 'Вы успешно авторизованы',
    token: token,
    exp: payload.exp,
  });
});
APP.get('/products', async (req, res) => {
  const serverProduct = await ProductDB.find();
  res.json({ productFetch: serverProduct });
});

// NEW POST ROUTE FOR PRODUCTS
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

APP.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;
    let imgPath = '';
    if (req.file) {
      imgPath = req.file.path;
    }
    const newProduct = new ProductDB({
      name,
      img: imgPath,
      price: Number(price),
    });
    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
APP.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    const profile = await ProfileSchema.findOne({ login: req.user.login });
    res.json(profile);
  } catch (err) {
    return res.status(400).json({ message: 'User not authorized' });
  }
});
APP.post('/update-profile', authMiddleware, async (req, res) => {
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
