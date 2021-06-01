require("dotenv").config()
const Discord = require("discord.js")
const database = require("../index").database
const axios = require("axios")
const crypto = require("crypto-js")

module.exports.run = async (client, message, args) => {
    message.delete()
    database.query(`SELECT * FROM serverinfomation WHERE serverID = ${message.guild.id}`, function (error, data) {
        
        if (data.length === 0) {
            message.reply("Bạn chưa yêu cài đặt hệ thống, vui lòng liên hệ quản trị viên hoặc sử dụng lệnh ```!setup```. Xin cảm ơn")
        } else {
            if(data[0].isOpen === "no") return message.reply("Server không nhận thẻ vào thời điểm hiện tại. Vui lòng liên hệ admin server")
            if (!args[0] || !args[1] || !args[2] || !args[3]) return message.reply("Vui lòng nhập đầy đủ các thông tin. Câu lệnh sử dụng là ```" + data[0].prefix + "napthe [Tên nhà mang] [Mệnh giá.] [Số Seri] [Số thẻ]```")
            if ((args[0] == "Viettel" || args[0] == "Mobifone" || args[0] === "Vinaphone" || args[0] === "Zing" || args[0] === "Vietnamobile" || args[0] === "Vcoin" || args[0] === "Gate") === false) return message.reply("Thẻ của bạn có thể nhập sai hoặc không được hỗ trợ, vui lòng kiểm tra lại. Chú ý, viết đúng cả hoa lẫn viết thường: ```- Viettel\n- Mobifone\n- Vinaphone\n- Zing\n- Vietnamobile\n- Vcoin\n- Gate```")
            if ((isNaN(parseFloat(args[1])) || args[1] === '10000' || args[1] === '20000' || args[1] === '30000' || args[1] === '50000' || args[1] === '100000' || args[1] === '200000'||args[1] === '300000'||args[1] === '500000') === false) return message.reply("Mệnh giá nạp tiền không tồn tại")
            if(isNaN(parseFloat(args[2]))||isNaN(parseFloat(args[3]))) return message.reply("Thẻ nạp phải ở dạng số, vui lòng kiểm tra lại cú pháp```" + data[0].prefix + "napthe [Tên nhà mang] [Mệnh giá.] [Số Thẻ] [Số Seri]```")
            let times = Date.now()
            let input_string = JSON.stringify({
                user: message.member.id,
                ticket: times
            })
            let mgs = crypto.AES.encrypt(input_string, process.env.HASH_KEY).toString()
            
            console.log({
                APIkey:data[0].serverAPIkeys,
                type: args[0],
                seri: parseFloat(args[2]),
                mathe: parseFloat(args[3]),
                menhgia: parseFloat(args[1]),
                content: mgs
            })
            
                database.query(`SELECT * FROM s${message.guild.id} WHERE ID = ${message.member.id}`, function (error, udata) {
                    if (udata.length === 0) {
                        database.query(`INSERT INTO s${message.guild.id} (ID,Coin) VALUE ('${message.member.id}','0')`)
                    }
                    axios({
                        menthod: "post",
                        url: "https://thesieutoc.net/chargingws/v2",
                        headers:{
                            "Content-Type": "Text/json",
                            "Accept": "x-www-form-urlencoded"
                        },
                        params: {
                            APIkey:data[0].serverAPIkeys,
                            type: args[0],
                            seri: args[3],  //int
                            mathe: args[2], //int
                            menhgia: parseFloat(args[1]), //int
                            content: mgs
                        }
                    }).then(callback => {
                        console.log(callback.data)
                        switch (callback.data.status) {
                            case "00":
                                message.reply("Yêu cầu nạp tiền hoàn tất, ID đơn nạp tiền của bạn là #"+times.toString().substring(9))
                                break;
                            case "3":
                                message.reply("Tài khoản nạp tiền của bạn đã bị khóa, vui lòng liên hệ Admin server. Xin cảm ơn")
                                break;
                            case "-1089":
                                message.reply("Chúng tôi rất tiếc, hệ thông đang bảo trì")
                                break;
                            case "2":
                                message.reply("Thẻ của bạn đã được sử dụng từ trước. Vui lòng kiểm tra lại và không spam. Xin cảm ơn")
                                break;
                            case "1":
                                message.reply("Thông tin API key không chính xác, vui lòng liên hệ với quản trị viên của server")
                                break;
                            
                            default:
                                message.reply("Lỗi từ hệ thông. Mã lỗi ``"+callback.data.status+"``. Nội dung lỗi:```"+callback.data.msg+"```")
                                break;
                        }
                    }).catch(err => {
                        console.log(err)
                    })

                })
        }

    })
}


module.exports.config = {
    name: "napthe",
    aliases: [""]
}