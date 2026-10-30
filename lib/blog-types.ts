export type ArticleSummary={slug:string;title:string;description:string;category:string;date:string;cover:string;coverAlt:string;featured:boolean};
export type ArticleBlock={type:'heading';level:2|3;text:string;id:string}|{type:'paragraph';text:string}|{type:'list';ordered:boolean;items:string[]};
export type Article=ArticleSummary&{blocks:ArticleBlock[];toc:{id:string;text:string;level:2|3}[]};
