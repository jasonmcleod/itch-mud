const C = require('../constants');
const Screen = require('./Screen');
const uuidv1 = require('uuid/v1');
const Player = require('./Player');

class MudClient {
    constructor(client, game) {
        this.id = uuidv1();
        this.scene = {};
        this.game = game;
        this.client = client;
        this.lastMove = 0;
        this.player = new Player();
        this.screen = new Screen(this).screen;
    }

    setScene(scene) {
        this.scene = scene;
    }
}

module.exports = MudClient;