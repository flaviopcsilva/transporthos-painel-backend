const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');

async function enviarPDF(req, res) {
    const { nome, data, hora, status, imagem, email } = req.body;


    try {

        if (!nome) {
            res.status(401).json({ Mensagem: `O nome não pode ficar em branco` })
        }

        // Cria um novo documento PDF
        const doc = new PDFDocument();
        // Aqui você adiciona o conteúdo ao PDF usando os métodos fornecidos pelo PDFKit

        // Adiciona texto ao PDF
        doc.fontSize(18).text('Relatório de Follow Up', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Nome: ${nome}`);
        doc.text(`Data: ${data}`);
        doc.text(`Hora: ${hora}`);
        doc.text(`Status: ${status}`);

        // Se houver uma imagem, baixa ela e a adiciona ao PDF
        if (imagem) {
            const response = await axios.get(imagem, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'base64');
            doc.image(imageBuffer, { fit: [400, 400], align: 'center' });
        }


        // Salva o PDF localmente
        const nomeArquivoPDF = 'relatorio_follow_up.pdf';
        const caminhoArquivoPDF = `./${nomeArquivoPDF}`;
        const stream = fs.createWriteStream(caminhoArquivoPDF);
        doc.pipe(stream);
        doc.end();


        // Configure o transporte do nodemailer para enviar e-mail
        let transporter = nodemailer.createTransport({
            // Configure as opções de transporte de e-mail aqui (por exemplo, SMTP, API de e-mail, etc.)
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            timeout: 60000, // tempo limite de 60 segundos (ou ajuste conforme necessário)
        });

        // Configurações de e-mail
        const mailOptions = {
            from: 'flaviopc2@gmail.com', // Seu endereço de e-mail
            to: email, // O e-mail do destinatário
            subject: 'Follow Up PDF', // Assunto do e-mail
            text: 'Segue anexo arquivo PDF com Followup atualizado.', // Corpo do e-mail em texto plano
            attachments: [
                {
                    filename: nomeArquivoPDF,
                    path: caminhoArquivoPDF
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);

        console.log('E-mail enviado: %s', info.messageId);
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });


    } catch (error) {
        console.log(error);
        res.status(500).json({ Mensagem: 'Erro ao enviar Email!' }, error)
    }
    // Exclui o arquivo PDF após o envio
    fs.unlinkSync(caminhoArquivoPDF);

}

module.exports = enviarPDF;
