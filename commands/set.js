const Discord = require("discord.js")
const database = require("../index").database

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("ADMINISTRATOR") == false) return message.reply("Bạn không có quyền sử dụng lệnh này")
    database.query(`SELECT * FROM serverinfomation WHERE serverID = ${message.guild.id}`,function (error, data) {
        if(data.length === 0){
            message.reply("Bạn chưa yêu cài đặt hệ thống, vui lòng sử dụng lệnh ```!setup```")
        }else{
            message.delete()
            switch (args[0]) {
                case "prefix":
                    database.query(`UPDATE serverinfomation set prefix= ? where serverID = ?`, [args[1], message.guild.id])
                    client.prefix.set(message.guild.id,args[1])
                    message.reply(`Cập nhât prefix thành công, prefix mới của server là ${args[1]}`)
                    break;
                case "key":
                    database.query(`UPDATE serverinfomation set serverAPIkeys= ? where serverID = ?`, [args[1], message.guild.id])
                    message.reply(`Cập nhât APIs mới thành công ^^`)
                    break;
                case "log":
                    database.query(`UPDATE serverinfomation set logchanel = ? where serverID = ?`, [message.channel.id, message.guild.id]) //stupid english
                    message.reply(`Cập nhật Log Channel thành công, đây sẽ là nơi bot gửi các log hoạt động vào`)
                    break;
                case "open":
                    if(args[1] === "yes" || args[1] === "no") {
                        database.query(`UPDATE serverinfomation set isOpen = ? where serverID = ?`, [args[1], message.guild.id]) //stupid english
                        message.reply(`Cập nhật việc nhận thẻ thành công`)
                    }else{
                        message.reply("Không tìm thấy giá trị đúng. Bot chỉ chấp nhận 2 giá trị ``yes`` và ``no``")
                    }

                    break;
                default:
                    message.reply("Không tìm thấy yêu cầu thay đổi của bạn")
                    break;
            }
            // const exampleEmbed = new Discord.MessageEmbed()
            // .setColor('#0099ff')
            // .setTitle('Thông tin cài đặt từ lần cuối cùng bot')
            // .addField('ID Server của bạn là', message.guild.id)
            // .addField('APIs Keys của bạn là', data[0].serverAPIkeys || "Chưa thiết lập")
    
        // message.member.send(exampleEmbed);
        }

      })

}


module.exports.config = {
    name: "set",
    aliases: []
}