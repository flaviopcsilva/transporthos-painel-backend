const express = require('express')
const ejs = require('ejs')
const { listarClientes, cadastrarClientes, editarCliente, excluirCliente, buscarCliente, listagemDeClientesCompleta } = require('./controladores/clientes')
const validarCorpoRequisicao = require('./intermediarios/validarCorpoDaRequisicao')
const { schemaPlacas } = require('./validacoes/schema')
const { listarClientesEmail, buscarClientePdf } = require('./controladores/enviarEmail')
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

app.post('/send', (req, res) => {
    const recipientEmail = req.body.recipientEmail;
    const { cliente, qtd, tipo_de_carga, origem, destino, selectedStatus, selectedInform, emailBody } = req.body;

    if (!recipientEmail) {
        return res.status(400).send('E-mail do destinatário ausente.');
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const subject = `Follow UP: ${selectedInform}`;

    const text = `
      Cliente: ${cliente}
      Quantidade: ${qtd}
      Tipo de Carga: ${tipo_de_carga}
      Origem: ${origem}
      Destino: ${destino}
      Status: ${selectedStatus}
      Informação: ${selectedInform}
    `;

    const htmlBody = emailBody;

    transporter.sendMail({
        from: 'flaviopc2@gmail.com',
        to: recipientEmail,
        cc: ['lucas_cosllop@hotmail.com', ' flaviopcfake@gmail.com'],
        subject: subject,
        html: htmlBody

    }).then(info => {
        res.send(info);
        console.log("E-mail enviado:", info);
    }).catch(error => {
        res.status(500).send(error);
        console.error("Erro ao enviar o e-mail:", error);
    });
});


module.exports = rotas