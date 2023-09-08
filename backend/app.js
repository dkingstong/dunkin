import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import filesRouter from './routes/files.js'
import transactionsRouter from './routes/transactions.js'
import accountsRouter from './routes/accounts.js'


const app = express();
app.use(bodyParser.json())

await mongoose.connect('mongodb://127.0.0.1:27017/method');

const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use('/files', filesRouter)
app.use('/transactions', transactionsRouter)
app.use('/accounts', accountsRouter)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});