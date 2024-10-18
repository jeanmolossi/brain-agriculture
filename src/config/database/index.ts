import knex from "knex";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL");
}

const pg = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ["public"],
});

export default pg;
