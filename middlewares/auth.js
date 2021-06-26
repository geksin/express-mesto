const jwt = require('jsonwebtoken');
const config = require('../config');
const AutorizationError = require('../errors/AutorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AutorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    next(new AutorizationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
