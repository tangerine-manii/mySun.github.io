import { neon } from '@netlify/neon';

export default async (event, context) => {
  const sql = neon(); // automatic NETLIFY_DATABASE_URL

  const [result] = await sql`SELECT now()`;

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
