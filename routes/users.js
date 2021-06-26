const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, findUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');

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
    avatar: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
  }),
}), updateAvatar);

module.exports = router;
