import * as redis from 'redis';

export const Type = {
    POST_CREATED : 'PostCreated',
    COMMENT_CREATED : 'CommentCreated',
    COMMENT_MODERATED : 'CommentModerated',
    COMMENT_VOTED : 'CommentVoted'
}

export interface Comment {
    commentId: string,
    articleId: string,
    username: string,
    content: string,
}

export class db {
    static client = redis.createClient({
        socket: {
            host: 'commentsdb',
            port: 4402
        }
    });

    static async getCommentByID(id: string) {
        await this.client.connect();

        const res = await this.client.get(id);

        await this.client.disconnect();
        return res;
    }

    static async createComment(comment: Comment) {
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        await this.client.connect();

        await this.client.set('foo', 'bar');
        const fooValue = await this.client.get('foo');
        console.log(fooValue)

        await this.client.disconnect();
    }
    
    static async editComment(comment: Comment) {
        return;
    }
    
    static async deleteComment(comment: Comment) {
        return;
    }
}
