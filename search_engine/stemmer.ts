import { punc, stopword } from "./stopword.js";

export class Stemmer {
    input: string;
    constructor(input: string) {
        this.input = input;

    }
    private stopWord(content: string): string[] {
        const arr: string[] = content.split(" ");
        return arr.filter(x => !stopword.has(x));
    }

    private punctuation(content: string): string {
        const arr = content.split("");
        const res = arr.filter(x => !punc.has(x));
        return res.join("");
    }

    // Porter Stemmer
    private stemmer(content: string[]): string[] {
        // TODO: Implement Porter Stemmer
        return content
    }

    public stemming(): string[] {
        const rmvStopWord = this.stopWord(this.input);
        const rmvPunc = rmvStopWord.map(x => this.punctuation(x));
        return rmvPunc;
    }
}
