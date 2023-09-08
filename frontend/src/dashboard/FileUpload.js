import * as React from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Title from './Title';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from '@mui/material';
import Transactions from './Transactions';

const UploadTab = () => {
  const [transactions, setTransactions] = React.useState([]);

  const handleFileUpload = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    try {
      const res = await axios.postForm('http://localhost:4000/files', {
      'file': file
    })
      setTransactions(res.data.transactions)
      return res;
    } catch (err) {
      console.log(err);
    }
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240,
          }}
        >
          <React.Fragment>
            <Title>Upload XML file</Title>
            <Button
            component="label"
            variant="outlined"
            startIcon={<FileUploadIcon />}
            sx={{ marginRight: "1rem" }}
          >
            Upload file
          <input type="file" accept=".xml" hidden onChange={handleFileUpload} />
            </Button>
          </React.Fragment>
        </Paper>
        </Grid>
      </Grid>
      <Toolbar />
      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Transactions transactions={transactions} setTransactions={setTransactions}/>
        </Paper>
      </Grid>
    </Container>
  );
}

export default UploadTab