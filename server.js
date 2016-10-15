'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let bot = require("./telegramBot")
let pdFetcher = require("./parkdeckFetcher")
let stats = require("./stats"); 
let sync = require("synchronize")

pdFetcher.fetch()
setInterval(() => pdFetcher.fetch(), 30 * 1000)

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.get("/", (req, resp) => {
  stats.setUrl("https://" + req.headers.host)
  resp.sendFile(__dirname + '/views/index.html');
})
 
app.get("/json", (req, resp) => {
  resp.send(pdFetcher.decks);
})

app.get("/users", (req, resp) => {
  resp.send(stats.getUsers());
})

app.get("/users/:id", (req, resp) => {
  resp.send(stats.getUser(req.params.id));
})

app.get("/stats", (req, resp) => {
  resp.send(stats.getStats());
})
 
app.post("/" + process.env.TELEGRAM_BOT_TOKEN, (req, resp) => {
  console.log("msg from telegram", req.body)
  if (pdFetcher.decks[0].free === undefined) {
    // TODO: replace this hack (promises for parkdeckFetcher?)
    // we don't have current data of decks available (eg. container just started)
    // => wait some time and hope data was fetched till then
    setTimeout(() => sync.fiber(() => bot.processUpdate(req.body)), 2 * 1000)
  } else {
     bot.processUpdate(req.body)  
  }
  sync.fiber(() => stats.updateUser(req.body.message))
  resp.send(200)
})

var listener = app.listen(process.env.PORT, () => { 
  console.log('Your app is listening on port ' + listener.address().port);
}) 