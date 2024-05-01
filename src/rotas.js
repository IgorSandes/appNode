const express = require('express');
const rotas = express.Router();
const request = require('./requisicaoApi')

rotas.get('/users', request.request)

module.exports = {rotas}