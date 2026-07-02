import express from 'express';

const VALID_SORT_FIELDS = ['unit_price', 'product_name', 'rating'];

export default function productsRouter(db) {
  const router = express.Router();

  // GET /sort?field=
  router.get('/sort', (req, res) => {
    const { field } = req.query;
    if (!field || !VALID_SORT_FIELDS.includes(field)) {
      return res.status(400).json({
        message: 'Invalid request. Please provide a valid field for sorting.',
      });
    }
    const products = db.get('products').value();
    const sorted = [...products].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    return res.json(sorted);
  });

  // GET /unitprice?min=&max=
  router.get('/unitprice', (req, res) => {
    const min = Number(req.query.min);
    const max = Number(req.query.max);
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return res.status(400).json({
        message:
          'Invalid request. Please provide valid minimum and maximum unit prices.',
      });
    }
    const results = db
      .get('products')
      .filter((p) => p.unit_price >= min && p.unit_price <= max)
      .value();
    return res.json(results);
  });

  // GET /brand/:brand
  router.get('/brand/:brand', (req, res) => {
    const { brand } = req.params;
    const results = db
      .get('products')
      .filter((p) => String(p.brand).toLowerCase() === brand.toLowerCase())
      .value();
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'Products with the specified brand not found.' });
    }
    return res.json(results);
  });

  // GET /colour/:colour
  router.get('/colour/:colour', (req, res) => {
    const { colour } = req.params;
    const results = db
      .get('products')
      .filter((p) => String(p.colour).toLowerCase() === colour.toLowerCase())
      .value();
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'Products with the specified color not found.' });
    }
    return res.json(results);
  });

  // PUT / (exact /api/v1/products)
  router.put('/', (req, res) => {
    const { id, ...fields } = req.body || {};
    if (id === undefined || id === null || Object.keys(fields).length === 0) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid product data for updating.',
      });
    }
    const existing = db.get('products').find({ id }).value();
    if (!existing) {
      return res.status(400).json({
        message: 'Invalid request. Please provide valid product data for updating.',
      });
    }
    db.get('products').find({ id }).assign(fields).write();
    return res.json('Record Updated Successfully');
  });

  // DELETE /:id
  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const existing = db.get('products').find({ id }).value();
    if (!existing) {
      return res.status(404).json({
        message: 'Product with the specified ID not found for deletion.',
      });
    }
    db.get('products').remove({ id }).write();
    return res.json('Record deleted Successfully');
  });

  // GET /:productname  -- catch-all substring match, MUST be registered last.
  router.get('/:productname', (req, res) => {
    const { productname } = req.params;
    const query = decodeURIComponent(productname).toLowerCase();
    const results = db
      .get('products')
      .filter((p) => String(p.product_name).toLowerCase().includes(query))
      .value();
    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: 'Product(s) with the specified name not found.' });
    }
    return res.json(results);
  });

  return router;
}
