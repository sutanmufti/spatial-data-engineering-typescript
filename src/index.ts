/**
 * Written by sutan.co.uk
 * 
 * 
 */

import { Pool } from "pg";
import { transformAndLoad, ExtractData } from "./lib/functions"
import * as dotenv from 'dotenv';
dotenv.config();

async function main(){

    // generate the Pool connection
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: Number(process.env.POSTGRES_PORT), // Adjust the port as needed
      });

    
    // this fetches the data
    const data = await ExtractData()
    // this transforms and load the data based on the Pool connection
    await transformAndLoad(data.features,pool)

}

main()