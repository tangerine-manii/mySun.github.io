// netlify/functions/save-wishlist.js

const { Client } = require("pg");
const multiparty = require("multiparty");
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // parse form-data
    const form = new multiparty.Form();

    const data = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const name = data.fields.name?.[0];
    const url = data.fields.url?.[0];
    const imageFile = data.files.image?.[0];

    if (!name || !url || !imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // 이미지 저장
    const uploadDir = path.join("/tmp", imageFile.originalFilename);
    fs.copyFileSync(imageFile.path, uploadDir);

    // DB 연결
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    const query = `
      INSERT INTO wishlist (name, url, image_path)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await client.query(query, [
      name,
      url,
      imageFile.originalFilename,
    ]);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        saved: result.rows[0],
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message }),
    };
  }
};
