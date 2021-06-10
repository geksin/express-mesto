const router = require('express').Router();
const {
  getUsers, findUser, updateProfile, updateAvatar, getMe
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', findUser);
router.get('/me', getMe);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
