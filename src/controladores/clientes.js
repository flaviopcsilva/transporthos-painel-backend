const knex = require('../database/conexao')

const fs = require('fs');
const PDFDocument = require('pdfkit');


const listarClientes = async (req, res) => {
    try {
        const clientes = await knex('clientes2')
            .whereNot(knex.raw('LOWER(status) = ?', 'concluído'))
            .orderBy('data')
            .orderBy('hora')

        // Mapeia os resultados para formatar a data abreviada
        const clientesFormatados = clientes.map(cliente => {
            const data = new Date(cliente.data);
            const hora = new Date(`1970-01-01T${cliente.hora}`);

            // Obtém a hora e os minutos do objeto Date
            const horas = hora.getHours();
            const minutos = hora.getMinutes();

            const dataAbreviada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
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
                conferentes: cliente.conferente,
                status: cliente.status

            };
        });

        return res.json(clientesFormatados);
    } catch (error) {

        return res.status(500).json({ Mensagem: `Erro interno do servidor em listar clientes ${error}` })
    }
}

const listagemDeClientesCompleta = async (req, res) => {
    try {
        const clientes = await knex('clientes2')
            .orderBy('data')
            .orderBy('hora')

        // Mapeia os resultados para formatar a data abreviada
        const clientesFormatados = clientes.map(cliente => {
            const data = new Date(cliente.data);
            const hora = new Date(`1970-01-01T${cliente.hora}`);

            // Obtém a hora e os minutos do objeto Date
            const horas = hora.getHours();
            const minutos = hora.getMinutes();

            const dataAbreviada = `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
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
                conferentes: cliente.conferente,
                status: cliente.status

            };
        });

        return res.json(clientesFormatados);
    } catch (error) {

        return res.status(500).json({ Mensagem: `Erro interno do servidor em listar clientes ${error}` })
    }
}


const cadastrarClientes = async (req, res) => {
    try {
        const { dataAbreviada, horaAbreviada, cliente, quantidade, di, dta, tipo_de_carga, processo, pl_cavalo, pl_carreta, motorista, origem, destino, ajudantes, conferente, status } = req.body; // Obtenha os dados do corpo da requisição

        // Verifica se todos os campos necessários foram fornecidos na requisição
        if (!cliente || !dataAbreviada || !horaAbreviada) {
            return res.status(400).json({ Mensagem: 'Nome, dataAbreviada e horaAbreviada são campos obrigatórios' });
        }



        // Função para formatar a data no formato "AAAA-MM-DD"
        const formatarData = (dataAbreviada) => {
            const [dia, mes, ano] = dataAbreviada.split('/');
            return `${ano}-${mes}-${dia}`;
        };

        // Função para formatar a hora no formato "HH:MM:SS"
        const formatarHora = (horaAbreviada) => {
            return `${horaAbreviada}:00`;
        };

        const dataFormatada = formatarData(dataAbreviada);
        const horaFormatada = formatarHora(horaAbreviada);

        // Insere o novo cliente na tabela "clientes2" com os formatos corretos
        await knex('clientes2').insert({
            data: dataFormatada, // Insere a data formatada como Date
            hora: horaFormatada, // Insere a hora formatada como Time
            cliente,
            quantidade,
            di,
            dta,
            tipo_de_carga,
            processo,
            pl_cavalo,
            pl_carreta,
            motorista,
            origem,
            destino,
            ajudantes,
            conferente,
            status
        });

        const novoCliente = await knex('clientes2').where('id', '=', knex.raw('lastval()')).first();

        return res.status(201).json({ Mensagem: 'Cliente cadastrado com sucesso', novoCliente });
    } catch (error) {

        return res.status(500).json({ Mensagem: `Erro interno do servidor em cadastro de clientes ${error}` });
    }
}




const buscarCliente = async (req, res) => {
    try {
        const { busca } = req.query; // Obtém o nome do cliente do corpo da requisição

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
                status: cliente.status
            };
        });


        return res.json(clientesFormatados);
    } catch (error) {

        return res.status(500).json({ Mensagem: `Erro interno do servidor em buscar clientes ${error}` });
    }
}

const excluirCliente = async (req, res) => {
    try {
        const { id } = req.params; // Obtenha o ID do cliente a ser excluído

        // Consulte o banco de dados para verificar se o cliente com o ID fornecido existe
        const clienteExistente = await knex('clientes2')
            .where({ id: id })
            .first();

        if (!clienteExistente) {
            return res.status(404).json({ Mensagem: 'Cliente não encontrado' });
        }

        // O cliente existe, agora podemos prosseguir com a exclusão
        const resultadoExclusao = await knex('clientes2')
            .where({ id: id })
            .del();

        // Verifique se a exclusão foi bem-sucedida (resultadoExclusao > 0)
        if (resultadoExclusao > 0) {
            return res.status(200).json({ Mensagem: 'Cliente excluído com sucesso' });
        } else {
            return res.status(500).json({ Mensagem: 'Erro ao excluir o cliente' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` });
    }
}

const editarCliente = async (req, res) => {
    try {
        const { id } = req.params; // Obtenha o ID do cliente a ser editado
        const { dataAbreviada, horaAbreviada, cliente, quantidade, di, dta, tipo_de_carga, processo, pl_cavalo, pl_carreta, motorista, origem, destino, ajudantes, conferente, status } = req.body; // Obtenha os dados do corpo da requisição



        // Função para formatar a data no formato "AAAA-MM-DD"
        const formatarData = (dataAbreviada) => {
            const [dia, mes, ano] = dataAbreviada.split('/');
            return `${ano}-${mes}-${dia}`;
        };

        // Função para formatar a hora no formato "HH:MM:SS"
        const formatarHora = (horaAbreviada) => {
            return `${horaAbreviada}:00`;
        };

        const dataFormatada = formatarData(dataAbreviada);
        const horaFormatada = formatarHora(horaAbreviada);

        // Consulte o banco de dados para verificar se o cliente com o ID fornecido existe
        const clienteExistente = await knex('clientes2')
            .where({ id: id })
            .first();

        if (!clienteExistente) {
            return res.status(404).json({ Mensagem: 'Cliente não encontrado' });
        }

        const novosDadosCliente = {
            data: dataFormatada, // Insere a data formatada como Date
            hora: horaFormatada, // Insere a hora formatada como Time
            cliente,
            quantidade,
            di,
            dta,
            tipo_de_carga,
            processo,
            pl_cavalo,
            pl_carreta,
            motorista,
            origem,
            destino,
            ajudantes,
            conferente,
            status
        }

        // Execute uma consulta SQL para atualizar o cliente com o ID fornecido com os novos dados
        const resultadoAtualizacao = await knex('clientes2')
            .where({ id: id })
            .update(novosDadosCliente);

        // Verifique se a atualização foi bem-sucedida (resultadoAtualizacao > 0)
        if (resultadoAtualizacao > 0) {
            return res.status(200).json({ Mensagem: 'Cliente atualizado com sucesso' });

            if (status === Concluído) {

            }


        } else {
            return res.status(404).json({ Mensagem: 'Cliente não encontrado' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` });
    }
}

module.exports = {
    listarClientes,
    cadastrarClientes,
    buscarCliente,
    excluirCliente,
    editarCliente,
    listagemDeClientesCompleta
}