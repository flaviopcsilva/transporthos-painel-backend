const express = require('express')
const ejs = require('ejs')
const { listarClientes, cadastrarClientes, editarCliente, excluirCliente, buscarCliente, listagemDeClientesCompleta } = require('./controladores/clientes')
const validarCorpoRequisicao = require('./intermediarios/validarCorpoDaRequisicao')
const { schemaPlacas } = require('./validacoes/schema')
const { listarClientesEmail, buscarClientePdf, emailNovo } = require('./controladores/enviarEmail')
const crialogin = require('./controladores/login')
const { cadastrarUsuario, ListarUsuarios } = require('./controladores/usuarios')
const enviarPDF = require('./controladores/enviarpdf')


const rotas = express()

rotas.get('/', (req, res) => {
    return res.json('Rota Funcionando!')
})

rotas.post('/login', crialogin)
rotas.get('/listagemcompleta', listagemDeClientesCompleta)
rotas.get('/usuario', ListarUsuarios)
rotas.post('/usuario', cadastrarUsuario)

rotas.get('/clientes', listarClientes)
rotas.get('/clientepdf', buscarClientePdf)
rotas.post('/clientes', validarCorpoRequisicao(schemaPlacas), cadastrarClientes)
rotas.put('/cliente/:id', validarCorpoRequisicao(schemaPlacas), editarCliente)
rotas.delete('/cliente/:id', excluirCliente)
rotas.get('/buscar', buscarCliente)

rotas.get('/email', listarClientesEmail)

rotas.put('/enviar-pdf', enviarPDF)

// Mandar email.

rotas.post('/send', emailNovo)


module.exports = rotas