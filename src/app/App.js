import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import Counter from "features/counter/Counter";

const Login = loadable(() => import("../pages/login/Login"));
// const TextVision = loadable(() => import("../pages/textVision/TextVision"));
// const ReTextVision = loadable(() =>
//   import("../pages/login/reTextVision/ReTextVision")
// );

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Counter />} />
        <Route path="/login/infoUniv/:univCode" element={<Login />} />
        {/* <Route path="/reTextVision" element={TextVision} />
        <Route path="TextVision" element={ReTextVision} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
