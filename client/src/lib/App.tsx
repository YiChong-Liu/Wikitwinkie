import React from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const App = (props: {children: React.ReactNode, title: string}) => <Fragment>
  <Link to="/">Home</Link>
  <h1 className="app-title">
    {props.title}
  </h1>
  <main className="page-body">
    {props.children}
  </main>
</Fragment>;

export default App;
