import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        if(request.method === 'POST'){
            const {result} = JSON.parse(request.body)
            await sql`INSERT INTO questioneerresult (result) VALUES (${result});`;
            return response.status(200).json( questioneerresult.rows);
        }
        if(request.method === 'GET') {
            const avgResult = await sql`SELECT AVG(result) as average FROM questioneerresult`;
            return response.status(200).json({ average: avgResult.rows[0].average });
        }
    } catch (error) {
        return response.status(500).json({ error });
    }
}