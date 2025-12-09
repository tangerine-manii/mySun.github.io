import { neon } from "@neondatabase/serverless";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Body 파싱
  let body = {};
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { product, link, image } = body; // ★ HTML과 정확히 일치함

  if (!product || !link) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields" }),
    };
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // 테이블이 처음이면 자동 생성 (안전)
    await sql`
      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        product TEXT NOT NULL,
        link TEXT NOT NULL,
        image TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // insert
    await sql`
      INSERT INTO wishlist (product, link, image)
      VALUES (${product}, ${link}, ${image});
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved successfully!" }),
    };
  } catch (err) {
    console.error("DB Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DB error", detail: err.message }),
    };
  }
}
