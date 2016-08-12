'use strict';
let express = require('express');
let app = express();
let request = require('request-promise');
let cheerio = require('cheerio');
 
app.use(express.static('public'));

var decks = []

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}

function fetchDeckInfo() {
  request({ 
    uri: "http://www.parken-in-ulm.de", 
    transform: (body) => cheerio.load(body) 
  }).then($ => {
    decks.length = 0
    $(".sitelink").each((index, elem) => {
      decks.push({
        name: trim(elem.children[0].data),
        total: trim(elem.parent.parent.parent.children[3].children[0].data),
        free: trim(elem.parent.parent.parent.children[5].children[0].data),
        openText: trim(elem.parent.parent.parent.children[7].children[0].data),
      })
    })
    console.log("parkdecks@" + Date(), decks) 
  })
  .catch(err => {
    console.error("could not get parkdeck information from server", err)
  });
}

fetchDeckInfo()

setInterval(() => fetchDeckInfo(), 2 * 60 * 1000)

app.get("/", (req, resp) => {
  resp.sendFile(__dirname + '/views/index.html');
});

app.get("/json", (req, resp) => {
  resp.send(decks);
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});