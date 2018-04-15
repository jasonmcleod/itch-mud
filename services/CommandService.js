class CommandService {
    constructor(game) {
        this.game = game;
    }

    parse(client, text) {
        const data = text.trim();
        const parts = data.split(' ');
        const command = parts.shift().toLowerCase();
        const args = parts.join(' ');

        if(command === 'say' || command === 's') {
            this.game.chatService.send(client, args);
        }
    }
}
module.exports = CommandService;