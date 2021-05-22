const router = require('express').Router();
const {getUsers, createUser, findUser, updateProfile, updateAvatar} = require('../controllers/users')

router.get('/', getUsers);
router.get('/:userId', findUser);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);






module.exports = router;
