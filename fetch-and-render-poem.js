function randomInt(max) {
  return Math.floor(Math.random() * max);
}

window.bridge.sendSettings((ev, poemData) => {
  console.log(poemData);
  
  var stanzaCount = 3;
  const poemDiv = document.querySelector('#poem');

  for (var i = 0; i < stanzaCount; i++) {
    const stanzaElement = document.createElement('p');
    stanzaElement.className = "poem-stanza";
    for (var j = randomInt(2) + 2; j > 0; j--) {
      stanzaElement.append(poemData.headlines.shift().toLowerCase());
      if (j > 0) {
        stanzaElement.appendChild(document.createElement('br'));
      }
    }
    poemDiv.appendChild(stanzaElement);
  }
  document.querySelector('#day-name').append(poemData.dayName);
  document.querySelector('#full-date').append(poemData.fullDate);
  setTimeout(() => {
    window.bridge.poemRendered('hihi');
  }, 500);
});
