import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';

export default function Transaction(props) {
  const { transactions, setTransactions, index } = props

  const updateTransactionStatus = (event, transaction) => {
    const newTransaction = {
      ...transaction,
      accepted: !transaction.accepted
    }
    const newTransactions = transactions.map(t => {
      if(t._id === transaction._id) {
        return newTransaction
      }else {
        return t
      }
    })
    event.preventDefault();
    setTransactions(newTransactions)
  }

  return (
    <React.Fragment>
      <TableRow key={transactions[index]._id}>
      <TableCell>{transactions[index]._id}</TableCell>
      <TableCell>{transactions[index].payorEIN}</TableCell>
      <TableCell>{transactions[index].payeeId}</TableCell>
      <TableCell>{transactions[index].employeeId}</TableCell>
      <TableCell>{transactions[index].accountNumber}</TableCell>
      <TableCell>{transactions[index].branchId}</TableCell>
      <TableCell align="center">{`$${transactions[index].amount / 100}`}</TableCell>
      <TableCell align="center">{transactions[index].accepted.toString() || transactions[index].accepted.toString()}</TableCell>
      <TableCell align="center">
        <Button
          component="label"
          variant="outlined"
          sx={{ marginRight: "1rem" }}
          onClick={(event) => {updateTransactionStatus(event, transactions[index])}}
        >
          {!transactions[index].accepted ? 'Accept': 'Decline'}
        </Button>
      </TableCell>
    </TableRow>
    </React.Fragment>
  );
}
