export const Type = {
    ARTICLE_CREATED : 'ArticleCreated'
}

export interface ErrorMessage {
    message: any
}

export interface Article {
    articleId: string,
    title: string,
    content: string
}

export interface SearchResult {
    articleId: string[]
}

export function instanceofSearchResult(object: any): object is SearchResult {
    return 'articleId' in object;
}