import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const {result} = JSON.parse(request.body)
 if (!result) {
      throw new Error('result are required');
    }
    await sql`INSERT INTO questioneerresult (result) VALUES (${result});`;
    return response.status(200).json( questioneerResult.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}