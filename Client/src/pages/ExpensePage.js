import { useState,useEffect } from "react";
import { data, useLocation } from "react-router-dom";
import { PieChart } from '@mui/x-charts/PieChart';
import DeleteIcon from '@mui/icons-material/Delete';
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
  Box,Checkbox,
  Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,
  Select,MenuItem,InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper
} from '@mui/material';

function ExpensePage() {

  const location = useLocation();
  const user_id = location.state.userId ;
  const username = location.state.username ;

  const [expenses, setExpenses] = useState([]);  
  const [checkbox_arr,set_checkbox_arr] = useState([])
  const [expense_id, setexpense_id] = useState('');
  const [amount, setamount] = useState('');
  const [comment, setcomment] = useState('');
  const [category, setcategory] = useState('');
  const [msg, setmsg] = useState('');
  const [open, setOpen] = useState(false);

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

  function handleClickOpen(exp){
    setOpen(true);
    setexpense_id(exp.expense_id)
    setcomment(exp.Comments)
    setamount(exp.amount)
    setcategory(exp.category)
  };

  const handleClose = () => {
    setOpen(false);
    setcomment('');
    setamount('');
    setcategory(null);
  };


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
      setamount('')
      setcomment('')
      setcategory(null)
       // Clear the message after 3 seconds
      setTimeout(() => {
        setmsg('');
      }, 3000);
    })
  }

  function delete_selected(){

    fetch('http://localhost:5000/delete_selected_expenses',{
      method:'POST',
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify({expenses,expense_id,user_id,checkbox_arr})
    }).then(response=>response.json())
      .then(data=>{
                  setmsg(data.message)
                  view_expense()
                  set_checkbox_arr([])
                  setTimeout(() => {
                                    setmsg('');
                    }, 3000);
    });
}
  function update_expense(event) {
    event.preventDefault();
    fetch('http://localhost:5000/update_expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expense_id, user_id, category,amount, comment })
    }).then(response=>response.json()).then(data=>{
          if(data.success){
              view_expense()
              console.log("This is update Success")
              handleClose()
          }
          setmsg(data.msg)
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
         setExpenses([...data.my_response]);
         //console.log("This is expense array "+JSON.stringify(expenses))
    });
  }

  return (
    
      <Box sx={{ px: 4, py: 5 }}>
      {/* Centered Title and Welcome */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Expense Page</Typography>
        <Typography variant="h6">Welcome {username}, UserID: {user_id}</Typography>
      </Box>

      {/* Pie Chart and View Section */}
      <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
        <Grid item xs={12} md={6}>
          {chartData.length > 0 ? (
          <PieChart
            series={[{ data: chartData }]}
            width={400}
            height={300}
          />
          ):( <Box
                  sx={{
                    width: 400,
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No data. Please Add Expense to Begin.
                  </Typography>
                </Box>
              )}
        </Grid>
      </Grid>
        <Grid item xs={12} mt={4} md={6} ml={10} mr={10} justifyContent="center">
          <Stack spacing={2}>
            <Button variant="contained" color="primary" onClick={view_expense}>
              View Expense
            </Button>

            {expenses.length > 0 && (
              <TableContainer component={Paper}>
                <Table   sx={{
                              "& .MuiTableCell-head": { fontSize: "1.2rem", fontWeight: "bold" },
                              "& .MuiTableCell-body": { fontSize: "1rem" }
                            }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Expense ID</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Updated At</TableCell>
                      <TableCell><Button aria-label="delete" size="small" onClick={delete_selected}>
                                              <DeleteIcon fontSize="medium" />
                                </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((exp) => (
                      <TableRow key={exp.expense_id}>
                        <TableCell>{exp.expense_id}</TableCell>
                        <TableCell>{exp.category}</TableCell>
                        <TableCell>{exp.amount} </TableCell>
                        <TableCell>{exp.Comments}</TableCell>
                        <TableCell>{new Date(exp.created_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(exp.updated_at).toLocaleString()}</TableCell>
                        <TableCell><Checkbox size="small" onChange={(e)=>{
                                if (e.target.checked) {
                                    if (!checkbox_arr.includes(exp.expense_id)){
                                        set_checkbox_arr([...checkbox_arr,exp.expense_id])
                                    }
                                }else{
                                    if (checkbox_arr.includes(exp.expense_id)){
                                        checkbox_arr.splice(checkbox_arr.indexOf(exp.expense_id),1)
                                    }
                                }
                            }
                            }/>
                        </TableCell>
                        <TableCell><Button variant="outlined" onClick={() => handleClickOpen(exp)}>Update </Button>
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Stack>
        </Grid>
      

      {/* Input Section */}
      
    <Box sx={{ mt: 6 }}>
    <Grid container spacing={3} justifyContent="center">
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
                sx={{ 
                      "& .MuiInputBase-input": { fontSize: "1.1rem" },   // input text
                      "& .MuiInputLabel-root": { fontSize: "1.1rem" }    // label text
                    }}
            />
            </Grid>
            <Grid item xs={4}>
            <TextField
                label="Comment"
                value={comment ?? ""}
                onChange={(e) => setcomment(e.target.value)}
                fullWidth
                 sx={{ 
                      "& .MuiInputBase-input": { fontSize: "1.1rem" },   // input text
                      "& .MuiInputLabel-root": { fontSize: "1.1rem" }    // label text
                    }}
            />
            </Grid>
            <Grid item xs={4}>
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
        <Grid container spacing={2} alignItems="center" justifyContent="center" sx={{ mt: 2 }}  >
            <Button variant="contained" color="primary" onClick={add_expense}>
              Add Expense
            </Button>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', my: 2 }}>
      
      <Box sx={{ justifyContent: 'center'}}>
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>Category</FormLabel>
          <RadioGroup
            row
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <FormControlLabel value="Electronics" control={<Radio />} label="Electronics" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
            <FormControlLabel value="Medical" control={<Radio />} label="Medical" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
            <FormControlLabel value="Food" control={<Radio />} label="Food" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
            <FormControlLabel value="Fashion & Clothing" control={<Radio />} label="Fashion & Clothing" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
          </RadioGroup>
          <RadioGroup
            row
            value={category}
            onChange={(e) => setcategory(e.target.value)}
          >
            <FormControlLabel value="Education" control={<Radio />} label="Education" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
            <FormControlLabel value="Travelling" control={<Radio />} label="Travelling" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
            <FormControlLabel value="Others" control={<Radio />} label="Others" sx={{ "& .MuiFormControlLabel-label": { fontSize: "1.1rem" } }} />
          </RadioGroup>
        </FormControl>
      </Box>
      </Box>
      {/* Right side: Instruction block */}
      {/* <Box
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
      </Box> */}
    </Box>

    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Expense - Expense Id {expense_id}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Click on Save Changes to confirm Update.
          </DialogContentText>
          <form onSubmit={update_expense} id="subscription-form">
            <TextField autoFocus margin="dense" value={amount} onChange={(e) => setamount(e.target.value)} label="Amount" type="number" fullWidth variant="standard"/>
            <TextField autoFocus margin="dense" value={comment} onChange={(e) => setcomment(e.target.value)} label="Comment" fullWidth variant="standard"/>

            <FormControl sx={{ mt: 2.5, minWidth: 150 }} size="medium">
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(e) => setcategory(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value={"Electronics"}>Electronics</MenuItem>
              <MenuItem value={"Fashion & Clothing"}>Fashion & Clothing</MenuItem>
              <MenuItem value={"Medical"}>Medical</MenuItem>
              <MenuItem value={"Food"}>Food</MenuItem>
              <MenuItem value={"Education"}>Education</MenuItem>
              <MenuItem value={"Travelling"}>Travelling</MenuItem>
              <MenuItem value={"Others"}>Others</MenuItem>

            </Select>
            
            </FormControl>
            
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExpensePage;
