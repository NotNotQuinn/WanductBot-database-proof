const ircLib = require("dank-twitch-irc");
const { prefixMatcher } = require("./prefixMatcher")
const { config, bot, db_conf } = require("./config");
const mariadb = require("mariadb");

let db_pool;

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
    console.log(`[META] createConnectionsInterval: Connection created: #${connectionsCreatedOnStart}`);
    
    if (--connectionsToCreateOnStart <= 0)
    {clearInterval(createConnectionsInterval);}
}, 2000);



client.on("ready", () => {
    console.log(`[META] client: Connected to chat!`)
});

client.on("PRIVMSG", (msg) => {
    
    if(msg.senderUserID == bot.uid)
        return;
    console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
    
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
        if(msg.mArgs[0].toLowerCase() == "echo") {
            
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
                    var messageToSay = msg.mArgs.slice(2, msg.mArgs.length).join(" ")
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
    console.error("Error?", err);
});


client.use(new ircLib.AlternateMessageModifier(client));



client.connect();
client.joinAll(bot.channelsToConnect);
