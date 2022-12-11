import React from "react";
import { Fragment } from "react";
import Navbar from "./Navbar";
import "./NLPPage.css";

const NLPPage = (props: {children: React.ReactNode, title: string}) => {
  return <Fragment>
    <Navbar searchbar={false}/>
    <h1 className="app-title">
      {props.title}
    </h1>
    <main className="page-body">
      {props.children}
    </main>
  </Fragment>;
};

export default NLPPage;
