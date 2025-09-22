import Joi from 'joi'

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.pattern.base': 'Пароль должен содержать хотя бы одну строчную букву, одну заглавную букву и одну цифру',
      'string.min': 'Пароль должен быть не короче 8 символов'
    })
})