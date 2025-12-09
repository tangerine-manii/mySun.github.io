import { neon } from '@netlify/neondb';

export const handler = async () => {
  const sql = neon();

  const rows = await sql`SELECT * FROM posts LIMIT 10`;

  return {
    statusCode: 200,
    body: JSON.stringify(rows)
  };
};
