const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const knex = require('../database/conexao')

const enviarEmailComDados = async (destinatario, dados) => {
    try {
        // Configurar o transporte de e-mail com nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        // Construir o corpo do e-mail com os dados formatados
        let emailBody = 'Lista de Clientes:\n\n';

        dados.forEach((cliente, index) => {
            emailBody += `Cliente ID ${cliente.id}:\n`;
            emailBody += `Nome: ${cliente.cliente}\n`;
            emailBody += `Data: ${cliente.data}\n`;
            emailBody += `Hora: ${cliente.hora}\n`;
            emailBody += '--------------------------\n';
        });

        // Configurar o e-mail
        const mailOptions = {
            from: 'flaviopc2@gmail.com',
            to: destinatario,
            subject: 'Lista de Clientes',
            text: emailBody, // Usar o corpo do e-mail como texto simples
        };

        // Enviar o e-mail
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado:', info.response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};

const listarClientesEmail = async (req, res) => {
    try {
        // Consulte o banco de dados para obter a lista de clientes
        const clientes = await knex('clientes2')
            .orderBy('data')
            .orderBy('hora');

        // Mapeia os resultados para formatar a data abreviada e hora abreviada, se necessário
        const clientesFormatados = clientes.map(cliente => {
            const data = new Date(cliente.data);
            const hora = new Date(`1970-01-01T${cliente.hora}`);

            // Obtém a hora e os minutos do objeto Date
            const horas = hora.getHours();
            const minutos = hora.getMinutes();

            // Formata a hora com dois dígitos para garantir que seja exibida como "HH:MM"
            const horaAbreviada = `${horas}:${minutos.toString().padStart(2, '0')}`;

            return {
                id: cliente.id,
                data: `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`,
                hora: horaAbreviada,
                cliente: cliente.cliente,
                quantidade: cliente.quantidade,
                di: cliente.di,
                dta: cliente.dta,
                tipoDeCarga: cliente.tipo_de_carga,
                processo: cliente.processo,
                plCavalo: cliente.pl_cavalo,
                plCarreta: cliente.pl_carreta,
                motorista: cliente.motorista,
                origem: cliente.origem,
                destino: cliente.destino,
                ajudantes: cliente.ajudantes,
                conferentes: cliente.conferentes,
                status: cliente.status
            };
        });

        // Enviar e-mail com a lista de clientes em PDF
        await enviarEmailComDados('flaviopc2@gmail.com', clientesFormatados);

        // Retornar os clientes como resposta JSON
        return res.status(200).json(clientesFormatados);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

module.exports = {
    listarClientesEmail
};
