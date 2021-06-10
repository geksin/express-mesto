const Card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;

const errorsMessagee = {
  400: 'Переданы некорректные данные при создании карточки',
  404: 'карточка или пользователь не найден',
  '400likes': 'Переданы некорректные данные для постановки/снятии лайка',
  '404del': 'Карточка с указанным _id не найдена',
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee[400] });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') return res.status(ERROR_CODE_404).send({ message: errorsMessagee['404del'] });
      res.status(500).send(err);
    });
};

module.exports.likeCard = (req, res) => { // http://localhost:3000/cards/60a7f325708ab64d91ef48ad/likes
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then((cards) => {
      if (cards === null) return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400likes'] });
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400likes'] });
      res.status(500).send(err);
    });
};

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((cards) => {
  if (cards === null) return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400likes'] });
  res.send({ data: cards });
})
  .catch((err) => {
    if (err.name === 'ValidationError') return res.status(ERROR_CODE_400).send({ message: errorsMessagee['400likes'] });
    res.status(500).send(err);
  });
