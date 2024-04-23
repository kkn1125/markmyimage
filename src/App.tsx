import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./templates/Layout";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
