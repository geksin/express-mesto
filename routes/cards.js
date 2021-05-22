const router = require('express').Router();
const {getCards, createCard, deleteCard, likeCard, dislikeCard} = require('../controllers/cards')

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);


module.exports = router;
