/*
    Credit:
    - Developer: MokaTeam
    - Version:1.0
    - License: BSD 2-Clause License
    - Please keep my copyright warranty for modification
*/
require("dotenv").config()
const Discord = require("discord.js")
express = require("express")
superagent = require("superagent")
mysql = require("mysql")
errorHandle = require("http-errors")
cookieParser = require('cookie-parser')
path = require("path")
crypto = require("crypto-js")

const client = new Discord.Client()
database = mysql.createConnection(process.env.CLEARDB_DATABASE_URL)
app = express()




database.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + database.threadId);
});
module.exports.database = database
module.exports.discord = client

var command = []
client.login(process.env.DISCORD_TOKEN)
/*
Discord bot 
*/

setInterval(() => {
    database.ping()
}, 1500);

const fs = require("fs");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.prefix = new Discord.Collection();


app.listen(process.env.PORT)

// Commands handle

fs.readdir("./commands/", (err, files) => {

    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("Cannt find any commands");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        client.commands.set(pull.config.name, pull);
        pull.config.aliases.forEach(alias => {
            client.aliases.set(alias, pull.config.name)
        });
    });
});

database.query("Select * from serverinfomation", function (err, data) {
    data.forEach(element => {
        client.prefix.set(element.serverID, element.prefix)
    });
})

client.on("message", async message => {
    if (message.author.bot || message.channel.type === "dm") return;
    console.log(client.prefix.get(message.guild.id) || "!")
    let prefix = client.prefix.get(message.guild.id) || "!";
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);


    if (!message.content.startsWith(prefix)) return;
    let commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) {
        commandfile.run(client, message, args)
    } else {
        message.channel
    }

})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




fs.readdir("./event/", (err, files) => {
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("Cannt find any event");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./event/${f}`);
        if (pull.config.isOnce) {
            client.once(pull.config.name, (...cb) => {
                pull.run(...cb, client)
            })
        } else {
            client.on(pull.config.name, (...cb) => {
                pull.run(...cb, client)
            })
        }
    });
});


app.use("/", require("./callback").route)

app.get("/", (req,res)=>{
    res.json({message:"Đây là web của bot, bot không hỗ trợ method này ^^"})
})