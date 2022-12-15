/*
Author: Yichong Liu (https://github.com/YiChong-Liu)
Date: 12-12-2022
*/


import axios from "axios";
import { useState, useEffect } from "react";

const ArticleVote = (props: any) => {
    const [Vote,setVote] = useState();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        try {
            axios.get(
                `http://${window.location.hostname}:4004/articles/${props.articleId}/vote`,
                {withCredentials: true}
            ).then(response => {
                setVote(response.data.vote);
                setLoading(false);
            });
        }
        catch(e) {
            console.log(e);
        }

    }, []);
    if (isLoading) {
        return <div>Loading Article Votes...</div>;
    }

    const upVote = async () => {
        const response = await axios.put(
            `http://${window.location.hostname}:4004/articles/${props.articleId}/vote`,
            { vote: 1 },
            {withCredentials: true}
        );
        setVote(response.data.vote);
    }
    const downVote = async() => {
        const response = await axios.put(
            `http://${window.location.hostname}:4004/articles/${props.articleId}/vote`,
            { vote: -1 },
            {withCredentials: true}
        );
        setVote(response.data.vote);
    }

    return <div id="article-vote">
        <span>Vote: {Vote} </span>
        <div>
            <button type="button" className="btn btn-outline-primary" onClick={upVote}>Upvote</button>
            <button type="button" className="btn btn-outline-danger" onClick={downVote}>Downvote</button>
        </div>
    </div>;
}

export default ArticleVote;
