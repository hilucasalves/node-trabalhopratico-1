import express from 'express';
import { promises as fs } from 'fs';
const { readFile } = fs;

const router = express.Router();

async function getBrands() {
  const resp = await readFile('car-list.json');
  return JSON.parse(resp);
}

router.get('/maisModelos', async (req, res) => {
  const brands = await getBrands();
  let result = [];
  let max = 0;

  for (const b of brands) {
    if (b.models.length > max) {
      result = [];
      result.push(b.brand);
      max = b.models.length;
    } else if (b.models.length === max) {
      result.push(b.brand);
    }
  }

  if (result.length === 1) {
    res.send(result[0]);
  } else {
    res.send(result);
  }
});

router.get('/menosModelos', async (req, res) => {
  const brands = await getBrands();
  let result = [];
  let min = 999999;

  for (const b of brands) {
    if (b.models.length < min) {
      result = [];
      result.push(b.brand);
      min = b.models.length;
    } else if (b.models.length === min) {
      result.push(b.brand);
    }
  }

  if (result.length === 1) {
    res.send(result[0]);
  } else {
    res.send(result);
  }
});

router.get('/listaMaisModelos/:qtd', async (req, res) => {
  const brands = await getBrands();
  brands.sort((a, b) => {
    if (a.models.length === b.models.length) {
      return a.brand.localeCompare(b.brand);
    }
    return b.models.length - a.models.length;
  });
  res.send(
    brands.slice(0, req.params.qtd).map(b => `${b.brand} - ${b.models.length}`)
  );
});

router.get('/listaMenosModelos/:qtd', async (req, res) => {
  const brands = await getBrands();
  brands.sort((a, b) => {
    if (a.models.length === b.models.length) {
      return a.brand.localeCompare(b.brand);
    }
    return a.models.length - b.models.length;
  });
  res.send(
    brands.slice(0, req.params.qtd).map(b => `${b.brand} - ${b.models.length}`)
  );
});

router.post('/listaModelos', async (req, res, next) => {
  try {
    const brands = await getBrands();
    const brand = brands.find(
      b => b.brand.toUpperCase() === req.body.nomeMarca.toUpperCase()
    );

    if (brand) {
      res.send(brand.models);
    } else {
      res.send([]);
    }
  } catch (err) {
    next(err);
  }
});

router.use(() => {
  res.status(400).send({ error: err.message });
});

export default router;
