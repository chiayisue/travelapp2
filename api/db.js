const { neon } = require('@neondatabase/serverless');

export default async function handler(req, res) {
  // 檢查鑰匙是否存在
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "環境變數 DATABASE_URL 消失了！" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT content FROM trip_data ORDER BY id DESC LIMIT 1`;
      return res.status(200).json(result[0] ? result[0].content : null);
    } 
    
    if (req.method === 'POST') {
      // 確保收到的是物件，如果 Vercel 沒幫我們轉好，我們手動轉
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      await sql`INSERT INTO trip_data (content) VALUES (${payload})`;
      return res.status(200).json({ message: "儲存成功" });
    }
  } catch (error) {
    console.error("資料庫錯誤:", error);
    return res.status(500).json({ error: error.message });
  }
}
