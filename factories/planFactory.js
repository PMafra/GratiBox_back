import connection from '../src/database/database.js';

const createUserPlan = async (userId) => {
  await connection.query(`
      INSERT INTO "users_plans"
        (user_id, plan_id, signature_date) 
      VALUES 
        ($1, $2, NOW());
    `, [userId, 1]);
};

const addUserProduct = async (userPlanId) => {
  await connection.query(`
    INSERT INTO "users_plans_products"
      (user_plan_id, product_id) 
    VALUES 
      ($1, $2);
  `, [userPlanId, 1]);
};

export { createUserPlan, addUserProduct };
