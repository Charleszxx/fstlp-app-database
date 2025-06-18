import { query } from '../lib/db.js';

export default async function handler(req, res) {
  const userId = req.params.id;

  try {
    const result = await query(`SELECT profileImage FROM users WHERE id = $1`, [userId]);

    if (!result.rows.length || !result.rows[0].profileimage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const imageBuffer = result.rows[0].profileimage;

    res.setHeader('Content-Type', 'image/jpeg'); // or 'image/png' if your images are PNGs
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
}
