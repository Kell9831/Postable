import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: process.env["NAME_DB"],
  user: process.env["USER_DB"],
  password: process.env["PASS_DB"],
});

export const query = (text: string, params?: (string | number | undefined )[]) => {
  return pool.query(text, params);
};

