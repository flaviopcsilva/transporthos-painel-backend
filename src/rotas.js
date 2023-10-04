const express = require('express')
const { listarClientes, cadastrarClientes, editarCliente, excluirCliente, buscarCliente } = require('./controladores/clientes')

const rotas = express()

rotas.get('/', (req, res) => {
    return res.json('Rota Funcionando!')
})

rotas.get('/clientes', listarClientes)

rotas.post('/clientes', cadastrarClientes)
rotas.put('/cliente/:id', editarCliente)
rotas.delete('cliente/:id', excluirCliente)
rotas.get('/buscar', buscarCliente)

module.exports = rotas