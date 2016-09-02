'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let bot = require("./telegramBot")
let pdFetcher = require("./parkdeckFetcher")
let datastore = require("./datastore").sync;

pdFetcher.fetch()
setInterval(() => pdFetcher.fetch(), 30 * 1000)

let app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

datastore.initializeApp(app);
bot.setDatastore(datastore)
 
app.get("/", (req, resp) => {
  resp.sendFile(__dirname + '/views/index.html');
})
 
app.get("/json", (req, resp) => {
  resp.send(pdFetcher.decks);
})

app.get("/users", (req, resp) => {
  let users = []
  for(var i=1; i<99999; i++) {
    let user = datastore.get("user." + i)
    if (!user) break;
    users.push(user)
  }
  resp.send({
    userCount: datastore.get("userCount"),
    users: users
  });
})

app.get("/users/:id", (req, resp) => {
  resp.send(datastore.get("user." + req.params.id));
})

app.get("/stats", (req, resp) => {
  resp.send({
    "userCount": datastore.get("userCount"),
    "/start": datastore.get("/start"),
    "/free": datastore.get("/free"),
    "/details": datastore.get("/details"),
    "/detailsRathaus": datastore.get("/detailsRathaus"),
    "/detailsDeutschhaus": datastore.get("/detailsDeutschhaus"),
    "/detailsFischerviertel": datastore.get("/detailsFischerviertel"),
    "/detailsSalzstadel": datastore.get("/detailsSalzstadel"),
    "/detailsFrauenstraße": datastore.get("/detailsFrauenstraße"),
    "/detailsBasteicenter": datastore.get("/detailsBasteicenter"),
    "/detailsMaritim": datastore.get("/detailsMaritim"),
    "/detailsKornhaus": datastore.get("/detailsKornhaus"),
    "/detailsTheater": datastore.get("/detailsTheater")
  });
})
 
app.post("/" + process.env.TELEGRAM_BOT_TOKEN, (req, resp) => {
  console.log("msg from telegram", req.body)
  if (pdFetcher.decks[0].free === undefined) {
    // TODO: replace this hack (promises for parkdeckFetcher?)
    // we don't have current data of decks available (eg. container just started)
    // => wait some time and hope data was fetched till then
    setTimeout(() => bot.processUpdate(req.body), 2 * 1000)
  } else {
     bot.processUpdate(req.body)  
  }
  storeUserInfo(req.body.message)
  resp.send(200)
})

function storeUserInfo(msg) {
  let userId = 0
  let totalCalls = 0
  if (!datastore.get("userMap." + msg.from.id)) {
    userId = datastore.get("userCount") + 1
    datastore.set("userMap." + msg.from.id, userId)
    datastore.set("userCount", userId)
  } else {
    userId = datastore.get("userMap." + msg.from.id)
    totalCalls = datastore.get("user." + userId).total_calls
  }
  datastore.set("user." + userId, {
    id: userId,
    first_name: msg.from.first_name,
    last_name: msg.from.last_name,
    username: msg.from.username,
    last_call: msg.date,
    total_calls: totalCalls + 1
  })
}

var listener = app.listen(process.env.PORT, () => { 
  console.log('Your app is listening on port ' + listener.address().port);
})