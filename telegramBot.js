'use strict';
let TelegramBot = require('node-telegram-bot-api');
let pdFetcher = require("./parkdeckFetcher")
let stats = require("./stats") 
let db = require("./database")

let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {webHook: true});
bot.setWebHook(process.env.TELEGRAM_WEBHOOK_URL)

var datastore = null

let defaultMsgParams = { 
  parse_mode: "Markdown",
  reply_markup: { 
    keyboard: [['/free', '/details']],
    resize_keyboard: true
  }
}

bot.onText(/\/start$/, (msg, match) => {
  let startText =  `
Hi ${msg.from.first_name || msg.from.username || ""} 😃
Ich will dir helfen schneller einen Parkplatz in Ulm zu finden.
Diese Kommandos kannst du benutzen um mit mir zu sprechen:
/free - Freie Plätze in allen Parkhäusern anzeigen
/details - Details zu den Parkhäusern anzeigen
`
  bot.sendMessage(msg.from.id, startText,  defaultMsgParams);
  stats.incrementStat("/start")
});

bot.onText(/\/free$/, (msg, match) => {
  db.setUser(msg.from)
  let reply = "So viele Parkplätze sind noch in den jeweiligen Parkhäusern frei:\n\n"
  pdFetcher.decks.forEach(x => reply += `${x.name}: ${x.free} /details${x.id}\n`)
  bot.sendMessage(msg.from.id, reply);
  stats.incrementStat("/free")
}); 

bot.onText(/\/details$/, (msg, match) => {
  db.setUser(msg.from)
  let reply = "Welches Parkhaus interessiert dich?"
  let keyboard = []
  let decks = pdFetcher.decks
  for (let i=0; i<=decks.length; i+=2) {
    let buttons = []
    if (decks[i]) buttons.push(`/details${decks[i].id}`)
    if (decks[i+1]) buttons.push(`/details${decks[i+1].id}`)
    keyboard.push(buttons)
  }
  bot.sendMessage(msg.from.id, reply, { reply_markup: {
    one_time_keyboard: true,
    resize_keyboard: true,
    keyboard: keyboard
  }})
  stats.incrementStat("/details")
});

bot.onText(/\/details(.+)/, (msg, match) => {
  db.setUser(msg.from)
  let id = match[1];
  let deck = pdFetcher.decks[pdFetcher.getDeckIndex(id)]
  let reply = `
*${deck.name}*
Frei: ${deck.free}
Kapazität: ${deck.total}
Öffnungszeiten: ${deck.openText}
`
  bot.sendMessage(msg.from.id, reply, defaultMsgParams)
  setTimeout(() => {
      bot.sendLocation(msg.from.id, deck.location.lat, deck.location.long);
  }, 100)
  stats.incrementStat("/details" + id)
});

bot.onText(/\/users(.+)/, (msg, match) => {
  let limit = parseInt(match[1]);
  console.log("limit", limit)
  db.getUsers(limit).then(
    data => bot.sendMessage(msg.from.id, JSON.stringify(data.val(), null, 2).replace(/"|,|{|}/g, '')),
    error => bot.sendMessage(msg.from.id, error)
  )
});

bot.onText(/\/admin$/, (msg, match) => {
  let res = stats.getUrl() + "/stats \n"
  res += stats.getUrl() + "/users \n"
  bot.sendMessage(msg.from.id, res, defaultMsgParams);
});

module.exports = { 
  processUpdate: update => bot.processUpdate(update),
}