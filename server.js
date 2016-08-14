'use strict';
let express = require('express');
let bot = require("./telegramBot")
let parkdeckFetcher = require("./parkdeckFetcher")
 
let app = express();
app.use(express.static('public'));

parkdeckFetcher.fetch()

setInterval(() => parkdeckFetcher.fetch(), 2 * 60 * 1000);

app.get("/", (req, resp) => {
  resp.sendFile(__dirname + '/views/index.html');
});

app.get("/json", (req, resp) => {
  resp.send(parkdeckFetcher.decks);
});
 
app.post(process.env.TELEGRAM_BOT_TOKEN, (req, resp) => {
  console.log("######## yo da kams", req)
})

var listener = app.listen(process.env.PORT, function () { 
  console.log('Your app is listening on port ' + listener.address().port);
});

