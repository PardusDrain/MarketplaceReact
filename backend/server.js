// Конфигурация сервера
const PORT = 9001;
const DBconnect = 'mongodb://localhost:27017/ReactMarketplaceDB';

const EXPRESS = require('express');
const Order = require('./OrderSchema');
const CORS = require('cors');
const { mongoose } = require('mongoose');
const ProductDB = require('./ProductSchema');
const JWT = require('jsonwebtoken');
const { secretKey } = require('./config');
const ProfileSchema = require('./ProfileSchema');

// Проверка авторизации
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

// Генерация JWT токена
const generateAccessToken = (login) => {
  const payload = { login };
  return JWT.sign(payload, secretKey, { expiresIn: '12h' });
};

const APP = EXPRESS();
APP.use(
  CORS({
    origin: (origin, callback) => {
      // Разрешение  использованиz любого адреса на localhost
      if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
APP.use(EXPRESS.json());
// Роут регистрации нового пользователя
APP.post('/registration', async (req, res) => {
  try {
    const { login, password, email } = req.body;

    const existingUser = await ProfileSchema.findOne({ login });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: 'Пользователь с таким логином уже существует' });
    }

    const user = new ProfileSchema({ login, password, email });
    await user.save();
    const token = generateAccessToken(user.login);
    const payload = JWT.decode(token);
    res.status(201).json({
      message: 'Регистрация успешна',
      token: token,
      login: user.login,
      exp: payload.exp,
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});
// Роут авторизации пользователя
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
// Роут получения списка товаров
APP.get('/products', async (req, res) => {
  const serverProduct = await ProductDB.find();
  res.json({ productFetch: serverProduct });
});

// Роут добавления нового товара
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

APP.post('/api/products', upload.single('image'), async (req, res) => {
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

// Роут оформления заказа
APP.post('/api/orders', async (req, res) => {
  try {
    const { city, address, firstName, lastName, total } = req.body;

    // Validation checks
    const errors = [];
    if (!city?.trim()) errors.push('Укажите город');
    if (!address?.trim()) errors.push('Укажите адрес');
    if (!firstName?.trim()) errors.push('Укажите имя');
    if (!lastName?.trim()) errors.push('Укажите фамилию');
    if (isNaN(total) || total <= 0) errors.push('Некорректная сумма заказа');

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const newOrder = new Order({
      city: city.trim(),
      address: address.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      total: Number(total),
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      orderId: savedOrder._id,
      message: 'Заказ успешно оформлен',
    });
  } catch (error) {
    console.error('Ошибка при сохранении заказа:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      error:
        statusCode === 400
          ? 'Ошибка валидации данных: ' + error.message
          : 'Внутренняя ошибка сервера',
    });
  }
});

// Роут проверки существования пользователя
APP.get('/verify-user', authMiddleware, async (req, res) => {
  try {
    const user = await ProfileSchema.exists({ login: req.user.login });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ exists: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Роут получения данных профиля пользователя
APP.get('/profile', authMiddleware, async (req, res) => {
  try {
    console.log(req.user);
    const profile = await ProfileSchema.findOne({ login: req.user.login });
    res.json(profile);
  } catch (err) {
    return res.status(400).json({ message: 'User not authorized' });
  }
});
// Роут обновления данных профиля
APP.post('/api/update-profile', authMiddleware, async (req, res) => {
  try {
    const updates = req.body.profile;
    if (Object.values(updates).every((val) => !val)) {
      return res
        .status(400)
        .json({ message: 'Заполните профиль новой информацией' });
    }

    const existingUser = await ProfileSchema.findOne({ login: updates.login });
    if (existingUser && existingUser.login !== req.user.login) {
      return res.status(409).json({ message: 'Логин уже занят' });
    }

    const updatedUser = await ProfileSchema.findOneAndUpdate(
      { login: req.user.login },
      updates,
      { new: true },
    );

    res.json({
      message: 'Профиль обновлен',
      profile: updatedUser,
    });
  } catch (error) {
    console.error('Ошибка обновления:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Запуск сервера и подключение к БД
const start = async () => {
  try {
    await mongoose.connect(DBconnect);
    APP.listen(PORT, () => console.log(`Сервер запушен на ${PORT} порте`));
  } catch (error) {
    console.log(error);
  }
};
start();
