'use strict';
//let sync = require("synchronize")

//let datastore = null

function getUsers() {
  /*let users = []
  for(var i=1; i<99999; i++) {
    let user = datastore.get("user." + i)
    if (!user) break;
    users.push(user)
  }
  return {
    userCount: datastore.get("userCount"),
    users: users
  }*/
}

function getUser(id) {
  //return datastore.get("user." + id)
}

function updateUser(msg) {
    /*let userId = 0
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
      last_call: new Date(msg.date * 1000).toISOString(),
      total_calls: totalCalls + 1
    })*/
}

function getStats() {
  /*return {
    userCount: datastore.get("userCount"),
    commandExecutions: {
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
    }
  }*/
}

function incrementStat(stat) {
  //datastore.set(stat, datastore.get(stat) + 1, 10)
}

module.exports = {
  getUsers: () => getUsers(),
  getUser: (id) => getUser(id),
  updateUser: msg => updateUser(msg),
  getStats: () => getStats(),
  incrementStat: (stat) => incrementStat(stat),
  getUrl: () => null,//datastore.get("url"),
  setUrl: (url) => null,//datastore.set("url", url),
}