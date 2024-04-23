import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./templates/Layout";

function App() {
  return (
    <Routes>
      <Route index element={<Layout children={<Home />} />} />
    </Routes>
  );
}

export default App;
