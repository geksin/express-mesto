const User = require('../models/user');


const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;

const errorsMessagee = {
  "400":"Переданы некорректные данные при создании пользователя",
  "400user":"Переданы некорректные данные при обновлении профиля",
  "400ava":"Переданы некорректные данные при обновлении аватара",
  "404":"Пользователь по указанному _id не найден"
}


module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send(errorsMessagee[400]);
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send(errorsMessagee[404]);
      res.status(500).send({ message: 'Произошла ошибка' })});
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send(errorsMessagee[400]);
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send(errorsMessagee[404]);
      res.status(500).send({ message: 'Произошла ошибка' })});
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {res.send(user)
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send(errorsMessagee[400]);
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send(errorsMessagee[404]);
      res.status(500).send({ message: 'Произошла ошибка' })});
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  console.log(req);
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true
  })
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send(errorsMessagee["400user"]);
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send(errorsMessagee[404]);
      res.status(500).send({ message: 'Произошла ошибка' })});
};

module.exports.updateAvatar = (req, res) => {
  const owner = req.user._id
  const { avatar } = req.body;
  User.findByIdAndUpdate(owner, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true
  })
    .then(users => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send(errorsMessagee["400ava"]);
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send(errorsMessagee[404]);
      res.status(500).send({ message: 'Произошла ошибка' })});
};

