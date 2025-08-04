import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PieChart } from '@mui/x-charts/PieChart';
import {
  Grid,
  Stack,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Typography,
  Box,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';

function ExpensePage() {

  const location = useLocation();
  const user_id = location.state.userId ;
  const username = location.state.username ;

  const [expenses, setExpenses] = useState([]);  
  const [expense_id, setexpense_id] = useState('');
  const [amount, setamount] = useState('');
  const [comment, setcomment] = useState('');
  const [category, setcategory] = useState('');
  const [msg, setmsg] = useState('');
  const categoryTotals = expenses.reduce((acc, exp) => { 
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
  
  const chartData = Object.entries(categoryTotals).map(([label, value], idx) => ({
        id: idx, value, label,
    }));

  useEffect(() => {
  view_expense(); // fetch data when component loads
}, []);

  function add_expense() {
    fetch('http://localhost:5000/add_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, comment, category, user_id })
    }).then(response=>response.json()).then(data=>{
      if (data.message){
          view_expense()
      }
      setmsg(data.message)
       // Clear the message after 3 seconds
      setTimeout(() => {
        setmsg('');
      }, 3000);
    })
  }

  function delete_expense() {
    fetch('http://localhost:5000/delete_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense_id, user_id })
    })
      .then(response => response.text())
      .then(data => {
            setmsg(data)
            view_expense();

             // Clear the message after 3 seconds
            setTimeout(() => {
              setmsg('');
            }, 3000);
    }); 
  }

  function update_expense() {
    fetch('http://localhost:5000/update_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense_id, user_id, category,amount, comment })
    }).then(response=>response.text()).then(data=>{
          setmsg(data)
          view_expense()
           // Clear the message after 3 seconds
          setTimeout(() => {
            setmsg('');
          }, 3000);
    });
  }

  function view_expense() {
    fetch('http://localhost:5000/show_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    }).then(response => response.json()).then(data => {
         setExpenses(data.my_response || []);
         console.log("View data")
    });
  }

  return (
    
      <Box sx={{ px: 4, py: 5 }}>
      {/* Centered Title and Welcome */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Expense Page</Typography>
        <Typography variant="h6">Welcome {user_id}, {username}</Typography>
      </Box>

      {/* Pie Chart and View Section */}
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6}>
          <PieChart
            series={[{ data: chartData }]}
            width={400}
            height={300}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Button variant="contained" color="primary" onClick={view_expense}>
              View Expense
            </Button>

            {expenses.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Expense ID</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((exp) => (
                      <TableRow key={exp.expense_id}>
                        <TableCell>{exp.expense_id}</TableCell>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>{exp.amount}</TableCell>
                        <TableCell>{exp.Comments}</TableCell>
                        <TableCell>{new Date(exp.created_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(exp.updated_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Input Section */}
      
    <Box sx={{ mt: 6 }}>
    <Grid container spacing={3}>
        {/* Form Fields: Amount, Comment, Expense ID - in one row */}
        <Grid item xs={12}>
        <Grid container spacing={2}>
            <Grid item xs={4}>
            <TextField
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setamount(e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={4}>
            <TextField
                label="Comment"
                value={comment}
                onChange={(e) => setcomment(e.target.value)}
                fullWidth
            />
            </Grid>
            <Grid item xs={4}>
            <TextField
                label="Expense ID (for update/delete)"
                value={expense_id}
                onChange={(e) => setexpense_id(e.target.value)}
                fullWidth
            />
            
            </Grid>
        </Grid>
        
        </Grid>
        {msg && (
            <Grid item xs={12}>
                <Typography color="success.main">{msg}</Typography>
            </Grid>
        )}

  </Grid>

      <Box>
        {/* Buttons */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
      
      <Grid item>
        <Button variant="contained" color="primary" onClick={add_expense}>
          Add Expense
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="error" onClick={delete_expense}>
          Delete Expense
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary" onClick={update_expense}>
          Update Expense
        </Button>
      </Grid>
    </Grid>

        </Box>

</Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', my: 2 }}>
      {/* Left side: Category section */}
      <Box sx={{ width: '55%' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Category</FormLabel>
          <RadioGroup
            row
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <FormControlLabel value="Electronics" control={<Radio />} label="Electronics" />
            <FormControlLabel value="Fashion and Clothing" control={<Radio />} label="Fashion and Clothing" />
            <FormControlLabel value="Food" control={<Radio />} label="Food" />
          </RadioGroup>
          <RadioGroup
            row
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <FormControlLabel value="Education" control={<Radio />} label="Education" />
            <FormControlLabel value="Others" control={<Radio />} label="Others" />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Right side: Instruction block */}
      <Box
        sx={{
          width: '40%',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 1,
          p: 2,
          fontSize: '2rem'
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Instructions:
        </Typography>
        <Typography variant="body2">1. Add expense: Fill amount, (optional) comment, and select category.</Typography>
        <Typography variant="body2">2. Delete expense: Enter valid Expense ID (from table).</Typography>
        <Typography variant="body2">3. Update expense: Enter Expense ID + updated amount, category, comment.</Typography>
      </Box>
    </Box>


    </Box>
  );
}

export default ExpensePage;
