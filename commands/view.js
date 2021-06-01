require("dotenv").config()
const Discord = require("discord.js")
const database = require("../index").database
const axios = require("axios")
const crypto = require("crypto-js")

module.exports.run = async (client, message, args) => {

    database.query(`SELECT * FROM serverinfomation WHERE serverID = ${message.guild.id}`, function (error, data) {
        
        if (data.length === 0) {
            message.reply("Bạn chưa yêu cài đặt hệ thống, vui lòng liên hệ quản trị viên hoặc sử dụng lệnh ```!setup```. Xin cảm ơn")
        } else {  
            if (!message.mentions.users.size) {
                let user = message.author
                database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${user.id}`,[],function (err,udata) {
                    let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Thông tin zí của '+user.tag)
                    .addField('Số tiền đang có là', udata[0].Coin)
                    message.reply(embed)
                })
            }

            message.mentions.users.map(user => {
                database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${user.id}`,[],function (err,udata) {
                    let embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Thông tin zí của '+user.tag)
                    .addField('Số tiền đang có là', udata[0].Coin)
                    message.reply(embed)
                })
            });
        }

    })
}


module.exports.config = {
    name: "view",
    aliases: ["balance"]
}