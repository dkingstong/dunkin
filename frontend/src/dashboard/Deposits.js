import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Title from './Title';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios'

function preventDefault(event) {
  event.preventDefault();
}

const [accountRes, branchesRes] = await Promise.all([
  axios.get('http://127.0.0.1:4000/accounts/source'),
  axios.get('http://127.0.0.1:4000/transactions/branches/list')
])
const { distinctAccounts } = accountRes.data
const accountsMap = {}
const accountNames = distinctAccounts.map(account => {
const name = account.routingNumber + ' ' + account.accountNumber
accountsMap[name] = account._id
return name
})

const branches = branchesRes.data

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function Deposits(props) {

  // we are going to have filters to filter by branch etc.
  // we need to call the backend to populate all the different branches and accounts
  // the onChange function will need to query the db to get the aggregated r
  const { title, sourceType } = props
  const theme = useTheme();
  const [source, setSource] = React.useState('');
  const [amount, setAmount] = React.useState('$0');

  const names = sourceType === 'Account' ? accountNames : branches

  const handleAccountChange = async(event) => {
    const {
      target: { value },
    } = event;
    setSource(value);
    console.log('******** value', value)
    const res = await axios.get(`http://127.0.0.1:4000/transactions/metrics/account/${accountsMap[value]}`)
    const amount = res.data
    setAmount(`$${amount}`)
  };

  const handleBranchChange = async(event) => {
    const {
      target: { value },
    } = event;
    setSource(value);
    const res = await axios.get(`http://127.0.0.1:4000/transactions/metrics/branch/${value}`)
    const amount = res.data
    setAmount(`$${amount}`)
  };

  return (
    <React.Fragment>
      <Title>{title}</Title>
      <Typography component="p" variant="h4">
        {amount}
      </Typography>
      <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{sourceType}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={source}
          label={sourceType}
          onChange={ sourceType === 'Account' ? handleAccountChange : handleBranchChange}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, source, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
    </React.Fragment>
  );
}
