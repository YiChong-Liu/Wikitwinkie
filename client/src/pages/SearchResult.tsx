import axios from "axios";
import type { AxiosResponse } from "axios";
import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import { ArticleSearchEngineResponse } from "../utils/interfaces";

const SearchResult = (props: any) => {
  // const navigate = useNavigate();
  const arr: ArticleSearchEngineResponse[] = props.result.Articles;
  if (arr) {
    const search_result = document.getElementById("search-result");
    const prev = document.getElementById("inner-search");
    prev?.remove();

    const inner = document.createElement("div");
    inner.setAttribute("id", "inner-search");
    
    if (arr.length == 0) {
      const newdiv = document.createElement("div");
      const notFound = document.createTextNode("No article found.");

      newdiv.appendChild(notFound);
      inner?.appendChild(newdiv);
      search_result?.appendChild(inner);
    }
    else {
      for (let article of arr) {
        if (!document.getElementById(article.articleId)) {
            const newdiv = document.createElement("div");
            newdiv.setAttribute("id", article.articleId);

            // TODO: link to articleId
            // <Link to="/about">About</Link>
            // const link = document.createElement("Link");
            const title = document.createTextNode(article.articleId);
    
            newdiv.appendChild(title);
            inner?.appendChild(newdiv);
            search_result?.appendChild(inner);
        }
      }
    }
  }
  
  return <div id="search-result">

  </div>;
}

export default SearchResult;
