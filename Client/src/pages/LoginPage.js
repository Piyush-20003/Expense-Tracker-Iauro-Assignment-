import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
} from "@mui/material";

function LoginPage() {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [name2, setname2] = useState("");
  const [msg, setmsg] = useState("");

  const sendData = async () => {
    const response = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, name2 }),
    });

    const data = await response.json();
    setmsg(data.message);
  };

  const login = () => {
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { 
        'Authorization':'Basic '+ btoa(name + ':' + name2)
      }
      
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log("id: "+data.id+" name: "+data.username)
          if (data.id === null || data.username === null){
            return setmsg("Invalid Credentials")
        
          }
          navigate("/ExpensePage", {
            state: { userId: data.id, username: data.username },
          });
        }else{
            return setmsg(data.message)
        }
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={2}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setname(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={name2}
              onChange={(e) => setname2(e.target.value)}
            />

            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="primary" onClick={login}>
                Login
              </Button>
              <Button variant="outlined" color="secondary" onClick={sendData}>
                Register
              </Button>
            </Stack>

            {msg && (
              <Typography variant="body1" color="success.main" align="center">
                {msg}
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
