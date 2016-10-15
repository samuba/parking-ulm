'use strict'

let firebase = require('firebase')

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DB_URL,
  //authDomain: "projectId.firebaseapp.com",
  //storageBucket: "bucket.appspot.com"
})

let db = firebase.database();

module.exports = {
  
  setUser: (user) => {
    user.lastRequest = (new Date()).toISOString()
    
    module.exports.getUser(user.id).then(
      data => {
        let dbUser = data.val()
        user.requestCount = dbUser ? dbUser.requestCount + 1 : 1
        db.ref("users/" + user.id ).set(user).then(
          ok => console.log("firebase set succesfull"),
          err => console.error("firebase set failed", err)
        )
      },
      error => { console.error("error getting user", user) }
    )
  },
  
  getUsers: (limit) => {
    limit = !limit ? 10: limit
    return db.ref("users").limitToLast(limit).once("value")
  },
  
  getUser: (id) => {
    return db.ref("users/" + id).once("value")
  },
  
}