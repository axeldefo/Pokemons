module.exports = (app) =>{
    app.use("/api/v1/pokemons", require('../api/routes/pokemonsRoute'));
    app.use("/api/v1/auth", require('../api/routes/authRoutes'));
    app.use("/api/v1/secure", require('../api/routes/secureRoutes'));
    app.use("/api/v1/user", require('../api/routes/userRoute'));
}