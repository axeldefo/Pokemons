const jwt = require('jsonwebtoken');

// Middleware pour l'authentification par jeton JWT
const authenticateToken = (req, res, next) => {
  // Récupérer le jeton depuis le header d'autorisation
  const token = req.header('Authorization');
  console.log(token);
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extraire le token (enlever "Bearer " du début)
  const tokenWithoutBearer = token.substring(7);

  // Vérifier si le jeton existe
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Vérifier la validité du jeton
  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token has expired' });
      } else {
        return res.status(403).json({ error: 'Token is not valid' });
      }
    }
    
    // Appeler next() pour continuer le traitement de la requête
    next();
  });
};

// Exporter le middleware
module.exports = { authenticateToken };
