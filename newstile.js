const matchQuote = require('./match-pull-quote');
const fetch = require('node-fetch');
const parser = require('node-html-parser');

module.exports = class NewsTile {
  constructor(element) {
    this.element = element;
  }

  get headline() {
    return this.element.querySelector('h3.c-NewsTile-title');
  }

  get headlineQuotes() {
    return matchQuote(this.headline.text);
  }

  get url() {
    return this.element.querySelector('a').getAttribute('href')
  }

  fetchArticle() {
    return fetch(this.url)
      .then((res) => res.text())
      .then((html) => parser.parse(html));
  }

  getArticlePublicationDate() {
    return this.fetchArticle()
      .then((doc) => Date.parse(doc.querySelector('article > meta[itemprop="datePublished"]').getAttribute('content')));
  }

  static uniqueByUrl(stories) {
    return [... new Map(stories.map(story => [story.url, story])).values()];
  }
};
