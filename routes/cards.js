const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
  }),
}), createCard);
router.put('/:cardId/likes', celebrate(
  {
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  },
), likeCard);
router.delete('/:cardId/likes', celebrate(
  {
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  },
), dislikeCard);
router.delete('/:cardId', celebrate(
  {
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex(),
    }),
  },
), deleteCard);

module.exports = router;
