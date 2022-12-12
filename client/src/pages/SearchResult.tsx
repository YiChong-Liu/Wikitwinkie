// import axios from "axios";
// import type { AxiosResponse } from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import NLPPage from "../lib/NLPPage";

const SearchResult = (props: any) => {
  // const navigate = useNavigate();
  const arr: string[] = props.result.articleId;

  const search_result = document.getElementById("search-result");
  const prev = document.getElementById("inner-search");
  prev?.remove();

  const inner = document.createElement("div");
  inner.setAttribute("id", "inner-search");
  for (let id of arr) {
    // TODO: Retrieve article name by id
    if (!document.getElementById(id)) {
        const newdiv = document.createElement("div");
        newdiv.setAttribute("id", id);
        const newid = document.createTextNode(id);

        newdiv.appendChild(newid);
        inner?.appendChild(newdiv);
        search_result?.appendChild(inner);
    }
  }

  return <div id="search-result">

  </div>;
}

export default SearchResult;
