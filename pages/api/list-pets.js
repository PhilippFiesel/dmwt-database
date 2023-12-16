import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const pets = await sql`SELECT * FROM Pets;`;
    return response.status(200).json( pets.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}