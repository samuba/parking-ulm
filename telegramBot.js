'use strict';
let TelegramBot = require('node-telegram-bot-api');
let parkdeckFetcher = require("./parkdeckFetcher")

let bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {webHook: true});

bot.setWebHook("https://thunder-jester.hyperdev.space/" + process.env.TELEGRAM_BOT_TOKEN)

bot.onText(/\/start/, (msg, match) => {
  let reply = "/all - Freie Plätze in allen Parkhäusern anzeigen"
  bot.sendMessage(msg.from.id, reply);
});

bot.onText(/\/all/, (msg, match) => {
  let reply = ""
  parkdeckFetcher.decks.forEach(deck => {
    reply += deck.name + ": " + deck.free + ` ${deck} /location` + deck.id +"\n"
  })
  bot.sendMessage(msg.from.id, reply);
});

bot.onText(/\/location(.+)/, (msg, match) => {
  let id = match[1];
  let deck = parkdeckFetcher.decks[parkdeckFetcher.getDeckIndex(id)]
  bot.sendLocation(msg.from.id, deck.location.lat, deck.location.long);
});

console.log("bot running") 

module.exports = {
  run: function () {
    
  }
}