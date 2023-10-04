const knex = require('../database/conexao')


const listarClientes = async (req, res) => {
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
                nome: cliente.cliente,
                qtd: cliente.qtd,
                peso: cliente.peso,
                plCavalo: cliente.plcavalo,
                plCarreta: cliente.plcarreta,
                motorista: cliente.motorista,
                origem: cliente.origem,
                destino: cliente.destino,
                ajudantes: cliente.ajudantes,
                conferentes: cliente.conferentes

            };
        });

        return res.json(clientesFormatados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` })
    }
}

const cadastrarClientes = async (req, res) => {
    try {
        const { dataAbreviada, horaAbreviada, nome, qtd, peso, plcavalo, plcarreta, motorista, origem, destino, ajudantes, conferentes } = req.body; // Obtenha os dados do corpo da requisição

        // Verifica se todos os campos necessários foram fornecidos na requisição
        if (!nome || !dataAbreviada || !horaAbreviada) {
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
            cliente: nome,
            qtd,
            plcavalo,
            plcarreta,
            motorista,
            origem,
            destino,
            ajudantes,
            conferentes,
            hora: horaFormatada, // Insere a hora formatada como Time
            peso,
        });

        const novoCliente = await knex('clientes2').where('id', '=', knex.raw('lastval()')).first();

        return res.status(201).json({ Mensagem: 'Cliente cadastrado com sucesso', novoCliente });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` });
    }
}




const buscarCliente = async (req, res) => {
    try {
        const { nomeCliente } = req.body; // Obtém o nome do cliente do corpo da requisição

        // Verifica se o nome do cliente foi fornecido na requisição
        if (!nomeCliente) {
            return res.status(400).json({ Mensagem: 'O nome do cliente é obrigatório no corpo da requisição' });
        }

        // Consulta o banco de dados filtrando pelo nome do cliente (insensível a maiúsculas e minúsculas)
        const clientes = await knex('clientes2')
            .whereRaw('lower(cliente) like ?', [`%${nomeCliente.toLowerCase()}%`])
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
                nome: cliente.cliente,
                qtd: cliente.qtd,
                peso: cliente.peso,
                plCavalo: cliente.plcavalo,
                plCarreta: cliente.plcarreta,
                motorista: cliente.motorista,
                origem: cliente.origem,
                destino: cliente.destino,
                ajudantes: cliente.ajudantes,
                conferentes: cliente.conferentes
            };
        });

        return res.json(clientesFormatados);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ Mensagem: `Erro interno do servidor ${error}` });
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