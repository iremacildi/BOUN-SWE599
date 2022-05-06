import './App.css';
import { Routes, Route } from "react-router-dom"
//pages
import Welcome from './Pages/Welcome';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/Signup';

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default App;
