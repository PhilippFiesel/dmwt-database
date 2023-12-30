import { sql } from '@vercel/postgres';
/*
export default async function handler(request, response) {
  try {
    const latestPet = await sql`SELECT id FROM Pets ORDER BY created_at DESC LIMIT 1;`;
    const latestPetId = latestPet.rows[0].id;

    await sql`DELETE FROM Pets WHERE id = ${latestPetId}`;

    return response.status(200).json({ success: true });
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}*/