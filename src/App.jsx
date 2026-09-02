import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Message from './Pages/Message';
import Call from './Pages/Call';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/message" element={<Message />} />
          <Route path="/call" element={<Call />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
