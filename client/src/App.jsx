import { Route, Routes } from "react-router-dom";
import Userlayout from "./components/Layout/Userlayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Userlayout />} />
      </Routes>
    </>
  );
}

export default App;
