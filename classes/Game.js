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

    login(client, username, password, callback) {
        if(username === 'a' && password ==='a') {
            client.authenticated = true;
            client.setScene(new PlayScene(client));
        } else {
            callback({success: false, message: 'Not implemented'});
        }
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