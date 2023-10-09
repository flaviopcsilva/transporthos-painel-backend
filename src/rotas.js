const express = require('express')
const { listarClientes, cadastrarClientes, editarCliente, excluirCliente, buscarCliente } = require('./controladores/clientes')
const validarCorpoRequisicao = require('./intermediarios/validarCorpoDaRequisicao')
const { schemaPlacas } = require('./validacoes/schema')
const { listarClientesEmail } = require('./controladores/enviarEmail')


const rotas = express()

rotas.get('/', (req, res) => {
    return res.json('Rota Funcionando!')
})

rotas.get('/clientes', listarClientes)

rotas.post('/clientes', validarCorpoRequisicao(schemaPlacas), cadastrarClientes)
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaPlacas), editarCliente)
rotas.delete('/cliente/:id', excluirCliente)
rotas.get('/buscar', buscarCliente)

rotas.get('/email', listarClientesEmail)

module.exports = rotas