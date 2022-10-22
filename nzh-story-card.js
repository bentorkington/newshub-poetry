const matchQuote = require('./match-pull-quote');
const fetch = require('node-fetch');
const parser = require('node-html-parser');

module.exports = class StoryCard {
  constructor(element) {
    this.element = element;
  }

  get headline() {
    return this.element.querySelector('.story-card__heading');
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
    const date = this.element.querySelector('time.meta-data__time-stamp');
    if (date) {
      return Promise.resolve(Date.parse(date.getAttribute('datetime')));
    }
    else {
      return Promise.resolve(new Date());
    }
  }

  static uniqueByUrl(stories) {
    return [... new Map(stories.map(story => [story.url, story])).values()];
  }
};
