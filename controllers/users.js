const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const JWT_SECRET = 'jdsg776599jngmmjhdg';



const errorsMessagee = {
  400: 'Переданы некорректные данные при создании пользователя',
  '400user': 'Переданы некорректные данные при обновлении профиля',
  '400ava': 'Переданы некорректные данные при обновлении аватара',
  404: 'Пользователь по указанному _id не найден',
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee[400] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getMe = (req, res) => {
  console.log(req.user.id);
  User.findOne(req.user.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee[400] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'not all sent' });
  }

  return bcrypt.hash(password, 8, (err, hash) => User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: 'Пользователь c такой почтой уже существует' });
      }
      return User.create({
        name, about, avatar, password: hash, email,
      })
        .then((user) => res.status(200).send({ data: user }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee[400] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee[400] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  // const body = req.body;
  User.findByIdAndUpdate(req.user._id, req.body,
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400user'] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const owner = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400ava'] });
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee[404] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'not all sent' });
  }

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: 'not found' });
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          return res.status(401).send({ message: 'no valid' });
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).send(token);
      });
    });
};
