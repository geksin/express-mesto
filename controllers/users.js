const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/errors');
const RequestError = require('../errors/errors');
const AutorizationError = require('../errors/errors');
const AlreadyHaveError = require('../errors/errors');

const JWT_SECRET = 'jdsg776599jngmmjhdg';

const errorsMessagee = {
  400: 'Переданы некорректные данные при создании пользователя',
  '400login': 'Не заполнены все поля',
  '400user': 'Переданы некорректные данные при обновлении профиля',
  '400ava': 'Переданы некорректные данные при обновлении аватара',
  401: 'Логин или пароль не правильные',
  404: 'Пользователь по указанному _id не найден',
  '404email': 'Пользователь с такой почтой не найден',
  409: 'Пользователь c такой почтой уже существует',
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  const userid = req.user.id;
  User.findById(userid)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!email || !password) {
    next(new RequestError(errorsMessagee[400]));
  }
  return bcrypt.hash(password, 8, (err, hash) => User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new AlreadyHaveError(errorsMessagee[409]));
      }
      return User.create({
        name, about, avatar, password: hash, email,
      })
        .then((newuser) => res.status(200).send({ data: newuser }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    }));
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body,
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee[400]));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee['400ava']));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee[404]));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new RequestError(errorsMessagee['400login']));
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new NotFoundError(errorsMessagee['404email']));
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (!isValid) {
          next(new AutorizationError(errorsMessagee[401]));
        }

        const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).send(token);
      });
    })
    .catch(next);
};
