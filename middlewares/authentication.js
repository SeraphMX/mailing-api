const jwt = require('jsonwebtoken');

// Verificación del token
let tokenVerification = (req, res, next) => {

  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    
    req.body = decoded.body;
    next();
  });

  res.json({
    token: token
  })

};

module.exports = {
  tokenVerification
}