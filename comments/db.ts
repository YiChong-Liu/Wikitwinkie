import * as redis from 'redis';
import { Comment, ErrorMessage, instanceOfComment, instanceOfComments } from './utils';

export class db {
    client: redis.RedisClientType;
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: 'commentsdb',
                port: 4402
            }
        });

        this.client.connect();
    }
    

    async getCommentsByArticleId(articleId: string): Promise<Comment[] | ErrorMessage> {
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

    async createComment(comment: Comment): Promise<Comment | ErrorMessage> {
        const comments: Comment[] | ErrorMessage = await this.getCommentsByArticleId(comment.articleId)
        if (instanceOfComments(comments)) {
            comments.push(comment);

            try {
                await this.client.set(JSON.stringify(comment.articleId), JSON.stringify(comments));
            }
            catch (e) {
                return { message: e };
            }
        }

        else {
            try {
                await this.client.set(JSON.stringify(comment.articleId), JSON.stringify([comment]));
            }
            catch (e) {
                return { message: e };
            }     
        }

        return comment;

    }

    // static async getCommentByIds(postId: string, commentId: string): Promise<Comment | ErrorMessage> {
        // await this.client.connect();
        // const res = await this.client.get(postId);
        // await this.client.disconnect();

        // if (res) {
        //     const comments = JSON.parse(res);
        //     if (commentId in comments) {
        //         return comments[commentId];
        //     }
        //     else {
        //         const error: ErrorMessage = { message: "comment not found" }
        //         return error;  
        //     }
        // }

        // else {
        //     const error: ErrorMessage = { message: "comment not found" }
        //     return error; 
        // }
    // }
    
    async editComment(comment: Comment) {
        return;
    }
    
    async deleteComment(comment: Comment) {
        return;
    }
}
