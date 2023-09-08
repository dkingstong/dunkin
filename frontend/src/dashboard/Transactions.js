import * as React from 'react';
import axios from 'axios';

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Transaction from './Transaction';
import Title from './Title';

import { Button } from '@mui/material';

export default function Orders(props) {
  const limit = 10;
  let offset = 0
  const { transactions, setTransactions } = props

  async function getNextBatch(event, offset, fileId) {
    event.preventDefault();
    offset += transactions.length
    let res
    try{
      [, res] = await Promise.all([
        axios.patch('http://localhost:4000/transactions', {
        transactions
      }),
        axios.get(`http://localhost:4000/transactions/${fileId}`, {
        params: {
          offset,
          limit
        }})
      ])
    } catch(err) {
      console.error(err)
    }
    const nextBatch = res.data
    if(nextBatch.length > 0) {
      setTransactions(nextBatch)
    }
  }

  async function saveTransactions(event, transactions) {
    event.preventDefault();
    try {
      await axios.patch('http://localhost:4000/transactions', {
        transactions
      })
      const res = await axios.post('http://localhost:4000/transactions/send', {
        fileId: transactions[0].fileId
      })
      setTransactions([])
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      <Title>Review Transactions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Payor</TableCell>
            <TableCell>Payee</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="right">Accepted</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, index) => (
            <Transaction key={transaction._id} transactions={transactions} setTransactions={setTransactions} index={index}/>
          ))}
        </TableBody>
      </Table>
      {transactions.length > 0 && (
        <React.Fragment> 
          <Link color="primary" href="#" onClick={(event) => getNextBatch(event, offset, transactions[0].fileId)} sx={{ mt: 3 }}>
          See more transactions
        </Link>
        < Button
            align="right"
            component="label"
            variant="outlined"
            sx={{ marginRight: "1rem" }}
            onClick={(event) => {saveTransactions(event, transactions)}}
          >
            Send
          </Button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
