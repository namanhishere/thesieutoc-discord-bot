const Discord = require("discord.js")
const database = require("../index").database

module.exports.run = async (client, message, args) => {
    if(message.member.hasPermission("ADMINISTRATOR") == false) return message.reply("Bạn không có quyền sử dụng lệnh này")
    database.query(`SELECT * FROM serverinfomation WHERE serverID = ${message.guild.id}`,function (error, data) {
        if(data.length === 0){
            console.log("test")
            database.query(`INSERT INTO serverinfomation (serverID,serverRoles) VALUE ('${message.guild.id}','Non-Verify')`)
            database.query(`CREATE TABLE s${message.guild.id} (
                ID varchar(255),
                Coin varchar(255)
            )`)
            let embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Hoàn tất thiết lập hệ thống')
            .addField('ID Server của bạn là', message.guild.id)
            .addField('APIs Keys của bạn là', "Chưa thiết lập")
            .addField("Cài đặt chuyển hướng (Callback) về địa chỉ:",`https://2y2c.namanhishere.com/${message.guild.id}`)
            .addField("Để xác thực vui lòng sử dụng lệnh !verify [ID]","Yêu cầu của bạn sẽ được xem xét và duyệt trong khoảng thời gian sớm nhất.")
            .setFooter('Một sản phẩm của MokaTeam')
            message.member.send(embed);
        }else{
            const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Thông tin cài đặt từ lần cuối cùng bot')
            .addField('ID Server của bạn là', message.guild.id)
            .addField('APIs Keys của bạn là', data[0].serverAPIkeys || "Chưa thiết lập")
            .addField("Cài đặt chuyển hướng (Callback) về địa chỉ:",`https://2y2c.namanhishere.com/${message.guild.id}`)
            .addField("Để xác thực vui lòng sử dụng lệnh !verify [ID]","Yêu cầu của bạn sẽ được xem xét và duyệt trong khoảng thời gian sớm nhất.")
            .setFooter('Một sản phẩm của MokaTeam')
        message.member.send(exampleEmbed);
        }

      })

}


module.exports.config = {
    name: "setup",
    aliases: ["info"]
}