// import axios from "axios";
// import type { AxiosResponse } from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import NLPPage from "../lib/NLPPage";
// import { ArticleSearchEngineResponse } from "../utils/interfaces";

const SearchResult = (props: any) => {
  // const navigate = useNavigate();
  const arr = props.result;
  const search_result = document.getElementById("search-result");
  const prev = document.getElementById("inner-search");
  prev?.remove();

  const inner = document.createElement("div");
  inner.setAttribute("id", "inner-search");

  if (arr && arr.length > 0) {
    for (let article of arr) {
      if (!document.getElementById(article.articleId)) {
          const newdiv = document.createElement("div");
          newdiv.setAttribute("id", article.articleId);

          const link = document.createElement("a");
          link.setAttribute("href", `http://localhost:3000/article/${article.articleId}`);
          link.classList.add("link-primary");
          const title = document.createTextNode(article.articleId);

          link.appendChild(title);
          newdiv.appendChild(link);
          inner?.appendChild(newdiv);
          search_result?.appendChild(inner);
      }}
  }
  else {
    const newdiv = document.createElement("div");
    const notFound = document.createTextNode("No article found.");

    newdiv.appendChild(notFound);
    inner?.appendChild(newdiv);
    search_result?.appendChild(inner);
  }

  return <div id="search-result">

  </div>;
}

export default SearchResult;
