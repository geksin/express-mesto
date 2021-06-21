const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jdsg776599jngmmjhdg';
const AutorizationError = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AutorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new AutorizationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};

// const isAuthorized = (token) => jwt.verify(token, JWT_SECRET, { expiresIn: '7d' }, (err, data) => {
//   if (err) {
//     return false;
//   }
//   return User.findOne({ _id: data.id })
//     .then((admin) => !!admin);
// });
