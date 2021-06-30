const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, findUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/api', getUsers);
router.get('/api/me', getMe);
router.get('/api/:userId', celebrate(
  {
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  },
), findUser);
router.patch('/api/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), updateProfile);
router.patch('/api/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
  }),
}), updateAvatar);

module.exports = router;
