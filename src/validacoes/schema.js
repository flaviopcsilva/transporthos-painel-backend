const joi = require('joi')

// Esquema de validação para os campos plcavalo e plcarreta
const schemaPlacas = joi.object({

    dataAbreviada: joi.string().required().allow('', null).messages({
        'any.required': 'O campo Data é obrigatório',
        'string.empty': 'O campo Data Não pode está vazio'
    }),
    horaAbreviada: joi.string().required().messages({
        'any.required': 'O campo Hora é obrigatório',
        'string.empty': 'O campo Hora é obrigatório'
    }),

    cliente: joi.string().max(50).required().messages({
        'any.required': 'O campo Cliente é obrigatório',
        'string.empty': 'O campo Cliente é obrigatório'
    }),

    quantidade: joi.number().max(50).positive().required().messages({
        'number.positive': 'Tem que ser um valor maior que zero.',
        'number.max': 'O Campo Quantidade deve ser um número menor ou igual a 50',
        'any.required': 'O campo Quantidade é obrigatório',
        'string.empty': 'O campo Quantidade é obrigatório',
        'number.base': 'O Campo Quantidade deve ser um número'
    }),

    di: joi.string().required().messages({
        'any.required': 'O campo DI é obrigatório',
        'string.empty': 'O campo DI é obrigatório'
    }),

    dta: joi.string().required().messages({
        'any.required': 'O campo DTA é obrigatório',
        'string.empty': 'O campo DTA é obrigatório'
    }),

    tipo_de_carga: joi.string().required().messages({
        'any.required': 'O campo Tipo de Carga é obrigatório',
        'string.empty': 'O campo Tipo de Carga é obrigatório'
    }),

    processo: joi.string().required().messages({
        'any.required': 'O campo Processo é obrigatório',
        'string.empty': 'O campo Processo é obrigatório'
    }),

    pl_cavalo: joi.string().max(7).required().messages({
        'string.max': 'O Campo Cavalo tem que ter no máximo 7 caracteres',
        'any.required': 'O campo Cavalo é obrigatório',
        'string.empty': 'O campo Cavalo é obrigatório'

    }),
    pl_carreta: joi.string().max(7).required().messages({
        'string.max': 'O Campo Carreta tem que ter no máximo 7 caracteres',
        'any.required': 'O campo Carreta é obrigatório',
        'string.empty': 'O campo Carreta é obrigatório'
    }),

    motorista: joi.string().required().messages({
        'any.required': 'O campo Motorista é obrigatório',
        'string.empty': 'O campo Motorista é obrigatório'
    }),

    origem: joi.string().required().messages({
        'any.required': 'O campo Origem é obrigatório',
        'string.empty': 'O campo Origem é obrigatório'
    }),

    destino: joi.string().required().messages({
        'any.required': 'O campo Destino é obrigatório',
        'string.empty': 'O campo Destino é obrigatório'
    }),

    ajudantes: joi.string().required().messages({
        'any.required': 'O campo Ajudantes é obrigatório',
        'string.empty': 'O campo Ajudantes é obrigatório'
    }),

    conferente: joi.string().required().messages({
        'any.required': 'O campo Conferente é obrigatório',
        'string.empty': 'O campo Conferente é obrigatório'
    }),

    status: joi.string().required().messages({
        'any.required': 'O campo Status é obrigatório',
        'string.empty': 'O campo Status é obrigatório'
    }),


});

module.exports = {
    schemaPlacas
}