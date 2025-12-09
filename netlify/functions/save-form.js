import { neon } from '@neondatabase/serverless';

export default async () => {
  const sql = neon(process.env.NETLIFY_DATABASE_URL);

  const rows = await sql`SELECT * FROM posts`;

  return {
    statusCode: 200,
    body: JSON.stringify(rows)
  };
};
