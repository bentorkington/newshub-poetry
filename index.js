const fetch = require('node-fetch');
const parser = require('node-html-parser');
const fs = require('fs-extra');
const { decode } = require('html-entities');
const nodeHtmlToImage = require('node-html-to-image');

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

fetch('https://www.newshub.co.nz/home.html')
  .then(resp => resp.text())
  .then((html) => parser.parse(html))
  .then((doc) => {
    headlines = doc.querySelectorAll('div.c-NewsTile h3.c-NewsTile-title')
      .map((hl) => hl.text.match(/(?<!\w)'([\w\s,]*)'[:\s]/))
      .filter((match) => match)
      .map((match) => match[1]);

    const date = new Date();
    const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
    const fullDate = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    let stanzas = [];
    var stanzaCount = 3;
    for (var i = 0; i < stanzaCount; i++) {
      stanzas.push(headlines.splice(0, randomInt(2) + 2).map((line) => line.toLowerCase()).join('<br>'));
    }

    fs.readFile('./template.handlebars')
      .then((template) => {
        nodeHtmlToImage({
          output: "out.png",
          content: {
            dayName: dayName.toLowerCase(),
            stanzas,
            fullDate
          },
          html: template.toString('utf-8'),
        });
      })
  });
