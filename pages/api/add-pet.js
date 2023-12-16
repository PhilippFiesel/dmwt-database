import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const {petName, ownerName} = JSON.parse(request.body)
    if (!petName || !ownerName) throw new Error('Pet and owner names required');
    await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
    return response.status(200).json( pets.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}