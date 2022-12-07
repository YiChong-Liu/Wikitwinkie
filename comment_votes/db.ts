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
    

    async getVoteById(articleId: string, commentId: string): Promise<CommentVote[] | ErrorMessage> {
        let res: string | null = null;
        try {
            res = await this.client.get(JSON.stringify(articleId));
        }
        catch(e) {
            return { message: e };
        }
        
        if (res) {
            try {
                return JSON.parse(res);
            }
            catch (e) {
                return { message: e };
            }
        }
        else {
            return { message: "comment not found" }; 
        }
    }

    async createComment(comment: CommentVote): Promise<Comment | ErrorMessage> {
        // const votes: CommentVote[] | ErrorMessage = await this.getVoteById(comment.articleId, comment.commentId)
        // if (instanceOfCommentVotes(votes)) {
        //     comments.push(comment);

        //     try {
        //         await this.client.set(JSON.stringify(comment.articleId), JSON.stringify(comments));
        //     }
        //     catch (e) {
        //         return { message: e };
        //     }
        // }

        // else {
        //     try {
        //         await this.client.set(JSON.stringify(comment.articleId), JSON.stringify([comment]));
        //     }
        //     catch (e) {
        //         return { message: e };
        //     }     
        // }

        // return comment;
        return { message: "" };

    }

}
