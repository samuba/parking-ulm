'use strict';
let TelegramBot = require('node-telegram-bot-api');
let pdFetcher = require("./parkdeckFetcher")

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

let startText = `
Hi 😃
Ich will dir helfen schneller einen Parkplatz in Ulm zu finden.
Diese Kommandos kannst du benutzen um mit mir zu sprechen:
/free - Freie Plätze in allen Parkhäusern anzeigen
/details - Details zu den Parkhäusern anzeigen
`
bot.onText(/\/start$/, (msg, match) => {
  bot.sendMessage(msg.from.id, startText,  defaultMsgParams);
  
  datastore.set("/start", datastore.get("/start") + 1)
});

bot.onText(/\/help$/, (msg, match) => {
  bot.sendMessage(msg.from.id, startText, defaultMsgParams);
});

bot.onText(/\/free$/, (msg, match) => {
  let reply = "So viele Parkplätze sind noch in den jeweiligen Parkhäusern frei:\n\n"
  pdFetcher.decks.forEach(x => reply += `${x.name}: ${x.free} /details${x.id}\n`)
  bot.sendMessage(msg.from.id, reply);
  
  datastore.set("/free", datastore.get("/free") + 1)
}); 

bot.onText(/\/details$/, (msg, match) => {
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
  
  datastore.set("/details", datastore.get("/details") + 1)
});

bot.onText(/\/details(.+)/, (msg, match) => {
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
  
  datastore.set("/details" + id, datastore.get("/details" + id) + 1)
});

module.exports = {
  processUpdate: update => bot.processUpdate(update),
  setDatastore: ds => datastore = ds
}