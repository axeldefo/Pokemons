var PokemonController = require('../Controllers/pokemonsController')    
const { authenticateToken } = require('../../loaders/authMiddleware');  // Correction ici
var express = require('express');
var router = express.Router();
var debug = require('debug')('pokemon:controller')

const PokemonMongoose = require('../../models/pokemon');




/**
 * @swagger
 * 
 * /api/v1/pokemons:
 *   get:
 *     summary: Get all Pokemon
 *     description: Retrieve a list of all Pokemon.
 *     responses:
 *       '200':
 *         description: Success, returns a list of Pokemon
 *       '500':
 *         description: Internal Server Error
 */

router.get('/', function(req, res, next) {
    res.json(PokemonController.getPokemon())
  });

  /**
 * @swagger
 * 
 * /api/v1/pokemons/pagination:
 *   get:
 *     summary: Get paginated Pokemon
 *     description: Retrieve a paginated list of Pokemon.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns a paginated list of Pokemon
 *       '500':
 *         description: Internal Server Error
 */

router.get('/pagination', function(req, res, next) {
    const page = parseInt(req.query.page || 1);
    const paginatedPokemons = PokemonController.getPokemonsByPage(page);
    res.json(paginatedPokemons)

});
 
/**
 * @swagger
 * 
 * /api/v1/pokemons/search:
 *   get:
 *     summary: Search for Pokemon
 *     description: Search for Pokemon based on criteria.
 *     parameters:
 *       - name: nom
 *         in: query
 *         description: Pokemon name
 *         required: false
 *         schema:
 *           type: string
 *       - name: types
 *         in: query
 *         description: Types of Pokemon (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *       - name: hp
 *         in: query
 *         description: Pokemon HP
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns search results
 *       '500':
 *         description: Internal Server Error
 */

router.get('/search', function(req, res, next) {
  // Récupérer les critères depuis les paramètres de requête
  const nom = req.query.nom;
  const types = req.query.types ? req.query.types.split(',') : [];
  const hp = req.query.hp ? parseInt(req.query.hp) : undefined;

  // Appeler la fonction de recherche du contrôleur
  const resultatsRecherche = PokemonController.search(nom, types, hp);

  // Retourner les résultats en tant que réponse JSON
  res.json(resultatsRecherche);
});

/*router.get('/:id', function(req, res, next) {
  
  //debug('coucou')
  const pokemonId = parseInt(req.params.id);
  
  //console.log('Requested Pokemon ID:', pokemonId);

  if (isNaN(pokemonId)) {
      res.status(400).json({ error: "Invalid Pokemon ID" });
      return;
  }

  const pokemon = PokemonController.getPokemonById(pokemonId);

  //console.log('Returned Pokemon:', pokemon);
  
  if (pokemon.error) {
      res.status(404).json(pokemon);
  } else {
      res.json(pokemon);
  }
});
*/



/**
 * @swagger
 * 
 * /api/v1/pokemons/crud/:
 *   post:
 *     summary: Create a new Pokemon
 *     description: Create a new Pokemon.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Pikachu
 *             type: Electric
 *             base: 55
 *     responses:
 *       '201':
 *         description: Pokemon created successfully
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '500':
 *         description: Internal Server Error
 *   get:
 *     summary: Get all Pokemon (CRUD)
 *     description: Retrieve a list of all Pokemon (CRUD).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success, returns a list of Pokemon (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '500':
 *         description: Internal Server Error
 */

router.post('/crud/', authenticateToken, PokemonController.createPokemon);

/**
 * @swagger
 * 
 * /api/v1/pokemons/crud/:
 *   get:
 *     summary: Get all Pokemon (CRUD)
 *     description: Retrieve a list of all Pokemon (CRUD).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success, returns a list of Pokemon (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '500':
 *         description: Internal Server Error
 */

router.get('/crud/', authenticateToken, PokemonController.readPokemons);

/**
 * @swagger
 * 
 * /api/v1/pokemons/crud/search:
 *   get:
 *     summary: Search for Pokemon (CRUD)
 *     description: Search for Pokemon based on criteria (CRUD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nom
 *         in: query
 *         description: Pokemon name
 *         required: false
 *         schema:
 *           type: string
 *       - name: types
 *         in: query
 *         description: Types of Pokemon (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *       - name: hp
 *         in: query
 *         description: Pokemon HP
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns search results (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '500':
 *         description: Internal Server Error
 */

router.get('/crud/search', authenticateToken, PokemonController.searchBD);



/**
 * @swagger
 * 
 * /api/v1/pokemons/crud/{id}:
 *   get:
 *     summary: Get a Pokemon by ID (CRUD)
 *     description: Retrieve a Pokemon by ID (CRUD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Pokemon ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns a Pokemon (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '404':
 *         description: Pokemon not found
 *       '500':
 *         description: Internal Server Error
 *   put:
 *     summary: Update a Pokemon by ID (CRUD)
 *     description: Update a Pokemon by ID (CRUD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Pokemon ID
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Pikachu
 *             type: Electric
 *             base: 60
 *     responses:
 *       '200':
 *         description: Success, returns the updated Pokemon (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '404':
 *         description: Pokemon not found
 *       '500':
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a Pokemon by ID (CRUD)
 *     description: Delete a Pokemon by ID (CRUD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Pokemon ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns the deleted Pokemon (CRUD)
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '404':
 *         description: Pokemon not found
 *       '500':
 *         description: Internal Server Error
 */

router.get('/crud/:id', authenticateToken, PokemonController.readPokemon);

router.put('/crud/:id', authenticateToken, PokemonController.updatePokemon);
router.delete('/crud/:id', authenticateToken, PokemonController.deletePokemon);

/**
 * @swagger
 * 
 * /api/v1/pokemons/count:
 *   get:
 *     summary: Get the count of Pokemon
 *     description: Retrieve the count of Pokemon.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Success, returns the count of Pokemon
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '500':
 *         description: Internal Server Error
 */

router.get('/count', authenticateToken, PokemonController.getPokemonCount);

/**
 * 
 * @swagger
 * 
 * /api/v1/pokemons/{id}:
 *   get:
 *     summary: Get a Pokemon by ID
 *     description: Retrieve a Pokemon by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Pokemon ID
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Success, returns a Pokemon
 *       '401':
 *         description: Unauthorized, invalid JWT token
 *       '404':
 *         description: Pokemon not found
 *       '500':
 *         description: Internal Server Error
 */

router.get('/:id', authenticateToken, async (req, res) => {
  try {

    console.error("1");
    const pokemon = await PokemonMongoose.findOne({ id: req.params.id });
    console.error("2");
    res.json(pokemon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


module.exports = router;

