const selectUsers = 'SELECT * FROM "users"';
const passwordRules = 'Your password must contain at least 8 characters, 1 upper case letter, 1 lower case letter, 1 number and 1 special character.';
const CPFRules = 'Your cpf must only contain 11 numbers';
const incorrectInputMessage = 'Email or password is invalid!';

export {
  selectUsers, passwordRules, CPFRules, incorrectInputMessage,
};
