const Discord = require("discord.js")
const database = require("../index").database

module.exports.run = async (guild,client) => {
    //rảnh thì mới fix được

    
    // console.log("Joined a new guild: " + guild.name);
    // database.query(`SELECT * FROM serverinfomation WHERE serverID = ${guild.id}`,function (error, data) {
    //     console.log(data.length)
    //     if(data.length === 0){
    //         console.log("test")
    //         database.query(`INSERT INTO serverinfomation (serverID,serverRoles) VALUE ('${guild.id}','Non-Verify')`)
    //         database.query(`CREATE TABLE s${guild.id} (
    //             ID varchar(255),
    //             Coin varchar(255)
    //         )`)
    //         let embed = new Discord.MessageEmbed()
    //         .setColor('#0099ff')
    //         .setTitle('Hoàn tất thiết lập hệ thống')
    //         .addField('ID Server của bạn là', guild.id)
    //         .addField('APIs Keys của bạn là', "Chưa thiết lập")
    //         .addField('Trạng thái server là:', "Non-Verify")
    //         .addField("Để xác thực vui lòng sử dụng lệnh !verify [ID]","Yêu cầu của bạn sẽ được xem xét và duyệt trong khoảng thời gian sớm nhất.")
    //         .setFooter('Một sản phẩm của MokaTeam')
    //         client.users.cache.get(guild.ownerID).send(embed);
    //     }else{
    //         const exampleEmbed = new Discord.MessageEmbed()
    //         .setColor('#0099ff')
    //         .setTitle('Thông tin Server')
    //         .addField('ID Server của bạn là', guild.id)
    //         .addField('APIs Keys của bạn là', data[0].serverAPIkeys || "Chưa thiết lập")
    //         .addField('Trạng thái server là:', data[0].serverRoles )
    //         .setFooter('Một sản phẩm của MokaTeam')
    //         console.log(guild)
    //         client.users.cache.get(guild.ownerID).send(exampleEmbed);
    //     }
    //   })

}


module.exports.config = {
    name: "guildCreate",
    isOnce: false
}