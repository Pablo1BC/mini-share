const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Rotas
// Rota de parar servidor (injeção do app)
require('./services/stopServer')(app);

// Rotas
// desliga pc
require('./services/scheduleShutdown')(app);


//update
const checkUpdateRoutes = require("./routes/checkUpdate");
app.use("/check-update", checkUpdateRoutes);

module.exports = app;
