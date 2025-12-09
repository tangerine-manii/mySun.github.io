// netlify/functions/save-wishlist.js
import { neon } from "@netlify/neon";

export async function handler(event, context) {
  try {
    const sql = neon(); // 자동으로 NETLIFY_DATABASE_URL 사용

    const body = JSON.parse(event.body);
    const { name, link, image } = body;

    // DB에 INSERT
    await sql`
      INSERT INTO wishlist (name, link, image_url)
      VALUES (${name}, ${link}, ${image});
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved!" })
    };

  } catch (err) {
    console.error("DB ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database Error", detail: err.message })
    };
  }
}
