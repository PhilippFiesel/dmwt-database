import { sql } from '@vercel/postgres';

export default async function handler(request, response) {
    try {
        // SELECT *
        if (response.method === 'GET') {
            const contactform = await sql`SELECT * FROM contactform`;
            return response.status(200).json(contactform.rows);
        } 
        // INSERT INTO
        if (request.method === 'POST') {
            const { email, name, firstname, message } = JSON.parse(request.body);
            await sql`INSERT INTO contactform (email, name, firstname, message) VALUES (${email}, ${name}, ${firstname}, ${message});`;
            return response.status(200).json( contactform.rows);
        }
    } catch (error) {
        return response.status(500).json({ error });
    }
}