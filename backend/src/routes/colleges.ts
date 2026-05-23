import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search, location, maxFees, page = '1', limit = '9' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const conditions: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (search) {
    conditions.push(`name ILIKE $${i++}`);
    values.push(`%${search}%`);
  }
  if (location) {
    conditions.push(`location ILIKE $${i++}`);
    values.push(`%${location}%`);
  }
  if (maxFees) {
    conditions.push(`fees <= $${i++}`);
    values.push(Number(maxFees));
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const countResult = await pool.query(`SELECT COUNT(*) FROM colleges ${where}`, values);
  const total = Number(countResult.rows[0].count);

  values.push(Number(limit));
  values.push(offset);
  const result = await pool.query(
    `SELECT * FROM colleges ${where} ORDER BY rating DESC LIMIT $${i++} OFFSET $${i++}`,
    values
  );
  res.json({ colleges: result.rows, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
});

router.get('/compare', async (req: Request, res: Response) => {
  const { ids } = req.query;
  if (!ids) return res.status(400).json({ error: 'No IDs provided' });
  const idArray = (ids as string).split(',').map(Number);
  if (idArray.length < 2) return res.status(400).json({ error: 'Select at least 2 colleges' });
  if (idArray.length > 3) return res.status(400).json({ error: 'Max 3 colleges allowed' });
  try {
    const result = await pool.query(
      `SELECT * FROM colleges WHERE id = ANY($1)`,
      [idArray]
    );
    res.json({ colleges: result.rows });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM colleges WHERE id=$1', [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'College not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;