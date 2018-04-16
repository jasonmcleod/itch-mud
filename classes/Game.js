const C = require('../constants');
const LoginScene = require('../scenes/LoginScene');
const PlayScene = require('../scenes/PlayScene');
const DataService = require('../services/DataService');
const MapService = require('../services/MapService');
const CommandService = require('../services/CommandService');
const chatService = require('../services/ChatService');
const playerService = require('../services/PlayerService');
const dataService = require('../services/DataService');
const mapService = require('../services/MapService');

class Game {
    constructor() {
        this.connections = {};
        
        dataService.load().then(() => {
            setInterval(() => {
                this.renderAll();
            }, C.TICK_RATE);
        });
    }

    connect(client) {
        this.connections[client.id] = client;
        client.setScene('login');
    }

    renderAll() {
        for(let c in this.connections) {
            const client = this.connections[c];
            if(!client.authenticated) continue;

            const canvasMarkup = mapService.getMarkup(client);
            const chatMarkup = chatService.getMarkup();

            client.scene.canvas.setContent(canvasMarkup);
            client.scene.chatLog.setContent(chatMarkup);

            client.screen.render();
        }
    }
}

module.exports = new Game();