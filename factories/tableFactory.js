import connection from '../src/database/database.js';

const del = 'DELETE FROM';

const clearDatabase = async () => {
  await connection.query(`
    ${del} "sessions";
    ${del} "users_plans";
    ${del} "users_plans_products";
    ${del} "addresses";
    ${del} "products";
    ${del} "plans";
    ${del} "plans_types";
    ${del} "users";
  `);
};

export default clearDatabase;
