const knex = require('../database/conexao')


const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes2')

        return res.json(clientes)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` })
    }
}

const cadastrarClientes = async (next, req, res) => {

    try {

    } catch (error) {

    }
}

const buscarCliente = async (next, req, res) => {

    try {

    } catch (error) {

    }
}

const excluirCliente = async (req, res) => {

    try {

    } catch (error) {

    }
}

const editarCliente = async (req, res) => {

    try {

    } catch (error) {

    }
}

module.exports = {
    listarClientes,
    cadastrarClientes,
    buscarCliente,
    excluirCliente,
    editarCliente
}