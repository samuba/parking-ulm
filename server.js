'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let bot = require("./telegramBot")
let pdFetcher = require("./parkdeckFetcher")

pdFetcher.fetch()
setInterval(() => pdFetcher.fetch(), 30 * 1000)

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
 
app.get("/", (req, resp) => {
  resp.sendFile(__dirname + '/views/index.html');
})

app.get("/json", (req, resp) => {
  resp.send(pdFetcher.decks);
})
 
app.post("/" + process.env.TELEGRAM_BOT_TOKEN, (req, resp) => {
  if (pdFetcher.decks[0].free === undefined) {
    // container just started. warit for parkdeckfetch to finish
    // otherwise we wont have data available
    setTimeout(() => pdFetcher.fetch(), 2 * 1000)
  }
  bot.processUpdate(req.body) 
  resp.send(200)
})

var listener = app.listen(process.env.PORT, () => { 
  console.log('Your app is listening on port ' + listener.address().port);
})

