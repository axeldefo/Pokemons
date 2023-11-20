const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
var debug = require('debug')('pokemon:app:Authentication:');

// Méthode pour l'inscription
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    debug('Checking if user exists');
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      debug('User already exists');
      return res.status(400).json({ error: 'Username already exists' });
    }


    //gerneration du salt
    const salt = bcrypt.genSalt(parseInt(process.env.ROUND) ?? 0);
    
    // Hasher le mot de passe
    debug('Hashing the password');
    const hashedPassword = await bcrypt.hash(password, salt);

    
    
    // Créer un nouvel utilisateur
    debug('Creating a new user');
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    debug('User registered successfully');
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    debug('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Méthode pour la connexion
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    debug('Checking if user exists');
    const user = await User.findOne({ username });

    if (!user) {
      debug('User not found');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Vérifier le mot de passe
    debug('Checking the password');
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      debug('Invalid username or password');
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Créer et envoyer le token JWT
    debug('Creating and sending JWT access token');
    const accesstoken = jwt.sign({ username: user.username }, process.env.ACCESS_SECRET, { expiresIn: '3m' });

    debug('Creating and sending JWT refresh token');
    const refreshtoken = jwt.sign({ username: user.username }, process.env.REFRESH_SECRET, { expiresIn: '10m' });

    res.json({ accesstoken, refreshtoken });
  } catch (error) {
    console.error('Login error:', error);
    debug('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Méthode pour le rafraîchissement du token
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      debug('Refresh token missing');
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    // Vérifier le token de rafraîchissement
    debug('Verifying refresh token');
    const user = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
          debug('Invalid refresh token');
          reject(err);
        } else {
          resolve(user);
        }
      });
    });

    // Créer un nouveau token d'accès
    debug('Creating new access token');
    const newAccessToken = jwt.sign({ username: user.username }, process.env.ACCESS_SECRET, { expiresIn: '3m' });

    debug('Sending new access token');
    res.json({ accessToken: newAccessToken });
    } catch (error) {
    console.error('Refresh token error:', error);
    debug('Refresh token failed:', error);
    res.status(500).json({ error: 'Refresh token failed' });
    }
};