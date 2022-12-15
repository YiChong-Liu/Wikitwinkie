import * as redis from 'redis';
import type { Comment, CommentKey } from './utils/interfaces.js';
import { ErrorMessage, instanceOfComment, instanceOfComments } from './commentsUtils.js';

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
            return [];
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

    async editComment(comment: Comment): Promise<Comment | ErrorMessage> {
        const comments: Comment[] | ErrorMessage = await this.getCommentsByArticleId(comment.articleId)
        if (instanceOfComments(comments)) {
            comments.forEach(x => {
                if (x.commentId == comment.commentId) {
                    x.content = comment.content
                }
            });

            try {
                await this.client.set(JSON.stringify(comment.articleId), JSON.stringify(comments));
            }
            catch (e) {
                return { message: e };
            }
        }

        else {
            return { message: "Invalid CommentId or ArticleId" };
        }

        return comment;
    }

    async deleteComment(key: CommentKey): Promise<CommentKey | ErrorMessage> {
        const comments: Comment[] | ErrorMessage = await this.getCommentsByArticleId(key.articleId)
        if (instanceOfComments(comments)) {
            const newComments: Comment[] = [];
            comments.forEach(x => {
                if (x.commentId != key.commentId) {
                    newComments.push(x);
                }
            });

            try {
                await this.client.set(JSON.stringify(key.articleId), JSON.stringify(newComments));
            }
            catch (e) {
                return { message: 'Failed to set comment' };
            }
        }

        else {
            return { message: "Invalid CommentId or ArticleId" };
        }

        return key;
    }
}
