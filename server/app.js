const path    = require('path');
const express = require('express');
const app     = express();

app.use(express.static(path.resolve(__dirname, '../www')));

app.use((req, res, next) => {
    const erro = new Error('Não encontrado.');
    erro.code  = 404;
    next(erro);
});

app.use((erro, req, res, next) => {
    res.status(erro.code || 500).send(erro.message);
});

module.exports = app;