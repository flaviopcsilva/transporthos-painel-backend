const knex = require('../database/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const hash = process.env.SENHA_JWT

const crialogin = async (req, res) => {
    const { usuario, senha } = req.body

    try {
        const usuarios = await knex('usuarios').where({ usuario }).first()

        if (!usuarios) {
            return res.status(404).json({ mensagem: 'Usuário ou senha inválida' })
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarios.senha)

        if (!senhaCorreta) {
            return res.status(404).json({ mensagem: 'Usuário ou senha inválida' })
        }

        const token = jwt.sign({ id: usuarios.id }, process.env.SENHA_JWT, { expiresIn: '5m' })

        const { senha: _, ...dadosUsuario } = usuarios

        return res.status(201).json({
            usuario: dadosUsuario,
            token
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: ` Erro interno do servidor ${error.message}` })
    }
}

module.exports = crialogin