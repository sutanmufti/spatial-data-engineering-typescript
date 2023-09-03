/**
 * Written by sutan.co.uk
 * DISCLAIMER: parts of this code were written by ChatGPT 
 * 
 */

import fetch from "cross-fetch";
import pg from 'pg'
import { Feature, GeoData } from "./types";


/**
 * 
 * gets the geojson data, don't forget to add validation function.
 * 
 * @returns 
 */
export async function ExtractData() {
    const res = await fetch('https://skgrange.github.io/www/data/london_low_emission_zones.json')
    const data = <GeoData> await res.json()
    // add validation function to handle error here.
    return data
}

function getISOstring() {
    const now = new Date();    
    return now.toISOString()
  }

  /**
   * 
   * Create the Record in Postgis
   * 
   * @param geojsonFeatures 
   * @param pool 
   */
export async function transformAndLoad(geojsonFeatures: Feature[], pool: pg.Pool) {
    const client = await pool.connect();

  
    try {
      await client.query('BEGIN'); // Start a new transaction
  
      for (const geojsonPolygon of geojsonFeatures) {
        const geometryType = geojsonPolygon.geometry.type;
        const coordinates = geojsonPolygon.geometry.coordinates;
  
        const insertQuery = `
          INSERT INTO public.data (geometry, name, type,id)
          VALUES (ST_setsrid(ST_GeomFromGeoJSON($1),4326), $2, $3,$4)
        `;
  
        const values = [
          JSON.stringify({ type: geometryType, coordinates }),
          geojsonPolygon.properties.name,    
          geojsonPolygon.properties.type,    
          getISOstring()
        ];
  
        await client.query(insertQuery, values); // Insert the GeoJSON data
      }
  
      await client.query('COMMIT'); // Commit the transaction if successful
        // await client.query('ROLLBACK');
        console.log('Bulk insert of POLYGON features successful');
    } catch (error) {
      await client.query('ROLLBACK'); // Roll back the transaction on error
      console.error('Bulk insert failed:', error);
    } finally {
      client.release(); // Release the database connection\
      pool.end()
    }
  }
  