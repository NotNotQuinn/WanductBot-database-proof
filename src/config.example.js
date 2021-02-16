let config = {
    // yoinked example from here https://www.npmjs.com/package/dank-twitch-irc/v/4.3.0
    
    username: "mybotusernameinlowercase", // justinfan12345 by default - For anonymous chat connection
    password: "xxxxxxxxxxxxxxxxx", // undefined by default (no password)

    /*/


    // Message rate limits configuration for verified and known bots
    // pick one of the presets or configure custom rates as shown below:
    rateLimits: "default",
    // or:
    rateLimits: "knownBot",
    // or:
    rateLimits: "verifiedBot",
    // or:

    /*/

    rateLimits: {
      highPrivmsgLimits: 7500, // this is what I have set because I have a verified bot, and the preset verified one wasnt working
      lowPrivmsgLimits: 7500, 
    },
    
    /*/
    
    // Configuration options for the backing connections:
    // Plain TCP or TLS
    connection: {
      type: "tcp", // tcp by default
      secure: false, // true by default
      // host and port must both be specified at once
      host: "custom-chat-server.com", // irc.chat.twitch.tv by default
      port: 1234, // 6697/6667 by default, depending on the "secure" setting
    },
    // or:
    connection: {
      type: "websocket",
      secure: true, // use preset URL of irc-ws.chat.twitch.tv
    },
    // or:
    connection: {
      type: "websocket",
      url: "wss://custom-url.com/abc/def", // custom URL
    },
    // or:
    connection: {
      type: "duplex",
      stream: () => aNodeJsDuplexInstance, // read and write to a custom object
      // implementing the Duplex interface from Node.js
      // the function you specify is called for each new connection
  
      preSetup: true, // false by default, makes the lib skip login
      // and capabilities negotiation on connection startup
    },
  
    // how many channels each individual connection should join at max
    maxChannelCountPerConnection: 100, // 90 by default
  
    // custom parameters for connection rate limiting

    /*/

    connectionRateLimits: {
      // so I can spam :)
      parallelConnections: 100, // 1 by default
      // time to wait after each connection before a new connection can begin
      releaseTime: 2000, // in milliseconds, 2 seconds by default
    },

    /*/

    // I recommend you leave this off by default, it makes your bot faster
    // If you need live update of who's joining and leaving chat,
    // poll the tmi.twitch.tv chatters endpoint instead since it
    // is also more reliable
    requestMembershipCapability: false, // false by default
  
    // read more about mixins below
    // this disables the connection rate limiter, message rate limiter
    // and Room- and Userstate trackers (which are important for other mixins)
    installDefaultMixins: false, // true by default
  
    // Silence UnandledPromiseRejectionWarnings on all client methods
    // that return promises.
    // With this option enabled, the returned promises will still be rejected/
    // resolved as without this option, this option ONLY silences the
    // UnhandledPromiseRejectionWarning.
    ignoreUnhandledPromiseRejections: true, // false by default

    */
}

let bot = {
  // Userid of your bot account
  uid: 1234567890,

  // displayname of your bot account, not used but I like hacing it availible
  displayName: "MyBotUSERNAMEhowEVERitisDisplayedINCHAT",

  // the name of your bot account, must be lowercase
  name: "mybotusernameinlowercase",

  // the command prefix of your bot (spaces will work I think)
  commandPrefix: "! ",

  // the list of channels to connect your bot to
  channelsToConnect: ["mybotusernameinlowercase", "myfriendsaccount", "someotheraccount"],
}

module.exports.config = config;
module.exports.bot = bot