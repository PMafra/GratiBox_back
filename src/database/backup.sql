CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "plan_types" (
	"id" serial NOT NULL,
	"type" varchar(255) NOT NULL,
	CONSTRAINT "plan_types_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"plan_type_id" integer NOT NULL,
	"day" varchar(255) NOT NULL,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "Addresses" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"cep" varchar(255) NOT NULL,
	"number" integer NOT NULL,
	"complement" varchar(255),
	CONSTRAINT "Addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "users_plans_products" (
	"user_plan_id" integer NOT NULL,
	"product_id" integer NOT NULL
) WITH (
  OIDS=FALSE
);
CREATE TABLE "users_plans" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	CONSTRAINT "users_plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "plans" ADD CONSTRAINT "plans_fk0" FOREIGN KEY ("plan_type_id") REFERENCES "plan_types"("id");
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_plans_products" ADD CONSTRAINT "users_plans_products_fk0" FOREIGN KEY ("user_plan_id") REFERENCES "users_plans"("id");
ALTER TABLE "users_plans_products" ADD CONSTRAINT "users_plans_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "users_plans" ADD CONSTRAINT "users_plans_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_plans" ADD CONSTRAINT "users_plans_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");