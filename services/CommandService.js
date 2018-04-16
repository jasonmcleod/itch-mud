const chatService = require('./ChatService');

class CommandService {
    constructor() {
        
    }

    parse(client, text) {
        const data = text.trim();
        const parts = data.split(' ');
        const command = parts.shift().toLowerCase();
        const args = parts.join(' ');

        if(command === 'say' || command === 's') {
            chatService.send(client, args);
        }
    }
}
module.exports = new CommandService();