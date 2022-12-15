import * as redis from 'redis';
import { ArticleVote, ErrorMessage, instanceOfArticleVote, VoteKey,parsedKey} from './newUtils.js';

export class db {
    client: redis.RedisClientType;
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: 'article_votedb',
                port: 4407
            }
        });

        this.client.connect();
    }

    async getVoteById(key: VoteKey): Promise<ArticleVote | ErrorMessage> {
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

    async initVote(key: VoteKey): Promise<ArticleVote | ErrorMessage> {
        const vote: ArticleVote = { 'articleId': key.articleId, 'vote': 0 };

        try {
            await this.client.set(JSON.stringify(parsedKey(key)), JSON.stringify(vote));
        }
        catch {
            return { message: 'Failed to init vote' };
        }

        return vote;

    }

    async updateVote(key: VoteKey, value: number): Promise<ArticleVote | ErrorMessage> {
        const vote: ArticleVote | ErrorMessage = await this.getVoteById(key)
        if (instanceOfArticleVote(vote)) {
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
