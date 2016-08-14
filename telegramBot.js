'use strict';
let TelegramBot = require('node-telegram-bot-api');
let parkdeckFetcher = require("./parkdeckFetcher")

module.exports = {
  processUpdate: update => bot.processUpdate(update)
}

let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {webHook: true});
bot.setWebHook(process.env.TELEGRAM_WEBHOOK_URL)

let startText = `
Hi 😃
Ich will dir helfen schneller einen Parkplatz in Ulm zu finden.
Diese Kommandos kannst du benutzen um mit mir zu sprechen:
/free - Freie Plätze in allen Parkhäusern anzeigen
/details - Details zu den Parkhäusern anzeigen
`

bot.onText(/\/start$/, (msg, match) => {
  bot.sendMessage(msg.from.id, startText);
});

bot.onText(/\/help$/, (msg, match) => {
  bot.sendMessage(msg.from.id, startText);
});


bot.onText(/\/all$/, (msg, match) => {
  let reply = ""
  parkdeckFetcher.decks.forEach(x => reply += `${x.name}: ${x.free} /details${x.id}\n`)
  bot.sendMessage(msg.from.id, reply);
}); 

bot.onText(/\/location(.+)/, (msg, match) => {
  let id = match[1];
  let deck = parkdeckFetcher.decks[parkdeckFetcher.getDeckIndex(id)]
  bot.sendLocation(msg.from.id, deck.location.lat, deck.location.long);
});

bot.onText(/\/details$/, (msg, match) => {
  let reply = "Welches Parkhaus interessiert dich?"
  let keyboard = []
  let decks = parkdeckFetcher.decks
  for (let i=0; i<=decks.length; i+=2) {
    let buttons = []
    if (decks[i]) {
      buttons.push(`/details${decks[i].id}`)
    }
    if (decks[i+1]) {
      buttons.push(`/details${decks[i+1].id}`)
    }
    keyboard.push(buttons)
  }
  bot.sendMessage(msg.from.id, reply, { reply_markup: {
    one_time_keyboard: true,
    keyboard: keyboard
  }})
});

bot.onText(/\/details(.+)/, (msg, match) => {
  let id = match[1];
  let deck = parkdeckFetcher.decks[parkdeckFetcher.getDeckIndex(id)]
  let reply = `
*${deck.name}*
Frei: ${deck.free}
Kapazität: ${deck.total}
Öffnungszeiten: ${deck.openText}
`
  bot.sendMessage(msg.from.id, reply, { 
    parse_mode: "Markdown", 
    reply_markup: { hide_keyboard: true }
  })
  setTimeout(() => {
      bot.sendLocation(msg.from.id, deck.location.lat, deck.location.long);
  }, 100)
});

console.log("bot running") 