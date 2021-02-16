const { prefixMatcher } = require("./prefixMatcher");

// dont rely on config for tests (make your own)
let bot = {
    // Userid of your bot account
    uid: 564777265,
  
    // displayname of your bot account, not used but I like hacing it availible
    displayName: "Wanductbot",
  
    // the name of your bot account, must be lowercase
    name: "wanductbot",
  
    // the command prefix of your bot
    // not case sensitive
    defaltCommandPrefix: "wb ",
    mappedCommandPrefixes: {
      // case sensitive
      "apu": "Apu ",
      "dank": "FeelsDankMan "
    },

    channelPrefixMapping: {
      turtoise: ["apu", "dank"],
      wanductbot: ["apu", "dank"],
    },
  
    // the list of channels to connect your bot to
    channelsToConnect: ["wanductbot", "turtoise", "nimmy0", "ym733"],
}


describe("prefixMatcher", () => {

    it("should detect the defalt command prefix.", () => {

        // given
        const channel = "turtoise";
        const prefix = `${bot.defaltCommandPrefix}`;
        const command = "spam 1 lol"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot);

        // then
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual(`${bot.defaltCommandPrefix}`, bot)

    });

    it("should detect the apu custom prefix.", () => {
        
        // given
        const channel = "turtoise";
        const prefix = "Apu ";
        const command = "ping see did it survive overnight?"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot);
 
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual("Apu ");
    });

    it("should not detect the \"botusername\" prefix because it doesnt exist.", () => {

        // given
        const channel = "turtoise";
        const prefix = `${bot.name}`;
        const command = "spam 10000 lol this wont break the bot!!!!"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(false);
        expect(res.prefix).toEqual(false);
    });

    it("should not detect the apu prefix in lowercase.", () => {
        // given
        const channel = "turtoise";
        const prefix = `apu `;
        const command = "echo /ban turtoise"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(false);
        expect(res.prefix).toEqual(false);
    });

    it("should not detect the apu prefix in a channel that doesnt have it enabled.", () => {
        // given
        const channel = "wanductbot";
        const prefix = `Apu `;
        const command = "permajoinchannel michaelreeves"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual("Apu ");
    });

    it("should not detect the dank prefix in a channel that doesnt have it enabled.", () => {
        // given
        const channel = "turtoise";
        const prefix = `FeelsDankMan `;
        const command = "tempjoinchannel michaelreeves 10m"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual("FeelsDankMan ");
    });

    it("should detect the dank prefix in a channel that has it enabled.", () => {
        // given
        const channel = "wanductbot";
        const prefix = `FeelsDankMan `;
        const command = "leavealltempjoinedchannels pepeMeltdown"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual("FeelsDankMan ");
    });

    it("should match defalt prefix in channels that have no custom prefixes.", () => {
        // given
        const channel = "nimmy0";
        const prefix = `wb `;
        const command = "createcustomprefix whicked \"WICKED \""; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(true);
        expect(res.prefix).toEqual("wb ");
    });

    it("shouldnt match any custom prefix in channels that have no custom prefixes.", () => {
        // given
        const channel = "nimmy0";
        const prefix = `Apu `;
        const command = "addprefix whicked"; 

        // when
        const res = prefixMatcher(channel, `${prefix}${command}`, bot)

        // then
        expect(res.match).toEqual(false);
        expect(res.prefix).toEqual(false);
    });

    it("should not match any prefix on a message that has no prefix.", () => {
        // given
        const channel = "turtoise";
        const message = "nymnOkay Quinn your bot is so cool!"

        // when
        const res = prefixMatcher(channel, `${message}`, bot)

        // then
        expect(res.match).toEqual(false);
        expect(res.prefix).toEqual(false);
    });

});
