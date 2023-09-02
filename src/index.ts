import { Pool } from "pg";
import { CreateRecord, queryData } from "./lib/functions"
import * as dotenv from 'dotenv';
dotenv.config();

async function main(){
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT), // Adjust the port as needed
      });
    const data = await queryData()
    await CreateRecord(data.features,pool)

}

main()