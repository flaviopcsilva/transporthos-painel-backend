const knex = require('../database/conexao')
const bcrypt = require('bcrypt')


const ListarUsuarios = async (req, res) => {
    const usuarios = await knex('usuarios')

    return res.json(usuarios)
}

const cadastrarUsuario = async (req, res) => {
    const { usuario, senha } = req.body;

    try {

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarios = await knex('usuarios')
            .insert({ usuario, senha: senhaCriptografada }).returning('*');

        if (!usuarios) {
            return res.status(404).json({ Mensagem: 'O usuário não foi cadastrado.' });
        }



        const { senha: _, ...dadosUsuario } = usuarios[0]

        return res.status(201).json(dadosUsuario);
    } catch (error) {
        return res.status(500).json({ Mensagem: `Erro interno do servidor: ${error.message}` });
    }
}

module.exports = {
    cadastrarUsuario,
    ListarUsuarios
}