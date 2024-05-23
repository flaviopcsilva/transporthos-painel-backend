const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');
const knex = require('../database/conexao')

const enviarEmailComDados = async (destinatario, dados) => {
    try {
        // Configurar o transporte de e-mail com nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_GOOGLE,
                pass: process.env.SENHA_GOOGLE
            }
        });

        // Construir o corpo do e-mail com os dados formatados
        let emailBody = '<h1>Lista de Clientes:</h1>\n\n';

        dados.forEach((cliente, index) => {
            emailBody += `<h2>Cliente ID ${cliente.id}:</h2>\n`;
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
            attachments: [
                {
                    filename: 'clientes.pdf', // Nome do anexo
                    path: 'src/arquivos/clientes.pdf', // Caminho para o arquivo PDF temporário
                },
            ],
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
                status: cliente.status,
                cnpj: cliente.cnpj
            };
        });

        // Enviar e-mail com a lista de clientes em PDF
        await enviarEmailComDados('flaviopcfake@gmail.com', clientesFormatados);

        // Retornar os clientes como resposta JSON
        return res.status(200).json(clientesFormatados);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};



const buscarClientePdf = async (req, res) => {
    try {
        const { busca } = req.body; // Obtém o nome do cliente do corpo da requisição

        // Verifica se o nome do cliente foi fornecido na requisição
        if (!busca) {
            return res.status(400).json({ Mensagem: 'O nome do cliente é obrigatório no corpo da requisição' });
        }

        // Consulta o banco de dados filtrando pelo nome do cliente (insensível a maiúsculas e minúsculas)
        const clientes = await knex('clientes2')
            .where(builder => {
                builder.whereRaw('lower(cliente) like ?', [`%${busca.toLowerCase()}%`])
                    .orWhereRaw('lower(status) like ?', [`%${busca.toLowerCase()}%`]);
            })
            .orderBy('data')
            .orderBy('hora')


        // Mapeia os resultados para formatar a data abreviada e hora abreviada, se necessário
        const clientesFormatados = clientes.map(cliente => {
            const data = new Date(cliente.data);
            const hora = new Date(`1970-01-01T${cliente.hora}`);

            // Obtém a hora e os minutos do objeto Date
            const horas = hora.getHours();
            const minutos = hora.getMinutes();

            // Formata a hora e os minutos com dois dígitos
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
                pl_cavalo: cliente.pl_cavalo,
                pl_carreta: cliente.pl_carreta,
                motorista: cliente.motorista,
                origem: cliente.origem,
                destino: cliente.destino,
                ajudantes: cliente.ajudantes,
                conferente: cliente.conferente,
                status: cliente.status,
                cnpj: cliente.cnpj
            };
        });


        // Criar um novo documento PDF
        const doc = new PDFDocument();

        // Nome do arquivo PDF a ser salvo
        const pdfFileName = 'src/arquivos/clientes.pdf';

        // Configurar o stream para salvar o PDF no arquivo
        const stream = fs.createWriteStream(pdfFileName);

        // Configurar o título do documento
        doc.pipe(stream);
        doc.fontSize(16).text('Lista de Clientes', { align: 'center' });


        // Adicionar os detalhes dos clientes ao PDF
        clientesFormatados.forEach(cliente => {
            doc.fontSize(12)
                .text(`Cliente ID: ${cliente.id}`)
                .text(`Nome: ${cliente.cliente}`)
                .text(`CNPJ: ${cliente.cnpj}`)
                .text('Data: ', { italic: true, continued: true }) // Deixa "Data" em negrito
                .text(`${cliente.data}`)
                .text(`Hora: ${cliente.hora}`)
                .text(`Quantidade: ${cliente.quantidade}`)
                .text(`DI: ${cliente.di}`)
                .text(`DTA: ${cliente.dta}`)
                .text(`Tipo de carga: ${cliente.tipoDeCarga}`)
                .text(`Processo: ${cliente.processo}`)
                .text(`PL Cavalo: ${cliente.pl_cavalo}`)
                .text(`PL Carreta: ${cliente.pl_carreta}`)
                .text(`Motorista: ${cliente.motorista}`)
                .text(`Origem: ${cliente.origem}`)
                .text(`Destino: ${cliente.destino}`)
                .text(`Ajudantes: ${cliente.ajudantes}`)
                .text(`Conferente: ${cliente.conferente}`)
                .fillColor('red')
                .text(`Status: ${cliente.status}`, { underline: true, italic: true })
                .fillColor('black')
                .text('-------------------------------------------');
        });

        // Finalizar e salvar o documento
        doc.end();



        return res.json(clientesFormatados);
    } catch (error) {

        return res.status(500).json({ Mensagem: `Erro interno do servidor em buscar clientes ${error}` });
    }
}



const emailNovo = async (req, res) => {

    const recipientEmail = req.body.recipientEmail;
    const { id, cliente, processo, di, data, hora, qtd, cnpj, tipo_de_carga, origem, destino, selectedStatus, selectedInform, emailBody, informacoes } = req.body;

    try {
        if (!recipientEmail) {
            return res.status(400).send('E-mail do destinatário ausente.');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_GOOGLE,
                pass: process.env.SENHA_GOOGLE
            }
        });

        const subject = `Follow UP: ${selectedInform}`;



        const text = `
      Cliente: ${cliente}
      CNPJ: ${cnpj}
      Quantidade: ${qtd}
      Tipo de Carga: ${tipo_de_carga}
      Origem: ${origem}
      Destino: ${destino}
      Status: ${selectedStatus}
      Informação: ${historicoString}
    `;

        const htmlBody = emailBody

        transporter.sendMail({
            from: process.env.EMAIL_GOOGLE,
            to: recipientEmail,
            cc: ['lucas_cosllop@hotmail.com', ' flaviopcfake@gmail.com'],
            subject: subject,
            html: htmlBody

        }).then(async info => {
            // Atualizar o campo `informacoes` no banco de dados
            await knex('clientes2')
                .where({ id })  // Usando `id` como chave para identificar o registro
                .update({
                    informacoes: knex.raw('array_append(informacoes, ?)', [selectedInform])
                });
            res.send(info);
            console.log("E-mail enviado:", info);
        }).catch(error => {
            res.status(500).send(error);
            console.error("Erro ao enviar o e-mail:", error);
        });

    } catch (error) {
        res.status(500).send(error);
        console.error("Erro ao enviar o e-mail:", error);
    }


}


module.exports = {
    listarClientesEmail,
    buscarClientePdf,
    emailNovo
};
