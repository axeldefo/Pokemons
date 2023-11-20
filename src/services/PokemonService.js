// services/PokemonService.js
const Pokemon = require('../models/pokemon');

exports.createPokemon = async ({ id, name, type, base }) => {
    const pokemon = new Pokemon({ id, name, type, base });
    return await pokemon.save();
};

exports.readPokemons = async () => {
    return Pokemon.find({});
  };

exports.readPokemonById = async (id) => {
  return Pokemon.findOne({ id: id });
};

exports.updatePokemon = async (id, updatedData) => {
  return Pokemon.findOneAndUpdate({ id: id }, updatedData, { new: true });
};

exports.deletePokemon = async (id) => {
  return Pokemon.findOneAndDelete({ id: id });
};

exports.getPokemonCount = async () => {
    
    return Pokemon.countDocuments();
  };

exports.search = async (nom, types, hp) => {
    const filter = {};
  
    // Ajoutez des conditions au filtre en fonction des paramètres spécifiés
    if (nom) {
      filter['name.french'] = { $regex: new RegExp(nom, 'i') };
    }
  
    if (types && types.length > 0) {
      filter.type = { $all: types };
    }
  
    if (hp) {
      filter['base.HP'] = hp;
    }
  
    try {
      const resultatsFiltres = await Pokemon.find(filter);
      return resultatsFiltres;
    } catch (error) {
      console.error(error);
      throw new Error('Erreur lors de la recherche de Pokémon');
    }
  };