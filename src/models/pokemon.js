/*const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pokemon = sequelize.define('Pokemon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.JSONB,
  },
  type: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  base: {
    type: DataTypes.JSONB,
  },
});

module.exports = Pokemon;*/

const mongoose = require('../loaders/mongoose');

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String,
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    'Sp. Attack': Number,
    'Sp. Defense': Number,
    Speed: Number,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;


//On peut ajouter les methodes à utiliser par le schema et meme des règles de validation
//on peut ajouter un index sur un attribut pour faciliter la recherche par ce dernier
//pour utiliser nos élément dans le front il faut créer un modèle correspondant à ce schema