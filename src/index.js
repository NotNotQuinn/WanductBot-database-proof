const ircLib = require("dank-twitch-irc");
const { prefixMatcher } = require("./prefixMatcher")
const { config, bot, db_conf } = require("./config");
const mariadb = require("mariadb");
const _ = require("lodash/isEqual");

const arrayContainsObject = (array, obj) => {
    for (____obj_in_arr in array) {
        if (_.isEqual(____obj_in_arr, obj))
            return true;
    }
    return false;
};


let db_pool;
let users_seen = [];

const client = new ircLib.ChatClient(config);


// dbConnector
setTimeout(async () => {
    console.log("[META] dbConnector: Connecting to database...");
    try {
        db_pool = mariadb.createPool(db_conf);
        console.log("[META] dbConnector: Database connected!");
    } catch (error) {
        throw error;
    }
}, 1000);



// create 5 connections on startup, so spam command works
var connectionsToCreateOnStart = 5;
var connectionsCreatedOnStart = 0;


var createConnectionsInterval = setInterval(() => {
    
    client.newConnection();
    connectionsCreatedOnStart++;
    console.log(`[META] New connection: #${connectionsCreatedOnStart}`);
    
    if (--connectionsToCreateOnStart <= 0)
    {clearInterval(createConnectionsInterval);}
}, 5000);



var addNewUsertoDatabase = setInterval(() => {
    var default_msg = "[META] New users added to db:";
    var str = default_msg;
    for (let i = 0; i < users_seen.length; i++) {
        if(users_seen[i].name && users_seen[i].id) 
        {   
            //console.log(users_seen[i])
            str += " " + users_seen[i].name + ",";
        }
    }
    if(str.length > default_msg.length)
        console.log(str.substr(0, str.length-1));
}, 60000) // 1 min




client.on("ready", () => {
    console.log(`[META] client: Connected to chat!`)
});

client.on("PRIVMSG", (msg) => {
    
    console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
    if(msg.senderUserID == bot.uid)
        return;
    (()=>{
        let seen = false;
        for(let i = 0; i < users_seen.length; i++) {
            if(users_seen[i].id == msg.senderUserID) {seen = true;}
        }
        if (!seen) { 
            users_seen.push({ name: msg.senderUsername, id: msg.senderUserID }) 
        }
    })();

    
    prefixMatch = prefixMatcher(msg.channelName, msg.messageText)
    msg.mText = msg.messageText.substr(prefixMatch.prefix.length);
    msg.mArgs = msg.mText.split(" ");
    msg.messageArgs = msg.messageText.split(" ");

    //db_pool.
    
    if(prefixMatch.match) {
        // starts with prefix
        if(msg.mArgs[0].toLowerCase() == "ping") {
            client.say(msg.channelName, "🅱ONG!")
        }

        if(msg.mArgs[0].toLowerCase() == "su" || msg.mArgs[0].toLowerCase() == "usersseen") {
            client.say(msg.channelName, `lol! ive spotted ${users_seen.length} new users since last startup!`)
        }

        if(msg.mArgs[0].toLowerCase() == "echo") {
            client.privmsg(msg.channelName, msg.mArgs.slice(1).join(" "))
        }
        
        if(msg.mArgs[0].toLowerCase() == "spam")
        {   
            try {
                // spam command
                if (msg.senderUserID != 440674731) {
                    // no perms
                    client.say(msg.channelName, `${msg.senderUsername} no :)`)
                    return;
                }
                
                if(typeof parseInt(msg.mArgs[1]) != "number") {
                    client.say(msg.channelName, `How much WholeWheat`)
                    return;
                }
                
                for(let i=0; i< parseInt(msg.mArgs[1]);i++) {
                    var messageToSay = msg.mArgs.slice(2).join(" ")
                    if(messageToSay.length <= 0)
                    {
                        client.privmsg(msg.channelName, "Spam what WholeWheat");
                        return;
                    }
                    client.privmsg(msg.channelName, messageToSay)
                }
            }
            catch(err) {
                console.error("Error in spam command", err)
                let eMessage = `spam: ${err.message}`
                client.say(eMessage)
            }
        }
        
    }
});


client.on("error", (err) => {
    console.error("Unhandled error in bot. ", err);
});


client.use(new ircLib.AlternateMessageModifier(client));


setTimeout(() => {
    client.connect();
    client.joinAll(bot.channelsToConnect);
}, 1000);
