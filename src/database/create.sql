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
CREATE TABLE "plans_types" (
	"id" serial NOT NULL,
	"type" varchar(255) NOT NULL,
	CONSTRAINT "plans_types_pk" PRIMARY KEY ("id")
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
CREATE TABLE "addresses" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"cep" varchar(8) NOT NULL,
	"address" text NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" varchar(255) NOT NULL,
	CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "users_plans_products" (
	"id" serial NOT NULL,
	"user_plan_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "users_plans_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "users_plans" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"signature_date" DATE NOT NULL DEFAULT NOW(),
	CONSTRAINT "users_plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"token" text NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "plans" ADD CONSTRAINT "plans_fk0" FOREIGN KEY ("plan_type_id") REFERENCES "plans_types"("id");
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_plans_products" ADD CONSTRAINT "users_plans_products_fk0" FOREIGN KEY ("user_plan_id") REFERENCES "users_plans"("id");
ALTER TABLE "users_plans_products" ADD CONSTRAINT "users_plans_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");
ALTER TABLE "users_plans" ADD CONSTRAINT "users_plans_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "users_plans" ADD CONSTRAINT "users_plans_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
