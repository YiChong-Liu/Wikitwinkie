import * as redis from 'redis';
import { CommentVote, ErrorMessage, instanceOfCommentVotes } from './utils';

export class db {
    client: redis.RedisClientType;
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: 'comment_votesdb',
                port: 4404
            }
        });

        this.client.connect();
    }
    

    async getVoteById(articleId: string, commentId: string): Promise<CommentVote | ErrorMessage> {
        let res: string | null = null;
        const key = articleId + "," + commentId;
        try {
            res = await this.client.get(JSON.stringify(key));
        }
        catch(e) {
            return { message: e };
        }
        
        if (res) {
            try {
                return JSON.parse(res);
            }
            catch (e) {
                console.log(e)
                return { message: "Failed" };
            }
        }
        else {
            return { message: "vote not found" }; 
        }
    }

    async initVote(articleId: string, commentId: string): Promise<CommentVote | ErrorMessage> {
        const key = articleId + ',' + commentId;
        const vote: CommentVote = { 'articleId': articleId, 'commentId': commentId, 'vote': 0 };

        try {
            await this.client.set(JSON.stringify(key), JSON.stringify(vote));
        }
        catch {
            return { message: 'Failed to init vote' };
        }

        return vote;
        
    }

    // async updateVote(comment: CommentVote): Promise<Comment | ErrorMessage> {
    //     const votes: CommentVote[] | ErrorMessage = await this.getVoteById(comment.articleId, comment.commentId)
    //     if (instanceOfCommentVotes(votes)) {
    //         comments.push(comment);

    //         try {
    //             await this.client.set(JSON.stringify(comment.articleId), JSON.stringify(comments));
    //         }
    //         catch (e) {
    //             return { message: e };
    //         }
    //     }

    //     else {
    //         try {
    //             await this.client.set(JSON.stringify(comment.articleId), JSON.stringify([comment]));
    //         }
    //         catch (e) {
    //             return { message: e };
    //         }     
    //     }

    //     return comment;
    // }

}
