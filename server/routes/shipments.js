import express from 'express';

export default function shipmentsRouter(db) {
  const router = express.Router();

  // GET /
  router.get('/', (req, res) => {
    const shipments = db.get('shipments').value();
    return res.json(shipments);
  });

  // GET /:id -- matches on `id` first, falls back to `shipment_id`
  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const shipment =
      db.get('shipments').find({ id }).value() ||
      db.get('shipments').find({ shipment_id: id }).value();
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found.' });
    }
    return res.json(shipment);
  });

  return router;
}
