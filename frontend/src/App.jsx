import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SampleDecision from "./pages/SampleDecision";
import { ThemeProvider } from "./components/ThemeContext";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sample-decision" element={<SampleDecision />} />
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
  
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;