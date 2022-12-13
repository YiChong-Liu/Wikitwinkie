// import axios from "axios";
// import type { AxiosResponse } from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import NLPPage from "../lib/NLPPage";
// import { Article } from "../utils/interfaces";

const SearchResult = (props: any) => {
  // const navigate = useNavigate();
  // const arr: Article[] = props.result.Articles;

  // const search_result = document.getElementById("search-result");
  const prev = document.getElementById("inner-search");
  prev?.remove();

  const inner = document.createElement("div");
  inner.setAttribute("id", "inner-search");

  // if (arr.length == 0) {
  //   const newdiv = document.createElement("div");
  //   const newid = document.createTextNode("No article found.");

  //   inner?.appendChild(newdiv);
  //   search_result?.appendChild(inner);
  // }
  // else {
  //   for (let article of arr) {
  //     // TODO: Retrieve article name by id
  //     if (!document.getElementById(article.articleId)) {
  //         const newdiv = document.createElement("div");
  //         newdiv.setAttribute("id", id);
  //         const newid = document.createTextNode(id);

  //         newdiv.appendChild(newid);
  //         inner?.appendChild(newdiv);
  //         search_result?.appendChild(inner);
  //     }
  //   }
  // }

  return <div id="search-result">

  </div>;
}

export default SearchResult;
