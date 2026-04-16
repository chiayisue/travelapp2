const { neon } = require('@neondatabase/serverless');

module.exports = async (req, res) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT content FROM trip_data ORDER BY id DESC LIMIT 1`;
      return res.status(200).json(result[0] ? result[0].content : null);
    } 
    if (req.method === 'POST') {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      await sql`INSERT INTO trip_data (content) VALUES (${JSON.stringify(payload)})`;
      return res.status(200).json({ message: "OK" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
