const chatService = require('./ChatService');

const commands = {}
commands.help = {
    alias: ['commands'],
    tip: 'lists all commands.',
    action: (client) => {
        for (let k in commands) {
            let command = k;
            if(commands[k].alias) command += ' (alias: ' + commands[k].alias.join(', ') + ')';
            client.console.add(`${command}: ${commands[k].tip}`)
        }
    }
};
commands.say = {
    alias: ['s'],
    tip: 'Send a message to all connected players.',
    action: chatService.send
};

class CommandService {
    constructor() {
        
    }

    parse(client, text) {
        const data = text.trim();
        const parts = data.split(' ');
        const command = parts.shift().toLowerCase();
        const args = parts.join(' ');

        if(commands.hasOwnProperty(command)) {
            return commands[command].action(client, args);
        }
        
        for(let c in commands) {
            if(commands[c].alias && commands[c].alias.indexOf(command) > -1) {
                return commands[c].action(client, args);
            }
        }

        client.console.add(`${command} is not a valid command.`);

    }
}
module.exports = new CommandService();