const fs = require('node:fs');
const path = require("path");
const filtreService = require('../../services/filtre')
const pokedex = require('../../models/pokedex.json')
const PokemonService = require('../../services/PokemonService');



function getPokemon() {

  return pokedex;
}

exports.getPokemon = getPokemon;



exports.getPokemonsByPage = function (page) {
    const pokedex = getPokemon()
    const pageSize = 10;
    const totalPokemons = pokedex.length;
    const totalPages = Math.ceil(totalPokemons / pageSize);

    // Vérifier si la page demandée est valide
    if (page < 1 || page > totalPages) {
        return { error: "Page out of range" };
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // Pagination des données pour obtenir les pokémons pour la page donnée
    const paginatedPokemons = pokedex.slice(start, end);

    return {
        totalPokemons,
        totalPages,
        currentPage: page,
        pokemons: paginatedPokemons
    };
}

exports.getPokemonById = function (id) {
    //console.log('Retquest id:', id);

    const PokemonTrouve = pokedex.find(pokemon => pokemon.id === id);
    
    //console.log('find2');
    
    if (!PokemonTrouve) {
        console.log('Pokemon not found');
        return { error: "Pokemon pas trouvé" };
    }
    
    //console.log('Returned Pokemon:', PokemonTrouve);
    
    return {
        pokemon: PokemonTrouve
    };
}

exports.search = function (nom, types, hp) {
    //console.log('Retquest id:', id);
    /*const nom = critères.find(c => typeof c === 'string' && c.trim().length > 0);
    const types = critères.filter(c => Array.isArray(c));
    const hp = critères.find(c => typeof c === 'number');
*/
    // Fonction pour convertir la première lettre en majuscule
    //const convertirPremiereLettreEnMajuscule = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const resultatsRecherche = filtreService.search(
        nom,
        types,
        hp,
        pokedex
    );

    //const pokemon = filtreService.search(nom, type, hp, pokedex)

    if (resultatsRecherche.length === 0) {
        return { error: "Aucun Pokémon trouvé avec les critères spécifiés" };
    }

    return {
        pokemons: resultatsRecherche
    };
}



exports.createPokemon = async (req, res) => {
    try {
        const { name, type, base } = req.body;
    
        // Appeler le service pour obtenir le nombre d'éléments existants
        const existingCount = await PokemonService.getPokemonCount();
       
        // Utiliser le nombre d'éléments existants pour générer un nouvel ID
        const newId = parseInt(existingCount, 10) + 1;
    
        // Appeler le service pour créer le Pokémon avec le nouvel ID
        const createdPokemon = await PokemonService.createPokemon({ id: newId, name, type, base });
    
        // Envoyer la réponse
        res.status(201).json(createdPokemon);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.readPokemons = async (req, res) => {
    try {
      const pokemon = await PokemonService.readPokemons();
      if (pokemon) {
        res.json(pokemon);
      } else {
        res.status(404).json({ error: 'Pokemon not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
exports.readPokemon = async (req, res) => {
  try {
    const pokemon = await PokemonService.readPokemonById(req.params.id);
    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updatePokemon = async (req, res) => {
  try {
    const updatedPokemon = await PokemonService.updatePokemon(req.params.id, req.body);
    if (updatedPokemon) {
      res.json(updatedPokemon);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deletePokemon = async (req, res) => {
  try {
    const deletedPokemon = await PokemonService.deletePokemon(req.params.id);
    if (deletedPokemon) {
      res.json(deletedPokemon);
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getPokemonCount = async (req, res) => {
    try {
        const count = await PokemonService.getPokemonCount();
          res.json({count});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};

exports.searchBD = async (req, res) => {
    const nom = req.query.nom;
    const types = req.query.types ? req.query.types.split(',') : [];
    const hp = req.query.hp ? parseInt(req.query.hp) : undefined;
  
    try {
      const resultatsFiltres = await PokemonService.search(nom, types, hp);
      res.json(resultatsFiltres);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
/*module.exports = {

}*/