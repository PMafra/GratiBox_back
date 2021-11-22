/* eslint-disable no-useless-escape */
import Joi from 'joi';

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringWithOnlyNumbers = /^[0-9]+$/;

const signUpSchema = Joi.object()
  .length(4)
  .keys({
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().pattern(passwordRegex).required(),
    cpf: Joi.string().pattern(stringWithOnlyNumbers).length(11),
  });

const signInSchema = Joi.object()
  .length(2)
  .keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().pattern(passwordRegex).required(),
  });

const planSchema = Joi.object()
  .length(2)
  .keys({
    plan: Joi.object().length(3).keys({
      planType: Joi.string().required(),
      planDay: Joi.string().required(),
      products: Joi.array(),
    }),
    address: Joi.object().length(5).keys({
      fullName: Joi.string().required(),
      cep: Joi.string().length(8).required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
    }),
  });

export { signUpSchema, signInSchema, planSchema };
