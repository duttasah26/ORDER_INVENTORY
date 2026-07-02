import express from 'express';

export default function storesRouter(db) {
  const router = express.Router();

  // GET /
  router.get('/', (req, res) => {
    const stores = db.get('stores').value();
    return res.json(stores);
  });

  // GET /:id
  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const store = db.get('stores').find({ id }).value();
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    return res.json(store);
  });

  return router;
}
