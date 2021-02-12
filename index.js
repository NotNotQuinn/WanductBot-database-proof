const ircLib = require("dank-twitch-irc");
let config = require("./config.js");

let client = new ircLib.ChatClient(config);


client.on("PRIVMSG", (msg) => {
    console.log(`[#${msg.channelName}] ${msg.displayName}: ${msg.messageText}`);
});


client.use(new ircLib.AlternateMessageModifier(client));


client.connect();
client.join("turtoise");
