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

export { signUpSchema, signInSchema };
