import "./App.css";

import React from "react";

const App = (props: {children: React.ReactNode}) => {
  return <div className="App">
    <h1>
      This is the title
    </h1>
    <div className="page-body">
      {props.children}
    </div>
  </div>;
}

export default App;
