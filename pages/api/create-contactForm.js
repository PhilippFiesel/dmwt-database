import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const result =
      await sql`CREATE TABLE IF NOT EXISTS contactform (email varchar(255), name varchar(255), firstname varchar(255), message varchar(255))`;
    return response.status(200).json({ result });
  } catch (error) {
    return response.status(500).json({ error });
  }
}