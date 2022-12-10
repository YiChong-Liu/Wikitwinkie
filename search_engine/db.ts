import * as redis from 'redis';
import { Article, ErrorMessage, SearchResult } from './utils';

export class db {
    client: redis.RedisClientType;
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: 'search_enginedb',
                port: 4406
            }
        });

        this.client.connect();
    }
    
    async indexing(article: Article): Promise<Article | ErrorMessage> {
        return { message: "" };
    }

    async searchContent(content: string): Promise<SearchResult | ErrorMessage> {
        return { articleId: [] }
    }
}
