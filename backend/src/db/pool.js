import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();


export const pool = new Pool({
    host: process.env.PG_SERVER,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: String(process.env.PG_PASSWORD),
    database: process.env.PG_DATABASE,
});