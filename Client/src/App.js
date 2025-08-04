import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpensePage from "./pages/ExpensePage";

function App(){
  return(
      <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/ExpensePage" element={<ExpensePage />} />
      </Routes>
      </Router>
  );
}
export default App;