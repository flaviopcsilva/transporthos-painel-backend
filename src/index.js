require('dotenv').config()

const express = require('express')
const rotas = require('./rotas')
const cors = require('cors')
const app = express()

// Configuração para permitir CORS apenas do seu domínio frontend
const corsOptions = {
    origin: 'https://painel-transporthos.vercel.app/painel', // Substitua pelo seu domínio frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(rotas)

app.listen(process.env.PORT_SERVER, () => {
    console.log(`Servidor Rodando na Porta ${process.env.PORT_SERVER}`)
})