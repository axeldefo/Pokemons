const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const url = process.env.MONGOURI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }); 

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connecté à MongoDB');
});

module.exports = mongoose;

