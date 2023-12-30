import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const contactform = await sql`SELECT * FROM contactform;`;
    return response.status(200).json( contactform.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}