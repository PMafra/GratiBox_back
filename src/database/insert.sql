INSERT INTO products (name) VALUES ('Teas');
INSERT INTO products (name) VALUES ('Incense');
INSERT INTO products (name) VALUES ('Organic products');
INSERT INTO "plans_types" (type) VALUES ('Weekly');
INSERT INTO "plans_types" (type) VALUES ('Monthly');
INSERT INTO plans (plan_type_id, day) VALUES (1, 'Monday');
INSERT INTO plans (plan_type_id, day) VALUES (1, 'Wednesday');
INSERT INTO plans (plan_type_id, day) VALUES (1, 'Friday');
INSERT INTO plans (plan_type_id, day) VALUES (2, '1');
INSERT INTO plans (plan_type_id, day) VALUES (2, '10');
INSERT INTO plans (plan_type_id, day) VALUES (2, '20');

-- INSERT INTO users_plans (user_id, plan_id, signature_date) VALUES (6, 1, NOW());
-- INSERT INTO users_plans_products (user_plan_id, product_id) VALUES (3, 1);
-- INSERT INTO users_plans_products (user_plan_id, product_id) VALUES (3, 2);
-- INSERT INTO users_plans_products (user_plan_id, product_id) VALUES (3, 3);