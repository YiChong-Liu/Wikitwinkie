import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateArticle from "./pages/CreateArticle";
import Article from "./pages/Article";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode>
  <Router>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/createArticle" element={<CreateArticle/>}/>
        <Route path="/article/*" element={<Article/>}/>
    </Routes>
  </Router>
</React.StrictMode>);
