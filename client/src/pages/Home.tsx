import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import NLPPage from "../lib/NLPPage";
import { useState } from 'react';
import SearchResult from "./SearchResult";

const Home = () => {
  // const navigate = useNavigate();
  const [Articles,setArticles]=useState({articleId: []});

  const onSearch = async () => {
    const content: string = (document.getElementById("search-bar") as HTMLInputElement).value;
    const response = await axios.get(
      `http://${window.location.hostname}:4405/search/${content}`,
      {withCredentials: true} // send and/or set cookies
    );

    setArticles(response.data);
  }

  return <NLPPage title="WikiTwinkie">
    Please enter your search query in the search bar below:
    <br/>
    <SearchResult result={Articles}></SearchResult>
    
    <div className="input-group mb-3">
      <input type="text" className="form-control" id="search-bar" placeholder="Search here..."/>
      <div className="input-group-append">
        <button type="button" className="btn btn-outline-secondary" onClick={onSearch}>Search</button>
      </div>
    </div>

  </NLPPage>;
}

export default Home;
