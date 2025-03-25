import { Route, Routes } from "react-router-dom";
import Userlayout from "./components/Layout/Userlayout";
import Home from "../src/components/Pages/Home";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register"; 
import { Toaster } from 'sonner';
import Profile from "./components/Pages/Profile";


function App() {
  return (
    <>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<Userlayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="Profile" element={<Profile />} />

      </Route>
    </Routes>
    </>
  );
}

export default App;
