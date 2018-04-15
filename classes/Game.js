const C = require('../constants');
const LoginScene = require('../scenes/LoginScene');
const PlayScene = require('../scenes/PlayScene');
const DataService = require('../services/DataService');
const MapService = require('../services/MapService');
const CommandService = require('../services/CommandService');
const ChatService = require('../services/ChatService');

class Game {
    constructor() {
        this.connections = {};
        this.dataService = new DataService();
        this.mapService = new MapService(this);
        this.chatService = new ChatService(this);
        this.commandService = new CommandService(this);

        this.dataService.load().then(() => {
            console.log('assets loaded');

            console.log('mainloop setup');
            //start mainloop
            setInterval(() => {
                this.renderAll();
            }, C.TICK_RATE);
        });
        
    }

    connect(client) {
        this.connections[client.id] = client;
        client.setScene(new LoginScene(client));
    }

    login(client, name, password, callback) {
        this.dataService.models.account.find({where:{name, password}}).then((result) => {
            if(!result) return callback({success: false, message: 'Invalid credentials'});
            
            this.dataService.models.player.find({where: {account: result.dataValues.id}}).then((result) => {
                client.authenticated = true;
                client.player.x = result.dataValues.x;
                client.player.y = result.dataValues.y;
                client.player.name = result.dataValues.name;

                client.setScene(new PlayScene(client));
                callback({success: true, character: result.dataValues.id});
            });

        });
    }

    renderAll() {
        for(let c in this.connections) {
            const client = this.connections[c];
            if(!client.authenticated) continue;

            const canvasMarkup = client.game.mapService.getMarkup(client);
            const chatMarkup = client.game.chatService.getMarkup();

            client.scene.canvas.setContent(canvasMarkup);
            client.scene.chatLog.setContent(chatMarkup);

            client.screen.render();
        }
    }
}

module.exports = Game;