import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Message from './Pages/Message';
import Call from './Pages/Call';
import Settings from "./Pages/Settings";
import Contacts from "./Pages/Contacts";
import Profile from "./Pages/Profile";

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
          <Route path="/settings" element={<Settings />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
