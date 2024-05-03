const request = require('./src/requisicaoApi');
const express = require('express');
const app = express();
const router = require('./src/rotas')

app.use('/', router.rotas)

app.listen(2000, () => 
    console.log("Servidor está rondando.")
);

