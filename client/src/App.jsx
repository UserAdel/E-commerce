import { Route, Routes } from "react-router-dom";
import Userlayout from "./components/Layout/Userlayout";
import Home from "../src/components/Pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Userlayout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
