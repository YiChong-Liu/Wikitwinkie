import * as redis from 'redis';
import { Stemmer } from './stemmer';
import { Article, ErrorMessage, instanceofSearchResult, SearchResult } from './utils';

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
        const stemmer = new Stemmer(article.content);
        const arr = stemmer.stemming();

        // x: word
        arr.forEach(async x => {
            let res: SearchResult | null = null;
            try {
                res = JSON.parse(await this.client.get(JSON.stringify(x)));
            }
            catch(e) {
                return { message: e };
            }
            
            if (instanceofSearchResult(res)) {
                res.articleId.push(article.articleId);

                try {
                    await this.client.set(JSON.stringify(x), JSON.stringify(res));
                }
                catch (e) {
                    return { message: e };
                }
            }

            else {
                try {
                    await this.client.set(JSON.stringify(x), JSON.stringify([article.articleId]));
                }
                catch (e) {
                    return { message: e };
                }     
            }
        
        });
        return article;
    }

    async searchContent(content: string): Promise<SearchResult | ErrorMessage> {
        const stemmer: Stemmer = new Stemmer(content);
        const arr: string[] = stemmer.stemming();
        const sr: SearchResult = { articleId: [] };

        arr.forEach(async x => {
            let res: SearchResult | null = null;
            try {
                res = JSON.parse(await this.client.get(JSON.stringify(x)));
            }
            catch(e) {
                return { message: e };
            }
            
            if (instanceofSearchResult(res)) {
                res.articleId.forEach(x => {
                    sr.articleId.push(x);
                });
            } 
        });

        return sr;
    }
}
