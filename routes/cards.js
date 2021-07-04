const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method),
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
