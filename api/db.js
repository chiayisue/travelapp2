const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
  // 1. 從 Vercel 後台拿鑰匙 (這不會被外人看到)
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    // 拿資料
    const data = await sql`SELECT * FROM expenses ORDER BY id DESC`;
    return res.status(200).json(data);
  } else if (req.method === 'POST') {
    // 存資料
    const { cat, name, amt } = JSON.parse(req.body);
    await sql`INSERT INTO expenses (category, name, amount) VALUES (${cat}, ${name}, ${amt})`;
    return res.status(200).json({ message: "OK" });
  }
}
