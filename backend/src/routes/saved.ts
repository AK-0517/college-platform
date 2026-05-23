import { Router, Response } from 'express';
import pool from '../db';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT c.* FROM colleges c
       JOIN saved_colleges sc ON c.id = sc.college_id
       WHERE sc.user_id = $1`,
      [req.user!.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { college_id } = req.body;
  if (!college_id) return res.status(400).json({ error: 'college_id required' });
  try {
    await pool.query(
      'INSERT INTO saved_colleges (user_id, college_id) VALUES ($1,$2)',
      [req.user!.id, college_id]
    );
    res.status(201).json({ message: 'Saved successfully' });
  } catch (err: any) {
    if (err.code === '23505')
      return res.status(409).json({ error: 'Already saved' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:collegeId', async (req: AuthRequest, res: Response) => {
  try {
    await pool.query(
      'DELETE FROM saved_colleges WHERE user_id=$1 AND college_id=$2',
      [req.user!.id, req.params.collegeId]
    );
    res.json({ message: 'Removed from saved' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;