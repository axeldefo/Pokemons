var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swaggerSpec'); // Assurez-vous de spécifier le chemin correct


//
const dotenv = require('dotenv');
dotenv.config();

var debug = require('debug')('http');
const http = require('http');
console.log('booting %o', process.env.DEBUG);
const debugApp = require('debug')('Pokemon:app start')

const helmet = require('helmet');



const bodyParser = require('body-parser');
// ...




var app = express();
//app.use('/api/v1/pokemons', pokemonsController);

// Accéder aux variables d'environnement
const port = process.env.PORT;


var server = http.createServer(app);

server.listen(port, () => {
    debugApp('Pokemoner');

    console.log(`Serveur démarré sur le port ${port}`);
  });


  // Ajoutez la documentation Swagger à votre application
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

app.use(helmet());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//app.use('/pokemons', pokemonsRouter);
//app.use('/', indexRouter);
const secureRoutes = require('./api/routes/secureRoutes');
const authMiddleware = require('./loaders/authMiddleware');

require("./loaders/routes")(app);
app.use('/secure',secureRoutes);

app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500).end();
    //res.render('error');
  });
  
  module.exports = app;