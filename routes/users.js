const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers, findUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate(
  {
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  },
), findUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().custom(method),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(method),
  }),
}), updateAvatar);

module.exports = router;
