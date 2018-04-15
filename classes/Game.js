const LoginScene = require('../scenes/LoginScene');
const PlayScene = require('../scenes/PlayScene');

const DataService = require('../services/DataService');
const MapService = require('../services/MapService');

class Game {
    constructor() {
        this.connections = {};
        this.dataService = new DataService();
        this.mapService = new MapService(this);
        this.dataService.load().then(() => {
            console.log('assets loaded');
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
}

module.exports = Game;