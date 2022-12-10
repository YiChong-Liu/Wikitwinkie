export const Type = {
    ARTICLE_CREATED : 'ArticleCreated'
}

export interface ErrorMessage {
    message: any
}

export interface Article {
    articleId: string,
    content: string
}

export interface SearchResult {
    articleId: string[]
}