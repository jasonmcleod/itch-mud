const C = require('../constants');
const playerService = require('../services/PlayerService');
const dataService = require('../services/DataService');
const renderService = require('../services/RenderService');

class Game {
    constructor() {
        this.connections = {};    
    }

    loadData() {
        dataService.load().then(() => {
            setInterval(() => {
                this.render();
            }, C.TICK_RATE);
        });
    }

    connect(client) {
        this.connections[client.id] = client;
        client.setScene('login');
    }

    render() {
        for(let c in this.connections) {
            const client = this.connections[c];
            if(!client.authenticated) continue;

            renderService.renderAll(client);
            
            client.screen.render();
        }
    }
}

module.exports = new Game();