/**
 * Written by sutan.co.uk
 * 
 * 
 */

export interface GeoData {
    "type": string,
    "crs": {
      "type": string,
      "properties": {
        "name": string
      }
    },
    "features": 
    Feature[]
}

export interface Feature {
    "type": string,
    "id": number,
    "properties": {
      // id: number
      "name": string,
      "type": string,
      "active": string,
      "data_source": string,
      "notes": string
    },
    geometry: {
        type: string 
        coordinates: number[][][][]
    }
}