const C = require('../constants');
const game = require('../classes/Game');

class ChatService {
    constructor() {
    
    }

    send(client, message) {
        for(let c in game.connections) {
            let client = game.connections[c];
            client.console.add(`${client.player.name}: ${message}`);
        }
    }

}

module.exports = new ChatService();