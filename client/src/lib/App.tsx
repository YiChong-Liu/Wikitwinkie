import React from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const App = (props: {children: React.ReactNode, title: string}) => {
  return <Fragment>
    <Link to="/">Home</Link>
    <h1 className="app-title">
      {props.title}
    </h1>
    <div className="page-body">
      {props.children}
    </div>
  </Fragment>;
}

export default App;
