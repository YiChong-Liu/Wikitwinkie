export interface ArticleVote {
    articleId: string,
    vote: number
}
export interface VoteKey {
    articleId: string
}

export interface ErrorMessage {
    message: any
}

export function instaceOfErrorMessage(object: any): object is ErrorMessage {
    return 'message' in object;
}

export function instanceOfArticleVote(object: any): object is ArticleVote {
    return 'vote' in object;
}

export function parsedKey(key: VoteKey): string {
    return key.articleId;
}



