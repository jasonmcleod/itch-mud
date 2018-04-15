const telnet = require('telnet2');
const port = process.env.PORT || 8001;
const Game = require('./classes/Game');
const MudClient = require('./classes/MudClient');

const game = new Game(); // await assets before setting up telnet?

let server = telnet({ tty: true }, (client) => {
    let newUser = new MudClient(client, game);
    console.log('client connecting');
    game.connect(newUser);
});
server.listen(port);

console.log(`Listening on ${port}...`);
