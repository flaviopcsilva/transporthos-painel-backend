const joi = require('joi')

// Esquema de validação para os campos plcavalo e plcarreta
const schemaPlacas = joi.object({

    dataAbreviada: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),
    horaAbreviada: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    cliente: joi.string().max(50).required().messages({
        'any.required': 'O campo Cliente é obrigatório',
        'string.empty': 'O campo Cliente é obrigatório'
    }),

    quantidade: joi.number().max(50).positive().messages({
        'number.positive': 'Tem que ser um valor maior que zero.'
    }),

    di: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    dta: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    tipo_de_carga: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    processo: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    motorista: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    origem: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    destino: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    ajudantes: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    conferente: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    status: joi.string().max(50).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),

    pl_cavalo: joi.string().max(7).messages({
        'string.max': 'O Campo Placa Cavalo tem que ter no máximo 7 caracteres'
    }),
    pl_carreta: joi.string().max(7).messages({
        'string.max': 'O Campo Placa Carreta tem que ter no máximo 7 caracteres'
    })
});

module.exports = {
    schemaPlacas
}