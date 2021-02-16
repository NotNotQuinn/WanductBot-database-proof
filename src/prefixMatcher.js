const { bot } = require("./config");

module.exports.prefixMatcher = (channel, text, _bot = undefined) => {
    if (_bot == undefined) {
        _bot = bot;
    }
    
    if (text.toLowerCase().startsWith(_bot.defaltCommandPrefix.toLowerCase())) {
        return { match: true, prefix: _bot.defaltCommandPrefix };
    }

    if(_bot.channelPrefixMapping[channel] == undefined) {
        // channel has no custom prefixes, so none will match anyway, and it will error if we try to check
        return { match: false, prefix: false };
    }

    for( let i=0; i < _bot.channelPrefixMapping[channel].length; i++ ) {
        if (text.startsWith(  _bot.mappedCommandPrefixes[  _bot.channelPrefixMapping[channel][i]  ]  )) {
            return {  
                match: true,  
                prefix: _bot.mappedCommandPrefixes[  _bot.channelPrefixMapping[channel][i]  ]  
            }
        }
    }

    return { match: false, prefix: false };
}
