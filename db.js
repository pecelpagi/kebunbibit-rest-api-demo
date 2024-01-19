import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

let database = process.env.DB_NAME_DEVELOPMENT;

if (String(process.env.NODE_ENV).toUpperCase() === 'TEST') database = process.env.DB_NAME_TEST;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
  database,
});

export const getConnection = async () => await connection;