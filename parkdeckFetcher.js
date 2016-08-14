'use strict';
let request = require('request-promise');
let cheerio = require('cheerio');

let decks = [
  { id: "Rathaus", name: "Am Rathaus", location: { lat: 48.3972972, long: 9.9928868 } },
  { id: "Deutschhaus", name: "Deutschhaus", location: { lat: 48.39791, long: 9.984179 } },
  { id: "Fischerviertel", name: "Fischerviertel", location: { lat: 48.3964242, long: 9.9861272 } },
  { id: "Salzstadel", name: "Salzstadel", location: { lat: 48.4011074, long: 9.9880109 } },
  { id: "Frauenstraße", name: "Frauenstraße", location: { lat: 48.4011065, long: 9.9938233 } },
  { id: "Basteicenter", name: "Congress Centrum Nord / Basteicenter", location: { lat: 48.402076, long: 10.002884 } },
  { id: "Maritim", name: "Congress Centrum Süd / Maritim Hotel", location: { lat: 48.4016258, long: 10.0042832 } },
  { id: "Kornhaus", name: "Kornhaus", location: { lat: 48.401052, long: 9.9948341 } },
  { id: "Theater", name: "Theater", location: { lat: 48.400639, long: 9.985831 } },
]

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '') 
}

function getDeckIndex(str) {
  for(let i=0; i <= decks.length-1; i++) {
    if (str.indexOf(decks[i].id) >= 0) return i
  }
  return null
}

function fetchDeckInfo() { 
  request({ 
    uri: "http://www.parken-in-ulm.de", 
    transform: (body) => cheerio.load(body) 
  }).then($ => {
    $(".sitelink").each((_, elem) => {
      let name = trim(elem.children[0].data)
      let index = getDeckIndex(name)
      if (index === null) return
      decks[index].name = name
      decks[index].total = trim(elem.parent.parent.parent.children[3].children[0].data)
      decks[index].free = trim(elem.parent.parent.parent.children[5].children[0].data)
      decks[index].openText = trim(elem.parent.parent.parent.children[7].children[0].data)
    })
    console.log("parkdecks fetch successfull @" + Date()) 
  })
  .catch(err => {
    console.error("could not get parkdeck information from server", err)
  });
}

module.exports = {
  fetch: () => fetchDeckInfo(),
  decks: decks,
  getDeckIndex: (str) => getDeckIndex(str)
}