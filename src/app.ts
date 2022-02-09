import express from 'express';
import { CalculatePortfolio } from "./calculate-portfolio";
import { Portfolio } from './types/models';
import { PORT } from './utils/constants';

const app = express();

app.get('/', async (req, res) => {
  const result: Portfolio[] = await CalculatePortfolio();
  console.log(result);
  res.send(result);
});

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
