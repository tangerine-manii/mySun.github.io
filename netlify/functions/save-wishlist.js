// netlify/functions/save-wishlist.js

import { neon } from '@neondatabase/serverless';   // Neon 공식 패키지

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), {
      status: 405
    });
  }

  try {
    const body = await req.json();

    const { productName, productLink, imageUrl } = body;

    if (!productName || !productLink) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400
      });
    }

    // ① NEON DB 연결 (환경 변수에서 URL 사용)
    const sql = neon(process.env.NEON_DATABASE_URL);

    // ② INSERT 쿼리 실행
    await sql`
      INSERT INTO wishlist (product_name, product_link, image_url)
      VALUES (${productName}, ${productLink}, ${imageUrl})
    `;

    return new Response(JSON.stringify({ message: "Wishlist saved!" }), {
      status: 200
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    });
  }
};
