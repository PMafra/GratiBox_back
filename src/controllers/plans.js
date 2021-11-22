/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import connection from '../database/database.js';
import { planSchema } from '../validations/bodyValidations.js';

async function getPlan(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

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

    const userId = obtainUserId.rows[0].id;

    const obtainUserPlan = await connection.query(`
        SELECT "plans".day, "plans_types".type, "users_plans".id, "users_plans".signature_date FROM "plans_types"
        JOIN "plans"
            ON "plans".plan_type_id = "plans_types".id
        JOIN "users_plans"
            ON "users_plans".plan_id = "plans".id
        WHERE "users_plans".user_id = $1;
    `, [userId]);

    if (obtainUserPlan.rowCount === 0) {
      return res.sendStatus(204);
    }

    const {
      day: planDay, type: planType, id, signature_date: signatureDate,
    } = obtainUserPlan.rows[0];

    const obtainUserProducts = await connection.query(`
        SELECT "products".* FROM "products"
        JOIN "users_plans_products"
          ON "users_plans_products".product_id = "products".id
        JOIN "users_plans"
          ON "users_plans".id = "users_plans_products".user_plan_id
        WHERE "users_plans".user_id = $1
    `, [userId]);

    const userProducts = obtainUserProducts.rows;

    return res.send({
      id, planDay, planType, signatureDate, userProducts,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

async function addPlanSubscription(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  const isCorrectBody = planSchema.validate(req.body);
  if (isCorrectBody.error) {
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const {
    plan,
    address,
  } = req.body;

  try {
    // OBTAINING USER ID

    const obtainUserId = await connection.query(`
        SELECT "users".id from "users"
        JOIN "sessions"
            ON "sessions".user_id = "users".id
        WHERE "sessions".token = $1;
    `, [token]);

    if (obtainUserId.rowCount === 0) {
      return res.status(403).send('Your session token has expired or you haven`t logged in yet!');
    }

    const userId = obtainUserId.rows[0].id;

    // USER PLAN

    const obtainPlanId = await connection.query(`
      SELECT "plans".id from "plans"
      JOIN "plans_types"
          ON "plans_types".id = "plans".plan_type_id
      WHERE "plans".day ILIKE $1
        AND "plans_types".type ILIKE $2;
    `, [plan.planDay, plan.planType]);

    if (obtainPlanId.rowCount === 0) {
      return res.sendStatus(404);
    }

    const planId = obtainPlanId.rows[0].id;

    await connection.query(`
      INSERT INTO "users_plans"
        (user_id, plan_id, signature_date) 
      VALUES 
        ($1, $2, NOW());
    `, [userId, planId]);

    // INSERTING USER PLAN PRODUCTS

    const obtainUserPlanId = await connection.query(`
      SELECT * FROM "users_plans"
      WHERE "user_id" = $1
        AND "plan_id" = $2;
    `, [userId, planId]);

    if (obtainUserPlanId.rowCount === 0) {
      return res.sendStatus(404);
    }

    const userPlanId = obtainUserPlanId.rows[0].id;
    for (let i = 0; i < plan.products.length; i++) {
      const obtainProductId = await connection.query(`
        SELECT * FROM "products"
        WHERE name ILIKE $1;
      `, [plan.products[i]]);

      const productId = obtainProductId.rows[0].id;

      await connection.query(`
        INSERT INTO "users_plans_products"
          (user_plan_id, product_id) 
        VALUES 
          ($1, $2);
      `, [userPlanId, productId]);
    }

    // INSERTING USER ADDRESS

    await connection.query(`
      INSERT INTO "addresses"
        (user_id, full_name, cep, address, city, state) 
      VALUES 
        ($1, $2, $3, $4, $5, $6);
    `, [userId, address.fullName, address.cep, address.address, address.city, address.state]);

    return res.sendStatus(201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

export { getPlan, addPlanSubscription };
