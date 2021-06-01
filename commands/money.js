require("dotenv").config()
const Discord = require("discord.js")
const database = require("../index").database
const axios = require("axios")
const crypto = require("crypto-js")

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("ADMINISTRATOR") == false) return message.reply("Bạn không có quyền sử dụng lệnh này")
    database.query(`SELECT * FROM serverinfomation WHERE serverID = ${message.guild.id}`, function (error, data) {
        
        if (data.length === 0) {
            message.reply("Bạn chưa yêu cài đặt hệ thống, vui lòng liên hệ quản trị viên hoặc sử dụng lệnh ```!setup```. Xin cảm ơn")
        } else {
            let newargs = []
            args.forEach(element => {
                if(element.startsWith("<@") || element==="") return
                newargs.push(element)
            })
                let numadd = newargs[1]
                if(numadd < 1000) numadd = numadd*1000
                let messages = newargs.slice(2).join(" ")
                if(!messages) messages="Hong có lý do"
                // console.log(newargs)
                // console.log(numadd)
                // console.log(messages)
                // console.log(message.mentions)
                switch (newargs[0]) {
                    case "add":
                        
                        message.mentions.users.map(user => {
                            console.log(user.id)
                            database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${user.id}`, function (err,uda) {
                                if(uda.length == 0 ) {
                                    
                                    database.query(`INSERT INTO s${message.guild.id} (ID,Coin) VALUE ('${user.id}', ? )`,[numadd])//tạo mới user
                                    message.channel.send(`Hoàn tất cộng thêm ${numadd} cho user ${user} với lý `+"do```"+ messages+"```")
                                }else{
                                    let newnum = (parseFloat(uda[0].Coin)+parseFloat(numadd)).toString()
                                    database.query(`UPDATE s${message.guild.id} SET Coin = ${newnum} WHERE ID= ${user.id}`)
                                    message.channel.send(`Hoàn tất cộng thêm ${numadd} cho user ${user} với lý `+"do```"+ messages+"```")
                                }
                                
                            })
                        });
                        break;
                        case "minus":
                            message.mentions.users.map(user => {
                                database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${user.id}`, function (err,uda) {
                                    if(uda.length == 0 ) {
                                        database.query(`INSERT INTO ${message.guild.id} (ID,Coin) VALUE ('?', ? )`,[user.id,numadd])//tạo mới user
                                    }else{
                                        let newnum = (parseFloat(uda[0].Coin)-parseFloat(numadd)).toString()
                                        database.query(`UPDATE s${message.guild.id} SET Coin = ${newnum} WHERE ID= ${user.id}`)
                                        message.channel.send(`Hoàn tất trừ ${numadd} cho user ${user} với lý `+"do```"+ messages+"```")
                                    }
                                    
                                })
                            });
                            break;
                            case "set":
                                message.mentions.users.map(user => {
                                    database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${user.id}`, function (err,uda) {
                                        if(uda.length == 0 ) {
                                            database.query(`INSERT INTO ${message.guild.id} (ID,Coin) VALUE ('?', ? )`,[user.id,numadd])//tạo mới user
                                        }else{
                                            let newnum = parseFloat(numadd)
                                            database.query(`UPDATE s${message.guild.id} SET Coin = ${newnum} WHERE ID= ${user.id}`)
                                            message.channel.send(`Hoàn tất thay đổi số tiền thành ${numadd} cho user ${user} với lý `+"do```"+ messages+"```")
                                        }
                                        
                                    })
                                });
                                break;
                    default:
                        break;
                }
            
            
    }

    })
}


module.exports.config = {
    name: "money",
    aliases: ["action"]
}