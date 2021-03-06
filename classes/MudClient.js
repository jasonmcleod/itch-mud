const C = require('../constants');
const Screen = require('./Screen');
const uuidv1 = require('uuid/v1');
const Player = require('./Player');
const Console = require('./Console');

const PlayScene = require('../scenes/PlayScene');
const LoginScene = require('../scenes/LoginScene');

const scenes = {
    play: PlayScene,
    login: LoginScene
};

class MudClient {
    constructor(client) {
        this.id = uuidv1();
        this.scene = {};
        this.client = client;
        this.lastMove = 0;
        this.cache = {};
        this.player = new Player();
        this.screen = new Screen(this).screen;
        this.console = new Console();
    }

    setScene(scene) {
        this.scene = new scenes[scene](this).scene;
    }
}

module.exports = MudClient;