import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Article from "./pages/Article";
import CreateArticle from "./pages/CreateArticle";
import EditArticle from "./pages/EditArticle";
import UploadImage from "./pages/UploadImage";
import ImageList from "./pages/ImageList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<React.StrictMode>
  <Router>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/article/*" element={<Article/>}/>
        <Route path="/createArticle" element={<CreateArticle/>}/>
        <Route path="/edit/*" element={<EditArticle/>}/>
        <Route path="/uploadImage" element={<UploadImage/>}/>
        <Route path="/imageList" element={<ImageList/>}/>
    </Routes>
  </Router>
</React.StrictMode>);
