import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body);

    const sql = neon(); // NETLIFY_DATABASE_URL 사용

    await sql`
      INSERT INTO contact_form (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
