import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const {email, name, firstname, message} = JSON.parse(request.body)
 if (!email || !name || !firstname || !message) {
      throw new Error('Email, name, firstname, and message are required');
    }
    await sql`INSERT INTO contactform (email, name, firstname, message) VALUES (${email}, ${name}, ${firstname}, ${message});`;
    return response.status(200).json( contactform.rows);
  } catch (error) {
    return response.status(500).json({ error });
  }
}