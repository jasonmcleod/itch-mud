const telnet = require('telnet2');
const port = process.env.PORT || 8001;
const game = require('./classes/Game');
const MudClient = require('./classes/MudClient');

game.loadData();

let server = telnet({ tty: true }, (client) => {
    let newUser = new MudClient(client);
    game.connect(newUser);
});
server.listen(port);

console.log(`Listening on ${port}...`);

/*
    classes:
        GameServer
        Player
        Client
        Connection
    services:
        Account
        Chat
        Movement
        Command
        Data?
*/
