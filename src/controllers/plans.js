import connection from '../database/database.js';

async function getPlan(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).send('You are not authorized to see this content. Please try signing in.');

  try {
    const obtainUserId = await connection.query(`
        SELECT "users".id from "users"
        JOIN "sessions"
            ON "sessions".user_id = "users".id
        WHERE "sessions".token = $1;
    `, [token]);

    if (obtainUserId.rowCount === 0) {
      return res.status(403).send('Your session token has expired or you haven`t logged in yet!');
    }

    const userId = obtainUserId.rowCount[0].id;

    const obtainUserPlan = await connection.query(`
        SELECT "plans".day, "plans_types".type FROM "plans_types"
        JOIN "plans"
            ON "plans".plan_type_id = "plans_types".id
        JOIN "users_plans"
            ON "users_plans".plan_id = "plans".id
        WHERE "users_plans".user_id = $1;
    `, [userId]);

    if (obtainUserPlan.rowCount === 0) {
      return res.status(204).send('You haven`t signed up for any plans yet.');
    }

    const { planDay, planType } = obtainUserPlan.rows[0];

    const obtainUserProducts = await connection.query(`
        SELECT "products".* FROM "products"
        JOIN "users_plans_products"
          ON "users_plans_products".product_id = "products".id
        JOIN "users_plans"
          ON "users_plans".id = "users_plans_products".user_plan_id
        WHERE "users_plans".user_id = $1
    `, [userId]);

    const userProducts = obtainUserProducts.rows;

    return res.send({ userProducts, planDay, planType });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

export default getPlan;
