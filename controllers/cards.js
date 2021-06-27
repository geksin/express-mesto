const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');

const errorsMessagee = {
  400: 'Переданы некорректные данные при создании карточки',
  404: 'карточка или пользователь не найден',
  '400likes': 'Переданы некорректные данные для постановки/снятии лайка',
  '404del': 'Карточка с указанным _id не найдена',
  '403del': 'Карточку может удалить только создатель',
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFoundError(errorsMessagee[400]));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card == null) {
        next(new NotFoundError(errorsMessagee['404del']));
      }
      if (card.owner.equals(req.user.id)) {
        Card.findByIdAndRemove(card._id)
          .then((cards) => res.send(cards));
      } else {
        next(new RequestError(errorsMessagee['403del']));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFoundError(errorsMessagee['404del']));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => { // http://localhost:3000/cards/60a7f325708ab64d91ef48ad/likes
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then((cards) => {
      if (cards === null) {
        next(new RequestError(errorsMessagee['400likes']));
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(errorsMessagee['400likes']));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } }, // убрать _id из массива
  { new: true },
).then((cards) => {
  if (cards === null) {
    next(new RequestError(errorsMessagee['400likes']));
  }
  res.send({ data: cards });
})
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new RequestError(errorsMessagee['400likes']));
    }
    next(err);
  });
