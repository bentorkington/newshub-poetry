function randomInt(max) {
  return Math.floor(Math.random() * max);
}

fetch('https://www.newshub.co.nz/home.html')
  .then(resp => resp.text())
  .then((html) => new DOMParser().parseFromString(html, 'text/html'))
  .then((doc) => {
    headlines = Array.from(doc.querySelectorAll('div.c-NewsTile h3.c-NewsTile-title'))
      .map((hl) => hl.innerText.match(/(?<!\w)'([\w\s,]*)'[:\s]/))
      .filter((match) => match)
      .map((match) => match[1]);

    const date = new Date();
    const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
    const fullDate = date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

    var stanzaCount = 3;
    const poemDiv = document.querySelector('#poem');

    for (var i = 0; i < stanzaCount; i++) {
      const stanzaElement = document.createElement('p');
      stanzaElement.className = "poem-stanza";
      for (var j = randomInt(2) + 2; j > 0; j--) {
        stanzaElement.append(headlines.shift().toLowerCase());
        if (j > 0) {
          stanzaElement.appendChild(document.createElement('br'));
        }
      }
      poemDiv.appendChild(stanzaElement);
    }
    document.querySelector('#day-name').append(dayName);
    document.querySelector('#full-date').append(fullDate);
    window.versions.poemRendered('hihi');
  });
