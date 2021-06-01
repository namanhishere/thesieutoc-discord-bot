const Discord = require("discord.js")
const database = require("../index").database

module.exports.run = async (client) => {
    console.log("Bot turned on successfully")
}


module.exports.config = {
    name: "ready",
    isOnce: false
}