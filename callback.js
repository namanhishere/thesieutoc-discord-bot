const express = require("express")
const app = express.Router()
const crypto = require("crypto-js")
const Discord = require("discord.js")
const Main = require("./index")
const database = Main.database
    client = Main.discord


module.exports.route = app

app.post("/:id", function (req,res) {
    console.log(req.params.id)
    // console.log(req)
    console.log(database.escape("s"+ req.params.id).split("'")[1])

    let raw_cb = req.body.content
    let status = req.body.status
    let cb 
        try {
           cb = JSON.parse(crypto.AES.decrypt(req.body.content, process.env.HASH_KEY).toString(crypto.enc.Utf8))
        } catch (err) {
            console.log("Không thể giải mã chuối Callback")
            return res.json({status:"Thất bại", msg:"Không thể giải mã chuỗi content"})
        }
    
    console.log(cb)
    
    switch (status) {
        case "thanhcong":
            //logic cộng tiền
            database.query("SELECT * FROM "+database.escape("s"+ req.params.id).split("'")[1]+" WHERE ID = ?",[cb.user], function (err,d) {
                if (d.length === 0) {
                    database.query(`INSERT INTO ? (ID,Coin) VALUE ('?', ? )`,["s"+req.params.id,cb.user,req.body.amount]) //Mong sẽ không dính phải cái này
                    return res.json({status:"Thất bại",msg:`Không tìn thấy user ${cb.user}`})
                }else{
                    let current_money = parseFloat(d[0].Coin)
                    let money_after = current_money + parseFloat(req.body.amount) //đẻ phòng ngừa trường hợp trả về kiểu string
                    console.log(money_after)
                    //update lại lên database
                    database.query("UPDATE "+database.escape("s"+ req.params.id).split("'")[1]+" set Coin= ? where Id=?", [money_after,cb.user])
                        let uembed = new Discord.MessageEmbed()
                        .setColor('#7FFF00')
                        .setAuthor('Yêu cầu nạp tiền')
                        .setDescription('ID: '+ cb.ticket.toString().substring(9))
                        .addFields(
                            { name: 'Trạng thái', value: 'Hoàn tất' },
                            { name: 'Số tiền được cộng thêm', value: req.body.amount, inline: true },
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        console.log(client.users.cache)
                        try{
                            client.users.cache.get(cb.user).send(uembed);
                        }catch(err){
                            console.log(err)
                        }
                        let lembed = new Discord.MessageEmbed()
                        .setColor('#7FFF00')
                        .setAuthor('Thông báo thay đổi số tiền')
                        .setDescription('ID yêu cầu: '+ cb.ticket)
                        .addFields(
                            { name: 'Nội dung thông báo', value: 'Nạp tiền' },
                            { name:  'User được cộng tiền', value: client.users.cache.get(cb.user)},
                            { name: 'Số tiền được cộng thêm', value: req.body.amount, inline: true },
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        database.query("SELECT * FROM serverinfomation WHERE serverId = ?", [req.params.id], function (err,da) {
                            console.log(da[0].logchanel)
                            client.channels.cache.get(da[0].logchanel).send(lembed)
                            res.json({status:"Thành Công", msg:"Hoàn thành cộng tiền cho user"})
                        })

                }
            })
            break;
        case "thatbai":
                      //logic cộng tiền
            database.query("SELECT * FROM "+database.escape("s"+ req.params.id).split("'")[1]+" WHERE ID = ?",[cb.user], function (err,d) {
                if (d.length === 0) {
                    database.query(`INSERT INTO ? (ID,Coin) VALUE ('?', ? )`,["s"+req.params.id,cb.user,req.body.amount]) //Mong sẽ không dính phải cái này
                    return res.json({status:"Thất bại",msg:`Không tìn thấy user ${cb.user}`})
                }else{
                    let current_money = parseFloat(d[0].Coin)
                    let money_after = current_money + parseFloat("0") //đẻ phòng ngừa trường hợp trả về kiểu string
                    console.log(money_after)
                    //update lại lên database
                    database.query("UPDATE "+database.escape("s"+ req.params.id).split("'")[1]+" set Coin= ? where Id=?", [money_after,cb.user])
                        let uembed = new Discord.MessageEmbed()
                        .setColor('#ff0040')
                        .setAuthor('Yêu cầu nạp tiền')
                        .setDescription('ID: '+cb.ticket.toString().substring(9))
                        .addFields(
                            { name: 'Trạng thái', value: 'Thất bài- Sai seri hoặc (và) thẻ nạp' },
                            { name: 'Số tiền được cộng thêm', value: "0", inline: true },
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        console.log(client.users.cache)
                        try {
                            client.users.cache.get(cb.user).send(uembed);
                        } catch (error) {
                            
                        }
                        let lembed = new Discord.MessageEmbed()
                        .setColor('#ff0040')
                        .setAuthor('Thông báo thay đổi số tiền')
                        .setDescription('ID yêu cầu: '+cb.ticket)
                        .addFields(
                            { name: 'Nội dung thông báo', value: 'Nạp thẻ sai' },
                            { name:  'User thực hiện', value: client.users.cache.get(cb.user)},
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        database.query("SELECT * FROM serverinfomation WHERE serverId = ?", [req.params.id], function (err,da) {
                            console.log(da[0].logchanel)
                            client.channels.cache.get(da[0].logchanel).send(lembed)
                            res.json({status:"Thành Công", msg:"Hoàn thành cộng tiền cho user"})
                        })

                }
            })
            break;
        case "saimenhgia":
            //logic cộng tiền
            database.query("SELECT * FROM "+database.escape("s"+ req.params.id).split("'")[1]+" WHERE ID = ?",[cb.user], function (err,d) {
                if (d.length === 0) {
                    database.query(`INSERT INTO ? (ID,Coin) VALUE ('?', ? )`,["s"+req.params.id,cb.user,req.body.amount]) //Mong sẽ không dính phải cái này
                    return res.json({status:"Thất bại",msg:`Không tìn thấy user ${cb.user}`})
                }else{
                    let current_money = parseFloat(d[0].Coin)
                    let money_after = current_money + parseFloat(req.body.amount) //đẻ phòng ngừa trường hợp trả về kiểu string
                    console.log(money_after)
                    //update lại lên database
                    database.query("UPDATE "+database.escape("s"+ req.params.id).split("'")[1]+" set Coin= ? where Id=?", [money_after,cb.user])
                        let uembed = new Discord.MessageEmbed()
                        .setColor('#ffd358')
                        .setAuthor('Yêu cầu nạp tiền')
                        .setDescription('ID: '+cb.ticket.toString().substring(9))
                        .addFields(
                            { name: 'Trạng thái', value: 'Hoàn tất - Sai mệnh giá' },
                            { name: 'Số tiền được cộng thêm thực tế', value: req.body.amount, inline: true },
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        console.log(client.users.cache)
                        try{
                            client.users.cache.get(cb.user).send(uembed);
                        }catch(er){
                            
                        }
                        let lembed = new Discord.MessageEmbed()
                        .setColor('#ffd358')
                        .setAuthor('Thông báo thay đổi số tiền')
                        .setDescription('ID yêu cầu: '+cb.ticket)
                        .addFields(
                            { name: 'Nội dung thông báo', value: 'Nạp tiền' },
                            { name:  'User được cộng tiền', value: client.users.cache.get(cb.user)},
                            { name: 'Số tiền được cộng thêm', value: req.body.amount, inline: true },
                            { name: 'Số tiền hiện có', value: money_after, inline: true },
                        )
                        .setTimestamp()
                        .setFooter('Một sản phẩm của MokaTeam');
                        database.query("SELECT * FROM serverinfomation WHERE serverId = ?", [req.params.id], function (err,da) {
                            console.log(da[0].logchanel)
                            client.channels.cache.get(da[0].logchanel).send(lembed)
                            res.json({status:"Thành Công", msg:"Hoàn thành cộng tiền cho user"})
                        })

                }
            })
            break;
        default:

            break;
    }
})