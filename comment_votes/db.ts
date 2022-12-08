import * as redis from 'redis';
import { CommentVote, ErrorMessage, instanceOfCommentVote, parsedKey, VoteKey } from './utils';

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
    
    async getVoteById(key: VoteKey): Promise<CommentVote | ErrorMessage> {
        let res: string | null = null;
        try {
            res = await this.client.get(JSON.stringify(parsedKey(key)));
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

    async initVote(key: VoteKey): Promise<CommentVote | ErrorMessage> {
        const vote: CommentVote = { 'articleId': key.articleId, 'commentId': key.commentId, 'vote': 0 };

        try {
            await this.client.set(JSON.stringify(parsedKey(key)), JSON.stringify(vote));
        }
        catch {
            return { message: 'Failed to init vote' };
        }

        return vote;
        
    }

    async updateVote(key: VoteKey, value: number): Promise<CommentVote | ErrorMessage> {
        const vote: CommentVote | ErrorMessage = await this.getVoteById(key)
        if (instanceOfCommentVote(vote)) {
            try {
                vote.vote += value;
                await this.client.set(JSON.stringify(parsedKey(key)), JSON.stringify(vote));
            }
            catch (e) {
                return { message: e };
            }
        }

        else {
            return { message: 'Invalid articleId or commentId'}  
        }
        
        return vote;
    }

}
