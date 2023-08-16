import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
// import Counter from "../features/counter/Counter";
// import Counter from "../features/counter/Counter";

const Login = loadable(() => import("../pages/login/Login"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Counter />} /> */}
        <Route path="/login/infoUniv/:univCode" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
